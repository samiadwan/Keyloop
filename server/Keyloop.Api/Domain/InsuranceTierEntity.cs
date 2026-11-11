namespace Keyloop.Api.Domain;

public sealed class InsuranceTierEntity
{
    public int Id { get; set; }
    public int AppConfigId { get; set; }
    public AppConfigEntity? AppConfig { get; set; }
    public required string Code { get; set; }
    public required string Label { get; set; }
    public decimal AmountUsd { get; set; }
}
