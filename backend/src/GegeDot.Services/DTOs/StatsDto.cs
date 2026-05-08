namespace GegeDot.Services.DTOs;

/// <summary>
/// Statistiques agrégées de la base généalogique.
/// Toutes les valeurs sont calculées côté SQL (COUNT, SUM) — aucun GetAllAsync().
/// </summary>
/// <param name="PersonCount">Nombre total de personnes enregistrées.</param>
/// <param name="GenerationSpan">
/// Nombre de générations distinctes dans l'arbre.
/// Null si le champ Generation n'est pas stocké en base (cas actuel).
/// </param>
/// <param name="LivingCount">Nombre de personnes avec IsAlive = true.</param>
/// <param name="DeceasedCount">Nombre de personnes avec IsAlive = false.</param>
/// <param name="CompletenessPercent">
/// Pourcentage de personnes ayant FirstName + LastName + BirthDate renseignés.
/// 0 si PersonCount = 0.
/// </param>
/// <param name="DuplicateSuggestionCount">
/// Nombre de doublons détectés par le service de détection.
/// Null si la détection est désactivée ou trop coûteuse (retourné explicitement par le service).
/// </param>
public record StatsDto(
    int PersonCount,
    int? GenerationSpan,
    int LivingCount,
    int DeceasedCount,
    int CompletenessPercent,
    int? DuplicateSuggestionCount
);
