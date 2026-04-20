using AutoMapper;
using FluentAssertions;
using GegeDot.API.Controllers;
using GegeDot.Core.Entities;
using GegeDot.Core.Interfaces;
using GegeDot.Services.DTOs;
using GegeDot.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using Xunit;

namespace GegeDot.Tests.Controllers;

public class PersonsControllerTests
{
    private readonly Mock<IPersonService> _personService = new();
    private readonly Mock<IDuplicateDetectionService> _duplicateService = new();
    private readonly Mock<IUnitOfWork> _uow = new();
    private readonly Mock<IPersonRepository> _personsRepo = new();
    private readonly Mock<IRelationshipRepository> _relRepo = new();
    private readonly Mock<IMapper> _mapper = new();
    private readonly PersonsController _controller;

    public PersonsControllerTests()
    {
        _uow.Setup(u => u.Persons).Returns(_personsRepo.Object);
        _uow.Setup(u => u.Relationships).Returns(_relRepo.Object);

        _controller = new PersonsController(
            _personService.Object,
            _duplicateService.Object,
            _uow.Object,
            _mapper.Object,
            NullLogger<PersonsController>.Instance);
    }

    // ── GET ─────────────────────────────────────────────────────────────────

    [Fact]
    public async Task GetPersons_ShouldReturnOkWithList()
    {
        var persons = new List<PersonDto> { new() { Id = 1, FirstName = "Jean" } };
        _personService.Setup(s => s.GetAllPersonsAsync()).ReturnsAsync(persons);

        var result = await _controller.GetPersons();

        var ok = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        ok.Value.Should().BeEquivalentTo(persons);
    }

    [Fact]
    public async Task GetPerson_WithUnknownId_ShouldReturnNotFound()
    {
        _personService.Setup(s => s.GetPersonByIdAsync(99)).ReturnsAsync((PersonDto?)null);

        var result = await _controller.GetPerson(99);

        result.Result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Fact]
    public async Task GetPerson_WithValidId_ShouldReturnOk()
    {
        var dto = new PersonDto { Id = 1, FirstName = "Jean" };
        _personService.Setup(s => s.GetPersonByIdAsync(1)).ReturnsAsync(dto);

        var result = await _controller.GetPerson(1);

        var ok = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        ok.Value.Should().BeEquivalentTo(dto);
    }

    // ── Search ──────────────────────────────────────────────────────────────

    [Fact]
    public async Task SearchPersons_WithEmptyTerm_ShouldReturnBadRequest()
    {
        var result = await _controller.SearchPersons("   ");

        result.Result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public async Task SearchPersons_WithTerm_ShouldReturnOkList()
    {
        var matches = new List<PersonDto> { new() { Id = 1, FirstName = "Jean" } };
        _personService.Setup(s => s.SearchPersonsAsync("Jean")).ReturnsAsync(matches);

        var result = await _controller.SearchPersons("Jean");

        result.Result.Should().BeOfType<OkObjectResult>();
    }

    // ── Create ──────────────────────────────────────────────────────────────

    [Fact]
    public async Task CreatePerson_WithMissingFirstName_ShouldReturnBadRequest()
    {
        var dto = new CreatePersonDto { FirstName = "", LastName = "Dupont", Gender = "M" };

        var result = await _controller.CreatePerson(dto);

        result.Result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public async Task CreatePerson_WhenDeathBeforeBirth_ShouldReturnBadRequest()
    {
        var dto = new CreatePersonDto
        {
            FirstName = "Jean",
            LastName = "Dupont",
            Gender = "M",
            BirthDate = new DateTime(1980, 1, 1),
            DeathDate = new DateTime(1970, 1, 1),
            IsAlive = false
        };

        var result = await _controller.CreatePerson(dto);

        result.Result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public async Task CreatePerson_WithValidData_ShouldReturnCreatedAtAction()
    {
        var dto = new CreatePersonDto { FirstName = "Jean", LastName = "Dupont", Gender = "M" };
        var created = new PersonDto { Id = 1, FirstName = "Jean", LastName = "Dupont" };
        _personService.Setup(s => s.CreatePersonAsync(dto)).ReturnsAsync(created);

        var result = await _controller.CreatePerson(dto);

        var createdAt = result.Result.Should().BeOfType<CreatedAtActionResult>().Subject;
        createdAt.Value.Should().BeEquivalentTo(created);
    }

    // ── Update ──────────────────────────────────────────────────────────────

    [Fact]
    public async Task UpdatePerson_WhenPersonDoesNotExist_ShouldReturnNotFound()
    {
        _personService.Setup(s => s.PersonExistsAsync(1)).ReturnsAsync(false);
        var dto = new UpdatePersonDto { FirstName = "X", LastName = "Y", Gender = "M" };

        var result = await _controller.UpdatePerson(1, dto);

        result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Fact]
    public async Task UpdatePerson_WithForceTrue_ShouldBypassDuplicateCheck()
    {
        var dto = new UpdatePersonDto { FirstName = "Jean", LastName = "Dupont", Gender = "M" };
        _personService.Setup(s => s.PersonExistsAsync(1)).ReturnsAsync(true);
        _personService.Setup(s => s.UpdatePersonAsync(1, dto))
            .ReturnsAsync(new PersonDto { Id = 1 });

        var result = await _controller.UpdatePerson(1, dto, force: true);

        result.Should().BeOfType<NoContentResult>();
        _duplicateService.Verify(s => s.FindDuplicatesAsync(It.IsAny<Person>()), Times.Never);
    }

    [Fact]
    public async Task UpdatePerson_WithDuplicates_ShouldReturnConflict()
    {
        var dto = new UpdatePersonDto { FirstName = "Jean", LastName = "Dupont", Gender = "M" };
        _personService.Setup(s => s.PersonExistsAsync(1)).ReturnsAsync(true);
        _personService.Setup(s => s.GetPersonByIdAsync(1))
            .ReturnsAsync(new PersonDto { Id = 1, FirstName = "Jean", LastName = "Dupont" });
        _mapper.Setup(m => m.Map<Person>(dto))
            .Returns(new Person { FirstName = "Jean", LastName = "Dupont" });
        _duplicateService.Setup(s => s.FindDuplicatesAsync(It.IsAny<Person>()))
            .ReturnsAsync(new List<DuplicateCandidate> { new() { PersonId = 2 } });

        var result = await _controller.UpdatePerson(1, dto, force: false);

        result.Should().BeOfType<ConflictObjectResult>();
    }

    // ── Delete ──────────────────────────────────────────────────────────────

    [Fact]
    public async Task DeletePerson_WhenUnknown_ShouldReturnNotFound()
    {
        _personService.Setup(s => s.DeletePersonAsync(99)).ReturnsAsync(false);

        var result = await _controller.DeletePerson(99);

        result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Fact]
    public async Task DeletePerson_WhenDeleted_ShouldReturnNoContent()
    {
        _personService.Setup(s => s.DeletePersonAsync(1)).ReturnsAsync(true);

        var result = await _controller.DeletePerson(1);

        result.Should().BeOfType<NoContentResult>();
    }

    // ── Parent-Child ────────────────────────────────────────────────────────

    [Fact]
    public async Task CreateParentChildRelationship_WithMissingParent_ShouldReturnNotFound()
    {
        _personsRepo.Setup(r => r.ExistsAsync(1)).ReturnsAsync(false);
        _personsRepo.Setup(r => r.ExistsAsync(2)).ReturnsAsync(true);

        var result = await _controller.CreateParentChildRelationship(1, 2);

        result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Fact]
    public async Task CreateParentChildRelationship_WhenExisting_ShouldReturnConflict()
    {
        _personsRepo.Setup(r => r.ExistsAsync(It.IsAny<int>())).ReturnsAsync(true);
        _relRepo.Setup(r => r.RelationshipExistsAsync(1, 2, RelationshipType.Parent)).ReturnsAsync(true);

        var result = await _controller.CreateParentChildRelationship(1, 2);

        result.Should().BeOfType<ConflictObjectResult>();
    }

    [Fact]
    public async Task CreateParentChildRelationship_Success_ShouldReturnOk()
    {
        _personsRepo.Setup(r => r.ExistsAsync(It.IsAny<int>())).ReturnsAsync(true);
        _relRepo.Setup(r => r.RelationshipExistsAsync(1, 2, RelationshipType.Parent)).ReturnsAsync(false);
        _relRepo.Setup(r => r.AddAsync(It.IsAny<Relationship>()))
            .ReturnsAsync((Relationship r) => { r.Id = 99; return r; });

        var result = await _controller.CreateParentChildRelationship(1, 2);

        result.Should().BeOfType<OkObjectResult>();
    }

    // ── Spouse ──────────────────────────────────────────────────────────────

    [Fact]
    public async Task CreateSpouseRelationship_WithSamePerson_ShouldReturnBadRequest()
    {
        _personsRepo.Setup(r => r.ExistsAsync(It.IsAny<int>())).ReturnsAsync(true);

        var result = await _controller.CreateSpouseRelationship(5, 5);

        result.Should().BeOfType<BadRequestObjectResult>();
    }
}
