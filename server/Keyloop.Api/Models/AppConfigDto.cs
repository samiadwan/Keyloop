namespace Keyloop.Api.Models;

public sealed record InsuranceTierDto(string Code, string Label, decimal AmountUsd);

public sealed record AppConfigDto(
    string Currency,
    decimal PlatformFeeUsd,
    IReadOnlyList<InsuranceTierDto> InsuranceTiers,
    string RentalDayRule);
