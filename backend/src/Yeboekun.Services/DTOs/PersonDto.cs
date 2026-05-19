namespace Yeboekun.Services.DTOs;

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
    // Validation déléguée à CreatePersonDtoValidator (FluentValidation) — cf. Yeboekun.Services/Validators/
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

    public int? Parent1Id { get; set; }
    public int? Parent2Id { get; set; }
}

public class UpdatePersonDto
{
    // Validation déléguée à UpdatePersonDtoValidator (FluentValidation) — cf. Yeboekun.Services/Validators/
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
}
