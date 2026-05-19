using FluentAssertions;
using FluentValidation.Results;
using Yeboekun.Services.DTOs;
using Yeboekun.Services.Validators;
using Xunit;

namespace Yeboekun.Tests.Validators;

public sealed class CreateSpouseRelationshipDtoValidatorTests
{
    private readonly CreateSpouseRelationshipDtoValidator _validator = new();

    // ── Cas valides ──────────────────────────────────────────────────────────

    [Fact]
    public void EmptyDto_ShouldPass()
    {
        // Toutes les propriétés sont optionnelles
        var dto = new CreateSpouseRelationshipDto();

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void OnlyStartDate_ShouldPass()
    {
        var dto = new CreateSpouseRelationshipDto
        {
            StartDate = new DateTime(1990, 6, 15)
        };

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void OnlyEndDate_ShouldPass()
    {
        // EndDate sans StartDate — la règle conditionnelle ne s'applique pas
        var dto = new CreateSpouseRelationshipDto
        {
            EndDate = new DateTime(2005, 3, 1)
        };

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void ValidStartAndEndDates_ShouldPass()
    {
        var dto = new CreateSpouseRelationshipDto
        {
            StartDate = new DateTime(1990, 6, 15),
            EndDate = new DateTime(2005, 3, 1),
            Notes = "Divorce"
        };

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void UnionWithoutEndDate_IsCurrentUnion_ShouldPass()
    {
        // Mariage actif sans date de fin
        var dto = new CreateSpouseRelationshipDto
        {
            StartDate = new DateTime(2010, 8, 20)
        };

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeTrue();
    }

    // ── EndDate <= StartDate ─────────────────────────────────────────────────

    [Fact]
    public void EndDateBeforeStartDate_ShouldFail()
    {
        var dto = new CreateSpouseRelationshipDto
        {
            StartDate = new DateTime(2000, 1, 1),
            EndDate = new DateTime(1999, 12, 31)
        };

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        ShouldHaveErrorFor(result, nameof(dto.EndDate),
            "La date de fin de l'union doit être postérieure à la date de début.");
    }

    [Fact]
    public void EndDateEqualToStartDate_ShouldFail()
    {
        // GreaterThan est strictement supérieur
        var date = new DateTime(2000, 6, 1);
        var dto = new CreateSpouseRelationshipDto
        {
            StartDate = date,
            EndDate = date
        };

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        ShouldHaveErrorFor(result, nameof(dto.EndDate));
    }

    // ── Notes ────────────────────────────────────────────────────────────────

    [Fact]
    public void NotesExceeding1000Chars_ShouldFail()
    {
        var dto = new CreateSpouseRelationshipDto
        {
            Notes = new string('X', 1001)
        };

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        ShouldHaveErrorFor(result, nameof(dto.Notes), "Les notes ne peuvent pas dépasser 1000 caractères.");
    }

    [Fact]
    public void NotesAt1000Chars_ShouldPass()
    {
        var dto = new CreateSpouseRelationshipDto
        {
            Notes = new string('X', 1000)
        };

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void NullNotes_ShouldPass()
    {
        var dto = new CreateSpouseRelationshipDto { Notes = null };

        var result = _validator.Validate(dto);

        result.IsValid.Should().BeTrue();
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
