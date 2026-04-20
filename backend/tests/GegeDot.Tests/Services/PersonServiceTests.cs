using FluentAssertions;
using GegeDot.Core.Entities;
using GegeDot.Core.Interfaces;
using GegeDot.Services.DTOs;
using GegeDot.Services.Interfaces;
using GegeDot.Services.Services;
using Moq;
using Xunit;

namespace GegeDot.Tests.Services;

public class PersonServiceTests
{
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly Mock<IPersonRepository> _mockPersonRepository;
    private readonly Mock<IRelationshipRepository> _mockRelationshipRepository;
    private readonly PersonService _personService;

    public PersonServiceTests()
    {
        _mockUnitOfWork = new Mock<IUnitOfWork>();
        _mockPersonRepository = new Mock<IPersonRepository>();
        _mockRelationshipRepository = new Mock<IRelationshipRepository>();

        _mockUnitOfWork.Setup(u => u.Persons).Returns(_mockPersonRepository.Object);
        _mockUnitOfWork.Setup(u => u.Relationships).Returns(_mockRelationshipRepository.Object);

        var mockMapper = BuildMapperMock();

        var mockNormalization = new Mock<IDataNormalizationService>();
        mockNormalization.Setup(n => n.NormalizeName(It.IsAny<string?>())).Returns((string? s) => s ?? string.Empty);
        mockNormalization.Setup(n => n.NormalizePlace(It.IsAny<string?>())).Returns((string? s) => s ?? string.Empty);
        mockNormalization.Setup(n => n.NormalizeProfession(It.IsAny<string?>())).Returns((string? s) => s ?? string.Empty);
        mockNormalization.Setup(n => n.NormalizeDate(It.IsAny<string?>())).Returns((string? s) => null);

        _personService = new PersonService(_mockUnitOfWork.Object, mockMapper.Object, mockNormalization.Object);
    }

    private static Mock<AutoMapper.IMapper> BuildMapperMock()
    {
        static PersonDto ToDto(Person p) => new()
        {
            Id = p.Id,
            FirstName = p.FirstName,
            LastName = p.LastName,
            Gender = p.Gender.ToString(),
            FullName = p.FullName,
            Age = p.Age
        };

        var mockMapper = new Mock<AutoMapper.IMapper>();
        mockMapper.Setup(m => m.Map<PersonDto>(It.IsAny<Person>()))
                 .Returns((Person p) => ToDto(p));

        mockMapper.Setup(m => m.Map<IEnumerable<PersonDto>>(It.IsAny<IEnumerable<Person>>()))
                 .Returns((IEnumerable<Person> list) => list.Select(ToDto).ToList());

        mockMapper.Setup(m => m.Map<Person>(It.IsAny<CreatePersonDto>()))
                 .Returns((CreatePersonDto dto) => new Person
                 {
                     FirstName = dto.FirstName,
                     LastName = dto.LastName,
                     Gender = ParseGender(dto.Gender)
                 });

        mockMapper.Setup(m => m.Map(It.IsAny<UpdatePersonDto>(), It.IsAny<Person>()))
                 .Returns((UpdatePersonDto dto, Person existing) =>
                 {
                     existing.FirstName = dto.FirstName;
                     existing.LastName = dto.LastName;
                     existing.Gender = ParseGender(dto.Gender);
                     return existing;
                 });

        return mockMapper;
    }

    private static Gender ParseGender(string? value) => value switch
    {
        "F" or "Female" => Gender.Female,
        "O" or "Other" => Gender.Other,
        _ => Gender.Male
    };

    [Fact]
    public async Task GetAllPersonsAsync_ShouldReturnAllPersons()
    {
        var persons = new List<Person>
        {
            new() { Id = 1, FirstName = "Jean", LastName = "Dupont", Gender = Gender.Male },
            new() { Id = 2, FirstName = "Marie", LastName = "Martin", Gender = Gender.Female }
        };

        _mockPersonRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(persons);

        var result = (await _personService.GetAllPersonsAsync()).ToList();

        result.Should().HaveCount(2);
        result[0].FirstName.Should().Be("Jean");
        result[1].FirstName.Should().Be("Marie");
    }

    [Fact]
    public async Task GetAllPersonsAsync_WhenEmpty_ShouldReturnEmpty()
    {
        _mockPersonRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<Person>());

        var result = await _personService.GetAllPersonsAsync();

        result.Should().BeEmpty();
    }

    [Fact]
    public async Task GetPersonByIdAsync_WithValidId_ShouldReturnPerson()
    {
        var person = new Person { Id = 1, FirstName = "Jean", LastName = "Dupont", Gender = Gender.Male };
        _mockPersonRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(person);

        var result = await _personService.GetPersonByIdAsync(1);

        result.Should().NotBeNull();
        result!.FirstName.Should().Be("Jean");
        result.LastName.Should().Be("Dupont");
    }

    [Fact]
    public async Task GetPersonByIdAsync_WithInvalidId_ShouldReturnNull()
    {
        _mockPersonRepository.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Person?)null);

        var result = await _personService.GetPersonByIdAsync(999);

        result.Should().BeNull();
    }

    [Fact]
    public async Task CreatePersonAsync_WithValidData_ShouldCreatePerson()
    {
        var createDto = new CreatePersonDto
        {
            FirstName = "Jean",
            LastName = "Dupont",
            Gender = "M"
        };

        var createdPerson = new Person
        {
            Id = 1,
            FirstName = "Jean",
            LastName = "Dupont",
            Gender = Gender.Male
        };

        _mockPersonRepository.Setup(r => r.AddAsync(It.IsAny<Person>())).ReturnsAsync(createdPerson);

        var result = await _personService.CreatePersonAsync(createDto);

        result.Should().NotBeNull();
        result.FirstName.Should().Be("Jean");
        _mockPersonRepository.Verify(r => r.AddAsync(It.IsAny<Person>()), Times.Once);
        _mockRelationshipRepository.Verify(
            r => r.AddAsync(It.IsAny<Relationship>()),
            Times.Never,
            "aucune relation parent ne doit être créée sans Parent1Id/Parent2Id");
    }

    [Fact]
    public async Task CreatePersonAsync_WithParents_ShouldCreateParentRelationships()
    {
        var createDto = new CreatePersonDto
        {
            FirstName = "Enfant",
            LastName = "Dupont",
            Gender = "M",
            Parent1Id = 10,
            Parent2Id = 11
        };

        var createdPerson = new Person { Id = 1, FirstName = "Enfant", LastName = "Dupont", Gender = Gender.Male };

        _mockPersonRepository.Setup(r => r.AddAsync(It.IsAny<Person>())).ReturnsAsync(createdPerson);
        _mockPersonRepository.Setup(r => r.ExistsAsync(10)).ReturnsAsync(true);
        _mockPersonRepository.Setup(r => r.ExistsAsync(11)).ReturnsAsync(true);
        _mockRelationshipRepository
            .Setup(r => r.RelationshipExistsAsync(It.IsAny<int>(), It.IsAny<int>(), RelationshipType.Parent))
            .ReturnsAsync(false);

        await _personService.CreatePersonAsync(createDto);

        _mockRelationshipRepository.Verify(
            r => r.AddAsync(It.Is<Relationship>(rel =>
                rel.Person1Id == 10 && rel.Person2Id == 1 && rel.RelationshipType == RelationshipType.Parent)),
            Times.Once);
        _mockRelationshipRepository.Verify(
            r => r.AddAsync(It.Is<Relationship>(rel =>
                rel.Person1Id == 11 && rel.Person2Id == 1 && rel.RelationshipType == RelationshipType.Parent)),
            Times.Once);
    }

    [Fact]
    public async Task CreatePersonAsync_WithMissingParent_ShouldThrow()
    {
        var createDto = new CreatePersonDto
        {
            FirstName = "Enfant",
            LastName = "Dupont",
            Gender = "M",
            Parent1Id = 42
        };

        var createdPerson = new Person { Id = 1, FirstName = "Enfant", LastName = "Dupont", Gender = Gender.Male };

        _mockPersonRepository.Setup(r => r.AddAsync(It.IsAny<Person>())).ReturnsAsync(createdPerson);
        _mockPersonRepository.Setup(r => r.ExistsAsync(42)).ReturnsAsync(false);

        var act = () => _personService.CreatePersonAsync(createDto);

        await act.Should().ThrowAsync<ArgumentException>()
            .WithMessage("*42*");
    }

    [Fact]
    public async Task CreatePersonAsync_WhenRelationshipAlreadyExists_ShouldNotDuplicateIt()
    {
        var createDto = new CreatePersonDto
        {
            FirstName = "Enfant",
            LastName = "Dupont",
            Gender = "M",
            Parent1Id = 10
        };

        var createdPerson = new Person { Id = 1, FirstName = "Enfant", LastName = "Dupont", Gender = Gender.Male };

        _mockPersonRepository.Setup(r => r.AddAsync(It.IsAny<Person>())).ReturnsAsync(createdPerson);
        _mockPersonRepository.Setup(r => r.ExistsAsync(10)).ReturnsAsync(true);
        _mockRelationshipRepository
            .Setup(r => r.RelationshipExistsAsync(10, 1, RelationshipType.Parent))
            .ReturnsAsync(true);

        await _personService.CreatePersonAsync(createDto);

        _mockRelationshipRepository.Verify(
            r => r.AddAsync(It.IsAny<Relationship>()),
            Times.Never);
    }

    [Fact]
    public async Task UpdatePersonAsync_WithValidId_ShouldUpdatePerson()
    {
        var existingPerson = new Person { Id = 1, FirstName = "Jean", LastName = "Dupont", Gender = Gender.Male };
        var updateDto = new UpdatePersonDto
        {
            FirstName = "Jean-Pierre",
            LastName = "Dupont",
            Gender = "M"
        };

        _mockPersonRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(existingPerson);
        _mockPersonRepository.Setup(r => r.UpdateAsync(It.IsAny<Person>())).ReturnsAsync(existingPerson);

        var result = await _personService.UpdatePersonAsync(1, updateDto);

        result.Should().NotBeNull();
        _mockPersonRepository.Verify(r => r.UpdateAsync(It.IsAny<Person>()), Times.Once);
    }

    [Fact]
    public async Task UpdatePersonAsync_WithInvalidId_ShouldThrow()
    {
        _mockPersonRepository.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Person?)null);
        var updateDto = new UpdatePersonDto { FirstName = "X", LastName = "Y", Gender = "M" };

        var act = () => _personService.UpdatePersonAsync(999, updateDto);

        await act.Should().ThrowAsync<ArgumentException>()
            .WithMessage("*999*");
    }

    [Fact]
    public async Task DeletePersonAsync_WithValidId_ShouldDeletePerson()
    {
        _mockPersonRepository.Setup(r => r.DeleteAsync(1)).ReturnsAsync(true);

        var result = await _personService.DeletePersonAsync(1);

        result.Should().BeTrue();
        _mockPersonRepository.Verify(r => r.DeleteAsync(1), Times.Once);
    }

    [Fact]
    public async Task DeletePersonAsync_WithUnknownId_ShouldReturnFalse()
    {
        _mockPersonRepository.Setup(r => r.DeleteAsync(999)).ReturnsAsync(false);

        var result = await _personService.DeletePersonAsync(999);

        result.Should().BeFalse();
    }

    [Fact]
    public async Task PersonExistsAsync_ShouldProxyToRepository()
    {
        _mockPersonRepository.Setup(r => r.ExistsAsync(7)).ReturnsAsync(true);

        (await _personService.PersonExistsAsync(7)).Should().BeTrue();
    }

    [Fact]
    public async Task SearchPersonsAsync_WithSearchTerm_ShouldReturnMatchingPersons()
    {
        var persons = new List<Person>
        {
            new() { Id = 1, FirstName = "Jean", LastName = "Dupont", Gender = Gender.Male }
        };

        _mockPersonRepository.Setup(r => r.SearchByNameAsync("Jean")).ReturnsAsync(persons);

        var result = (await _personService.SearchPersonsAsync("Jean")).ToList();

        result.Should().HaveCount(1);
        result[0].FirstName.Should().Be("Jean");
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public async Task SearchPersonsAsync_WithEmptyTerm_ShouldReturnAllPersons(string? term)
    {
        var persons = new List<Person>
        {
            new() { Id = 1, FirstName = "Jean", LastName = "Dupont", Gender = Gender.Male },
            new() { Id = 2, FirstName = "Marie", LastName = "Martin", Gender = Gender.Female }
        };

        _mockPersonRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(persons);

        var result = await _personService.SearchPersonsAsync(term!);

        result.Should().HaveCount(2);
        _mockPersonRepository.Verify(r => r.SearchByNameAsync(It.IsAny<string>()), Times.Never);
    }

    [Fact]
    public async Task GetChildrenAsync_ShouldMapResultsFromRepository()
    {
        var children = new List<Person> { new() { Id = 3, FirstName = "Lea", LastName = "Dupont" } };
        _mockPersonRepository.Setup(r => r.GetChildrenAsync(1)).ReturnsAsync(children);

        var result = (await _personService.GetChildrenAsync(1)).ToList();

        result.Should().HaveCount(1);
        result[0].FirstName.Should().Be("Lea");
    }

    [Fact]
    public async Task GetParentsAsync_ShouldMapResultsFromRepository()
    {
        var parents = new List<Person>
        {
            new() { Id = 10, FirstName = "Pere", LastName = "Dupont" },
            new() { Id = 11, FirstName = "Mere", LastName = "Dupont" }
        };
        _mockPersonRepository.Setup(r => r.GetParentsAsync(1)).ReturnsAsync(parents);

        var result = (await _personService.GetParentsAsync(1)).ToList();

        result.Should().HaveCount(2);
    }

    [Fact]
    public async Task GetSiblingsAsync_ShouldMapResultsFromRepository()
    {
        var siblings = new List<Person> { new() { Id = 2, FirstName = "Sibling", LastName = "Dupont" } };
        _mockPersonRepository.Setup(r => r.GetSiblingsAsync(1)).ReturnsAsync(siblings);

        var result = (await _personService.GetSiblingsAsync(1)).ToList();

        result.Should().HaveCount(1);
        result[0].FirstName.Should().Be("Sibling");
    }
}
