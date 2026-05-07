using GegeDot.Core.Entities;
using GegeDot.Core.Interfaces;
using GegeDot.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GegeDot.Infrastructure.Repositories;

public class PersonRepository : IPersonRepository
{
    private readonly GegeDotContext _context;

    public PersonRepository(GegeDotContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Person>> GetAllAsync()
    {
        return await _context.Persons
            .OrderBy(p => p.LastName)
            .ThenBy(p => p.FirstName)
            .ToListAsync();
    }

    public async Task<Person?> GetByIdAsync(int id)
    {
        return await _context.Persons.FindAsync(id);
    }

    public async Task<Person?> GetByIdWithRelationshipsAsync(int id)
    {
        return await _context.Persons
            .Include(p => p.RelationshipsAsPerson1)
                .ThenInclude(r => r.Person2)
            .Include(p => p.RelationshipsAsPerson2)
                .ThenInclude(r => r.Person1)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<IEnumerable<Person>> GetChildrenAsync(int personId)
    {
        return await _context.Relationships
            .Where(r => r.Person1Id == personId && r.RelationshipType == RelationshipType.Parent)
            .Include(r => r.Person2)
            .Select(r => r.Person2)
            .ToListAsync();
    }

    public async Task<IEnumerable<Person>> GetParentsAsync(int personId)
    {
        return await _context.Relationships
            .Where(r => r.Person2Id == personId && r.RelationshipType == RelationshipType.Parent)
            .Include(r => r.Person1)
            .Select(r => r.Person1)
            .ToListAsync();
    }

    public async Task<IEnumerable<Person>> GetSiblingsAsync(int personId)
    {
        // Get parents first
        var parentIds = await _context.Relationships
            .Where(r => r.Person2Id == personId && r.RelationshipType == RelationshipType.Parent)
            .Select(r => r.Person1Id)
            .ToListAsync();

        if (!parentIds.Any())
            return new List<Person>();

        // Get siblings (children of the same parents)
        return await _context.Relationships
            .Where(r => parentIds.Contains(r.Person1Id) && 
                       r.RelationshipType == RelationshipType.Parent && 
                       r.Person2Id != personId)
            .Include(r => r.Person2)
            .Select(r => r.Person2)
            .Distinct()
            .ToListAsync();
    }

    public async Task<IEnumerable<Person>> SearchByNameAsync(string searchTerm)
    {
        var term = searchTerm.ToLower();
        return await _context.Persons
            .Where(p => p.FirstName.ToLower().Contains(term) || 
                       p.LastName.ToLower().Contains(term) ||
                       (p.MiddleName != null && p.MiddleName.ToLower().Contains(term)))
            .OrderBy(p => p.LastName)
            .ThenBy(p => p.FirstName)
            .ToListAsync();
    }

    public async Task<Person> AddAsync(Person person)
    {
        person.CreatedAt = DateTime.UtcNow;
        person.UpdatedAt = DateTime.UtcNow;
        
        _context.Persons.Add(person);
        await _context.SaveChangesAsync();
        return person;
    }

    public async Task<Person> UpdateAsync(Person person)
    {
        person.UpdatedAt = DateTime.UtcNow;
        _context.Persons.Update(person);
        await _context.SaveChangesAsync();
        return person;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var person = await _context.Persons.FindAsync(id);
        if (person == null)
            return false;

        _context.Persons.Remove(person);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.Persons.AnyAsync(p => p.Id == id);
    }

    /// <inheritdoc/>
    public async Task<Dictionary<int, List<int>>> GetParentIdsBatchAsync(
        IEnumerable<int> personIds,
        CancellationToken cancellationToken = default)
    {
        var ids = personIds.ToList();
        if (ids.Count == 0)
            return new Dictionary<int, List<int>>();

        // Convention : Type=Parent, Person1=parent, Person2=enfant
        // On veut : pour chaque enfant (Person2Id), ses parents (Person1Id)
        var rows = await _context.Relationships
            .AsNoTracking()
            .Where(r => r.RelationshipType == RelationshipType.Parent && ids.Contains(r.Person2Id))
            .Select(r => new { ChildId = r.Person2Id, ParentId = r.Person1Id })
            .ToListAsync(cancellationToken);

        var result = ids.ToDictionary(id => id, _ => new List<int>());
        foreach (var row in rows)
            result[row.ChildId].Add(row.ParentId);

        return result;
    }

    /// <inheritdoc/>
    public async Task<Dictionary<int, List<int>>> GetChildIdsBatchAsync(
        IEnumerable<int> personIds,
        CancellationToken cancellationToken = default)
    {
        var ids = personIds.ToList();
        if (ids.Count == 0)
            return new Dictionary<int, List<int>>();

        // Convention : Type=Parent, Person1=parent, Person2=enfant
        // On veut : pour chaque parent (Person1Id), ses enfants (Person2Id)
        var rows = await _context.Relationships
            .AsNoTracking()
            .Where(r => r.RelationshipType == RelationshipType.Parent && ids.Contains(r.Person1Id))
            .Select(r => new { ParentId = r.Person1Id, ChildId = r.Person2Id })
            .ToListAsync(cancellationToken);

        var result = ids.ToDictionary(id => id, _ => new List<int>());
        foreach (var row in rows)
            result[row.ParentId].Add(row.ChildId);

        return result;
    }

    /// <inheritdoc/>
    public async Task<List<Person>> GetPersonsByIdsAsync(
        IEnumerable<int> ids,
        CancellationToken cancellationToken = default)
    {
        var idList = ids.ToList();
        if (idList.Count == 0)
            return [];

        return await _context.Persons
            .AsNoTracking()
            .Where(p => idList.Contains(p.Id))
            .ToListAsync(cancellationToken);
    }
}
