using FluentAssertions;
using Yeboekun.API.Configuration;
using Yeboekun.API.Middleware;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Xunit;

namespace Yeboekun.Tests.Middleware;

public class FamilyAccessMiddlewareTests
{
    private static IDataProtectionProvider NewDataProtection()
    {
        var services = new ServiceCollection();
        services.AddDataProtection();
        return services.BuildServiceProvider().GetRequiredService<IDataProtectionProvider>();
    }

    [Fact]
    public async Task WhenGateInactive_CallsNext()
    {
        var nextCalled = false;
        var middleware = new FamilyAccessMiddleware(_ =>
        {
            nextCalled = true;
            return Task.CompletedTask;
        });
        var ctx = new DefaultHttpContext();
        ctx.Request.Path = "/api/persons";
        var options = Options.Create(new FamilyAccessOptions { Disabled = true, Password = "x" });

        await middleware.InvokeAsync(ctx, NewDataProtection(), options);

        nextCalled.Should().BeTrue();
    }

    [Fact]
    public async Task WhenPathNotUnderApi_CallsNext()
    {
        var nextCalled = false;
        var middleware = new FamilyAccessMiddleware(_ =>
        {
            nextCalled = true;
            return Task.CompletedTask;
        });
        var ctx = new DefaultHttpContext();
        ctx.Request.Path = "/swagger/index.html";
        var options = Options.Create(new FamilyAccessOptions { Disabled = false, Password = "x" });

        await middleware.InvokeAsync(ctx, NewDataProtection(), options);

        nextCalled.Should().BeTrue();
    }

    [Fact]
    public async Task WhenPublicAccessPath_CallsNext()
    {
        var nextCalled = false;
        var middleware = new FamilyAccessMiddleware(_ =>
        {
            nextCalled = true;
            return Task.CompletedTask;
        });
        var ctx = new DefaultHttpContext();
        ctx.Request.Path = "/api/access/status";
        var options = Options.Create(new FamilyAccessOptions { Disabled = false, Password = "x" });

        await middleware.InvokeAsync(ctx, NewDataProtection(), options);

        nextCalled.Should().BeTrue();
    }

    [Fact]
    public async Task WhenProtectedPathWithoutCookie_Returns401()
    {
        var nextCalled = false;
        var middleware = new FamilyAccessMiddleware(_ =>
        {
            nextCalled = true;
            return Task.CompletedTask;
        });
        var ctx = new DefaultHttpContext();
        ctx.Request.Path = "/api/persons";
        ctx.Response.Body = new MemoryStream();
        var options = Options.Create(new FamilyAccessOptions { Disabled = false, Password = "x" });

        await middleware.InvokeAsync(ctx, NewDataProtection(), options);

        nextCalled.Should().BeFalse();
        ctx.Response.StatusCode.Should().Be(StatusCodes.Status401Unauthorized);
    }

    [Fact]
    public async Task WhenProtectedPathWithValidCookie_CallsNext()
    {
        var nextCalled = false;
        var middleware = new FamilyAccessMiddleware(_ =>
        {
            nextCalled = true;
            return Task.CompletedTask;
        });
        var ctx = new DefaultHttpContext();
        ctx.Request.Path = "/api/persons";
        var dp = NewDataProtection();
        var protector = dp.CreateProtector(FamilyAccessMiddleware.ProtectorPurpose);
        var token = protector.Protect("granted");
        ctx.Request.Headers.Append("Cookie", $"{FamilyAccessMiddleware.CookieName}={token}");
        var options = Options.Create(new FamilyAccessOptions { Disabled = false, Password = "x" });

        await middleware.InvokeAsync(ctx, dp, options);

        nextCalled.Should().BeTrue();
    }

    [Fact]
    public async Task WhenCookiePayloadNotGranted_Returns401()
    {
        var nextCalled = false;
        var middleware = new FamilyAccessMiddleware(_ =>
        {
            nextCalled = true;
            return Task.CompletedTask;
        });
        var ctx = new DefaultHttpContext();
        ctx.Request.Path = "/api/persons";
        ctx.Response.Body = new MemoryStream();
        var dp = NewDataProtection();
        var protector = dp.CreateProtector(FamilyAccessMiddleware.ProtectorPurpose);
        var token = protector.Protect("other");
        ctx.Request.Headers.Append("Cookie", $"{FamilyAccessMiddleware.CookieName}={token}");
        var options = Options.Create(new FamilyAccessOptions { Disabled = false, Password = "x" });

        await middleware.InvokeAsync(ctx, dp, options);

        nextCalled.Should().BeFalse();
        ctx.Response.StatusCode.Should().Be(StatusCodes.Status401Unauthorized);
    }

    [Fact]
    public async Task WhenCookieInvalid_Returns401()
    {
        var nextCalled = false;
        var middleware = new FamilyAccessMiddleware(_ =>
        {
            nextCalled = true;
            return Task.CompletedTask;
        });
        var ctx = new DefaultHttpContext();
        ctx.Request.Path = "/api/persons";
        ctx.Response.Body = new MemoryStream();
        ctx.Request.Headers.Append("Cookie", $"{FamilyAccessMiddleware.CookieName}=garbage");
        var options = Options.Create(new FamilyAccessOptions { Disabled = false, Password = "x" });

        await middleware.InvokeAsync(ctx, NewDataProtection(), options);

        nextCalled.Should().BeFalse();
        ctx.Response.StatusCode.Should().Be(StatusCodes.Status401Unauthorized);
    }
}
