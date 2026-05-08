using GegeDot.Services.DTOs;
using GegeDot.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GegeDot.API.Controllers;

/// <summary>
/// Endpoint de statistiques agrégées de la base généalogique.
/// Utilisé par TableauView (frontend) pour l'affichage de métriques globales.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class StatsController : ControllerBase
{
    private readonly IStatsService _statsService;
    private readonly ILogger<StatsController> _logger;

    public StatsController(IStatsService statsService, ILogger<StatsController> logger)
    {
        _statsService = statsService;
        _logger = logger;
    }

    /// <summary>
    /// Retourne les statistiques agrégées de la base généalogique.
    /// Toutes les valeurs sont calculées via des COUNT SQL indexés — pas de chargement en mémoire.
    /// </summary>
    /// <remarks>
    /// Les champs nullables (generationSpan, duplicateSuggestionCount) sont explicitement null
    /// quand la donnée n'est pas disponible — le frontend doit gérer ces cas.
    /// </remarks>
    /// <response code="200">Statistiques calculées avec succès.</response>
    /// <response code="500">Erreur interne lors du calcul.</response>
    [HttpGet]
    [ProducesResponseType(typeof(StatsDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<StatsDto>> GetStats(CancellationToken cancellationToken = default)
    {
        try
        {
            var stats = await _statsService.GetStatsAsync(cancellationToken);

            _logger.LogInformation(
                "GET /api/stats — {PersonCount} personnes, {LivingCount} vivantes, {Completeness}% complètes",
                stats.PersonCount, stats.LivingCount, stats.CompletenessPercent);

            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors du calcul des statistiques");
            return StatusCode(500, "Erreur interne du serveur");
        }
    }
}
