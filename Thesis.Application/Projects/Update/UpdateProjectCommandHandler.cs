using Thesis.Application.Common;
using Thesis.Application.DTOs.Project;
using Thesis.Domain.Enums;
using Thesis.Domain.Interfaces;

namespace Thesis.Application.Projects.Update;

public class UpdateProjectCommandHandler : ICommandHandler<UpdateProjectCommand, UpdateProjectResponse>
{
    private readonly IProjectRepository _projectRepository;
    
    public UpdateProjectCommandHandler(IProjectRepository projectRepository)
    {
        _projectRepository = projectRepository;
    }
    
    public async Task<UpdateProjectResponse> HandleAsync(UpdateProjectCommand command, CancellationToken ct)
    {
        var project = await _projectRepository.GetByIdAsync(command.Id, ct);
        if (project is null)
        {
            throw new ArgumentNullException(nameof(project));
        }

        if (command.Title is not null)
        {
            project.SetTitle(command.Title);
        }

        if (command.Description is not null)
        {
            project.SetDescription(command.Description);
        }

        if (command.TargetAmount is not null && command.TargetAmount > 0)
        {
            project.SetTargetAmount(command.TargetAmount.Value);
        }

        if (command.Status is not null)
        {
            if (Enum.TryParse<ProjectStatus>(command.Status, true, out var status))
            {
                if (status != project.Status)
                {
                    project.SetStatus(status);
                }
            }
        }

        if (command.WalletAddress is not null)
        {
            try
            {
                project.SetWalletAddress(command.WalletAddress);
            }
            catch (ArgumentException ex)
            {
                throw new ApplicationException(ex.Message, ex);
            }
        }

        try
        {
            await _projectRepository.UpdateAsync(project, ct);
        }
        catch (Exception ex) when (ex.Message.Contains("wallet_address"))
        {
            throw new ApplicationException("Wallet address is already in use by another project", ex);
        }

        return new UpdateProjectResponse(
            Id: project.Id,
            Title: project.Title,
            Description: project.Description,
            TargetAmount: project.TargetAmount,
            CollectedAmount: project.CollectedAmount,
            Status: project.Status.ToString(),
            CreatedAt: project.CreatedAt,
            WalletAddress: project.WalletAddress
        );
    }
}