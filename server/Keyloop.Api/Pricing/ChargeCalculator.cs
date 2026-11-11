using Keyloop.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Keyloop.Api.Pricing;

/// <summary>
/// Calendar rental days, minimum 1. Total = daily price × days + flat insurance + platform fee.
/// </summary>
public static class ChargeCalculator
{
    public static int RentalDays(string pickupIso, string returnIso)
    {
        var start = DateOnly.Parse(pickupIso.Trim());
        var end = DateOnly.Parse(returnIso.Trim());
        var days = end.DayNumber - start.DayNumber;
        return Math.Max(1, days);
    }

    public static ChargeResult Compute(
        decimal dailyPriceUsd,
        string vehicleId,
        string insuranceTierCode,
        decimal insuranceUsd,
        decimal platformFeeUsd,
        string pickupDate,
        string returnDate)
    {
        var rentalDays = RentalDays(pickupDate, returnDate);
        var baseUsd = dailyPriceUsd * rentalDays;
        return new ChargeResult(
            vehicleId,
            insuranceTierCode,
            rentalDays,
            baseUsd,
            insuranceUsd,
            platformFeeUsd,
            baseUsd + insuranceUsd + platformFeeUsd);
    }

    public static async Task<ChargeResult?> ComputeAsync(
        KeyloopDbContext db,
        string vehicleId,
        string insuranceTierCode,
        string pickupDate,
        string returnDate,
        CancellationToken cancellationToken)
    {
        var vehicle = await db.Vehicles.AsNoTracking()
            .FirstOrDefaultAsync(v => v.Id == vehicleId, cancellationToken);
        if (vehicle is null)
        {
            return null;
        }

        var config = await db.AppConfigs.AsNoTracking()
            .Include(c => c.InsuranceTiers)
            .OrderBy(c => c.Id)
            .FirstOrDefaultAsync(cancellationToken);
        if (config is null)
        {
            return null;
        }

        var tier = config.InsuranceTiers.FirstOrDefault(t =>
            t.Code.Equals(insuranceTierCode.Trim(), StringComparison.OrdinalIgnoreCase));
        if (tier is null)
        {
            return null;
        }

        return Compute(
            vehicle.DailyPriceUsd,
            vehicle.Id,
            tier.Code,
            tier.AmountUsd,
            config.PlatformFeeUsd,
            pickupDate,
            returnDate);
    }
}

public sealed record ChargeResult(
    string VehicleId,
    string InsuranceTierCode,
    int RentalDays,
    decimal BaseUsd,
    decimal InsuranceUsd,
    decimal PlatformFeeUsd,
    decimal TotalUsd);
