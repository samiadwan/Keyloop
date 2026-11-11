namespace Keyloop.Api.Domain;

public sealed class AppConfigEntity
{
    public int Id { get; set; }
    public required string Currency { get; set; }
    public decimal PlatformFeeUsd { get; set; }
    public required string RentalDayRule { get; set; }
    public ICollection<InsuranceTierEntity> InsuranceTiers { get; set; } = [];
}
