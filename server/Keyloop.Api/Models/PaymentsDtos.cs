using System.ComponentModel.DataAnnotations;

namespace Keyloop.Api.Models;

public sealed class CreateCheckoutSessionRequest
{
    [Required]
    [MinLength(1)]
    public string BookingId { get; set; } = string.Empty;

    [Required]
    [MinLength(1)]
    public string VehicleId { get; set; } = string.Empty;

    [Required]
    [MinLength(1)]
    public string InsuranceTier { get; set; } = string.Empty;

    [Required]
    [MinLength(1)]
    public string PickupDate { get; set; } = string.Empty;

    [Required]
    [MinLength(1)]
    public string ReturnDate { get; set; } = string.Empty;
}

public sealed record CreateCheckoutSessionResponse(string CheckoutUrl);

public sealed record SessionVerifyResponse(
    bool Paid,
    string? BookingId,
    string? PaymentStatus,
    long? AmountTotalCents,
    string? Currency);
