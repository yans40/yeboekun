using Yeboekun.Services.DTOs;

namespace Yeboekun.Services.Interfaces;

/// <summary>
/// Construit l'arbre généalogique d'une personne en BFS niveau par niveau,
/// sans récursion C# et sans chargement global de toutes les personnes.
/// </summary>
public interface ITreeTraversalService
{
    /// <summary>
    /// Retourne l'arbre centré sur <paramref name="rootId"/>.
    /// </summary>
    /// <param name="rootId">ID de la personne racine.</param>
    /// <param name="up">Nombre de générations d'ascendants à remonter (clamped [0, 8]).</param>
    /// <param name="down">Nombre de générations de descendants à descendre (clamped [0, 4]).</param>
    /// <param name="cancellationToken">Jeton d'annulation.</param>
    /// <returns>
    /// <see cref="PersonTreeDto"/> complet, ou <c>null</c> si la personne n'existe pas.
    /// </returns>
    Task<PersonTreeDto?> BuildTreeAsync(
        int rootId,
        int up,
        int down,
        CancellationToken cancellationToken = default);
}
