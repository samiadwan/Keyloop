using Keyloop.Api.Domain;
using Keyloop.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Keyloop.Api.Data;

public static class CatalogSeeder
{
    public static async Task SeedAsync(KeyloopDbContext db, CancellationToken cancellationToken = default)
    {
        await SeedConfigAsync(db, cancellationToken);
        await SeedVehiclesAsync(db, cancellationToken);
    }

    private static async Task SeedConfigAsync(KeyloopDbContext db, CancellationToken cancellationToken)
    {
        if (await db.AppConfigs.AnyAsync(cancellationToken))
        {
            return;
        }

        var config = new AppConfigEntity
        {
            Id = 1,
            Currency = "USD",
            PlatformFeeUsd = 5,
            RentalDayRule = "calendarDaysMin1",
            InsuranceTiers =
            [
                new InsuranceTierEntity { AppConfigId = 1, Code = "Basic", Label = "Basic", AmountUsd = 500 },
                new InsuranceTierEntity { AppConfigId = 1, Code = "Standard", Label = "Standard", AmountUsd = 1000 },
                new InsuranceTierEntity { AppConfigId = 1, Code = "Premium", Label = "Premium", AmountUsd = 1500 },
            ],
        };

        db.AppConfigs.Add(config);
        await db.SaveChangesAsync(cancellationToken);
    }

    private static async Task SeedVehiclesAsync(KeyloopDbContext db, CancellationToken cancellationToken)
    {
        foreach (var dto in VehicleSeed.All)
        {
            var catalogLocation = CatalogLocations.Normalize(dto.Location) ?? dto.Location;
            var entity = await db.Vehicles.FindAsync([dto.Id], cancellationToken);
            if (entity is null)
            {
                db.Vehicles.Add(ToEntity(dto with { Location = catalogLocation }));
                continue;
            }

            entity.Name = dto.Name;
            entity.ImageUrl = dto.ImageUrl;
            entity.Location = catalogLocation;
            entity.DailyPriceUsd = dto.DailyPriceUsd;
            entity.Features = dto.Features.ToList();
            entity.Rules = dto.Rules.ToList();
        }

        await db.SaveChangesAsync(cancellationToken);
    }

    internal static VehicleEntity ToEntity(VehicleDto dto) =>
        new()
        {
            Id = dto.Id,
            Name = dto.Name,
            ImageUrl = dto.ImageUrl,
            Location = dto.Location,
            DailyPriceUsd = dto.DailyPriceUsd,
            Features = dto.Features.ToList(),
            Rules = dto.Rules.ToList(),
        };

    internal static VehicleDto ToDto(VehicleEntity entity) =>
        new(
            entity.Id,
            entity.Name,
            entity.ImageUrl,
            entity.Location,
            entity.DailyPriceUsd,
            entity.Features,
            entity.Rules);
}
