namespace Keyloop.Api.Domain;

public sealed class BookingEntity
{
    public required string Id { get; set; }
    public required string VehicleId { get; set; }
    public required string VehicleName { get; set; }
    public string? VehicleImageUrl { get; set; }
    public required string PickupLocation { get; set; }
    public required string PickupDate { get; set; }
    public required string ReturnDate { get; set; }
    public required string Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? InsuranceTier { get; set; }
    public decimal? DailyPriceUsd { get; set; }
    public int? RentalDays { get; set; }
    public decimal? BaseUsd { get; set; }
    public decimal? InsuranceUsd { get; set; }
    public decimal? PlatformFeeUsd { get; set; }
    public decimal? TotalUsd { get; set; }
    public string? StripeSessionId { get; set; }
}
