using Yeboekun.Core.Entities;

namespace Yeboekun.Core.Interfaces;

public interface ITreeRepository
{
    Task<IEnumerable<Tree>> GetAllAsync();
    Task<Tree?> GetByIdAsync(int id);
    Task<Tree?> GetByIdWithRootPersonAsync(int id);
    Task<IEnumerable<Tree>> GetPublicTreesAsync();
    Task<Tree> AddAsync(Tree tree);
    Task<Tree> UpdateAsync(Tree tree);
    Task<bool> DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
}
