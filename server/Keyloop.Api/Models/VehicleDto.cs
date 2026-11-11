namespace Keyloop.Api.Models;

public sealed record VehicleDto(
    string Id,
    string Name,
    string ImageUrl,
    string Location,
    decimal DailyPriceUsd,
    IReadOnlyList<string> Features,
    IReadOnlyList<string> Rules);
