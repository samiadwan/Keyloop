using Keyloop.Api.Data;
using Keyloop.Api.Domain;
using Keyloop.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Keyloop.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VehiclesController(KeyloopDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<VehicleDto>>> Get([FromQuery] string? location, CancellationToken cancellationToken)
    {
        IQueryable<VehicleEntity> query = db.Vehicles.AsNoTracking();
        var catalogFilter = CatalogLocations.ResolveFilter(location);
        if (!string.IsNullOrWhiteSpace(location) && catalogFilter is not null)
        {
            query = query.Where(v => v.Location.ToLower() == catalogFilter.ToLower());
        }
        else if (!string.IsNullOrWhiteSpace(location))
        {
            return Ok(Array.Empty<VehicleDto>());
        }

        var list = await query
            .OrderBy(v => v.Id)
            .ToListAsync(cancellationToken);

        return Ok(list.Select(CatalogSeeder.ToDto).ToList());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<VehicleDto>> GetById(string id, CancellationToken cancellationToken)
    {
        var vehicle = await db.Vehicles.AsNoTracking().FirstOrDefaultAsync(v => v.Id == id, cancellationToken);
        return vehicle is null ? NotFound() : Ok(CatalogSeeder.ToDto(vehicle));
    }
}
