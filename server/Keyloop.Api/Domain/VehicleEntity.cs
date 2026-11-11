namespace Keyloop.Api.Domain;

public sealed class VehicleEntity
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public required string ImageUrl { get; set; }
    public required string Location { get; set; }
    public decimal DailyPriceUsd { get; set; }
    public List<string> Features { get; set; } = [];
    public List<string> Rules { get; set; } = [];
}
