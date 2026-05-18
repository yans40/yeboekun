using Yeboekun.Core.Entities;
using Yeboekun.Core.Interfaces;
using Yeboekun.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Yeboekun.Infrastructure.Repositories;

public class TreeRepository : ITreeRepository
{
    private readonly YeboekunContext _context;

    public TreeRepository(YeboekunContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Tree>> GetAllAsync()
    {
        return await _context.Trees
            .Include(t => t.RootPerson)
            .OrderBy(t => t.Name)
            .ToListAsync();
    }

    public async Task<Tree?> GetByIdAsync(int id)
    {
        return await _context.Trees.FindAsync(id);
    }

    public async Task<Tree?> GetByIdWithRootPersonAsync(int id)
    {
        return await _context.Trees
            .Include(t => t.RootPerson)
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<IEnumerable<Tree>> GetPublicTreesAsync()
    {
        return await _context.Trees
            .Where(t => t.IsPublic)
            .Include(t => t.RootPerson)
            .OrderBy(t => t.Name)
            .ToListAsync();
    }

    public async Task<Tree> AddAsync(Tree tree)
    {
        tree.CreatedAt = DateTime.UtcNow;
        tree.UpdatedAt = DateTime.UtcNow;
        
        _context.Trees.Add(tree);
        await _context.SaveChangesAsync();
        return tree;
    }

    public async Task<Tree> UpdateAsync(Tree tree)
    {
        tree.UpdatedAt = DateTime.UtcNow;
        _context.Trees.Update(tree);
        await _context.SaveChangesAsync();
        return tree;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var tree = await _context.Trees.FindAsync(id);
        if (tree == null)
            return false;

        _context.Trees.Remove(tree);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.Trees.AnyAsync(t => t.Id == id);
    }
}
