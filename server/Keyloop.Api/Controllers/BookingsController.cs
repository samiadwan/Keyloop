using Keyloop.Api.Data;
using Keyloop.Api.Domain;
using Keyloop.Api.Models;
using Keyloop.Api.Pricing;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Keyloop.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingsController(KeyloopDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<BookingDto>>> List(CancellationToken cancellationToken)
    {
        var rows = await db.Bookings.AsNoTracking()
            .OrderBy(b => b.CreatedAt)
            .ThenBy(b => b.Id)
            .ToListAsync(cancellationToken);
        return Ok(rows.Select(BookingStore.ToDto).ToList());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BookingDto>> GetById(string id, CancellationToken cancellationToken)
    {
        var booking = await db.Bookings.AsNoTracking()
            .FirstOrDefaultAsync(b => b.Id == id, cancellationToken);
        return booking is null ? NotFound() : Ok(BookingStore.ToDto(booking));
    }

    [HttpPost]
    public async Task<ActionResult<BookingDto>> Create(
        [FromBody] CreateBookingRequest body,
        CancellationToken cancellationToken)
    {
        if (!TryReadRentalWindow(body.PickupDate, body.ReturnDate, out var pickup, out var returnDate))
        {
            return BadRequest("Return date must be after pickup date.");
        }

        if (pickup < DateOnly.FromDateTime(DateTime.UtcNow))
        {
            return BadRequest("Pickup date cannot be in the past.");
        }

        var vehicleId = body.VehicleId.Trim();
        var vehicle = await db.Vehicles.AsNoTracking()
            .FirstOrDefaultAsync(v => v.Id == vehicleId, cancellationToken);
        if (vehicle is null)
        {
            return BadRequest("Unknown vehicle.");
        }

        var booking = new BookingEntity
        {
            Id = await BookingStore.NextIdAsync(db, cancellationToken),
            VehicleId = vehicle.Id,
            VehicleName = body.VehicleName.Trim(),
            VehicleImageUrl = string.IsNullOrWhiteSpace(body.VehicleImageUrl) ? vehicle.ImageUrl : body.VehicleImageUrl.Trim(),
            PickupLocation = body.PickupLocation.Trim(),
            PickupDate = pickup.ToString("yyyy-MM-dd"),
            ReturnDate = returnDate.ToString("yyyy-MM-dd"),
            Status = BookingStore.Pending,
            CreatedAt = DateTime.UtcNow,
        };
        db.Bookings.Add(booking);
        await db.SaveChangesAsync(cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = booking.Id }, BookingStore.ToDto(booking));
    }

    [HttpPatch("{id}")]
    public async Task<ActionResult<BookingDto>> UpdateTier(
        string id,
        [FromBody] UpdateBookingTierRequest body,
        CancellationToken cancellationToken)
    {
        var booking = await db.Bookings.FirstOrDefaultAsync(b => b.Id == id, cancellationToken);
        if (booking is null)
        {
            return NotFound();
        }

        if (booking.Status != BookingStore.Pending)
        {
            return Conflict("Only a Pending booking can change insurance.");
        }

        ChargeResult? charge;
        try
        {
            charge = await ChargeCalculator.ComputeAsync(
                db,
                booking.VehicleId,
                body.InsuranceTier.Trim(),
                booking.PickupDate,
                booking.ReturnDate,
                cancellationToken);
        }
        catch (FormatException)
        {
            return BadRequest("Invalid insurance tier or dates.");
        }

        if (charge is null)
        {
            return BadRequest("Invalid insurance tier or dates.");
        }

        BookingStore.ApplyCharge(booking, charge);
        await db.SaveChangesAsync(cancellationToken);
        return Ok(BookingStore.ToDto(booking));
    }

    [HttpPost("{id}/cancel")]
    public async Task<ActionResult<BookingDto>> Cancel(string id, CancellationToken cancellationToken)
    {
        var booking = await db.Bookings.FirstOrDefaultAsync(b => b.Id == id, cancellationToken);
        if (booking is null)
        {
            return NotFound();
        }

        if (booking.Status is not (BookingStore.Pending or BookingStore.Paid))
        {
            return Conflict("This booking cannot be cancelled.");
        }

        booking.Status = BookingStore.Cancelled;
        await db.SaveChangesAsync(cancellationToken);
        return Ok(BookingStore.ToDto(booking));
    }

    private static bool TryReadRentalWindow(string? pickupText, string? returnText, out DateOnly pickup, out DateOnly returnDate)
    {
        pickup = default;
        returnDate = default;
        if (string.IsNullOrWhiteSpace(pickupText) || string.IsNullOrWhiteSpace(returnText))
        {
            return false;
        }

        if (!DateOnly.TryParse(pickupText.Trim(), out pickup) || !DateOnly.TryParse(returnText.Trim(), out returnDate))
        {
            return false;
        }

        return returnDate > pickup;
    }
}
