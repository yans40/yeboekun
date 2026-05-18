using Yeboekun.Core.Entities;
using Yeboekun.Core.Interfaces;
using Yeboekun.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Yeboekun.Infrastructure.Repositories;

public class RelationshipRepository : IRelationshipRepository
{
    private readonly YeboekunContext _context;

    public RelationshipRepository(YeboekunContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Relationship>> GetAllAsync()
    {
        return await _context.Relationships
            .Include(r => r.Person1)
            .Include(r => r.Person2)
            .OrderBy(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<Relationship?> GetByIdAsync(int id)
    {
        return await _context.Relationships
            .Include(r => r.Person1)
            .Include(r => r.Person2)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<IEnumerable<Relationship>> GetByPersonIdAsync(int personId)
    {
        return await _context.Relationships
            .Where(r => r.Person1Id == personId || r.Person2Id == personId)
            .Include(r => r.Person1)
            .Include(r => r.Person2)
            .OrderBy(r => r.RelationshipType)
            .ToListAsync();
    }

    public async Task<IEnumerable<Relationship>> GetByPersonIdsAsync(int person1Id, int person2Id)
    {
        return await _context.Relationships
            .Where(r => (r.Person1Id == person1Id && r.Person2Id == person2Id) ||
                       (r.Person1Id == person2Id && r.Person2Id == person1Id))
            .Include(r => r.Person1)
            .Include(r => r.Person2)
            .ToListAsync();
    }

    public async Task<Relationship> AddAsync(Relationship relationship)
    {
        relationship.CreatedAt = DateTime.UtcNow;
        
        _context.Relationships.Add(relationship);
        await _context.SaveChangesAsync();
        return relationship;
    }

    public async Task<Relationship> UpdateAsync(Relationship relationship)
    {
        _context.Relationships.Update(relationship);
        await _context.SaveChangesAsync();
        return relationship;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var relationship = await _context.Relationships.FindAsync(id);
        if (relationship == null)
            return false;

        _context.Relationships.Remove(relationship);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.Relationships.AnyAsync(r => r.Id == id);
    }

    public async Task<bool> RelationshipExistsAsync(int person1Id, int person2Id, RelationshipType type)
    {
        return await _context.Relationships
            .AnyAsync(r => ((r.Person1Id == person1Id && r.Person2Id == person2Id) ||
                           (r.Person1Id == person2Id && r.Person2Id == person1Id)) &&
                          r.RelationshipType == type);
    }

    public async Task<List<Relationship>> GetSpousesInSetAsync(
        IEnumerable<int> personIds,
        CancellationToken cancellationToken = default)
    {
        // Matérialiser en HashSet pour que EF Core génère un IN (...) efficace
        var idSet = personIds.ToHashSet();

        // On retourne les Spouse dont les DEUX extrémités sont dans l'ensemble.
        // Pas d'Include des entités Person : le controller/service n'en a pas besoin,
        // seuls les IDs scalaires sont utilisés.
        return await _context.Relationships
            .AsNoTracking()
            .Where(r => r.RelationshipType == RelationshipType.Spouse
                        && idSet.Contains(r.Person1Id)
                        && idSet.Contains(r.Person2Id))
            .ToListAsync(cancellationToken);
    }
}
