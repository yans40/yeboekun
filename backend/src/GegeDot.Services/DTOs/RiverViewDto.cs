namespace GegeDot.Services.DTOs;

/// <summary>
/// Réponse complète de GET /api/persons/{id}/river-view.
/// Contient tous les nœuds et arêtes nécessaires à la Vue Rivière du frontend.
/// </summary>
public sealed class RiverViewDto
{
    /// <summary>ID de la personne racine (centre de la vue).</summary>
    public int RootId { get; init; }

    /// <summary>Profondeur demandée (valeur du paramètre ?depth).</summary>
    public int Depth { get; init; }

    /// <summary>Ensemble des personnes du sous-arbre.</summary>
    public List<RiverViewNodeDto> Nodes { get; init; } = [];

    /// <summary>Ensemble des liens entre personnes du sous-arbre.</summary>
    public List<RiverViewEdgeDto> Edges { get; init; } = [];

    /// <summary>Plage de générations présentes dans le résultat.</summary>
    public GenerationRangeDto GenerationRange { get; init; } = new();
}

/// <summary>
/// Un nœud de la Vue Rivière : une personne avec sa position générationnelle.
/// Convention : 0 = racine, valeurs négatives = ancêtres, valeurs positives = descendants.
/// </summary>
public sealed class RiverViewNodeDto
{
    public int Id { get; init; }
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;

    /// <summary>Format ISO 8601 date-only (yyyy-MM-dd), null si inconnue.</summary>
    public string? BirthDate { get; init; }

    /// <summary>Format ISO 8601 date-only (yyyy-MM-dd), null si vivant ou inconnu.</summary>
    public string? DeathDate { get; init; }

    public bool IsAlive { get; init; }

    /// <summary>"M", "F" ou "O".</summary>
    public string Gender { get; init; } = "M";

    public string? PhotoUrl { get; init; }

    /// <summary>
    /// 0 = racine, -1 = parents, -2 = grands-parents, +1 = enfants, +2 = petits-enfants.
    /// </summary>
    public int Generation { get; init; }
}

/// <summary>
/// Une arête de la Vue Rivière : un lien entre deux personnes du sous-arbre.
/// Seuls les types pertinents pour la visualisation sont émis (Parent, Spouse, Sibling).
/// </summary>
public sealed class RiverViewEdgeDto
{
    /// <summary>ID de la personne source.</summary>
    public int SourceId { get; init; }

    /// <summary>ID de la personne cible.</summary>
    public int TargetId { get; init; }

    /// <summary>"Parent", "Spouse" ou "Sibling".</summary>
    public string Type { get; init; } = string.Empty;

    /// <summary>Format ISO 8601 date-only (yyyy-MM-dd), null si inconnue.</summary>
    public string? StartDate { get; init; }

    /// <summary>Format ISO 8601 date-only (yyyy-MM-dd), null si toujours actif.</summary>
    public string? EndDate { get; init; }

    public bool IsActive { get; init; }
}

/// <summary>
/// Plage des générations présentes dans le résultat.
/// Min est toujours négatif ou zéro (ancêtres), Max est toujours positif ou zéro (descendants).
/// </summary>
public sealed class GenerationRangeDto
{
    public int Min { get; init; }
    public int Max { get; init; }
}
