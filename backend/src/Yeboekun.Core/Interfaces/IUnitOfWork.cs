using Yeboekun.Core.Interfaces;

namespace Yeboekun.Core.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IPersonRepository Persons { get; }
    IRelationshipRepository Relationships { get; }
    ITreeRepository Trees { get; }
    
    Task<int> SaveChangesAsync();
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
}
