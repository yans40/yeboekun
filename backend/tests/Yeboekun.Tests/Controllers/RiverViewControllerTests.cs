using AutoMapper;
using FluentAssertions;
using FluentValidation;
using FluentValidation.Results;
using Yeboekun.API.Controllers;
using Yeboekun.Core.Entities;
using Yeboekun.Core.Interfaces;
using Yeboekun.Services.DTOs;
using Yeboekun.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using Xunit;

namespace Yeboekun.Tests.Controllers;

/// <summary>
/// Tests unitaires de PersonsController.GetRiverView.
/// On mocke IRiverViewService et on vérifie uniquement le routage HTTP (200/404/500).
/// </summary>
public class RiverViewControllerTests
{
    private readonly Mock<IRiverViewService> _riverViewService = new();
    private readonly PersonsController _controller;

    public RiverViewControllerTests()
    {
        var uow         = new Mock<IUnitOfWork>();
        var personsRepo = new Mock<IPersonRepository>();
        var relRepo     = new Mock<IRelationshipRepository>();
        uow.Setup(u => u.Persons).Returns(personsRepo.Object);
        uow.Setup(u => u.Relationships).Returns(relRepo.Object);

        var validResult = new ValidationResult();
        var createValidator = new Mock<IValidator<CreatePersonDto>>();
        createValidator.Setup(v => v.ValidateAsync(It.IsAny<CreatePersonDto>(), It.IsAny<CancellationToken>()))
                       .ReturnsAsync(validResult);
        var updateValidator = new Mock<IValidator<UpdatePersonDto>>();
        updateValidator.Setup(v => v.ValidateAsync(It.IsAny<UpdatePersonDto>(), It.IsAny<CancellationToken>()))
                       .ReturnsAsync(validResult);
        var spouseValidator = new Mock<IValidator<CreateSpouseRelationshipDto>>();
        spouseValidator.Setup(v => v.ValidateAsync(It.IsAny<CreateSpouseRelationshipDto>(), It.IsAny<CancellationToken>()))
                       .ReturnsAsync(validResult);

        _controller = new PersonsController(
            personService:            new Mock<IPersonService>().Object,
            duplicateDetectionService: new Mock<IDuplicateDetectionService>().Object,
            unitOfWork:               uow.Object,
            mapper:                   new Mock<IMapper>().Object,
            logger:                   NullLogger<PersonsController>.Instance,
            treeTraversalService:     new Mock<ITreeTraversalService>().Object,
            riverViewService:         _riverViewService.Object,
            createPersonValidator:    createValidator.Object,
            updatePersonValidator:    updateValidator.Object,
            createSpouseValidator:    spouseValidator.Object);
    }

    // ── Cas nominal : 200 OK ─────────────────────────────────────────────────

    [Fact]
    public async Task GetRiverView_WithValidId_Returns200WithPayload()
    {
        var dto = new RiverViewDto
        {
            RootId = 1,
            Depth  = 3,
            Nodes  =
            [
                new RiverViewNodeDto { Id = 1, FirstName = "Jean", LastName = "Dupont", Generation = 0 },
                new RiverViewNodeDto { Id = 2, FirstName = "Pierre", LastName = "Dupont", Generation = -1 }
            ],
            Edges =
            [
                new RiverViewEdgeDto { SourceId = 2, TargetId = 1, Type = "Parent", IsActive = true }
            ],
            GenerationRange = new GenerationRangeDto { Min = -1, Max = 0 }
        };

        _riverViewService
            .Setup(s => s.BuildRiverViewAsync(1, 3, It.IsAny<CancellationToken>()))
            .ReturnsAsync(dto);

        var result = await _controller.GetRiverView(id: 1, depth: 3);

        var ok = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var payload = ok.Value.Should().BeOfType<RiverViewDto>().Subject;
        payload.RootId.Should().Be(1);
        payload.Nodes.Should().HaveCount(2);
        payload.Edges.Should().HaveCount(1);
        payload.GenerationRange.Min.Should().Be(-1);
        payload.GenerationRange.Max.Should().Be(0);
    }

    // ── Cas 404 : personne inexistante ──────────────────────────────────────

    [Fact]
    public async Task GetRiverView_WithUnknownId_Returns404()
    {
        _riverViewService
            .Setup(s => s.BuildRiverViewAsync(999, It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((RiverViewDto?)null);

        var result = await _controller.GetRiverView(id: 999, depth: 3);

        result.Result.Should().BeOfType<NotFoundObjectResult>();
    }

    // ── Depth clampé côté controller ────────────────────────────────────────

    [Theory]
    [InlineData(0, 1)]
    [InlineData(10, 5)]
    [InlineData(3, 3)]
    public async Task GetRiverView_DepthClamped_CallsServiceWithClampedValue(int inputDepth, int expectedDepth)
    {
        _riverViewService
            .Setup(s => s.BuildRiverViewAsync(1, expectedDepth, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new RiverViewDto { RootId = 1, Depth = expectedDepth, GenerationRange = new() });

        var result = await _controller.GetRiverView(id: 1, depth: inputDepth);

        result.Result.Should().BeOfType<OkObjectResult>();

        // Vérifier que le service a bien été appelé avec la valeur clampée
        _riverViewService.Verify(
            s => s.BuildRiverViewAsync(1, expectedDepth, It.IsAny<CancellationToken>()),
            Times.Once);
    }

    // ── Cas 500 : exception non gérée ───────────────────────────────────────

    [Fact]
    public async Task GetRiverView_WhenServiceThrows_Returns500()
    {
        _riverViewService
            .Setup(s => s.BuildRiverViewAsync(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ThrowsAsync(new InvalidOperationException("DB error"));

        var result = await _controller.GetRiverView(id: 1, depth: 3);

        var status = result.Result.Should().BeOfType<ObjectResult>().Subject;
        status.StatusCode.Should().Be(500);
    }
}
