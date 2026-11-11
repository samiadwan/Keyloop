using System.Net;
using System.Net.Http.Json;
using Keyloop.Api.Models;

namespace Keyloop.Api.Tests;

public class VehiclesApiTests : IClassFixture<KeyloopApiWebApplicationFactory>
{
    private readonly HttpClient _client;

    public VehiclesApiTests(KeyloopApiWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetVehicles_ReturnsNineSeedVehicles()
    {
        var vehicles = await _client.GetFromJsonAsync<List<VehicleDto>>("/api/vehicles");
        Assert.NotNull(vehicles);
        Assert.Equal(9, vehicles.Count);
    }

    [Fact]
    public async Task GetVehicles_FiltersByLocationSydney()
    {
        var vehicles = await _client.GetFromJsonAsync<List<VehicleDto>>("/api/vehicles?location=Sydney");
        Assert.NotNull(vehicles);
        Assert.Equal(3, vehicles.Count);
        Assert.All(vehicles, v => Assert.Equal("Sydney", v.Location, StringComparer.OrdinalIgnoreCase));
    }

    [Fact]
    public async Task GetVehicles_FiltersByPhotonStyleLocationLabel()
    {
        const string label = "Sydney, New South Wales, Australia";
        var vehicles = await _client.GetFromJsonAsync<List<VehicleDto>>(
            $"/api/vehicles?location={Uri.EscapeDataString(label)}");
        Assert.NotNull(vehicles);
        Assert.Equal(3, vehicles.Count);
        Assert.All(vehicles, v => Assert.Equal("Sydney", v.Location, StringComparer.OrdinalIgnoreCase));
    }

    [Fact]
    public async Task GetVehicles_UnknownLocation_ReturnsEmptyList()
    {
        var vehicles = await _client.GetFromJsonAsync<List<VehicleDto>>("/api/vehicles?location=Adelaide");
        Assert.NotNull(vehicles);
        Assert.Empty(vehicles);
    }

    [Fact]
    public async Task GetVehicleById_IncludesFeaturesAndRules()
    {
        var vehicle = await _client.GetFromJsonAsync<VehicleDto>("/api/vehicles/v8");
        Assert.NotNull(vehicle);
        Assert.NotEmpty(vehicle.Features);
        Assert.Contains(vehicle.Features, f => f.Contains("Air conditioning", StringComparison.OrdinalIgnoreCase));
        Assert.NotEmpty(vehicle.Rules);
        Assert.Contains(vehicle.Rules, r => r.Contains("licence", StringComparison.OrdinalIgnoreCase));
    }

    [Fact]
    public async Task GetVehicleById_Unknown_ReturnsNotFound()
    {
        var response = await _client.GetAsync("/api/vehicles/missing");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
