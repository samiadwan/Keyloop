using System.ComponentModel.DataAnnotations;

namespace Keyloop.Api.Models;

public sealed class CreateBookingRequest
{
    [Required]
    [MinLength(1)]
    public string VehicleId { get; set; } = string.Empty;

    [Required]
    [MinLength(1)]
    public string VehicleName { get; set; } = string.Empty;

    public string? VehicleImageUrl { get; set; }

    [Required]
    [MinLength(1)]
    public string PickupLocation { get; set; } = string.Empty;

    [Required]
    [MinLength(1)]
    public string PickupDate { get; set; } = string.Empty;

    [Required]
    [MinLength(1)]
    public string ReturnDate { get; set; } = string.Empty;
}

public sealed class UpdateBookingTierRequest
{
    [Required]
    [MinLength(1)]
    public string InsuranceTier { get; set; } = string.Empty;
}

public sealed record ChargeBreakdownDto(
    decimal DailyPriceUsd,
    int RentalDays,
    decimal BaseUsd,
    decimal InsuranceUsd,
    decimal PlatformFeeUsd,
    decimal TotalUsd);

public sealed record BookingDto(
    string Id,
    string VehicleId,
    string VehicleName,
    string? VehicleImageUrl,
    string PickupLocation,
    string PickupDate,
    string ReturnDate,
    string Status,
    DateTime CreatedAt,
    string? InsuranceTier,
    ChargeBreakdownDto? ChargeBreakdown);
