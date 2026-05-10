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
        // Validate wallet address format
        if (string.IsNullOrWhiteSpace(command.WalletAddress))
            throw new ApplicationException("Wallet address cannot be empty");

        if (!command.WalletAddress.StartsWith("0x"))
            throw new ApplicationException("Wallet address must start with '0x'");

        var projectId = Guid.NewGuid();
        var createdAt = DateOnly.FromDateTime(DateTime.UtcNow);
        
        var newProject = new Project(
            projectId, 
            command.Title, 
            command.Description, 
            command.TargetAmount, 
            command.WalletAddress,
            createdAt
        );

        await _projectRepository.AddAsync(newProject, ct);
        
        return new CreateProjectResponse(newProject.Id);
    }
}