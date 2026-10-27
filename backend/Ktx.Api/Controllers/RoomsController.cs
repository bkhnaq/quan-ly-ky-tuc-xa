using Ktx.Api.Contracts;
using Ktx.Api.Data;
using Ktx.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace Ktx.Api.Controllers;

[ApiController]
[Route("api/rooms")]
public class RoomsController(KtxDbContext db) : ControllerBase
{
    // GET /api/rooms
    [HttpGet]
    public async Task<ActionResult<List<Room>>> GetAll()
    {
        return await db.Rooms.AsNoTracking().OrderBy(room => room.Id).ToListAsync();
    }

    // GET /api/rooms/A101
    [HttpGet("{id}")]
    public async Task<ActionResult<Room>> GetById(string id)
    {
        var room = await db.Rooms.FindAsync(id.ToUpperInvariant());
        if (room is null) return NotFound(new { message = "Không tìm thấy phòng." });
        return room;
    }

    // POST /api/rooms
    [HttpPost]
    public async Task<ActionResult<Room>> Create(RoomRequest request)
    {
        var id = request.Id.ToUpperInvariant();
        if (await db.Rooms.AnyAsync(room => room.Id == id))
            return Conflict(new { message = "Mã phòng đã tồn tại." });

        var room = new Room { Id = id };
        ApplyRequest(room, request);
        db.Rooms.Add(room);
        try
        {
            await db.SaveChangesAsync();
        }
        catch (DbUpdateException exception) when (exception.InnerException is SqliteException { SqliteExtendedErrorCode: 1555 or 2067 })
        {
            return Conflict(new { message = "Mã phòng đã tồn tại." });
        }
        return CreatedAtAction(nameof(GetById), new { id = room.Id }, room);
    }

    // PUT /api/rooms/A101
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, RoomRequest request)
    {
        if (!id.Equals(request.Id, StringComparison.OrdinalIgnoreCase))
            return BadRequest(new { message = "Không được thay đổi mã phòng khi cập nhật." });

        var room = await db.Rooms.FindAsync(id.ToUpperInvariant());
        if (room is null) return NotFound(new { message = "Không tìm thấy phòng." });
        ApplyRequest(room, request);
        await db.SaveChangesAsync();
        return NoContent();
    }

    // DELETE /api/rooms/A101 — chỉ xóa phòng chưa có người ở.
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var room = await db.Rooms.FindAsync(id.ToUpperInvariant());
        if (room is null) return NotFound(new { message = "Không tìm thấy phòng." });
        if (room.Occupied > 0)
            return Conflict(new { message = "Không thể xóa phòng đang có người ở." });

        db.Rooms.Remove(room);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private static void ApplyRequest(Room room, RoomRequest request)
    {
        room.Building = request.Building.ToUpperInvariant();
        room.Capacity = request.Capacity!.Value;
        room.Occupied = request.Occupied!.Value;
        room.Price = request.Price!.Value;
    }
}
