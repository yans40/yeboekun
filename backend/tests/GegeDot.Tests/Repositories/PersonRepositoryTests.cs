using FluentAssertions;
using GegeDot.Core.Entities;
using GegeDot.Infrastructure.Data;
using GegeDot.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Xunit;

namespace GegeDot.Tests.Repositories;

public class PersonRepositoryTests : IDisposable
{
    private readonly GegeDotContext _context;
    private readonly PersonRepository _repository;

    public PersonRepositoryTests()
    {
        var options = new DbContextOptionsBuilder<GegeDotContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .ConfigureWarnings(w => w.Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options;

        _context = new GegeDotContext(options);
        _repository = new PersonRepository(_context);
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }

    private async Task<Person> AddPerson(string first, string last, Gender g = Gender.Male)
    {
        var person = new Person { FirstName = first, LastName = last, Gender = g };
        _context.Persons.Add(person);
        await _context.SaveChangesAsync();
        return person;
    }

    [Fact]
    public async Task AddAsync_ShouldPersistPerson()
    {
        var result = await _repository.AddAsync(new Person
        {
            FirstName = "Jean",
            LastName = "Dupont",
            Gender = Gender.Male
        });

        result.Id.Should().BeGreaterThan(0);
        (await _context.Persons.CountAsync()).Should().Be(1);
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnPersonsOrderedByLastThenFirstName()
    {
        await AddPerson("Zoe", "Zephyr");
        await AddPerson("Alice", "Alpha");
        await AddPerson("Bob", "Alpha");

        var result = (await _repository.GetAllAsync()).ToList();

        result.Should().HaveCount(3);
        result[0].LastName.Should().Be("Alpha");
        result[0].FirstName.Should().Be("Alice");
        result[1].FirstName.Should().Be("Bob");
        result[2].LastName.Should().Be("Zephyr");
    }

    [Fact]
    public async Task GetByIdAsync_WithUnknownId_ReturnsNull()
    {
        var result = await _repository.GetByIdAsync(42);
        result.Should().BeNull();
    }

    [Fact]
    public async Task GetByIdAsync_WithValidId_ReturnsPerson()
    {
        var person = await AddPerson("Jean", "Dupont");

        var result = await _repository.GetByIdAsync(person.Id);

        result.Should().NotBeNull();
        result!.FirstName.Should().Be("Jean");
    }

    [Fact]
    public async Task SearchByNameAsync_ShouldMatchFirstOrLastNameCaseInsensitive()
    {
        await AddPerson("Jean", "Dupont");
        await AddPerson("Marie", "Martin");
        await AddPerson("Anatole", "jean-Valjean");

        var result = (await _repository.SearchByNameAsync("jean")).ToList();

        result.Should().HaveCount(2);
    }

    [Fact]
    public async Task UpdateAsync_ShouldBumpUpdatedAt()
    {
        var person = await AddPerson("Jean", "Dupont");
        var before = person.UpdatedAt;
        await Task.Delay(5);

        person.FirstName = "Jean-Pierre";
        var updated = await _repository.UpdateAsync(person);

        updated.FirstName.Should().Be("Jean-Pierre");
        updated.UpdatedAt.Should().BeOnOrAfter(before);
    }

    [Fact]
    public async Task DeleteAsync_WithValidId_ReturnsTrueAndRemoves()
    {
        var person = await AddPerson("Jean", "Dupont");

        var deleted = await _repository.DeleteAsync(person.Id);

        deleted.Should().BeTrue();
        (await _context.Persons.FindAsync(person.Id)).Should().BeNull();
    }

    [Fact]
    public async Task DeleteAsync_WithUnknownId_ReturnsFalse()
    {
        (await _repository.DeleteAsync(999)).Should().BeFalse();
    }

    [Fact]
    public async Task ExistsAsync_ReturnsExpectedValues()
    {
        var person = await AddPerson("Jean", "Dupont");

        (await _repository.ExistsAsync(person.Id)).Should().BeTrue();
        (await _repository.ExistsAsync(999)).Should().BeFalse();
    }

    [Fact]
    public async Task GetParentsAndChildren_ReturnsExpectedRelations()
    {
        var parent = await AddPerson("Parent", "Dupont");
        var child = await AddPerson("Child", "Dupont");

        _context.Relationships.Add(new Relationship
        {
            Person1Id = parent.Id,
            Person2Id = child.Id,
            RelationshipType = RelationshipType.Parent,
            IsActive = true
        });
        await _context.SaveChangesAsync();

        var children = (await _repository.GetChildrenAsync(parent.Id)).ToList();
        var parents = (await _repository.GetParentsAsync(child.Id)).ToList();

        children.Should().ContainSingle(p => p.Id == child.Id);
        parents.Should().ContainSingle(p => p.Id == parent.Id);
    }

    [Fact]
    public async Task GetSiblingsAsync_ReturnsChildrenOfSameParents()
    {
        var parent = await AddPerson("Parent", "Dupont");
        var alice = await AddPerson("Alice", "Dupont");
        var bob = await AddPerson("Bob", "Dupont");

        _context.Relationships.AddRange(
            new Relationship { Person1Id = parent.Id, Person2Id = alice.Id, RelationshipType = RelationshipType.Parent, IsActive = true },
            new Relationship { Person1Id = parent.Id, Person2Id = bob.Id, RelationshipType = RelationshipType.Parent, IsActive = true }
        );
        await _context.SaveChangesAsync();

        var siblings = (await _repository.GetSiblingsAsync(alice.Id)).ToList();

        siblings.Should().ContainSingle(p => p.Id == bob.Id);
        siblings.Should().NotContain(p => p.Id == alice.Id);
    }

    [Fact]
    public async Task GetSiblingsAsync_ForPersonWithoutParents_ReturnsEmpty()
    {
        var person = await AddPerson("Seul", "Orphelin");

        var siblings = await _repository.GetSiblingsAsync(person.Id);

        siblings.Should().BeEmpty();
    }
}
