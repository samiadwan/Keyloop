using System.Net;
using System.Net.Http.Json;
using Keyloop.Api.Models;

namespace Keyloop.Api.Tests;

public sealed class PaymentsControllerTests : IClassFixture<KeyloopApiWebApplicationFactory>
{
    private readonly HttpClient _client;

    public PaymentsControllerTests(KeyloopApiWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task CreateCheckoutSession_Returns503_WhenStripeNotConfigured()
    {
        var response = await _client.PostAsJsonAsync("/api/payments/checkout-session", ValidBody());

        Assert.Equal(HttpStatusCode.ServiceUnavailable, response.StatusCode);
        var message = await response.Content.ReadAsStringAsync();
        Assert.Contains("Stripe is not configured", message, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task CreateCheckoutSession_Returns400_ForUnknownTier_WithoutCallingStripe()
    {
        var body = ValidBody();
        body.InsuranceTier = "Gold";

        var response = await _client.PostAsJsonAsync("/api/payments/checkout-session", body);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateCheckoutSession_Returns400_WhenReturnDateIsBeforePickup()
    {
        var body = ValidBody();
        body.PickupDate = "2030-01-05";
        body.ReturnDate = "2030-01-01";

        var response = await _client.PostAsJsonAsync("/api/payments/checkout-session", body);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task VerifySession_Returns503_WhenStripeNotConfigured()
    {
        var response = await _client.GetAsync("/api/payments/session/cs_test_missing");

        Assert.Equal(HttpStatusCode.ServiceUnavailable, response.StatusCode);
    }

    private static CreateCheckoutSessionRequest ValidBody() => new()
    {
        BookingId = "TRP-002",
        VehicleId = "v1",
        InsuranceTier = "Standard",
        PickupDate = "2030-01-01",
        ReturnDate = "2030-01-04",
    };
}
