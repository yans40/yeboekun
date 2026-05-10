using GegeDot.Core.Entities;

namespace GegeDot.Core.Interfaces;

public interface IRelationshipRepository
{
    Task<IEnumerable<Relationship>> GetAllAsync();
    Task<Relationship?> GetByIdAsync(int id);
    Task<IEnumerable<Relationship>> GetByPersonIdAsync(int personId);
    Task<IEnumerable<Relationship>> GetByPersonIdsAsync(int person1Id, int person2Id);
    Task<Relationship> AddAsync(Relationship relationship);
    Task<Relationship> UpdateAsync(Relationship relationship);
    Task<bool> DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
    Task<bool> RelationshipExistsAsync(int person1Id, int person2Id, RelationshipType type);

    /// <summary>
    /// Retourne toutes les relations de type Spouse dont les deux extrémités
    /// appartiennent à l'ensemble <paramref name="personIds"/>.
    /// Une seule requête SQL avec WHERE Person1Id IN (...) AND Person2Id IN (...).
    /// </summary>
    Task<List<Relationship>> GetSpousesInSetAsync(
        IEnumerable<int> personIds,
        CancellationToken cancellationToken = default);
}
