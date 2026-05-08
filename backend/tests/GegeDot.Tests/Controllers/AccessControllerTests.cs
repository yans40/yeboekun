using FluentAssertions;
using GegeDot.API.Configuration;
using GegeDot.API.Controllers;
using GegeDot.API.Middleware;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Xunit;

namespace GegeDot.Tests.Controllers;

public class AccessControllerTests
{
    private static IDataProtectionProvider NewDataProtection()
    {
        var services = new ServiceCollection();
        services.AddDataProtection();
        return services.BuildServiceProvider().GetRequiredService<IDataProtectionProvider>();
    }

    private static AccessController CreateController(
        FamilyAccessOptions opts,
        out DefaultHttpContext httpContext)
    {
        httpContext = new DefaultHttpContext();
        httpContext.Request.Scheme = "http";
        var controller = new AccessController(Options.Create(opts), NewDataProtection())
        {
            ControllerContext = new ControllerContext { HttpContext = httpContext },
        };
        return controller;
    }

    [Fact]
    public void Status_WhenGateDisabled_ReturnsNotEnabledAndGranted()
    {
        var controller = CreateController(new FamilyAccessOptions { Disabled = true, Password = "" }, out _);

        var result = controller.Status();

        var ok = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var dto = ok.Value.Should().BeOfType<AccessController.AccessStatusResponse>().Subject;
        dto.GateEnabled.Should().BeFalse();
        dto.AccessGranted.Should().BeTrue();
    }

    [Fact]
    public void Status_WhenGateActiveAndNoCookie_ReturnsNotGranted()
    {
        var controller = CreateController(new FamilyAccessOptions { Disabled = false, Password = "secret" }, out _);

        var result = controller.Status();

        var ok = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var dto = ok.Value.Should().BeOfType<AccessController.AccessStatusResponse>().Subject;
        dto.GateEnabled.Should().BeTrue();
        dto.AccessGranted.Should().BeFalse();
    }

    [Fact]
    public void Status_WhenGateActiveAndValidCookie_ReturnsGranted()
    {
        var opts = new FamilyAccessOptions { Disabled = false, Password = "secret" };
        var dp = NewDataProtection();
        var controller = new AccessController(Options.Create(opts), dp);
        var httpContext = new DefaultHttpContext { Request = { Scheme = "http" } };
        var protector = dp.CreateProtector(FamilyAccessMiddleware.ProtectorPurpose);
        var token = protector.Protect("granted");
        httpContext.Request.Headers.Append("Cookie", $"{FamilyAccessMiddleware.CookieName}={token}");
        controller.ControllerContext = new ControllerContext { HttpContext = httpContext };

        var result = controller.Status();

        var ok = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var dto = ok.Value.Should().BeOfType<AccessController.AccessStatusResponse>().Subject;
        dto.GateEnabled.Should().BeTrue();
        dto.AccessGranted.Should().BeTrue();
    }

    [Fact]
    public void Status_WhenGateActiveAndTamperedCookie_ReturnsNotGranted()
    {
        var opts = new FamilyAccessOptions { Disabled = false, Password = "secret" };
        var controller = new AccessController(Options.Create(opts), NewDataProtection());
        var httpContext = new DefaultHttpContext { Request = { Scheme = "http" } };
        httpContext.Request.Headers.Append("Cookie", $"{FamilyAccessMiddleware.CookieName}=not-a-valid-payload");
        controller.ControllerContext = new ControllerContext { HttpContext = httpContext };

        var result = controller.Status();

        var ok = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var dto = ok.Value.Should().BeOfType<AccessController.AccessStatusResponse>().Subject;
        dto.AccessGranted.Should().BeFalse();
    }

    [Fact]
    public void Verify_WhenGateDisabled_ReturnsOkAndSetsCookie()
    {
        var controller = CreateController(new FamilyAccessOptions { Disabled = true, Password = "" }, out var ctx);

        var result = controller.Verify(new AccessController.VerifyAccessRequest("anything"));

        result.Should().BeOfType<OkResult>();
        ctx.Response.Headers.SetCookie.Should().NotBeEmpty();
    }

    [Fact]
    public void Verify_WhenGateActiveAndPasswordWrong_ReturnsUnauthorized()
    {
        var controller = CreateController(new FamilyAccessOptions { Disabled = false, Password = "good" }, out _);

        var result = controller.Verify(new AccessController.VerifyAccessRequest("bad"));

        result.Should().BeOfType<UnauthorizedResult>();
    }

    [Fact]
    public void Verify_WhenGateActiveAndBodyNull_ReturnsUnauthorized()
    {
        var controller = CreateController(new FamilyAccessOptions { Disabled = false, Password = "good" }, out _);

        var result = controller.Verify(null);

        result.Should().BeOfType<UnauthorizedResult>();
    }

    [Fact]
    public void Verify_WhenGateActiveAndPasswordCorrect_ReturnsOkAndSetsCookie()
    {
        var controller = CreateController(new FamilyAccessOptions { Disabled = false, Password = "good" }, out var ctx);

        var result = controller.Verify(new AccessController.VerifyAccessRequest("good"));

        result.Should().BeOfType<OkResult>();
        ctx.Response.Headers.SetCookie.ToString().Should().Contain(FamilyAccessMiddleware.CookieName);
    }

    [Fact]
    public void Logout_ClearsCookieHeader()
    {
        var controller = CreateController(new FamilyAccessOptions { Disabled = false, Password = "x" }, out var ctx);

        var result = controller.Logout();

        result.Should().BeOfType<OkResult>();
        ctx.Response.Headers.ContainsKey("Set-Cookie").Should().BeTrue();
    }
}
