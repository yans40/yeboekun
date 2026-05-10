using GegeDot.Core.Entities;
using GegeDot.Core.Interfaces;
using GegeDot.Services.DTOs;
using GegeDot.Services.Interfaces;

namespace GegeDot.Services.Services;

/// <summary>
/// Implémentation de IRiverViewService.
///
/// Stratégie :
///   1. Déléguer la traversée BFS à ITreeTraversalService (déjà éprouvée, anti-cycle intégrée).
///      On passe depth à la fois pour up et down : vue symétrique.
///   2. Construire les nœuds RiverView depuis PersonTreeNodeDto — IsAlive y est absent,
///      mais les PersonTreeNodeDto sont construits depuis les entités Person complètes
///      dans TreeTraversalService.ToNode. On relit IsAlive depuis les données déjà
///      présentes dans le résultat via une requête batch GetPersonsByIdsAsync.
///   3. Dériver les edges Parent depuis les parentIds/childIds des nœuds.
///   4. Requêter les Spouse en une passe SQL via GetSpousesInSetAsync.
///   5. Calculer generationRange comme min/max des générations présentes.
/// </summary>
public sealed class RiverViewService : IRiverViewService
{
    private readonly ITreeTraversalService _treeTraversal;
    private readonly IUnitOfWork _unitOfWork;

    // Depth clamped [1, 5] : 5 générations suffisent pour une vue rivière lisible.
    // Au-delà de 5 la performance et la lisibilité dégradent.
    private const int MinDepth = 1;
    private const int MaxDepth = 5;

    public RiverViewService(ITreeTraversalService treeTraversal, IUnitOfWork unitOfWork)
    {
        _treeTraversal = treeTraversal;
        _unitOfWork    = unitOfWork;
    }

    public async Task<RiverViewDto?> BuildRiverViewAsync(
        int rootId,
        int depth,
        CancellationToken cancellationToken = default)
    {
        depth = Math.Clamp(depth, MinDepth, MaxDepth);

        // --- Passe 1 : traversée BFS ascendants + descendants ---
        // On réutilise BuildTreeAsync qui gère les cycles, le batching SQL
        // et la numérotation de génération.
        var tree = await _treeTraversal.BuildTreeAsync(rootId, up: depth, down: depth, cancellationToken);
        if (tree is null)
            return null;

        // --- Passe 2 : enrichir avec IsAlive (absent de PersonTreeNodeDto) ---
        // On recharge les entités Person en une seule requête batch pour récupérer IsAlive.
        // PersonTreeNodeDto ne porte pas ce champ — éviter de le modifier pour ne pas
        // casser le contrat de /tree existant.
        var allIds = tree.Nodes.Select(n => n.Id).ToList();
        var persons = await _unitOfWork.Persons.GetPersonsByIdsAsync(allIds, cancellationToken);
        var personById = persons.ToDictionary(p => p.Id);

        // --- Passe 3 : construire les nœuds RiverView ---
        var nodes = tree.Nodes
            .Select(n =>
            {
                personById.TryGetValue(n.Id, out var entity);
                return new RiverViewNodeDto
                {
                    Id         = n.Id,
                    FirstName  = n.FirstName,
                    LastName   = n.LastName,
                    BirthDate  = n.BirthDate,
                    DeathDate  = n.DeathDate,
                    IsAlive    = entity?.IsAlive ?? true,
                    Gender     = entity is null ? n.Gender : entity.Gender switch
                    {
                        Gender.Female => "F",
                        Gender.Other  => "O",
                        _             => "M",
                    },
                    PhotoUrl   = n.PhotoUrl,
                    Generation = n.Generation
                };
            })
            .ToList();

        // --- Passe 4 : construire les edges ---
        var edges = new List<RiverViewEdgeDto>();

        // 4a. Edges Parent : dérivés des parentIds de chaque nœud.
        //     Convention DB : Person1=parent, Person2=enfant (type Parent).
        //     On émet source=parent, target=enfant, type="Parent".
        //     Dédupliqués via HashSet de paires ordonnées.
        var parentEdgesSeen = new HashSet<(int, int)>();
        foreach (var node in tree.Nodes)
        {
            foreach (var parentId in node.ParentIds)
            {
                var key = (parentId, node.Id);
                if (parentEdgesSeen.Add(key))
                {
                    edges.Add(new RiverViewEdgeDto
                    {
                        SourceId  = parentId,
                        TargetId  = node.Id,
                        Type      = "Parent",
                        StartDate = null,
                        EndDate   = null,
                        IsActive  = true
                    });
                }
            }
        }

        // 4b. Edges Spouse : une seule requête SQL filtrée sur l'ensemble des IDs du sous-arbre.
        //     GetSpousesInSetAsync garantit que les deux extrémités sont dans le sous-arbre.
        var idSet = allIds.ToHashSet();
        var spouseRels = await _unitOfWork.Relationships.GetSpousesInSetAsync(idSet, cancellationToken);

        // Dédupliquer : une relation Spouse bidirectionnelle ne doit générer qu'une arête.
        var spouseEdgesSeen = new HashSet<(int, int)>();
        foreach (var rel in spouseRels)
        {
            // Clé canonique : petit ID en premier pour détecter les doublons (A,B) == (B,A)
            var key = rel.Person1Id < rel.Person2Id
                ? (rel.Person1Id, rel.Person2Id)
                : (rel.Person2Id, rel.Person1Id);

            if (spouseEdgesSeen.Add(key))
            {
                edges.Add(new RiverViewEdgeDto
                {
                    SourceId  = rel.Person1Id,
                    TargetId  = rel.Person2Id,
                    Type      = "Spouse",
                    StartDate = rel.StartDate?.ToString("yyyy-MM-dd"),
                    EndDate   = rel.EndDate?.ToString("yyyy-MM-dd"),
                    IsActive  = rel.IsActive
                });
            }
        }

        // 4c. Edges Sibling : non stockés explicitement en DB (dérivables des parents communs).
        //     On les omet volontairement pour ne pas créer de faux positifs avec des demi-frères
        //     ou des données incomplètes. Le frontend peut les inférer côté client si besoin.
        //     Note : si le besoin émerge, ajouter une passe "frères et sœurs" sur les nœuds
        //     qui partagent au moins un parentId commun.

        // --- Passe 5 : generationRange ---
        var generations = nodes.Select(n => n.Generation).ToList();
        var range = generations.Count > 0
            ? new GenerationRangeDto { Min = generations.Min(), Max = generations.Max() }
            : new GenerationRangeDto { Min = 0, Max = 0 };

        return new RiverViewDto
        {
            RootId          = rootId,
            Depth           = depth,
            Nodes           = nodes,
            Edges           = edges,
            GenerationRange = range
        };
    }
}
