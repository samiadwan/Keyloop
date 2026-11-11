using Keyloop.Api.Domain;
using Microsoft.EntityFrameworkCore;

namespace Keyloop.Api.Data;

public sealed class KeyloopDbContext(DbContextOptions<KeyloopDbContext> options) : DbContext(options)
{
    public DbSet<VehicleEntity> Vehicles => Set<VehicleEntity>();
    public DbSet<AppConfigEntity> AppConfigs => Set<AppConfigEntity>();
    public DbSet<InsuranceTierEntity> InsuranceTiers => Set<InsuranceTierEntity>();
    public DbSet<BookingEntity> Bookings => Set<BookingEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<VehicleEntity>(entity =>
        {
            entity.ToTable("vehicles");
            entity.HasKey(v => v.Id);
            entity.Property(v => v.Id).HasMaxLength(16);
            entity.Property(v => v.Name).HasMaxLength(128);
            entity.Property(v => v.ImageUrl).HasMaxLength(256);
            entity.Property(v => v.Location).HasMaxLength(64);
            entity.Property(v => v.DailyPriceUsd).HasPrecision(10, 2);
            entity.Property(v => v.Features)
                .HasColumnType("jsonb")
                .HasConversion(JsonListConverter.StringList, JsonListConverter.StringListComparer);
            entity.Property(v => v.Rules)
                .HasColumnType("jsonb")
                .HasConversion(JsonListConverter.StringList, JsonListConverter.StringListComparer);
        });

        modelBuilder.Entity<AppConfigEntity>(entity =>
        {
            entity.ToTable("app_config");
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Currency).HasMaxLength(8);
            entity.Property(c => c.RentalDayRule).HasMaxLength(64);
            entity.Property(c => c.PlatformFeeUsd).HasPrecision(10, 2);
        });

        modelBuilder.Entity<InsuranceTierEntity>(entity =>
        {
            entity.ToTable("insurance_tiers");
            entity.HasKey(t => t.Id);
            entity.Property(t => t.Code).HasMaxLength(32);
            entity.Property(t => t.Label).HasMaxLength(64);
            entity.Property(t => t.AmountUsd).HasPrecision(10, 2);
            entity.HasOne(t => t.AppConfig)
                .WithMany(c => c.InsuranceTiers)
                .HasForeignKey(t => t.AppConfigId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<BookingEntity>(entity =>
        {
            entity.ToTable("bookings");
            entity.HasKey(b => b.Id);
            entity.Property(b => b.Id).HasMaxLength(16);
            entity.Property(b => b.VehicleId).HasMaxLength(16);
            entity.Property(b => b.VehicleName).HasMaxLength(128);
            entity.Property(b => b.VehicleImageUrl).HasMaxLength(256);
            entity.Property(b => b.PickupLocation).HasMaxLength(128);
            entity.Property(b => b.PickupDate).HasMaxLength(10);
            entity.Property(b => b.ReturnDate).HasMaxLength(10);
            entity.Property(b => b.Status).HasMaxLength(16);
            entity.Property(b => b.InsuranceTier).HasMaxLength(32);
            entity.Property(b => b.StripeSessionId).HasMaxLength(255);
            entity.Property(b => b.DailyPriceUsd).HasPrecision(10, 2);
            entity.Property(b => b.BaseUsd).HasPrecision(10, 2);
            entity.Property(b => b.InsuranceUsd).HasPrecision(10, 2);
            entity.Property(b => b.PlatformFeeUsd).HasPrecision(10, 2);
            entity.Property(b => b.TotalUsd).HasPrecision(10, 2);
        });
    }
}
