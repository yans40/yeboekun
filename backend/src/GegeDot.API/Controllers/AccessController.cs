using System.Security.Cryptography;
using System.Text;
using System.Text.Json.Serialization;
using GegeDot.API.Configuration;
using GegeDot.API.Middleware;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace GegeDot.API.Controllers;

[ApiController]
[Route("api/access")]
public class AccessController : ControllerBase
{
    private readonly FamilyAccessOptions _options;
    private readonly IDataProtectionProvider _dataProtection;
    public AccessController(
        IOptions<FamilyAccessOptions> options,
        IDataProtectionProvider dataProtection)
    {
        _options = options.Value;
        _dataProtection = dataProtection;
    }

    /// <summary>Indique si le garde-fou est actif et si le navigateur a déjà un cookie valide.</summary>
    [HttpGet("status")]
    public ActionResult<AccessStatusResponse> Status()
    {
        if (!_options.IsGateActive)
        {
            return Ok(new AccessStatusResponse(GateEnabled: false, AccessGranted: true));
        }

        var cookie = Request.Cookies[FamilyAccessMiddleware.CookieName];
        if (string.IsNullOrEmpty(cookie))
        {
            return Ok(new AccessStatusResponse(GateEnabled: true, AccessGranted: false));
        }

        try
        {
            var protector = _dataProtection.CreateProtector(FamilyAccessMiddleware.ProtectorPurpose);
            var payload = protector.Unprotect(cookie);
            var granted = payload == FamilyAccessMiddleware.CookiePayloadGranted;
            return Ok(new AccessStatusResponse(GateEnabled: true, AccessGranted: granted));
        }
        catch (CryptographicException)
        {
            return Ok(new AccessStatusResponse(GateEnabled: true, AccessGranted: false));
        }
    }

    [HttpPost("verify")]
    public IActionResult Verify([FromBody] VerifyAccessRequest? body)
    {
        if (!_options.IsGateActive)
        {
            AppendAccessCookie();
            return Ok();
        }

        if (body?.Password is null)
        {
            return Unauthorized();
        }

        if (!FixedTimePasswordEquals(body.Password, _options.Password!))
        {
            return Unauthorized();
        }

        AppendAccessCookie();
        return Ok();
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete(FamilyAccessMiddleware.CookieName, BuildCookieOptions());
        return Ok();
    }

    private void AppendAccessCookie()
    {
        var protector = _dataProtection.CreateProtector(FamilyAccessMiddleware.ProtectorPurpose);
        var token = protector.Protect(FamilyAccessMiddleware.CookiePayloadGranted);
        Response.Cookies.Append(FamilyAccessMiddleware.CookieName, token, BuildCookieOptions());
    }

    private CookieOptions BuildCookieOptions()
    {
        return new CookieOptions
        {
            HttpOnly = true,
            Secure = Request.IsHttps,
            SameSite = SameSiteMode.Lax,
            Path = "/",
            MaxAge = TimeSpan.FromDays(30),
        };
    }

    /// <summary>Comparaison résistante aux timings sur les empreintes SHA-256.</summary>
    private static bool FixedTimePasswordEquals(string provided, string expected)
    {
        var a = SHA256.HashData(Encoding.UTF8.GetBytes(provided));
        var b = SHA256.HashData(Encoding.UTF8.GetBytes(expected));
        return CryptographicOperations.FixedTimeEquals(a, b);
    }

    public record AccessStatusResponse(
        [property: JsonPropertyName("gateEnabled")] bool GateEnabled,
        [property: JsonPropertyName("accessGranted")] bool AccessGranted);

    public record VerifyAccessRequest(
        [property: JsonPropertyName("password")] string Password);
}
