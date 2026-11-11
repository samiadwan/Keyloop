using Keyloop.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var useInMemory = builder.Configuration.GetValue("Database:UseInMemory", false);
if (useInMemory)
{
    var inMemoryName = builder.Configuration["Database:InMemoryName"];
    if (string.IsNullOrWhiteSpace(inMemoryName))
    {
        inMemoryName = "keyloop-dev";
    }

    builder.Services.AddDbContext<KeyloopDbContext>(options =>
        options.UseInMemoryDatabase(inMemoryName));
}
else
{
    var connectionString = builder.Configuration.GetConnectionString("Default");
    if (string.IsNullOrWhiteSpace(connectionString))
    {
        throw new InvalidOperationException(
            "ConnectionStrings:Default is required when Database:UseInMemory is false. " +
            "See docs/guide/backend-development.md.");
    }

    builder.Services.AddDbContext<KeyloopDbContext>(options =>
        options.UseNpgsql(connectionString));
}

var allowedOrigins = builder.Configuration.GetSection("Cors:Origins").Get<string[]>()
    ?? ["http://localhost:4200"];

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Keyloop API v1");
        options.RoutePrefix = "swagger";
    });
    app.MapGet("/", () => Results.Redirect("/swagger")).ExcludeFromDescription();
}

app.UseCors();
app.UseAuthorization();
app.MapControllers();

await DatabaseBootstrap.ApplyAsync(app);

app.Run();

public partial class Program;
