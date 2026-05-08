using System.ComponentModel.DataAnnotations;

namespace GegeDot.Services.DTOs;

/// <summary>
/// Nœud d'un arbre généalogique : une personne avec sa position relative à la racine.
/// </summary>
public class PersonTreeNodeDto
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;

    /// <summary>Format ISO 8601 date-only (yyyy-MM-dd), null si inconnue.</summary>
    public string? BirthDate { get; set; }

    /// <summary>Format ISO 8601 date-only (yyyy-MM-dd), null si vivant ou inconnu.</summary>
    public string? DeathDate { get; set; }

    /// <summary>"M", "F" ou "O".</summary>
    public string Gender { get; set; } = "M";

    public string? PhotoUrl { get; set; }

    /// <summary>
    /// 0 = racine, -1 = parents, -2 = grands-parents, +1 = enfants, +2 = petits-enfants.
    /// </summary>
    public int Generation { get; set; }

    /// <summary>IDs des nœuds parents présents dans cet arbre.</summary>
    public List<int> ParentIds { get; set; } = [];

    /// <summary>IDs des nœuds enfants présents dans cet arbre.</summary>
    public List<int> ChildIds { get; set; } = [];
}

/// <summary>
/// Réponse complète de GET /api/persons/{id}/tree.
/// </summary>
public class PersonTreeDto
{
    public int RootId { get; set; }
    public List<PersonTreeNodeDto> Nodes { get; set; } = [];
}

public class PersonDto
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? MiddleName { get; set; }
    public DateTime? BirthDate { get; set; }
    public DateTime? DeathDate { get; set; }
    public string? BirthPlace { get; set; }
    public string? DeathPlace { get; set; }
    public string? Profession { get; set; }
    public DateTime? MarriageDate { get; set; }
    public string? MarriagePlace { get; set; }
    public string? DeathStatus { get; set; }
    public string? PhotoUrl { get; set; }
    public string? Biography { get; set; }
    public string Gender { get; set; } = "M";
    public bool IsAlive { get; set; } = true;
    public string FullName { get; set; } = string.Empty;
    public int? Age { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreatePersonDto
{
    [Required(ErrorMessage = "Le prénom est obligatoire")]
    [StringLength(100, ErrorMessage = "Le prénom ne peut pas dépasser 100 caractères")]
    public string FirstName { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Le nom est obligatoire")]
    [StringLength(100, ErrorMessage = "Le nom ne peut pas dépasser 100 caractères")]
    public string LastName { get; set; } = string.Empty;
    
    [StringLength(100, ErrorMessage = "Le deuxième prénom ne peut pas dépasser 100 caractères")]
    public string? MiddleName { get; set; }
    
    public DateTime? BirthDate { get; set; }
    
    [CustomValidation(typeof(PersonValidation), "ValidateDeathDate")]
    public DateTime? DeathDate { get; set; }
    
    public string? BirthPlace { get; set; }
    public string? DeathPlace { get; set; }
    public string? Profession { get; set; }
    public DateTime? MarriageDate { get; set; }
    public string? MarriagePlace { get; set; }
    public string? DeathStatus { get; set; }
    public string? PhotoUrl { get; set; }
    public string? Biography { get; set; }
    
    [RegularExpression("^(M|F|O|Male|Female|Other)$", ErrorMessage = "Le genre doit être M, F, O, Male, Female ou Other")]
    public string Gender { get; set; } = "M";

    public bool IsAlive { get; set; } = true;

    public int? Parent1Id { get; set; }
    public int? Parent2Id { get; set; }
}

// Classe de validation personnalisée pour les dates
public static class PersonValidation
{
    public static ValidationResult? ValidateDeathDate(DateTime? deathDate, ValidationContext context)
    {
        var dto = context.ObjectInstance as CreatePersonDto;
        if (dto == null) return ValidationResult.Success;
        
        // Si la personne est vivante, elle ne doit pas avoir de date de décès
        if (dto.IsAlive && deathDate.HasValue)
        {
            return new ValidationResult("Une personne vivante ne peut pas avoir de date de décès");
        }
        
        // Si une date de décès est fournie, elle doit être postérieure à la date de naissance
        if (deathDate.HasValue && dto.BirthDate.HasValue && deathDate.Value < dto.BirthDate.Value)
        {
            return new ValidationResult("La date de décès doit être postérieure à la date de naissance");
        }
        
        return ValidationResult.Success;
    }
}

public class UpdatePersonDto
{
    [Required(ErrorMessage = "Le prénom est obligatoire")]
    [StringLength(100, ErrorMessage = "Le prénom ne peut pas dépasser 100 caractères")]
    public string FirstName { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Le nom est obligatoire")]
    [StringLength(100, ErrorMessage = "Le nom ne peut pas dépasser 100 caractères")]
    public string LastName { get; set; } = string.Empty;
    [StringLength(100, ErrorMessage = "Le deuxième prénom ne peut pas dépasser 100 caractères")]
    public string? MiddleName { get; set; }
    
    public DateTime? BirthDate { get; set; }
    
    [CustomValidation(typeof(UpdatePersonValidation), "ValidateDeathDate")]
    public DateTime? DeathDate { get; set; }
    
    public string? BirthPlace { get; set; }
    public string? DeathPlace { get; set; }
    public string? Profession { get; set; }
    public DateTime? MarriageDate { get; set; }
    public string? MarriagePlace { get; set; }
    public string? DeathStatus { get; set; }
    public string? PhotoUrl { get; set; }
    public string? Biography { get; set; }
    
    [RegularExpression("^(M|F|O|Male|Female|Other)$", ErrorMessage = "Le genre doit être M, F, O, Male, Female ou Other")]
    public string Gender { get; set; } = "M";

    public bool IsAlive { get; set; } = true;
}

// Classe de validation personnalisée pour UpdatePersonDto
public static class UpdatePersonValidation
{
    public static ValidationResult? ValidateDeathDate(DateTime? deathDate, ValidationContext context)
    {
        var dto = context.ObjectInstance as UpdatePersonDto;
        if (dto == null) return ValidationResult.Success;
        
        // Si la personne est vivante, elle ne doit pas avoir de date de décès
        if (dto.IsAlive && deathDate.HasValue)
        {
            return new ValidationResult("Une personne vivante ne peut pas avoir de date de décès");
        }
        
        // Si une date de décès est fournie, elle doit être postérieure à la date de naissance
        if (deathDate.HasValue && dto.BirthDate.HasValue && deathDate.Value < dto.BirthDate.Value)
        {
            return new ValidationResult("La date de décès doit être postérieure à la date de naissance");
        }
        
        return ValidationResult.Success;
    }
}
