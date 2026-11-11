using Keyloop.Api.Domain;
using Keyloop.Api.Models;
using Keyloop.Api.Pricing;
using Microsoft.EntityFrameworkCore;

namespace Keyloop.Api.Data;

public static class BookingStore
{
    public const string Pending = "Pending";
    public const string Paid = "Paid";
    public const string Cancelled = "Cancelled";

    public static async Task<string> NextIdAsync(KeyloopDbContext db, CancellationToken cancellationToken)
    {
        var ids = await db.Bookings.Select(b => b.Id).ToListAsync(cancellationToken);
        var max = 0;
        foreach (var id in ids)
        {
            if (id.StartsWith("TRP-", StringComparison.Ordinal) &&
                int.TryParse(id.AsSpan(4), out var sequence))
            {
                max = Math.Max(max, sequence);
            }
        }

        return $"TRP-{max + 1:D3}";
    }

    public static async Task RememberCheckoutSessionAsync(
        KeyloopDbContext db,
        string bookingId,
        string sessionId,
        CancellationToken cancellationToken)
    {
        var booking = await db.Bookings.FirstOrDefaultAsync(b => b.Id == bookingId, cancellationToken);
        if (booking is null || string.IsNullOrWhiteSpace(sessionId))
        {
            return;
        }

        booking.StripeSessionId = sessionId;
        await db.SaveChangesAsync(cancellationToken);
    }

    public static async Task<bool> MarkPaidAsync(
        KeyloopDbContext db,
        string bookingId,
        string sessionId,
        CancellationToken cancellationToken)
    {
        var booking = await db.Bookings.FirstOrDefaultAsync(b => b.Id == bookingId, cancellationToken);
        if (booking is null || booking.Status != Pending)
        {
            return false;
        }

        booking.Status = Paid;
        if (!string.IsNullOrWhiteSpace(sessionId))
        {
            booking.StripeSessionId = sessionId;
        }

        await db.SaveChangesAsync(cancellationToken);
        return true;
    }

    public static void ApplyCharge(BookingEntity booking, ChargeResult charge)
    {
        booking.InsuranceTier = charge.InsuranceTierCode;
        booking.DailyPriceUsd = charge.BaseUsd / charge.RentalDays;
        booking.RentalDays = charge.RentalDays;
        booking.BaseUsd = charge.BaseUsd;
        booking.InsuranceUsd = charge.InsuranceUsd;
        booking.PlatformFeeUsd = charge.PlatformFeeUsd;
        booking.TotalUsd = charge.TotalUsd;
    }

    public static BookingDto ToDto(BookingEntity booking)
    {
        ChargeBreakdownDto? breakdown = null;
        if (booking.TotalUsd is not null &&
            booking.DailyPriceUsd is not null &&
            booking.RentalDays is not null &&
            booking.BaseUsd is not null &&
            booking.InsuranceUsd is not null &&
            booking.PlatformFeeUsd is not null)
        {
            breakdown = new ChargeBreakdownDto(
                booking.DailyPriceUsd.Value,
                booking.RentalDays.Value,
                booking.BaseUsd.Value,
                booking.InsuranceUsd.Value,
                booking.PlatformFeeUsd.Value,
                booking.TotalUsd.Value);
        }

        return new BookingDto(
            booking.Id,
            booking.VehicleId,
            booking.VehicleName,
            booking.VehicleImageUrl,
            booking.PickupLocation,
            booking.PickupDate,
            booking.ReturnDate,
            booking.Status,
            booking.CreatedAt,
            booking.InsuranceTier,
            breakdown);
    }
}
