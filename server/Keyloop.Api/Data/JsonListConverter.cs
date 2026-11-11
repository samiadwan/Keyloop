using System.Text.Json;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Keyloop.Api.Data;

internal static class JsonListConverter
{
    private static readonly JsonSerializerOptions SerializerOptions = new();

    public static ValueConverter<List<string>, string> StringList { get; } = new(
        v => Serialize(v),
        v => Deserialize(v));

    public static ValueComparer<List<string>> StringListComparer { get; } = new(
        (a, b) => SequenceEqual(a, b),
        v => ComputeHash(v),
        v => Snapshot(v));

    private static string Serialize(List<string> value) =>
        JsonSerializer.Serialize(value, SerializerOptions);

    private static List<string> Deserialize(string value) =>
        JsonSerializer.Deserialize<List<string>>(value, SerializerOptions) ?? [];

    private static bool SequenceEqual(List<string>? a, List<string>? b) =>
        (a ?? []).SequenceEqual(b ?? []);

    private static int ComputeHash(List<string>? value) =>
        (value ?? []).Aggregate(0, (hash, s) => HashCode.Combine(hash, s.GetHashCode()));

    private static List<string> Snapshot(List<string>? value) =>
        (value ?? []).ToList();
}
