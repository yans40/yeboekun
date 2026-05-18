using FluentAssertions;
using Yeboekun.Core.Entities;
using Yeboekun.Core.Interfaces;
using Yeboekun.Services.Services;
using Moq;
using Xunit;

namespace Yeboekun.Tests.Services;

/// <summary>
/// Tests unitaires de TreeTraversalService.
/// Toutes les dépendances (IUnitOfWork, IPersonRepository) sont mockées —
/// aucune base de données n'est nécessaire.
///
/// Convention de la base : Type=Parent, Person1=parent, Person2=enfant.
/// </summary>
public class TreeTraversalServiceTests
{
    // --- Helpers de setup ---

    private static Person MakePerson(int id, string first = "P", string? last = null, Gender gender = Gender.Male)
        => new()
        {
            Id        = id,
            FirstName = first,
            LastName  = last ?? $"Person{id}",
            Gender    = gender
        };

    private static Mock<IUnitOfWork> BuildUow(
        Mock<IPersonRepository> repo)
    {
        var uow = new Mock<IUnitOfWork>();
        uow.Setup(u => u.Persons).Returns(repo.Object);
        return uow;
    }

    private static void SetupGetById(Mock<IPersonRepository> repo, params Person[] persons)
    {
        foreach (var p in persons)
        {
            var captured = p;
            repo.Setup(r => r.GetByIdAsync(captured.Id))
                .ReturnsAsync(captured);
        }
        // Id inconnu → null
        repo.Setup(r => r.GetByIdAsync(It.IsNotIn(persons.Select(p => p.Id))))
            .ReturnsAsync((Person?)null);
    }

    private static void SetupGetPersonsByIds(Mock<IPersonRepository> repo, IEnumerable<Person> persons)
    {
        var lookup = persons.ToDictionary(p => p.Id);
        repo.Setup(r => r.GetPersonsByIdsAsync(It.IsAny<IEnumerable<int>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((IEnumerable<int> ids, CancellationToken _) =>
                ids.Where(id => lookup.ContainsKey(id)).Select(id => lookup[id]).ToList());
    }

    private static void SetupParentMap(
        Mock<IPersonRepository> repo,
        Dictionary<int, List<int>> parentMap)
    {
        repo.Setup(r => r.GetParentIdsBatchAsync(It.IsAny<IEnumerable<int>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((IEnumerable<int> ids, CancellationToken _) =>
            {
                var result = ids.ToDictionary(id => id, id =>
                    parentMap.TryGetValue(id, out var p) ? p : new List<int>());
                return result;
            });
    }

    private static void SetupChildMap(
        Mock<IPersonRepository> repo,
        Dictionary<int, List<int>> childMap)
    {
        repo.Setup(r => r.GetChildIdsBatchAsync(It.IsAny<IEnumerable<int>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((IEnumerable<int> ids, CancellationToken _) =>
            {
                var result = ids.ToDictionary(id => id, id =>
                    childMap.TryGetValue(id, out var c) ? c : new List<int>());
                return result;
            });
    }

    // =========================================================================
    // Scénario 1 : Personne inconnue
    // =========================================================================

    [Fact]
    public async Task BuildTreeAsync_UnknownRoot_ReturnsNull()
    {
        var repo = new Mock<IPersonRepository>();
        repo.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Person?)null);

        var sut = new TreeTraversalService(BuildUow(repo).Object);

        var result = await sut.BuildTreeAsync(999, up: 1, down: 1);

        result.Should().BeNull();
    }

    // =========================================================================
    // Scénario 2 : Personne seule (aucune relation)
    // =========================================================================

    [Fact]
    public async Task BuildTreeAsync_PersonAlone_ReturnsSingleNode()
    {
        var root = MakePerson(1, "Jean", "Dupont");
        var repo = new Mock<IPersonRepository>();

        SetupGetById(repo, root);
        SetupGetPersonsByIds(repo, [root]);
        SetupParentMap(repo, new Dictionary<int, List<int>>());
        SetupChildMap(repo, new Dictionary<int, List<int>>());

        var sut = new TreeTraversalService(BuildUow(repo).Object);

        var tree = await sut.BuildTreeAsync(1, up: 4, down: 2);

        tree.Should().NotBeNull();
        tree!.RootId.Should().Be(1);
        tree.Nodes.Should().HaveCount(1);

        var node = tree.Nodes.Single();
        node.Id.Should().Be(1);
        node.Generation.Should().Be(0);
        node.ParentIds.Should().BeEmpty();
        node.ChildIds.Should().BeEmpty();
        node.Gender.Should().Be("M");
    }

    // =========================================================================
    // Scénario 3 : Chaîne linéaire grand-parent → parent → racine → enfant → petit-enfant
    // =========================================================================
    //
    //   GP(10) → Parent(20) → Root(1) → Child(30) → GrandChild(40)
    //
    // Avec up=2, down=2 on doit voir les 5 nœuds.
    // Avec up=1, down=1 on doit voir 3 nœuds : Parent(20), Root(1), Child(30).

    [Fact]
    public async Task BuildTreeAsync_LinearChain_FullTraversal()
    {
        var gp    = MakePerson(10, "GrandP");
        var par   = MakePerson(20, "Parent");
        var root  = MakePerson(1,  "Root");
        var child = MakePerson(30, "Child");
        var gc    = MakePerson(40, "GrandC");

        var repo = new Mock<IPersonRepository>();
        SetupGetById(repo, gp, par, root, child, gc);
        SetupGetPersonsByIds(repo, new[] { gp, par, root, child, gc });

        // parentMap : qui est le parent de qui (clé = enfant, valeur = liste parents)
        SetupParentMap(repo, new Dictionary<int, List<int>>
        {
            [1]  = [20],  // Root a pour parent Parent
            [20] = [10],  // Parent a pour parent GP
            [10] = [],    // GP n'a pas de parent connu
        });

        // childMap : qui sont les enfants de qui (clé = parent, valeur = liste enfants)
        SetupChildMap(repo, new Dictionary<int, List<int>>
        {
            [1]  = [30],  // Root a pour enfant Child
            [30] = [40],  // Child a pour enfant GrandChild
            [40] = [],    // GrandChild pas d'enfant
        });

        var sut = new TreeTraversalService(BuildUow(repo).Object);

        var tree = await sut.BuildTreeAsync(rootId: 1, up: 2, down: 2);

        tree.Should().NotBeNull();
        tree!.Nodes.Should().HaveCount(5);

        var byId = tree.Nodes.ToDictionary(n => n.Id);

        byId[1].Generation.Should().Be(0);
        byId[20].Generation.Should().Be(-1);
        byId[10].Generation.Should().Be(-2);
        byId[30].Generation.Should().Be(1);
        byId[40].Generation.Should().Be(2);

        // Liens
        byId[1].ParentIds.Should().Contain(20);
        byId[1].ChildIds.Should().Contain(30);
        byId[20].ParentIds.Should().Contain(10);
        byId[30].ChildIds.Should().Contain(40);
    }

    [Fact]
    public async Task BuildTreeAsync_LinearChain_LimitedUpDown()
    {
        var gp    = MakePerson(10, "GrandP");
        var par   = MakePerson(20, "Parent");
        var root  = MakePerson(1,  "Root");
        var child = MakePerson(30, "Child");
        var gc    = MakePerson(40, "GrandC");

        var repo = new Mock<IPersonRepository>();
        SetupGetById(repo, gp, par, root, child, gc);
        SetupGetPersonsByIds(repo, new[] { gp, par, root, child, gc });

        SetupParentMap(repo, new Dictionary<int, List<int>>
        {
            [1]  = [20],
            [20] = [10],
        });
        SetupChildMap(repo, new Dictionary<int, List<int>>
        {
            [1]  = [30],
            [30] = [40],
        });

        var sut = new TreeTraversalService(BuildUow(repo).Object);

        var tree = await sut.BuildTreeAsync(rootId: 1, up: 1, down: 1);

        tree.Should().NotBeNull();
        // Avec up=1 et down=1 : Root(0) + Parent(-1) + Child(+1) = 3 nœuds
        tree!.Nodes.Should().HaveCount(3);
        tree.Nodes.Select(n => n.Id).Should().BeEquivalentTo([1, 20, 30]);
    }

    // =========================================================================
    // Scénario 4 : Branche asymétrique
    //
    //   ParentA(10) ──┐
    //                  ├── Root(1) ─── Child1(30)
    //   ParentB(11) ──┘         └──── Child2(31)
    //
    // ParentA a un parent (GP 10), ParentB est orphelin.
    // =========================================================================

    [Fact]
    public async Task BuildTreeAsync_AsymmetricBranch_CorrectStructure()
    {
        var pa     = MakePerson(10, "ParentA");
        var pb     = MakePerson(11, "ParentB", gender: Gender.Female);
        var root   = MakePerson(1,  "Root");
        var child1 = MakePerson(30, "Child1");
        var child2 = MakePerson(31, "Child2");
        var gpa    = MakePerson(50, "GrandParentA");

        var repo = new Mock<IPersonRepository>();
        SetupGetById(repo, pa, pb, root, child1, child2, gpa);
        SetupGetPersonsByIds(repo, new[] { pa, pb, root, child1, child2, gpa });

        SetupParentMap(repo, new Dictionary<int, List<int>>
        {
            [1]  = [10, 11],  // Root a deux parents
            [10] = [50],      // ParentA a un parent (GP)
            [11] = [],        // ParentB est orphelin
            [50] = [],
        });

        SetupChildMap(repo, new Dictionary<int, List<int>>
        {
            [1]  = [30, 31],  // Root a deux enfants
            [30] = [],
            [31] = [],
        });

        var sut = new TreeTraversalService(BuildUow(repo).Object);

        var tree = await sut.BuildTreeAsync(rootId: 1, up: 2, down: 1);

        tree.Should().NotBeNull();
        tree!.Nodes.Should().HaveCount(6);

        var byId = tree.Nodes.ToDictionary(n => n.Id);

        byId[1].ParentIds.Should().BeEquivalentTo([10, 11]);
        byId[1].ChildIds.Should().BeEquivalentTo([30, 31]);
        byId[10].Generation.Should().Be(-1);
        byId[11].Generation.Should().Be(-1);
        byId[50].Generation.Should().Be(-2);
        byId[11].Gender.Should().Be("F");
        byId[50].ParentIds.Should().BeEmpty(); // hors limite ou pas de parent
    }

    // =========================================================================
    // Scénario 5 : Détection de cycle (données corrompues)
    //
    //   Root(1) → Parent(2) → Root(1)  [cycle]
    //
    // L'arbre ne doit pas boucler indéfiniment et doit retourner un résultat fini.
    // =========================================================================

    [Fact]
    public async Task BuildTreeAsync_CycleInData_DoesNotLoopAndReturnsResult()
    {
        var root   = MakePerson(1, "Root");
        var parent = MakePerson(2, "Parent");

        var repo = new Mock<IPersonRepository>();
        SetupGetById(repo, root, parent);
        SetupGetPersonsByIds(repo, new[] { root, parent });

        // Root a pour parent Parent, et Parent a pour parent Root (cycle)
        SetupParentMap(repo, new Dictionary<int, List<int>>
        {
            [1] = [2],
            [2] = [1],  // cycle : Root est son propre grand-parent
        });
        SetupChildMap(repo, new Dictionary<int, List<int>>());

        var sut = new TreeTraversalService(BuildUow(repo).Object);

        var act = async () => await sut.BuildTreeAsync(rootId: 1, up: 4, down: 0);

        await act.Should().NotThrowAsync();

        var tree = await sut.BuildTreeAsync(rootId: 1, up: 4, down: 0);
        tree.Should().NotBeNull();
        // Root et Parent présents, mais pas de boucle infinie — le cycle est coupé
        tree!.Nodes.Should().HaveCountGreaterThan(0);
    }

    // =========================================================================
    // Scénario 6 : Paramètres up/down clamped
    // =========================================================================

    [Fact]
    public async Task BuildTreeAsync_UpBeyondMax_ClampedTo8()
    {
        var root = MakePerson(1, "Root");
        var repo = new Mock<IPersonRepository>();

        SetupGetById(repo, root);
        SetupGetPersonsByIds(repo, [root]);
        SetupParentMap(repo, new Dictionary<int, List<int>>());
        SetupChildMap(repo, new Dictionary<int, List<int>>());

        var sut = new TreeTraversalService(BuildUow(repo).Object);

        // up=100 ne doit pas lever d'exception — clampé à 8
        var act = async () => await sut.BuildTreeAsync(rootId: 1, up: 100, down: 0);
        await act.Should().NotThrowAsync();
    }

    // =========================================================================
    // Scénario 7 : Gender mapping
    // =========================================================================

    [Theory]
    [InlineData(Gender.Male,   "M")]
    [InlineData(Gender.Female, "F")]
    [InlineData(Gender.Other,  "O")]
    public async Task BuildTreeAsync_GenderMapped_Correctly(Gender gender, string expected)
    {
        var root = MakePerson(1, "Root", gender: gender);
        var repo = new Mock<IPersonRepository>();

        SetupGetById(repo, root);
        SetupGetPersonsByIds(repo, [root]);
        SetupParentMap(repo, new Dictionary<int, List<int>>());
        SetupChildMap(repo, new Dictionary<int, List<int>>());

        var sut = new TreeTraversalService(BuildUow(repo).Object);

        var tree = await sut.BuildTreeAsync(1, up: 0, down: 0);
        tree!.Nodes.Single().Gender.Should().Be(expected);
    }
}
