using Ktx.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ktx.Api.Controllers;

[ApiController]
[Route("api/statistics")]
public class StatisticsController(KtxDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var rooms = await db.Rooms.AsNoTracking().ToListAsync();
        return Ok(new
        {
            totalRooms = rooms.Count,
            occupiedPlaces = rooms.Sum(room => room.Occupied),
            availableRooms = rooms.Count(room => room.Occupied < room.Capacity)
        });
    }
}
