using Yeboekun.Core.Interfaces;
using Yeboekun.Services.DTOs;
using Yeboekun.Services.Interfaces;

namespace Yeboekun.Services.Services;

public sealed class StatsService : IStatsService
{
    private readonly IUnitOfWork _unitOfWork;

    public StatsService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    /// <inheritdoc />
    public async Task<StatsDto> GetStatsAsync(CancellationToken cancellationToken = default)
    {
        var aggregate = await _unitOfWork.Persons.GetStatsAggregateAsync(cancellationToken);

        var completenessPercent = aggregate.PersonCount > 0
            ? (int)Math.Round(aggregate.CompleteCount * 100.0 / aggregate.PersonCount)
            : 0;

        // generationSpan : l'entité Person ne stocke pas de champ Generation (c'est un
        // champ calculé dans PersonTreeNodeDto lors de la traversée BFS). Renvoyer null
        // explicitement est plus honnête que de faire une traversée récursive coûteuse
        // dans un endpoint stats temps-réel. À réévaluer si on persiste la génération.

        // duplicateSuggestionCount : IDuplicateDetectionService.FindDuplicatesAsync() prend
        // une Person cible et scanne en O(n²) — inadapté ici. Renvoyer null ; le frontend
        // l'affiche comme "non disponible". Un endpoint dédié /api/stats/duplicates avec
        // pagination sera traité en Lot 6.

        return new StatsDto(
            PersonCount:              aggregate.PersonCount,
            GenerationSpan:           null,
            LivingCount:              aggregate.LivingCount,
            DeceasedCount:            aggregate.DeceasedCount,
            CompletenessPercent:      completenessPercent,
            DuplicateSuggestionCount: null
        );
    }
}
