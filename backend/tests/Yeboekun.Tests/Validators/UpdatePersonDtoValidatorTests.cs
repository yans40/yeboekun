using FluentAssertions;
using FluentValidation.Results;
using Yeboekun.Services.DTOs;
using Yeboekun.Services.Validators;
using Xunit;

namespace Yeboekun.Tests.Validators;

public sealed class UpdatePersonDtoValidatorTests
{
    private readonly UpdatePersonDtoValidator _validator = new();

    // ── Cas valides ──────────────────────────────────────────────────────────

    [Fact]
    public void ValidDto_ShouldPass()
    {
        var dto = new UpdatePersonDto
        {
            FirstName = "Marie",
            LastName = "Dupont",
            Gender = "F",
            IsAlive = true
        };

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void DeceasedWithValidDates_ShouldPass()
    {
        var dto = new UpdatePersonDto
        {
            FirstName = "Paul",
            LastName = "Martin",
            Gender = "M",
            IsAlive = false,
            BirthDate = new DateTime(1900, 3, 12),
            DeathDate = new DateTime(1975, 8, 20)
        };

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeTrue();
    }

    // ── FirstName / LastName ─────────────────────────────────────────────────

    [Fact]
    public void EmptyFirstName_ShouldFail()
    {
        var dto = new UpdatePersonDto { FirstName = "", LastName = "Dupont", Gender = "M" };

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        ShouldHaveErrorFor(result, nameof(dto.FirstName), "Le prénom est obligatoire.");
    }

    [Fact]
    public void EmptyLastName_ShouldFail()
    {
        var dto = new UpdatePersonDto { FirstName = "Marie", LastName = "", Gender = "F" };

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        ShouldHaveErrorFor(result, nameof(dto.LastName), "Le nom est obligatoire.");
    }

    [Fact]
    public void FirstNameExceeding100Chars_ShouldFail()
    {
        var dto = new UpdatePersonDto
        {
            FirstName = new string('A', 101),
            LastName = "Dupont",
            Gender = "M"
        };

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        ShouldHaveErrorFor(result, nameof(dto.FirstName));
    }

    // ── DeathDate / BirthDate ─────────────────────────────────────────────────

    [Fact]
    public void DeathDateBeforeBirthDate_ShouldFail()
    {
        var dto = new UpdatePersonDto
        {
            FirstName = "Paul",
            LastName = "Martin",
            Gender = "M",
            IsAlive = false,
            BirthDate = new DateTime(1950, 1, 1),
            DeathDate = new DateTime(1940, 1, 1)
        };

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        ShouldHaveErrorFor(result, nameof(dto.DeathDate), "La date de décès doit être postérieure à la date de naissance.");
    }

    // ── IsAlive + DeathDate ──────────────────────────────────────────────────

    [Fact]
    public void IsAliveWithDeathDate_ShouldFail()
    {
        var dto = new UpdatePersonDto
        {
            FirstName = "Paul",
            LastName = "Martin",
            Gender = "M",
            IsAlive = true,
            DeathDate = new DateTime(2010, 5, 1)
        };

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        ShouldHaveErrorFor(result, nameof(dto.DeathDate), "Une personne vivante ne peut pas avoir de date de décès.");
    }

    // ── Gender ───────────────────────────────────────────────────────────────

    [Fact]
    public void InvalidGender_ShouldFail()
    {
        var dto = new UpdatePersonDto { FirstName = "Paul", LastName = "Martin", Gender = "Z" };

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        ShouldHaveErrorFor(result, nameof(dto.Gender));
    }

    // ── Helper ───────────────────────────────────────────────────────────────

    private static void ShouldHaveErrorFor(ValidationResult result, string propertyName, string? message = null)
    {
        var errors = result.Errors.Where(e => e.PropertyName == propertyName).ToList();
        errors.Should().NotBeEmpty($"aucune erreur pour la propriété '{propertyName}'");
        if (message is not null)
            errors.Should().Contain(e => e.ErrorMessage == message,
                $"message attendu : '{message}', messages reçus : {string.Join(", ", errors.Select(e => e.ErrorMessage))}");
    }
}
