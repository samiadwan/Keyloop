using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;

namespace Keyloop.Api.Tests;

public sealed class KeyloopApiWebApplicationFactory : WebApplicationFactory<Program>
{
    private readonly string _databaseName = Guid.NewGuid().ToString();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Development");
        builder.UseSetting("Database:UseInMemory", "true");
        builder.UseSetting("Database:ApplyMigrations", "true");
        builder.UseSetting("Database:InMemoryName", _databaseName);
        builder.UseSetting("Stripe:SecretKey", "");
        builder.ConfigureAppConfiguration((_, config) =>
        {
            config.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Stripe:SecretKey"] = "",
            });
        });
    }
}
