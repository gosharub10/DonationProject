using Thesis.Application.Common;
using Thesis.Application.DTOs.Project;
using Thesis.Domain.Entities;
using Thesis.Domain.Interfaces;

namespace Thesis.Application.Projects.Create;

public sealed class CreateProjectCommandHandler : ICommandHandler<CreateProjectCommand, CreateProjectResponse>
{
    private readonly IProjectRepository _projectRepository;

    public CreateProjectCommandHandler(IProjectRepository projectRepository)
    {
        _projectRepository = projectRepository;
    }
    
    public async Task<CreateProjectResponse> HandleAsync(CreateProjectCommand command, CancellationToken ct)
    {
        var projectId = Guid.NewGuid();
        var createdAt = DateOnly.FromDateTime(DateTime.UtcNow);
        
        // Admin creates project without financial settings; finance manager will complete setup
        var newProject = new Project(
            projectId,
            command.Title,
            command.Description,
            0m,
            string.Empty,
            createdAt
        );

        await _projectRepository.AddAsync(newProject, ct);
        
        return new CreateProjectResponse(newProject.Id);
    }
}