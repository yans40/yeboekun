using Yeboekun.Core.Interfaces;
using Yeboekun.Infrastructure.Data;
using Yeboekun.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore.Storage;

namespace Yeboekun.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly YeboekunContext _context;
    private IDbContextTransaction? _transaction;

    public UnitOfWork(YeboekunContext context)
    {
        _context = context;
        Persons = new PersonRepository(_context);
        Relationships = new RelationshipRepository(_context);
        Trees = new TreeRepository(_context);
    }

    public IPersonRepository Persons { get; }
    public IRelationshipRepository Relationships { get; }
    public ITreeRepository Trees { get; }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public async Task BeginTransactionAsync()
    {
        _transaction = await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.CommitAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task RollbackTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public void Dispose()
    {
        _transaction?.Dispose();
        _context.Dispose();
    }
}
