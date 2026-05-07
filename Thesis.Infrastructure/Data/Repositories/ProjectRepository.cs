using Microsoft.EntityFrameworkCore;
using Thesis.Domain.Entities;
using Thesis.Domain.Interfaces;

namespace Thesis.Infrastructure.Data.Repositories;

public class ProjectRepository(AppDbContext context) : IProjectRepository
{
    public async Task<Project?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await context.Projects
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id, ct);
    }

    public async Task<IEnumerable<Project>> GetAllAsync(CancellationToken ct = default)
    {
        return await context.Projects
            .AsNoTracking()
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task AddAsync(Project project, CancellationToken ct = default)
    {
        await context.Projects.AddAsync(project, ct);
        
        await context.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(Project project, CancellationToken ct = default)
    {
        context.Projects.Update(project);
        
        await context.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var project = await context.Projects.FindAsync([id], ct);
        
        if (project is not null)
        {
            context.Projects.Remove(project);
            await context.SaveChangesAsync(ct);
        }
    }
}