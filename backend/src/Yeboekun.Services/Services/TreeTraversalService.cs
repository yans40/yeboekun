using Yeboekun.Core.Entities;
using Yeboekun.Core.Interfaces;
using Yeboekun.Services.DTOs;
using Yeboekun.Services.Interfaces;

namespace Yeboekun.Services.Services;

/// <summary>
/// Implémentation BFS niveau par niveau.
///
/// Algorithme en deux passes :
///  1. Remontée des ascendants (génération -1, -2, …, -up).
///  2. Descente des descendants (génération +1, +2, …, +down).
///
/// Chaque niveau déclenche exactement une requête SQL batch via les méthodes
/// GetParentIdsBatchAsync / GetChildIdsBatchAsync, puis une requête GetPersonsByIdsAsync
/// pour les nouvelles personnes découvertes.
///
/// La détection de cycles repose sur un HashSet global des IDs déjà visités.
/// </summary>
public sealed class TreeTraversalService : ITreeTraversalService
{
    private readonly IUnitOfWork _unitOfWork;

    public TreeTraversalService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<PersonTreeDto?> BuildTreeAsync(
        int rootId,
        int up,
        int down,
        CancellationToken cancellationToken = default)
    {
        // Clamp défensif (la couche controller le fait aussi, double filet)
        up   = Math.Clamp(up,   0, 8);
        down = Math.Clamp(down, 0, 4);

        // Vérifier que la racine existe
        var rootPerson = await _unitOfWork.Persons.GetByIdAsync(rootId);
        if (rootPerson is null)
            return null;

        // visited : tous les IDs intégrés à l'arbre (anti-cycle)
        var visited = new HashSet<int> { rootId };

        // nodes : dictionnaire de travail, clé = personId
        var nodes = new Dictionary<int, PersonTreeNodeDto>
        {
            [rootId] = ToNode(rootPerson, generation: 0)
        };

        // --- Passe 1 : ascendants ---
        // currentFrontier contient les IDs du niveau courant dont on cherche les parents
        var frontier = new List<int> { rootId };

        for (int gen = 1; gen <= up && frontier.Count > 0; gen++)
        {
            // Une seule requête SQL pour tous les IDs du niveau courant
            var parentMap = await _unitOfWork.Persons.GetParentIdsBatchAsync(frontier, cancellationToken);

            // Collecter tous les IDs parents nouveaux (non déjà visités)
            var newParentIds = parentMap.Values
                .SelectMany(ids => ids)
                .Distinct()
                .Where(id => !visited.Contains(id))
                .ToList();

            // Enregistrer les liens parentIds dans les nœuds enfants déjà présents
            foreach (var (childId, parentIds) in parentMap)
            {
                if (nodes.TryGetValue(childId, out var childNode))
                    childNode.ParentIds.AddRange(parentIds.Where(pid => !childNode.ParentIds.Contains(pid)));
            }

            if (newParentIds.Count == 0)
                break;

            // Charger les entités Person en une requête
            var newPersons = await _unitOfWork.Persons.GetPersonsByIdsAsync(newParentIds, cancellationToken);

            foreach (var person in newPersons)
            {
                visited.Add(person.Id);
                nodes[person.Id] = ToNode(person, generation: -gen);
            }

            // Enregistrer également les parentIds pour les parents déjà dans visited
            // (cas où un parent est racine ou à une génération différente — lien seulement)
            foreach (var (childId, parentIds) in parentMap)
            {
                if (!nodes.TryGetValue(childId, out var childNode)) continue;
                foreach (var pid in parentIds)
                {
                    if (!childNode.ParentIds.Contains(pid))
                        childNode.ParentIds.Add(pid);
                }
            }

            // Le prochain niveau repart des IDs effectivement chargés
            frontier = newPersons.Select(p => p.Id).ToList();
        }

        // --- Passe 2 : descendants ---
        frontier = [rootId];

        for (int gen = 1; gen <= down && frontier.Count > 0; gen++)
        {
            var childMap = await _unitOfWork.Persons.GetChildIdsBatchAsync(frontier, cancellationToken);

            var newChildIds = childMap.Values
                .SelectMany(ids => ids)
                .Distinct()
                .Where(id => !visited.Contains(id))
                .ToList();

            // Enregistrer les liens childIds dans les nœuds parents déjà présents
            foreach (var (parentId, childIds) in childMap)
            {
                if (nodes.TryGetValue(parentId, out var parentNode))
                {
                    foreach (var cid in childIds)
                        if (!parentNode.ChildIds.Contains(cid))
                            parentNode.ChildIds.Add(cid);
                }
            }

            if (newChildIds.Count == 0)
                break;

            var newPersons = await _unitOfWork.Persons.GetPersonsByIdsAsync(newChildIds, cancellationToken);

            foreach (var person in newPersons)
            {
                visited.Add(person.Id);
                nodes[person.Id] = ToNode(person, generation: gen);
            }

            // Idem pour les enfants déjà visitables (cycles ou partage de nœud)
            foreach (var (parentId, childIds) in childMap)
            {
                if (!nodes.TryGetValue(parentId, out var parentNode)) continue;
                foreach (var cid in childIds)
                {
                    if (!parentNode.ChildIds.Contains(cid))
                        parentNode.ChildIds.Add(cid);
                }
            }

            frontier = newPersons.Select(p => p.Id).ToList();
        }

        // --- Passe 3 : nettoyer les références croisées ---
        // Un parentId ou childId référencé dans un nœud mais absent du dictionnaire
        // (car hors des limites up/down) doit être retiré pour ne pas exposer d'ID fantôme.
        var presentIds = new HashSet<int>(nodes.Keys);
        foreach (var node in nodes.Values)
        {
            node.ParentIds.RemoveAll(id => !presentIds.Contains(id));
            node.ChildIds.RemoveAll(id => !presentIds.Contains(id));
        }

        return new PersonTreeDto
        {
            RootId = rootId,
            Nodes = [.. nodes.Values]
        };
    }

    // ---------------------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------------------

    private static PersonTreeNodeDto ToNode(Person person, int generation) => new()
    {
        Id         = person.Id,
        FirstName  = person.FirstName,
        LastName   = person.LastName,
        BirthDate  = person.BirthDate?.ToString("yyyy-MM-dd"),
        DeathDate  = person.DeathDate?.ToString("yyyy-MM-dd"),
        Gender     = GenderToString(person.Gender),
        PhotoUrl   = person.PhotoUrl,
        Generation = generation,
        ParentIds  = [],
        ChildIds   = []
    };

    private static string GenderToString(Gender gender) => gender switch
    {
        Gender.Female => "F",
        Gender.Other  => "O",
        _             => "M"
    };
}
