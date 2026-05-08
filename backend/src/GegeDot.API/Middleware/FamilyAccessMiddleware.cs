using System.Security.Cryptography;
using GegeDot.API.Configuration;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Options;

namespace GegeDot.API.Middleware;

public class FamilyAccessMiddleware
{
    public const string CookieName = "GegeDotFamilyAccess";
    public const string ProtectorPurpose = "GegeDot.FamilyAccess.v1";
    internal const string CookiePayloadGranted = "granted";

    private readonly RequestDelegate _next;

    public FamilyAccessMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(
        HttpContext context,
        IDataProtectionProvider dataProtection,
        IOptions<FamilyAccessOptions> options)
    {
        var opts = options.Value;
        if (!opts.IsGateActive)
        {
            await _next(context);
            return;
        }

        var path = context.Request.Path.Value ?? string.Empty;

        // Swagger UI et fichiers statiques du host API (hors /api).
        if (!context.Request.Path.StartsWithSegments("/api"))
        {
            await _next(context);
            return;
        }

        if (IsPublicAccessPath(path))
        {
            await _next(context);
            return;
        }

        var cookie = context.Request.Cookies[CookieName];
        if (string.IsNullOrEmpty(cookie))
        {
            await WriteUnauthorized(context);
            return;
        }

        try
        {
            var protector = dataProtection.CreateProtector(ProtectorPurpose);
            var payload = protector.Unprotect(cookie);
            if (payload != CookiePayloadGranted)
            {
                await WriteUnauthorized(context);
                return;
            }
        }
        catch (CryptographicException)
        {
            await WriteUnauthorized(context);
            return;
        }

        await _next(context);
    }

    private static bool IsPublicAccessPath(string path)
    {
        return path.StartsWith("/api/access/", StringComparison.OrdinalIgnoreCase);
    }

    private static Task WriteUnauthorized(HttpContext context)
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        context.Response.ContentType = "application/json";
        return context.Response.WriteAsync("{\"error\":\"family_access_required\"}");
    }
}
