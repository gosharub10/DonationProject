using Thesis.Domain.Entities;
using Thesis.Domain.Enums;

namespace Thesis.Domain.Interfaces;

public interface IProjectRepository
{
    Task<Project?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IEnumerable<Project>> GetAllAsync(CancellationToken ct = default);
    Task AddAsync(Project project, CancellationToken ct = default);
    Task UpdateAsync(Project project, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}