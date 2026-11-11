using Microsoft.EntityFrameworkCore;

namespace Keyloop.Api.Data;

public static class DatabaseBootstrap
{
    public static async Task ApplyAsync(WebApplication app)
    {
        var configuration = app.Configuration;
        var apply = configuration.GetValue("Database:ApplyMigrations", app.Environment.IsDevelopment());
        if (!apply)
        {
            return;
        }

        await using var scope = app.Services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<KeyloopDbContext>();

        var useInMemory = configuration.GetValue("Database:UseInMemory", false);
        if (useInMemory)
        {
            await db.Database.EnsureCreatedAsync();
        }
        else
        {
            await db.Database.MigrateAsync();
        }

        await CatalogSeeder.SeedAsync(db);
    }
}
