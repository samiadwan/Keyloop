namespace Keyloop.Api.Data;

public static class CatalogLocations
{
    public static readonly string[] All = ["Sydney", "Melbourne", "Brisbane", "Perth"];

    private static readonly Dictionary<string, string> StateToCatalog =
        new(StringComparer.OrdinalIgnoreCase)
        {
            ["NSW"] = "Sydney",
            ["NEW SOUTH WALES"] = "Sydney",
            ["VIC"] = "Melbourne",
            ["VICTORIA"] = "Melbourne",
            ["QLD"] = "Brisbane",
            ["QUEENSLAND"] = "Brisbane",
            ["WA"] = "Perth",
            ["WESTERN AUSTRALIA"] = "Perth",
        };

    public static string? Normalize(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        var trimmed = value.Trim();
        return All.FirstOrDefault(c => c.Equals(trimmed, StringComparison.OrdinalIgnoreCase));
    }

    public static string? ExtractFromDisplayText(string? text)
    {
        if (string.IsNullOrWhiteSpace(text))
        {
            return null;
        }

        var trimmed = text.Trim();
        var exact = Normalize(trimmed);
        if (exact is not null)
        {
            return exact;
        }

        var firstSegment = trimmed.Split(',')[0]?.Trim();
        if (!string.IsNullOrEmpty(firstSegment))
        {
            var fromFirst = Normalize(firstSegment);
            if (fromFirst is not null)
            {
                return fromFirst;
            }
        }

        foreach (var catalog in All)
        {
            if (trimmed.StartsWith(catalog, StringComparison.OrdinalIgnoreCase)
                && (trimmed.Length == catalog.Length || !char.IsLetter(trimmed[catalog.Length])))
            {
                return catalog;
            }
        }

        var lower = trimmed.ToLowerInvariant();
        foreach (var (state, catalog) in StateToCatalog)
        {
            if (lower.Contains(state.ToLowerInvariant()))
            {
                return catalog;
            }
        }

        return null;
    }

    public static string? ResolveFilter(string? locationQuery)
    {
        if (string.IsNullOrWhiteSpace(locationQuery))
        {
            return null;
        }

        return ExtractFromDisplayText(locationQuery) ?? Normalize(locationQuery);
    }
}
