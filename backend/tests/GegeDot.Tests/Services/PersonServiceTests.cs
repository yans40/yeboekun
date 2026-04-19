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
    private readonly PersonService _personService;

    public PersonServiceTests()
    {
        _mockUnitOfWork = new Mock<IUnitOfWork>();
        _mockPersonRepository = new Mock<IPersonRepository>();
        
        _mockUnitOfWork.Setup(u => u.Persons).Returns(_mockPersonRepository.Object);
        
        // Mock AutoMapper (simplifié pour les tests)
        var mockMapper = new Mock<AutoMapper.IMapper>();
        mockMapper.Setup(m => m.Map<PersonDto>(It.IsAny<Person>()))
                 .Returns((Person p) => new PersonDto
                 {
                     Id = p.Id,
                     FirstName = p.FirstName,
                     LastName = p.LastName,
                     Gender = p.Gender.ToString(),
                     FullName = p.FullName,
                     Age = p.Age
                 });
        
        mockMapper.Setup(m => m.Map<Person>(It.IsAny<CreatePersonDto>()))
                 .Returns((CreatePersonDto dto) => new Person
                 {
                     FirstName = dto.FirstName,
                     LastName = dto.LastName,
                     Gender = Enum.Parse<Gender>(dto.Gender)
                 });

        var mockNormalization = new Mock<IDataNormalizationService>();
        mockNormalization.Setup(n => n.NormalizeName(It.IsAny<string?>())).Returns((string? s) => s ?? string.Empty);
        mockNormalization.Setup(n => n.NormalizePlace(It.IsAny<string?>())).Returns((string? s) => s ?? string.Empty);
        mockNormalization.Setup(n => n.NormalizeProfession(It.IsAny<string?>())).Returns((string? s) => s ?? string.Empty);
        mockNormalization.Setup(n => n.NormalizeDate(It.IsAny<string?>())).Returns((string? s) => null);

        _personService = new PersonService(_mockUnitOfWork.Object, mockMapper.Object, mockNormalization.Object);
    }

    [Fact]
    public async Task GetAllPersonsAsync_ShouldReturnAllPersons()
    {
        // Arrange
        var persons = new List<Person>
        {
            new Person { Id = 1, FirstName = "Jean", LastName = "Dupont", Gender = Gender.Male },
            new Person { Id = 2, FirstName = "Marie", LastName = "Martin", Gender = Gender.Female }
        };

        _mockPersonRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(persons);

        // Act
        var result = await _personService.GetAllPersonsAsync();

        // Assert
        result.Should().HaveCount(2);
        result.First().FirstName.Should().Be("Jean");
        result.Last().FirstName.Should().Be("Marie");
    }

    [Fact]
    public async Task GetPersonByIdAsync_WithValidId_ShouldReturnPerson()
    {
        // Arrange
        var person = new Person { Id = 1, FirstName = "Jean", LastName = "Dupont", Gender = Gender.Male };
        _mockPersonRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(person);

        // Act
        var result = await _personService.GetPersonByIdAsync(1);

        // Assert
        result.Should().NotBeNull();
        result!.FirstName.Should().Be("Jean");
        result.LastName.Should().Be("Dupont");
    }

    [Fact]
    public async Task GetPersonByIdAsync_WithInvalidId_ShouldReturnNull()
    {
        // Arrange
        _mockPersonRepository.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Person?)null);

        // Act
        var result = await _personService.GetPersonByIdAsync(999);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task CreatePersonAsync_WithValidData_ShouldCreatePerson()
    {
        // Arrange
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

        // Act
        var result = await _personService.CreatePersonAsync(createDto);

        // Assert
        result.Should().NotBeNull();
        result.FirstName.Should().Be("Jean");
        result.LastName.Should().Be("Dupont");
        _mockPersonRepository.Verify(r => r.AddAsync(It.IsAny<Person>()), Times.Once);
    }

    [Fact]
    public async Task UpdatePersonAsync_WithValidId_ShouldUpdatePerson()
    {
        // Arrange
        var existingPerson = new Person { Id = 1, FirstName = "Jean", LastName = "Dupont", Gender = Gender.Male };
        var updateDto = new UpdatePersonDto
        {
            FirstName = "Jean-Pierre",
            LastName = "Dupont",
            Gender = "M"
        };

        _mockPersonRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(existingPerson);
        _mockPersonRepository.Setup(r => r.UpdateAsync(It.IsAny<Person>())).ReturnsAsync(existingPerson);

        // Act
        var result = await _personService.UpdatePersonAsync(1, updateDto);

        // Assert
        result.Should().NotBeNull();
        _mockPersonRepository.Verify(r => r.UpdateAsync(It.IsAny<Person>()), Times.Once);
    }

    [Fact]
    public async Task DeletePersonAsync_WithValidId_ShouldDeletePerson()
    {
        // Arrange
        _mockPersonRepository.Setup(r => r.DeleteAsync(1)).ReturnsAsync(true);

        // Act
        var result = await _personService.DeletePersonAsync(1);

        // Assert
        result.Should().BeTrue();
        _mockPersonRepository.Verify(r => r.DeleteAsync(1), Times.Once);
    }

    [Fact]
    public async Task SearchPersonsAsync_WithSearchTerm_ShouldReturnMatchingPersons()
    {
        // Arrange
        var persons = new List<Person>
        {
            new Person { Id = 1, FirstName = "Jean", LastName = "Dupont", Gender = Gender.Male }
        };

        _mockPersonRepository.Setup(r => r.SearchByNameAsync("Jean")).ReturnsAsync(persons);

        // Act
        var result = await _personService.SearchPersonsAsync("Jean");

        // Assert
        result.Should().HaveCount(1);
        result.First().FirstName.Should().Be("Jean");
    }
}
