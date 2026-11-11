using Keyloop.Api.Data;
using Keyloop.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Keyloop.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ConfigController(KeyloopDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<AppConfigDto>> Get(CancellationToken cancellationToken)
    {
        var config = await db.AppConfigs
            .AsNoTracking()
            .Include(c => c.InsuranceTiers)
            .OrderBy(c => c.Id)
            .FirstOrDefaultAsync(cancellationToken);

        if (config is null)
        {
            return NotFound();
        }

        var tiers = config.InsuranceTiers
            .OrderBy(t => t.Id)
            .Select(t => new InsuranceTierDto(t.Code, t.Label, t.AmountUsd))
            .ToList();

        return Ok(new AppConfigDto(
            config.Currency,
            config.PlatformFeeUsd,
            tiers,
            config.RentalDayRule));
    }
}
