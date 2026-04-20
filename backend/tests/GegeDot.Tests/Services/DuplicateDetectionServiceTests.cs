using FluentAssertions;
using GegeDot.Core.Entities;
using GegeDot.Core.Interfaces;
using GegeDot.Services.Services;
using Moq;
using Xunit;

namespace GegeDot.Tests.Services;

public class DuplicateDetectionServiceTests
{
    private readonly Mock<IUnitOfWork> _uow = new();
    private readonly Mock<IPersonRepository> _personsRepo = new();
    private readonly DuplicateDetectionService _sut;

    public DuplicateDetectionServiceTests()
    {
        _uow.Setup(u => u.Persons).Returns(_personsRepo.Object);
        _sut = new DuplicateDetectionService(_uow.Object);
    }

    private static Person MakePerson(int id, string first, string last, DateTime? birth = null, string? place = null)
        => new() { Id = id, FirstName = first, LastName = last, BirthDate = birth, BirthPlace = place };

    [Fact]
    public void IsDuplicate_WithIdenticalPersons_ReturnsTrue()
    {
        var p1 = MakePerson(1, "Jean", "Dupont", new DateTime(1980, 1, 1), "Paris");
        var p2 = MakePerson(2, "Jean", "Dupont", new DateTime(1980, 1, 1), "Paris");

        _sut.IsDuplicate(p1, p2).Should().BeTrue();
    }

    [Fact]
    public void IsDuplicate_WithDifferentPersons_ReturnsFalse()
    {
        var p1 = MakePerson(1, "Jean", "Dupont", new DateTime(1980, 1, 1));
        var p2 = MakePerson(2, "Marie", "Leclerc", new DateTime(1990, 5, 5));

        _sut.IsDuplicate(p1, p2).Should().BeFalse();
    }

    [Fact]
    public void CalculateSimilarityScore_IdenticalNames_ReturnsOne()
    {
        var p1 = MakePerson(1, "Jean", "Dupont", new DateTime(1980, 1, 1), "Paris");
        var p2 = MakePerson(2, "Jean", "Dupont", new DateTime(1980, 1, 1), "Paris");

        _sut.CalculateSimilarityScore(p1, p2).Should().Be(1.0);
    }

    [Fact]
    public void CalculateSimilarityScore_SameFirstNameAndBirthDate_GivesHighScore()
    {
        var p1 = MakePerson(1, "Jean", "Dupont", new DateTime(1980, 1, 1));
        var p2 = MakePerson(2, "Jean", "Martin", new DateTime(1980, 1, 1));

        var score = _sut.CalculateSimilarityScore(p1, p2);

        score.Should().BeGreaterThanOrEqualTo(0.7);
    }

    [Fact]
    public void CalculateSimilarityScore_CompletelyDifferent_IsLow()
    {
        var p1 = MakePerson(1, "Jean", "Dupont", new DateTime(1980, 1, 1), "Paris");
        var p2 = MakePerson(2, "Zoe", "Wagner", new DateTime(1700, 6, 15), "Berlin");

        _sut.CalculateSimilarityScore(p1, p2).Should().BeLessThan(0.5);
    }

    [Fact]
    public async Task FindDuplicatesAsync_WhenNoCandidates_ReturnsEmptyList()
    {
        _personsRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<Person>());

        var result = await _sut.FindDuplicatesAsync(MakePerson(0, "Jean", "Dupont"));

        result.Should().BeEmpty();
    }

    [Fact]
    public async Task FindDuplicatesAsync_ReturnsOnlySimilarCandidates()
    {
        var newPerson = MakePerson(0, "Jean", "Dupont", new DateTime(1980, 1, 1), "Paris");
        var existing = new List<Person>
        {
            MakePerson(1, "Jean", "Dupont", new DateTime(1980, 1, 1), "Paris"),
            MakePerson(2, "Marie", "Leclerc", new DateTime(1990, 5, 5), "Lyon")
        };

        _personsRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(existing);

        var result = await _sut.FindDuplicatesAsync(newPerson);

        result.Should().HaveCount(1);
        result[0].PersonId.Should().Be(1);
    }

    [Fact]
    public async Task FindDuplicatesAsync_ShouldExcludeSelfWhenIdProvided()
    {
        var me = MakePerson(5, "Jean", "Dupont", new DateTime(1980, 1, 1), "Paris");
        var existing = new List<Person>
        {
            MakePerson(5, "Jean", "Dupont", new DateTime(1980, 1, 1), "Paris"),
            MakePerson(6, "Jean", "Dupont", new DateTime(1980, 1, 1), "Paris")
        };

        _personsRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(existing);

        var result = await _sut.FindDuplicatesAsync(me);

        result.Should().ContainSingle(c => c.PersonId == 6);
        result.Should().NotContain(c => c.PersonId == 5);
    }

    [Fact]
    public async Task FindDuplicatesAsync_ShouldReturnResultsOrderedByScoreDescending()
    {
        var newPerson = MakePerson(0, "Jean", "Dupont", new DateTime(1980, 1, 1), "Paris");
        var existing = new List<Person>
        {
            MakePerson(1, "Jean", "Dupond", new DateTime(1980, 1, 1), "Paris"),
            MakePerson(2, "Jean", "Dupont", new DateTime(1980, 1, 1), "Paris"),
        };

        _personsRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(existing);

        var result = await _sut.FindDuplicatesAsync(newPerson);

        result.Should().HaveCountGreaterThan(0);
        result.Should().BeInDescendingOrder(c => c.SimilarityScore);
    }
}
