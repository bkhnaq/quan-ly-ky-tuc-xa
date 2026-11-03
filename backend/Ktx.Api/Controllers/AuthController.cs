using System.Security.Claims;
using Ktx.Api.Contracts;
using Ktx.Api.Data;
using Ktx.Api.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace Ktx.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(KtxDbContext db, IPasswordHasher<AppUser> passwordHasher) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<UserResponse>> Register(AuthRequest request)
    {
        var normalizedEmail = request.Email.ToUpperInvariant();
        if (await db.Users.AnyAsync(user => user.NormalizedEmail == normalizedEmail))
            return Conflict(new { message = "Email đã được đăng ký." });

        var user = new AppUser
        {
            Email = request.Email.ToLowerInvariant(),
            NormalizedEmail = normalizedEmail
        };
        user.PasswordHash = passwordHasher.HashPassword(user, request.Password);
        db.Users.Add(user);
        try
        {
            await db.SaveChangesAsync();
        }
        catch (DbUpdateException exception) when (exception.InnerException is SqliteException { SqliteExtendedErrorCode: 1555 or 2067 })
        {
            return Conflict(new { message = "Email đã được đăng ký." });
        }
        return StatusCode(StatusCodes.Status201Created, ToResponse(user));
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserResponse>> Login(AuthRequest request)
    {
        var normalizedEmail = request.Email.ToUpperInvariant();
        var user = await db.Users.SingleOrDefaultAsync(user => user.NormalizedEmail == normalizedEmail);
        if (user is null)
            return Unauthorized(new { message = "Email hoặc mật khẩu không đúng." });

        var result = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (result == PasswordVerificationResult.Failed)
            return Unauthorized(new { message = "Email hoặc mật khẩu không đúng." });

        if (result == PasswordVerificationResult.SuccessRehashNeeded)
        {
            user.PasswordHash = passwordHasher.HashPassword(user, request.Password);
            await db.SaveChangesAsync();
        }

        var identity = new ClaimsIdentity(
            [new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), new Claim(ClaimTypes.Email, user.Email)],
            CookieAuthenticationDefaults.AuthenticationScheme);
        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            new ClaimsPrincipal(identity),
            new AuthenticationProperties { IsPersistent = true, ExpiresUtc = DateTimeOffset.UtcNow.AddHours(8) });

        return ToResponse(user);
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<UserResponse>> Me()
    {
        if (!Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id)) return Unauthorized();
        var user = await db.Users.AsNoTracking().SingleOrDefaultAsync(user => user.Id == id);
        if (user is null) return Unauthorized();
        return ToResponse(user);
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return NoContent();
    }

    // SQLite không giữ DateTime.Kind; trả UTC nhất quán ở cả đăng ký và đăng nhập.
    private static UserResponse ToResponse(AppUser user) =>
        new(user.Id, user.Email, DateTime.SpecifyKind(user.CreatedAt, DateTimeKind.Utc));
}
