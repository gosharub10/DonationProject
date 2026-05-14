using Thesis.Application.Common;
using Thesis.Domain.Enums;
using Thesis.Domain.Interfaces;

namespace Thesis.Application.Projects.Finance.ActivateProject;

public sealed class ActivateProjectCommandHandler : ICommandHandler<ActivateProjectCommand, Unit>
{
    private readonly IProjectRepository _projectRepository;

    public ActivateProjectCommandHandler(IProjectRepository projectRepository)
    {
        _projectRepository = projectRepository;
    }

    public async Task<Unit> HandleAsync(ActivateProjectCommand command, CancellationToken ct)
    {
        var project = await _projectRepository.GetByIdAsync(command.ProjectId, ct);
        if (project is null) throw new ArgumentNullException(nameof(project));

        if (project.TargetAmount <= 0) throw new ApplicationException("Target amount must be set before activation");
        if (string.IsNullOrWhiteSpace(project.WalletAddress)) throw new ApplicationException("Wallet address must be set before activation");

        project.Activate();
        await _projectRepository.UpdateAsync(project, ct);

        return new Unit();
    }
}
