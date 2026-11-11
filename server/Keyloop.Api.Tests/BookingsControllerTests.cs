using System.Net;
using System.Net.Http.Json;
using Keyloop.Api.Data;
using Keyloop.Api.Models;
using Microsoft.Extensions.DependencyInjection;

namespace Keyloop.Api.Tests;

public sealed class BookingsControllerTests : IClassFixture<KeyloopApiWebApplicationFactory>
{
    private readonly KeyloopApiWebApplicationFactory _factory;
    private readonly HttpClient _client;

    public BookingsControllerTests(KeyloopApiWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Create_AssignsSequentialIds_AndListReturnsBoth()
    {
        var first = await CreateAsync("v1", "2030-06-01", "2030-06-04");
        var second = await CreateAsync("v2", "2030-07-01", "2030-07-03");

        Assert.Equal(HttpStatusCode.Created, first.StatusCode);
        Assert.Equal(HttpStatusCode.Created, second.StatusCode);
        var firstBody = await first.Content.ReadFromJsonAsync<BookingDto>();
        var secondBody = await second.Content.ReadFromJsonAsync<BookingDto>();
        Assert.NotNull(firstBody);
        Assert.NotNull(secondBody);
        Assert.Equal("Pending", firstBody.Status);
        Assert.StartsWith("TRP-", firstBody.Id, StringComparison.Ordinal);
        Assert.NotEqual(firstBody.Id, secondBody.Id);
        Assert.Null(firstBody.ChargeBreakdown);
        Assert.Null(firstBody.InsuranceTier);

        var list = await _client.GetFromJsonAsync<List<BookingDto>>("/api/bookings");
        Assert.NotNull(list);
        Assert.Contains(list, b => b.Id == firstBody.Id);
        Assert.Contains(list, b => b.Id == secondBody.Id);
    }

    [Fact]
    public async Task Get_UnknownId_Returns404()
    {
        var response = await _client.GetAsync("/api/bookings/TRP-999");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task UpdateTier_SavesBreakdownOnThatBookingOnly()
    {
        var created = await CreateAsync("v1", "2030-08-01", "2030-08-04");
        var other = await CreateAsync("v2", "2030-09-01", "2030-09-03");
        var booking = await created.Content.ReadFromJsonAsync<BookingDto>();
        var untouched = await other.Content.ReadFromJsonAsync<BookingDto>();
        Assert.NotNull(booking);
        Assert.NotNull(untouched);

        var response = await _client.PatchAsJsonAsync(
            $"/api/bookings/{booking.Id}",
            new UpdateBookingTierRequest { InsuranceTier = "Standard" });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var updated = await response.Content.ReadFromJsonAsync<BookingDto>();
        Assert.NotNull(updated);
        Assert.Equal("Standard", updated.InsuranceTier);
        Assert.Equal(3, updated.ChargeBreakdown?.RentalDays);
        Assert.Equal(1000m, updated.ChargeBreakdown?.InsuranceUsd);
        Assert.Equal(5m, updated.ChargeBreakdown?.PlatformFeeUsd);

        var otherAfter = await _client.GetFromJsonAsync<BookingDto>($"/api/bookings/{untouched.Id}");
        Assert.Null(otherAfter?.InsuranceTier);
        Assert.Equal("Pending", otherAfter?.Status);
    }

    [Fact]
    public async Task Cancel_ChangesOnlyThatBooking()
    {
        var created = await CreateAsync("v1", "2030-10-01", "2030-10-04");
        var other = await CreateAsync("v3", "2030-11-01", "2030-11-03");
        var booking = await created.Content.ReadFromJsonAsync<BookingDto>();
        var untouched = await other.Content.ReadFromJsonAsync<BookingDto>();
        Assert.NotNull(booking);
        Assert.NotNull(untouched);

        var response = await _client.PostAsync($"/api/bookings/{booking.Id}/cancel", null);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var cancelled = await response.Content.ReadFromJsonAsync<BookingDto>();
        Assert.Equal("Cancelled", cancelled?.Status);

        var otherAfter = await _client.GetFromJsonAsync<BookingDto>($"/api/bookings/{untouched.Id}");
        Assert.Equal("Pending", otherAfter?.Status);
    }

    [Fact]
    public async Task MarkPaid_UpdatesOnlyTheVerifiedBooking()
    {
        var created = await CreateAsync("v1", "2030-12-01", "2030-12-04");
        var other = await CreateAsync("v4", "2031-01-01", "2031-01-03");
        var booking = await created.Content.ReadFromJsonAsync<BookingDto>();
        var untouched = await other.Content.ReadFromJsonAsync<BookingDto>();
        Assert.NotNull(booking);
        Assert.NotNull(untouched);

        await using var scope = _factory.Services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<KeyloopDbContext>();
        var marked = await BookingStore.MarkPaidAsync(db, booking.Id, "cs_test_paid", CancellationToken.None);
        Assert.True(marked);

        var paid = await _client.GetFromJsonAsync<BookingDto>($"/api/bookings/{booking.Id}");
        var stillPending = await _client.GetFromJsonAsync<BookingDto>($"/api/bookings/{untouched.Id}");
        Assert.Equal("Paid", paid?.Status);
        Assert.Equal("Pending", stillPending?.Status);

        var stored = await db.Bookings.FindAsync(booking.Id);
        Assert.Equal("cs_test_paid", stored?.StripeSessionId);
    }

    private async Task<HttpResponseMessage> CreateAsync(string vehicleId, string pickup, string returnDate)
    {
        return await _client.PostAsJsonAsync("/api/bookings", new CreateBookingRequest
        {
            VehicleId = vehicleId,
            VehicleName = "Test vehicle",
            VehicleImageUrl = $"/assets/vehicles/{vehicleId}.jpg",
            PickupLocation = "Sydney",
            PickupDate = pickup,
            ReturnDate = returnDate,
        });
    }
}
