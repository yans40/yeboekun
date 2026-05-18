using Yeboekun.Services.DTOs;

namespace Yeboekun.Services.Interfaces;

/// <summary>
/// Service de statistiques agrégées sur la base généalogique.
/// Toutes les implémentations doivent utiliser des requêtes SQL agrégées (COUNT, SUM) —
/// interdit de charger des collections complètes en mémoire.
/// </summary>
public interface IStatsService
{
    /// <summary>
    /// Calcule les statistiques globales de la base.
    /// Temps cible : ≤ 200 ms sur 10 000 personnes (requêtes indexées).
    /// </summary>
    Task<StatsDto> GetStatsAsync(CancellationToken cancellationToken = default);
}
