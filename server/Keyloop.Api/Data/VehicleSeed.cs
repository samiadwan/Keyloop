using Keyloop.Api.Models;

namespace Keyloop.Api.Data;

public static class VehicleSeed
{
    public static IReadOnlyList<string> GenericFeatures { get; } =
    [
        "Air conditioning",
        "Automatic transmission",
        "5-seat configuration",
        "Bluetooth & USB connectivity",
        "Reversing camera or parking sensors",
        "Comprehensive insurance options at checkout",
    ];

    public static IReadOnlyList<string> GenericRentalRules { get; } =
    [
        "Valid driver's licence required; minimum age 21.",
        "Return the vehicle with the same fuel or charge level as at pickup.",
        "No smoking, vaping, or pets inside the vehicle.",
        "Unlimited kilometres for this demo catalogue.",
        "Minimum rental length is 1 calendar day.",
        "Late return is charged in full calendar-day increments.",
        "Cancellations follow My Trips policy (demo — no real refunds).",
    ];

    public static IReadOnlyList<VehicleDto> All { get; } =
    [
        V("v1", "Toyota Corolla", "/assets/vehicles/v1.jpg", CatalogLocations.All[0], 49),
        V("v2", "Hyundai i30", "/assets/vehicles/v2.jpg", CatalogLocations.All[0], 52),
        V("v3", "Mazda CX-5", "/assets/vehicles/v3.jpg", CatalogLocations.All[1], 78),
        V("v4", "Kia Sportage", "/assets/vehicles/v4.jpg", CatalogLocations.All[1], 75),
        V("v5", "Ford Ranger", "/assets/vehicles/v5.jpg", CatalogLocations.All[2], 95),
        V("v6", "Honda CR-V", "/assets/vehicles/v6.jpg", CatalogLocations.All[2], 82),
        V("v7", "Subaru Outback", "/assets/vehicles/v7.jpg", CatalogLocations.All[3], 88),
        V("v8", "Tesla Model 3", "/assets/vehicles/v8.jpg", CatalogLocations.All[3], 120),
        V("v9", "Maxus eTerron 9", "/assets/vehicles/v9.jpg", CatalogLocations.All[0], 115),
    ];

    private static VehicleDto V(
        string id,
        string name,
        string imageUrl,
        string location,
        decimal dailyPriceUsd) =>
        new(id, name, imageUrl, location, dailyPriceUsd, GenericFeatures, GenericRentalRules);
}
