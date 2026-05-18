using Yeboekun.Services.DTOs;

namespace Yeboekun.Services.Interfaces;

/// <summary>
/// Construit la réponse de la Vue Rivière du frontend :
/// un sous-arbre centré sur une personne, avec nœuds, arêtes et plage de générations.
/// </summary>
public interface IRiverViewService
{
    /// <summary>
    /// Retourne la vue rivière centrée sur <paramref name="rootId"/>.
    /// </summary>
    /// <param name="rootId">ID de la personne racine.</param>
    /// <param name="depth">
    /// Profondeur symétrique : on remonte <paramref name="depth"/> générations d'ancêtres
    /// et on descend <paramref name="depth"/> générations de descendants.
    /// Clamped [1, 5].
    /// </param>
    /// <param name="cancellationToken">Jeton d'annulation.</param>
    /// <returns>
    /// <see cref="RiverViewDto"/> complet, ou <c>null</c> si la personne n'existe pas.
    /// </returns>
    Task<RiverViewDto?> BuildRiverViewAsync(
        int rootId,
        int depth,
        CancellationToken cancellationToken = default);
}
