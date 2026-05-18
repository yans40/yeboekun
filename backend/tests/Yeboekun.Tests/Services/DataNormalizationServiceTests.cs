using FluentAssertions;
using Yeboekun.Services.Services;
using Xunit;

namespace Yeboekun.Tests.Services;

public class DataNormalizationServiceTests
{
    private readonly DataNormalizationService _sut = new();

    [Theory]
    [InlineData(null, "")]
    [InlineData("", "")]
    [InlineData("   ", "")]
    public void NormalizeName_WithEmptyInput_ReturnsEmpty(string? input, string expected)
    {
        _sut.NormalizeName(input).Should().Be(expected);
    }

    [Theory]
    [InlineData("jean", "Jean")]
    [InlineData("JEAN", "Jean")]
    [InlineData("jean   dupont", "Jean Dupont")]
    [InlineData("  jean  dupont  ", "Jean Dupont")]
    [InlineData("marie-claire", "Marie-Claire")]
    public void NormalizeName_CapitalizesAndTrims(string input, string expected)
    {
        _sut.NormalizeName(input).Should().Be(expected);
    }

    [Theory]
    [InlineData(null, "")]
    [InlineData("", "")]
    public void NormalizePlace_WithEmptyInput_ReturnsEmpty(string? input, string expected)
    {
        _sut.NormalizePlace(input).Should().Be(expected);
    }

    [Theory]
    [InlineData("paris", "Paris")]
    [InlineData("st etienne", "Saint Etienne")]
    [InlineData("ste marie", "Sainte Marie")]
    [InlineData("ST PIERRE", "Saint Pierre")]
    public void NormalizePlace_ExpandsAbbreviationsAndCapitalizes(string input, string expected)
    {
        _sut.NormalizePlace(input).Should().Be(expected);
    }

    [Fact]
    public void NormalizeDate_WithNullOrEmpty_ReturnsNull()
    {
        _sut.NormalizeDate(null).Should().BeNull();
        _sut.NormalizeDate("").Should().BeNull();
        _sut.NormalizeDate("   ").Should().BeNull();
    }

    [Theory]
    [InlineData("01/02/2020", 2020, 2, 1)]
    [InlineData("01-02-2020", 2020, 2, 1)]
    [InlineData("2020-02-01", 2020, 2, 1)]
    public void NormalizeDate_ParsesStandardFormats(string input, int year, int month, int day)
    {
        var result = _sut.NormalizeDate(input);

        result.Should().NotBeNull();
        result!.Value.Year.Should().Be(year);
        result.Value.Month.Should().Be(month);
        result.Value.Day.Should().Be(day);
    }

    [Theory]
    [InlineData("vers 1850")]
    [InlineData("environ 1850")]
    [InlineData("circa 1850")]
    [InlineData("VERS 1850")]
    public void NormalizeDate_WithApproximateDate_ReturnsJanuaryFirstOfYear(string input)
    {
        var result = _sut.NormalizeDate(input);

        result.Should().NotBeNull();
        result!.Value.Year.Should().Be(1850);
        result.Value.Month.Should().Be(1);
        result.Value.Day.Should().Be(1);
    }

    [Fact]
    public void NormalizeDate_WithGarbage_ReturnsNull()
    {
        _sut.NormalizeDate("not a date").Should().BeNull();
    }

    [Theory]
    [InlineData(null, "")]
    [InlineData("", "")]
    [InlineData("agriculteur", "Agriculteur")]
    [InlineData("  INGÉNIEUR   LOGICIEL  ", "Ingénieur Logiciel")]
    public void NormalizeProfession_CapitalizesAndTrims(string? input, string expected)
    {
        _sut.NormalizeProfession(input).Should().Be(expected);
    }
}
