using System.Net.Http.Json;
using Keyloop.Api.Models;

namespace Keyloop.Api.Tests;

public class ConfigApiTests : IClassFixture<KeyloopApiWebApplicationFactory>
{
    private readonly HttpClient _client;

    public ConfigApiTests(KeyloopApiWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetConfig_ReturnsUsdFeeAndThreeTiers()
    {
        var config = await _client.GetFromJsonAsync<AppConfigDto>("/api/config");

        Assert.NotNull(config);
        Assert.Equal("USD", config.Currency);
        Assert.Equal(5m, config.PlatformFeeUsd);
        Assert.Equal("calendarDaysMin1", config.RentalDayRule);
        Assert.Collection(
            config.InsuranceTiers,
            tier => Assert.Equal(("Basic", 500m), (tier.Code, tier.AmountUsd)),
            tier => Assert.Equal(("Standard", 1000m), (tier.Code, tier.AmountUsd)),
            tier => Assert.Equal(("Premium", 1500m), (tier.Code, tier.AmountUsd)));
    }
}
