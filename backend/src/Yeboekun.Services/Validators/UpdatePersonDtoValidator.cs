using FluentValidation;
using Yeboekun.Services.DTOs;

namespace Yeboekun.Services.Validators;

/// <summary>
/// Règles de validation pour la mise à jour d'une personne.
/// Miroir de CreatePersonDtoValidator — sans le champ Parent1Id/Parent2Id qui n'existe pas sur UpdatePersonDto.
/// </summary>
public sealed class UpdatePersonDtoValidator : AbstractValidator<UpdatePersonDto>
{
    public UpdatePersonDtoValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("Le prénom est obligatoire.")
            .MaximumLength(100).WithMessage("Le prénom ne peut pas dépasser 100 caractères.");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Le nom est obligatoire.")
            .MaximumLength(100).WithMessage("Le nom ne peut pas dépasser 100 caractères.");

        RuleFor(x => x.MiddleName)
            .MaximumLength(100).WithMessage("Le deuxième prénom ne peut pas dépasser 100 caractères.")
            .When(x => x.MiddleName is not null);

        // DeathDate > BirthDate si les deux sont présents
        RuleFor(x => x.DeathDate)
            .GreaterThan(x => x.BirthDate!.Value)
            .WithMessage("La date de décès doit être postérieure à la date de naissance.")
            .When(x => x.DeathDate.HasValue && x.BirthDate.HasValue);

        // IsAlive = true interdit avec une DeathDate
        RuleFor(x => x.DeathDate)
            .Null()
            .WithMessage("Une personne vivante ne peut pas avoir de date de décès.")
            .When(x => x.IsAlive);

        RuleFor(x => x.Gender)
            .Matches("^(M|F|O|Male|Female|Other)$")
            .WithMessage("Le genre doit être M, F, O, Male, Female ou Other.");
    }
}
