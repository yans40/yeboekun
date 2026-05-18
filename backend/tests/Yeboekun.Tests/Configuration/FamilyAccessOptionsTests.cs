using FluentAssertions;
using Yeboekun.API.Configuration;
using Xunit;

namespace Yeboekun.Tests.Configuration;

public class FamilyAccessOptionsTests
{
    [Theory]
    [InlineData(true, "secret", false)]
    [InlineData(false, "", false)]
    [InlineData(false, null, false)]
    [InlineData(false, "secret", true)]
    public void IsGateActive_ReflectsDisabledAndPassword(bool disabled, string? password, bool expected)
    {
        var opts = new FamilyAccessOptions { Disabled = disabled, Password = password };
        opts.IsGateActive.Should().Be(expected);
    }

    [Fact]
    public void IsGateActive_WhenPasswordWhitespace_IsFalse()
    {
        new FamilyAccessOptions { Disabled = false, Password = "   " }.IsGateActive.Should().BeFalse();
    }
}
