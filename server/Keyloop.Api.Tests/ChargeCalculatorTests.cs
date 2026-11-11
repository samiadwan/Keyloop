using Keyloop.Api.Data;
using Keyloop.Api.Pricing;
using Microsoft.EntityFrameworkCore;

namespace Keyloop.Api.Tests;

public sealed class ChargeCalculatorTests
{
    [Fact]
    public void Compute_StandardThreeDaysAt100_Is1305()
    {
        var charge = ChargeCalculator.Compute(
            100m,
            "v-test",
            "Standard",
            1000m,
            5m,
            "2030-01-01",
            "2030-01-04");

        Assert.Equal(3, charge.RentalDays);
        Assert.Equal(300m, charge.BaseUsd);
        Assert.Equal(1000m, charge.InsuranceUsd);
        Assert.Equal(5m, charge.PlatformFeeUsd);
        Assert.Equal(1305m, charge.TotalUsd);
    }

    [Fact]
    public void RentalDays_SameDay_IsMinimumOne()
    {
        Assert.Equal(1, ChargeCalculator.RentalDays("2030-01-01", "2030-01-01"));
    }

    [Fact]
    public async Task ComputeAsync_BasicTwoDaysOnCorolla_Is603()
    {
        await using var db = await CreateDbAsync();
        var charge = await ChargeCalculator.ComputeAsync(
            db,
            "v1",
            "Basic",
            "2030-01-01",
            "2030-01-03",
            CancellationToken.None);

        Assert.NotNull(charge);
        Assert.Equal(2, charge.RentalDays);
        Assert.Equal(98m, charge.BaseUsd);
        Assert.Equal(500m, charge.InsuranceUsd);
        Assert.Equal(5m, charge.PlatformFeeUsd);
        Assert.Equal(603m, charge.TotalUsd);
    }

    [Fact]
    public async Task ComputeAsync_UnknownTier_ReturnsNull()
    {
        await using var db = await CreateDbAsync();
        var charge = await ChargeCalculator.ComputeAsync(
            db,
            "v1",
            "Gold",
            "2030-01-01",
            "2030-01-03",
            CancellationToken.None);

        Assert.Null(charge);
    }

    private static async Task<KeyloopDbContext> CreateDbAsync()
    {
        var options = new DbContextOptionsBuilder<KeyloopDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        var db = new KeyloopDbContext(options);
        await CatalogSeeder.SeedAsync(db);
        return db;
    }
}
