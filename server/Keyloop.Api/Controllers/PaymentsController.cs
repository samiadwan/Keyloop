using Keyloop.Api.Data;
using Keyloop.Api.Models;
using Keyloop.Api.Pricing;
using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;

namespace Keyloop.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController(
    KeyloopDbContext db,
    IConfiguration configuration,
    ILogger<PaymentsController> logger) : ControllerBase
{
    public const string NotConfiguredMessage =
        "Stripe is not configured. Set Stripe:SecretKey (dotnet user-secrets or environment). See docs/guide/stripe-test-setup.md.";

    [HttpPost("checkout-session")]
    public async Task<ActionResult<CreateCheckoutSessionResponse>> CreateCheckoutSession(
        [FromBody] CreateCheckoutSessionRequest body,
        CancellationToken cancellationToken)
    {
        if (!TryReadRentalWindow(body.PickupDate, body.ReturnDate, out _, out _))
        {
            return BadRequest("Invalid vehicle, insurance tier, or dates.");
        }

        ChargeResult? charge;
        try
        {
            charge = await ChargeCalculator.ComputeAsync(
                db,
                body.VehicleId.Trim(),
                body.InsuranceTier.Trim(),
                body.PickupDate.Trim(),
                body.ReturnDate.Trim(),
                cancellationToken);
        }
        catch (FormatException)
        {
            return BadRequest("Invalid vehicle, insurance tier, or dates.");
        }

        if (charge is null)
        {
            return BadRequest("Invalid vehicle, insurance tier, or dates.");
        }

        var amountCents = ToStripeAmountCents(charge.TotalUsd);
        if (amountCents < 50)
        {
            return BadRequest("Computed amount is too small for Stripe Checkout (minimum 50 cents).");
        }

        var secretKey = configuration["Stripe:SecretKey"]?.Trim();
        if (string.IsNullOrEmpty(secretKey))
        {
            return StatusCode(StatusCodes.Status503ServiceUnavailable, NotConfiguredMessage);
        }

        var clientUrl = configuration["Stripe:ClientUrl"]?.Trim().TrimEnd('/') ?? "http://localhost:4200";
        StripeConfiguration.ApiKey = secretKey;
        var sessionService = new SessionService();
        var bookingId = body.BookingId.Trim();
        var successUrl =
            $"{clientUrl}/bookings/{Uri.EscapeDataString(bookingId)}/checkout?stripe=success&session_id={{CHECKOUT_SESSION_ID}}";
        var cancelUrl =
            $"{clientUrl}/bookings/{Uri.EscapeDataString(bookingId)}/checkout?stripe=cancelled";

        var options = new SessionCreateOptions
        {
            Mode = "payment",
            SuccessUrl = successUrl,
            CancelUrl = cancelUrl,
            ClientReferenceId = bookingId,
            Metadata = new Dictionary<string, string>
            {
                ["booking_id"] = bookingId,
                ["vehicle_id"] = charge.VehicleId,
                ["insurance_tier"] = charge.InsuranceTierCode,
            },
            LineItems =
            [
                new SessionLineItemOptions
                {
                    Quantity = 1,
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        Currency = "usd",
                        UnitAmount = amountCents,
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = $"Keyloop booking {bookingId}",
                            Description =
                                $"Rental {charge.RentalDays} calendar day(s), insurance {charge.InsuranceTierCode}",
                        },
                    },
                },
            ],
        };

        try
        {
            var session = await sessionService.CreateAsync(options, cancellationToken: cancellationToken);
            if (string.IsNullOrEmpty(session.Url))
            {
                return StatusCode(StatusCodes.Status502BadGateway, "Stripe returned no checkout URL.");
            }

            if (!string.IsNullOrEmpty(session.Id))
            {
                await BookingStore.RememberCheckoutSessionAsync(db, bookingId, session.Id, cancellationToken);
            }

            return Ok(new CreateCheckoutSessionResponse(session.Url));
        }
        catch (StripeException ex)
        {
            logger.LogWarning(ex, "Stripe checkout session creation failed");
            return StatusCode(StatusCodes.Status502BadGateway, "Stripe error: " + ex.Message);
        }
    }

    [HttpGet("session/{sessionId}")]
    public async Task<ActionResult<SessionVerifyResponse>> VerifySession(string sessionId, CancellationToken cancellationToken)
    {
        var secretKey = configuration["Stripe:SecretKey"]?.Trim();
        if (string.IsNullOrEmpty(secretKey))
        {
            return StatusCode(StatusCodes.Status503ServiceUnavailable, "Stripe is not configured.");
        }

        if (string.IsNullOrWhiteSpace(sessionId))
        {
            return BadRequest();
        }

        StripeConfiguration.ApiKey = secretKey;
        var sessionService = new SessionService();

        try
        {
            var session = await sessionService.GetAsync(sessionId, cancellationToken: cancellationToken);
            var paid = string.Equals(session.PaymentStatus, "paid", StringComparison.OrdinalIgnoreCase);
            var bookingId = session.Metadata?.GetValueOrDefault("booking_id") ?? session.ClientReferenceId;
            if (paid && !string.IsNullOrWhiteSpace(bookingId))
            {
                await BookingStore.MarkPaidAsync(db, bookingId, session.Id, cancellationToken);
            }

            return Ok(new SessionVerifyResponse(
                Paid: paid,
                BookingId: bookingId,
                PaymentStatus: session.PaymentStatus,
                AmountTotalCents: session.AmountTotal,
                Currency: session.Currency));
        }
        catch (StripeException ex)
        {
            logger.LogWarning(ex, "Stripe session retrieval failed");
            return StatusCode(StatusCodes.Status502BadGateway, "Stripe error: " + ex.Message);
        }
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

        return returnDate >= pickup;
    }

    private static long ToStripeAmountCents(decimal totalUsd) =>
        (long)Math.Round(totalUsd * 100m, MidpointRounding.AwayFromZero);
}
