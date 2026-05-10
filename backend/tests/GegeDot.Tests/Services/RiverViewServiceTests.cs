using FluentAssertions;
using GegeDot.Core.Entities;
using GegeDot.Core.Interfaces;
using GegeDot.Services.DTOs;
using GegeDot.Services.Interfaces;
using GegeDot.Services.Services;
using Moq;
using Xunit;

namespace GegeDot.Tests.Services;

/// <summary>
/// Tests unitaires de RiverViewService.
///
/// Toutes les dépendances sont mockées (ITreeTraversalService, IUnitOfWork).
/// On vérifie :
///   - retour null si la personne n'existe pas (404)
///   - cas nominal : nœuds + edges Parent dérivés des parentIds
///   - edges Spouse issus de GetSpousesInSetAsync
///   - generationRange calculée correctement
///   - depth clampé [1, 5]
/// </summary>
public class RiverViewServiceTests
{
    // ── Helpers ─────────────────────────────────────────────────────────────

    private static Person MakePerson(int id, bool isAlive = true, Gender gender = Gender.Male)
        => new()
        {
            Id        = id,
            FirstName = $"P{id}",
            LastName  = "Test",
            IsAlive   = isAlive,
            Gender    = gender
        };

    private static PersonTreeDto MakeTreeDto(int rootId, params PersonTreeNodeDto[] nodes)
        => new() { RootId = rootId, Nodes = [.. nodes] };

    private static PersonTreeNodeDto MakeNode(int id, int generation, int[]? parentIds = null, int[]? childIds = null)
        => new()
        {
            Id         = id,
            FirstName  = $"P{id}",
            LastName   = "Test",
            Gender     = "M",
            Generation = generation,
            ParentIds  = parentIds is null ? [] : [.. parentIds],
            ChildIds   = childIds is null ? [] : [.. childIds]
        };

    /// <summary>
    /// Configure le mock ITreeTraversalService pour retourner un arbre préconstruit.
    /// </summary>
    private static Mock<ITreeTraversalService> SetupTreeService(PersonTreeDto? result)
    {
        var mock = new Mock<ITreeTraversalService>();
        mock.Setup(s => s.BuildTreeAsync(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(result);
        return mock;
    }

    /// <summary>
    /// Configure GetPersonsByIdsAsync pour retourner les entités Person correspondantes.
    /// </summary>
    private static Mock<IPersonRepository> SetupPersonsRepo(params Person[] persons)
    {
        var lookup = persons.ToDictionary(p => p.Id);
        var mock   = new Mock<IPersonRepository>();
        mock.Setup(r => r.GetPersonsByIdsAsync(It.IsAny<IEnumerable<int>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((IEnumerable<int> ids, CancellationToken _) =>
                ids.Where(id => lookup.ContainsKey(id)).Select(id => lookup[id]).ToList());
        return mock;
    }

    /// <summary>
    /// Configure GetSpousesInSetAsync pour retourner les relations Spouse données.
    /// </summary>
    private static Mock<IRelationshipRepository> SetupRelRepo(params Relationship[] spouses)
    {
        var mock = new Mock<IRelationshipRepository>();
        mock.Setup(r => r.GetSpousesInSetAsync(It.IsAny<IEnumerable<int>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(spouses.ToList());
        return mock;
    }

    private static RiverViewService BuildSut(
        Mock<ITreeTraversalService> treeMock,
        Mock<IPersonRepository> personsMock,
        Mock<IRelationshipRepository> relMock)
    {
        var uow = new Mock<IUnitOfWork>();
        uow.Setup(u => u.Persons).Returns(personsMock.Object);
        uow.Setup(u => u.Relationships).Returns(relMock.Object);
        return new RiverViewService(treeMock.Object, uow.Object);
    }

    // =========================================================================
    // Scénario 1 : Personne inconnue → null (404 côté controller)
    // =========================================================================

    [Fact]
    public async Task BuildRiverViewAsync_UnknownPerson_ReturnsNull()
    {
        var treeMock    = SetupTreeService(null);
        var personsMock = SetupPersonsRepo();
        var relMock     = SetupRelRepo();

        var sut    = BuildSut(treeMock, personsMock, relMock);
        var result = await sut.BuildRiverViewAsync(rootId: 999, depth: 3);

        result.Should().BeNull();
    }

    // =========================================================================
    // Scénario 2 : Cas nominal — racine avec un parent et un enfant, un Spouse
    //
    //   Parent(2) ──→ Root(1) ──→ Child(3)
    //                 Root(1) ──Spouse──→ Spouse(4)
    //
    // Génération : Parent=-1, Root=0, Child=+1, Spouse=0 (même génération que Root)
    // =========================================================================

    [Fact]
    public async Task BuildRiverViewAsync_NominalCase_ReturnsCorrectNodesAndEdges()
    {
        var parent = MakePerson(2);
        var root   = MakePerson(1);
        var child  = MakePerson(3);
        var spouse = MakePerson(4, gender: Gender.Female);

        var treeDto = MakeTreeDto(1,
            MakeNode(id: 1, generation: 0,  parentIds: [2], childIds: [3]),
            MakeNode(id: 2, generation: -1, parentIds: [],  childIds: [1]),
            MakeNode(id: 3, generation: 1,  parentIds: [1], childIds: []),
            MakeNode(id: 4, generation: 0,  parentIds: [],  childIds: [])
        );

        var spouseRel = new Relationship
        {
            Id               = 10,
            Person1Id        = 1,
            Person2Id        = 4,
            RelationshipType = RelationshipType.Spouse,
            IsActive         = true,
            StartDate        = new DateTime(2000, 6, 15),
            EndDate          = null
        };

        var treeMock    = SetupTreeService(treeDto);
        var personsMock = SetupPersonsRepo(root, parent, child, spouse);
        var relMock     = SetupRelRepo(spouseRel);

        var sut    = BuildSut(treeMock, personsMock, relMock);
        var result = await sut.BuildRiverViewAsync(rootId: 1, depth: 3);

        result.Should().NotBeNull();
        result!.RootId.Should().Be(1);
        result.Depth.Should().Be(3);

        // Nœuds
        result.Nodes.Should().HaveCount(4);
        var nodeById = result.Nodes.ToDictionary(n => n.Id);

        nodeById[1].Generation.Should().Be(0);
        nodeById[2].Generation.Should().Be(-1);
        nodeById[3].Generation.Should().Be(1);
        nodeById[4].Generation.Should().Be(0);
        nodeById[4].Gender.Should().Be("F");

        // IsAlive propagé depuis les entités Person
        nodeById[1].IsAlive.Should().BeTrue();

        // Edges Parent : Parent(2)→Root(1) et Root(1)→Child(3)
        var parentEdges = result.Edges.Where(e => e.Type == "Parent").ToList();
        parentEdges.Should().HaveCount(2);
        parentEdges.Should().ContainSingle(e => e.SourceId == 2 && e.TargetId == 1);
        parentEdges.Should().ContainSingle(e => e.SourceId == 1 && e.TargetId == 3);

        // Edge Spouse : Root(1)↔Spouse(4)
        var spouseEdges = result.Edges.Where(e => e.Type == "Spouse").ToList();
        spouseEdges.Should().HaveCount(1);
        spouseEdges[0].SourceId.Should().Be(1);
        spouseEdges[0].TargetId.Should().Be(4);
        spouseEdges[0].StartDate.Should().Be("2000-06-15");
        spouseEdges[0].EndDate.Should().BeNull();
        spouseEdges[0].IsActive.Should().BeTrue();

        // GenerationRange
        result.GenerationRange.Min.Should().Be(-1);
        result.GenerationRange.Max.Should().Be(1);
    }

    // =========================================================================
    // Scénario 3 : Personne seule, aucune relation
    // =========================================================================

    [Fact]
    public async Task BuildRiverViewAsync_PersonAlone_ReturnsOneNodeNoEdges()
    {
        var root    = MakePerson(1);
        var treeDto = MakeTreeDto(1, MakeNode(id: 1, generation: 0));

        var treeMock    = SetupTreeService(treeDto);
        var personsMock = SetupPersonsRepo(root);
        var relMock     = SetupRelRepo();

        var sut    = BuildSut(treeMock, personsMock, relMock);
        var result = await sut.BuildRiverViewAsync(rootId: 1, depth: 3);

        result.Should().NotBeNull();
        result!.Nodes.Should().HaveCount(1);
        result.Edges.Should().BeEmpty();
        result.GenerationRange.Min.Should().Be(0);
        result.GenerationRange.Max.Should().Be(0);
    }

    // =========================================================================
    // Scénario 4 : Depth clampé à [1, 5]
    // =========================================================================

    [Theory]
    [InlineData(0, 1)]   // en-dessous du min → clampé à 1
    [InlineData(10, 5)]  // au-dessus du max  → clampé à 5
    [InlineData(3, 3)]   // valeur valide      → inchangée
    public async Task BuildRiverViewAsync_DepthClamped(int inputDepth, int expectedDepth)
    {
        var root    = MakePerson(1);
        var treeDto = MakeTreeDto(1, MakeNode(1, 0));

        var treeMock    = SetupTreeService(treeDto);
        var personsMock = SetupPersonsRepo(root);
        var relMock     = SetupRelRepo();

        var sut    = BuildSut(treeMock, personsMock, relMock);
        var result = await sut.BuildRiverViewAsync(rootId: 1, depth: inputDepth);

        result.Should().NotBeNull();
        result!.Depth.Should().Be(expectedDepth);
    }

    // =========================================================================
    // Scénario 5 : Déduplication des edges Parent
    //
    // Si parentIds de Root=[2] ET childIds de Parent(2)=[1], l'edge Parent(2)→Root(1)
    // ne doit apparaître qu'une seule fois.
    // =========================================================================

    [Fact]
    public async Task BuildRiverViewAsync_ParentEdge_NotDuplicated()
    {
        var root    = MakePerson(1);
        var parent  = MakePerson(2);

        // Les deux nœuds référencent le même lien
        var treeDto = MakeTreeDto(1,
            MakeNode(id: 1, generation: 0,  parentIds: [2], childIds: []),
            MakeNode(id: 2, generation: -1, parentIds: [],  childIds: [1])  // childIds non utilisé pour les edges
        );

        var treeMock    = SetupTreeService(treeDto);
        var personsMock = SetupPersonsRepo(root, parent);
        var relMock     = SetupRelRepo();

        var sut    = BuildSut(treeMock, personsMock, relMock);
        var result = await sut.BuildRiverViewAsync(rootId: 1, depth: 3);

        // Un seul edge Parent(2)→Root(1), pas deux
        var parentEdges = result!.Edges.Where(e => e.Type == "Parent").ToList();
        parentEdges.Should().HaveCount(1);
        parentEdges[0].SourceId.Should().Be(2);
        parentEdges[0].TargetId.Should().Be(1);
    }

    // =========================================================================
    // Scénario 6 : Déduplication des edges Spouse
    //
    // Si la DB contient Spouse(A,B) ET Spouse(B,A), on n'émet qu'une arête.
    // =========================================================================

    [Fact]
    public async Task BuildRiverViewAsync_SpouseEdge_NotDuplicated()
    {
        var p1 = MakePerson(1);
        var p2 = MakePerson(2, gender: Gender.Female);

        var treeDto = MakeTreeDto(1,
            MakeNode(1, 0),
            MakeNode(2, 0)
        );

        // Simuler deux lignes Spouse en sens inverse (données incohérentes mais possibles)
        var rel1 = new Relationship { Id = 10, Person1Id = 1, Person2Id = 2, RelationshipType = RelationshipType.Spouse, IsActive = true };
        var rel2 = new Relationship { Id = 11, Person1Id = 2, Person2Id = 1, RelationshipType = RelationshipType.Spouse, IsActive = true };

        var treeMock    = SetupTreeService(treeDto);
        var personsMock = SetupPersonsRepo(p1, p2);
        var relMock     = SetupRelRepo(rel1, rel2);

        var sut    = BuildSut(treeMock, personsMock, relMock);
        var result = await sut.BuildRiverViewAsync(rootId: 1, depth: 1);

        result!.Edges.Where(e => e.Type == "Spouse").Should().HaveCount(1);
    }
}
