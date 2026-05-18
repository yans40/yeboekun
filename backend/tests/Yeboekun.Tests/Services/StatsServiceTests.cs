using FluentAssertions;
using Yeboekun.Core.Entities;
using Yeboekun.Core.Interfaces;
using Yeboekun.Services.Services;
using Moq;
using Xunit;

namespace Yeboekun.Tests.Services;

/// <summary>
/// Tests unitaires pour StatsService.
/// Le service délègue entièrement les calculs SQL à IPersonRepository.GetStatsAggregateAsync() ;
/// on mocke uniquement ce contrat — pas de DbContext réel requis.
/// </summary>
public class StatsServiceTests
{
    private readonly Mock<IUnitOfWork> _mockUow = new();
    private readonly Mock<IPersonRepository> _mockPersonRepo = new();

    public StatsServiceTests()
    {
        _mockUow.Setup(u => u.Persons).Returns(_mockPersonRepo.Object);
    }

    private StatsService CreateService() =>
        new StatsService(_mockUow.Object);

    // ── Cas : base vide ─────────────────────────────────────────────────────

    [Fact]
    public async Task GetStatsAsync_WhenDatabaseIsEmpty_ShouldReturnZeroesAndNulls()
    {
        _mockPersonRepo
            .Setup(r => r.GetStatsAggregateAsync(default))
            .ReturnsAsync(new PersonStatsAggregate(
                PersonCount:  0,
                LivingCount:  0,
                DeceasedCount: 0,
                CompleteCount: 0));

        var result = await CreateService().GetStatsAsync();

        result.PersonCount.Should().Be(0);
        result.LivingCount.Should().Be(0);
        result.DeceasedCount.Should().Be(0);
        result.CompletenessPercent.Should().Be(0, "division par zéro — on renvoie 0, pas une exception");
        result.GenerationSpan.Should().BeNull("le champ Generation n'est pas persisté sur l'entité Person");
        result.DuplicateSuggestionCount.Should().BeNull("la détection O(n²) est désactivée dans cet endpoint");
    }

    // ── Cas : 2 personnes (1 vivante complète, 1 décédée incomplète) ────────

    [Fact]
    public async Task GetStatsAsync_WithOneLivingAndOneDeceased_ShouldReturnCorrectCounts()
    {
        // 2 personnes : 1 vivante + complète, 1 décédée + incomplète (pas de BirthDate)
        _mockPersonRepo
            .Setup(r => r.GetStatsAggregateAsync(default))
            .ReturnsAsync(new PersonStatsAggregate(
                PersonCount:   2,
                LivingCount:   1,
                DeceasedCount: 1,
                CompleteCount: 1  // seule la personne vivante est complète
            ));

        var result = await CreateService().GetStatsAsync();

        result.PersonCount.Should().Be(2);
        result.LivingCount.Should().Be(1);
        result.DeceasedCount.Should().Be(1);
        result.CompletenessPercent.Should().Be(50, "1 complète sur 2 = 50%");
    }

    // ── Cas : arrondi du pourcentage de complétude ──────────────────────────

    [Theory]
    [InlineData(3, 1, 33)]   // 1/3 = 33.33 → arrondi à 33
    [InlineData(3, 2, 67)]   // 2/3 = 66.67 → arrondi à 67
    [InlineData(10, 7, 70)]  // 7/10 = 70%
    [InlineData(100, 78, 78)] // exactement 78%
    public async Task GetStatsAsync_CompletenessPercent_ShouldRoundCorrectly(
        int personCount, int completeCount, int expectedPercent)
    {
        _mockPersonRepo
            .Setup(r => r.GetStatsAggregateAsync(default))
            .ReturnsAsync(new PersonStatsAggregate(
                PersonCount:   personCount,
                LivingCount:   0,
                DeceasedCount: personCount,
                CompleteCount: completeCount));

        var result = await CreateService().GetStatsAsync();

        result.CompletenessPercent.Should().Be(expectedPercent);
    }

    // ── Cas : 100% de complétude ─────────────────────────────────────────────

    [Fact]
    public async Task GetStatsAsync_WhenAllPersonsComplete_ShouldReturn100Percent()
    {
        _mockPersonRepo
            .Setup(r => r.GetStatsAggregateAsync(default))
            .ReturnsAsync(new PersonStatsAggregate(
                PersonCount:   5,
                LivingCount:   3,
                DeceasedCount: 2,
                CompleteCount: 5));

        var result = await CreateService().GetStatsAsync();

        result.CompletenessPercent.Should().Be(100);
    }

    // ── Cas : tous décédés, aucun vivant ────────────────────────────────────

    [Fact]
    public async Task GetStatsAsync_WhenAllDeceased_ShouldHaveZeroLivingCount()
    {
        _mockPersonRepo
            .Setup(r => r.GetStatsAggregateAsync(default))
            .ReturnsAsync(new PersonStatsAggregate(
                PersonCount:   10,
                LivingCount:   0,
                DeceasedCount: 10,
                CompleteCount: 8));

        var result = await CreateService().GetStatsAsync();

        result.LivingCount.Should().Be(0);
        result.DeceasedCount.Should().Be(10);
        result.PersonCount.Should().Be(10);
        result.CompletenessPercent.Should().Be(80);
    }

    // ── Champs nullables toujours null dans l'implémentation actuelle ────────

    [Fact]
    public async Task GetStatsAsync_NullableFields_ShouldAlwaysBeNull()
    {
        _mockPersonRepo
            .Setup(r => r.GetStatsAggregateAsync(default))
            .ReturnsAsync(new PersonStatsAggregate(10, 5, 5, 8));

        var result = await CreateService().GetStatsAsync();

        // Ces champs sont null par design — si on les rend non-null un jour,
        // ces assertions rappelleront qu'il faut mettre à jour le contrat frontend.
        result.GenerationSpan.Should().BeNull();
        result.DuplicateSuggestionCount.Should().BeNull();
    }

    // ── CancellationToken propagé ────────────────────────────────────────────

    [Fact]
    public async Task GetStatsAsync_ShouldPropagatesCancellationToken()
    {
        using var cts = new CancellationTokenSource();
        var token = cts.Token;

        _mockPersonRepo
            .Setup(r => r.GetStatsAggregateAsync(token))
            .ReturnsAsync(new PersonStatsAggregate(0, 0, 0, 0));

        await CreateService().GetStatsAsync(token);

        _mockPersonRepo.Verify(r => r.GetStatsAggregateAsync(token), Times.Once);
    }
}
