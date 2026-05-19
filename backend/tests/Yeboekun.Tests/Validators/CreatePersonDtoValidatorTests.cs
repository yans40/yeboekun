using FluentAssertions;
using FluentValidation.Results;
using Yeboekun.Services.DTOs;
using Yeboekun.Services.Validators;
using Xunit;

namespace Yeboekun.Tests.Validators;

public sealed class CreatePersonDtoValidatorTests
{
    private readonly CreatePersonDtoValidator _validator = new();

    // ── Cas valides ──────────────────────────────────────────────────────────

    [Fact]
    public void ValidDto_ShouldPass()
    {
        var dto = new CreatePersonDto
        {
            FirstName = "Jean",
            LastName = "Dupont",
            Gender = "M",
            IsAlive = true
        };

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void DeceasedWithValidDates_ShouldPass()
    {
        var dto = new CreatePersonDto
        {
            FirstName = "Marie",
            LastName = "Curie",
            Gender = "F",
            IsAlive = false,
            BirthDate = new DateTime(1867, 11, 7),
            DeathDate = new DateTime(1934, 7, 4)
        };

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeTrue();
    }

    [Theory]
    [InlineData("M")]
    [InlineData("F")]
    [InlineData("O")]
    [InlineData("Male")]
    [InlineData("Female")]
    [InlineData("Other")]
    public void AllValidGenderValues_ShouldPass(string gender)
    {
        var dto = new CreatePersonDto { FirstName = "A", LastName = "B", Gender = gender };

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeTrue();
    }

    // ── FirstName ────────────────────────────────────────────────────────────

    [Fact]
    public void EmptyFirstName_ShouldFailWithExpectedMessage()
    {
        var dto = new CreatePersonDto { FirstName = "", LastName = "Dupont", Gender = "M" };

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        ShouldHaveErrorFor(result, nameof(dto.FirstName), "Le prénom est obligatoire.");
    }

    [Fact]
    public void WhitespaceFirstName_ShouldFail()
    {
        var dto = new CreatePersonDto { FirstName = "   ", LastName = "Dupont", Gender = "M" };

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        ShouldHaveErrorFor(result, nameof(dto.FirstName));
    }

    [Fact]
    public void FirstNameExceeding100Chars_ShouldFail()
    {
        var dto = new CreatePersonDto
        {
            FirstName = new string('A', 101),
            LastName = "Dupont",
            Gender = "M"
        };

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        ShouldHaveErrorFor(result, nameof(dto.FirstName), "Le prénom ne peut pas dépasser 100 caractères.");
    }

    [Fact]
    public void FirstNameAt100Chars_ShouldPass()
    {
        var dto = new CreatePersonDto
        {
            FirstName = new string('A', 100),
            LastName = "Dupont",
            Gender = "M"
        };

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeTrue();
    }

    // ── LastName ─────────────────────────────────────────────────────────────

    [Fact]
    public void EmptyLastName_ShouldFailWithExpectedMessage()
    {
        var dto = new CreatePersonDto { FirstName = "Jean", LastName = "", Gender = "M" };

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        ShouldHaveErrorFor(result, nameof(dto.LastName), "Le nom est obligatoire.");
    }

    [Fact]
    public void LastNameExceeding100Chars_ShouldFail()
    {
        var dto = new CreatePersonDto
        {
            FirstName = "Jean",
            LastName = new string('Z', 101),
            Gender = "M"
        };

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        ShouldHaveErrorFor(result, nameof(dto.LastName));
    }

    // ── DeathDate / BirthDate ─────────────────────────────────────────────────

    [Fact]
    public void DeathDateBeforeBirthDate_ShouldFail()
    {
        var dto = new CreatePersonDto
        {
            FirstName = "Jean",
            LastName = "Dupont",
            Gender = "M",
            IsAlive = false,
            BirthDate = new DateTime(1980, 1, 1),
            DeathDate = new DateTime(1970, 1, 1)
        };

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        ShouldHaveErrorFor(result, nameof(dto.DeathDate), "La date de décès doit être postérieure à la date de naissance.");
    }

    [Fact]
    public void DeathDateEqualToBirthDate_ShouldFail()
    {
        // GreaterThan est strictement supérieur
        var date = new DateTime(1950, 6, 15);
        var dto = new CreatePersonDto
        {
            FirstName = "Jean",
            LastName = "Dupont",
            Gender = "M",
            IsAlive = false,
            BirthDate = date,
            DeathDate = date
        };

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        ShouldHaveErrorFor(result, nameof(dto.DeathDate));
    }

    [Fact]
    public void DeathDateWithoutBirthDate_ShouldPass()
    {
        // Pas de BirthDate — la règle conditionnelle ne s'applique pas
        var dto = new CreatePersonDto
        {
            FirstName = "Jean",
            LastName = "Dupont",
            Gender = "M",
            IsAlive = false,
            DeathDate = new DateTime(1950, 1, 1)
        };

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeTrue();
    }

    // ── IsAlive + DeathDate ──────────────────────────────────────────────────

    [Fact]
    public void IsAliveWithDeathDate_ShouldFail()
    {
        var dto = new CreatePersonDto
        {
            FirstName = "Jean",
            LastName = "Dupont",
            Gender = "M",
            IsAlive = true,
            DeathDate = new DateTime(2020, 1, 1)
        };

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        ShouldHaveErrorFor(result, nameof(dto.DeathDate), "Une personne vivante ne peut pas avoir de date de décès.");
    }

    [Fact]
    public void IsAliveWithoutDeathDate_ShouldPass()
    {
        var dto = new CreatePersonDto
        {
            FirstName = "Jean",
            LastName = "Dupont",
            Gender = "M",
            IsAlive = true
        };

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeTrue();
    }

    // ── Gender ───────────────────────────────────────────────────────────────

    [Fact]
    public void InvalidGender_ShouldFail()
    {
        var dto = new CreatePersonDto { FirstName = "Jean", LastName = "Dupont", Gender = "X" };

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        ShouldHaveErrorFor(result, nameof(dto.Gender), "Le genre doit être M, F, O, Male, Female ou Other.");
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private static void ShouldHaveErrorFor(ValidationResult result, string propertyName, string? message = null)
    {
        var errors = result.Errors.Where(e => e.PropertyName == propertyName).ToList();
        errors.Should().NotBeEmpty($"aucune erreur trouvée pour la propriété '{propertyName}'");
        if (message is not null)
            errors.Should().Contain(e => e.ErrorMessage == message,
                $"message attendu : '{message}', messages reçus : {string.Join(", ", errors.Select(e => e.ErrorMessage))}");
    }
}
