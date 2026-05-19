using FluentValidation;
using Yeboekun.Services.DTOs;

namespace Yeboekun.Services.Validators;

/// <summary>
/// Règles de validation pour la création d'une relation conjugale.
/// EndDate > StartDate si les deux sont fournis (gestion des divorces, unions multiples).
/// </summary>
public sealed class CreateSpouseRelationshipDtoValidator : AbstractValidator<CreateSpouseRelationshipDto>
{
    public CreateSpouseRelationshipDtoValidator()
    {
        // EndDate > StartDate si les deux sont présents
        RuleFor(x => x.EndDate)
            .GreaterThan(x => x.StartDate!.Value)
            .WithMessage("La date de fin de l'union doit être postérieure à la date de début.")
            .When(x => x.EndDate.HasValue && x.StartDate.HasValue);

        RuleFor(x => x.Notes)
            .MaximumLength(1000).WithMessage("Les notes ne peuvent pas dépasser 1000 caractères.")
            .When(x => x.Notes is not null);
    }
}
