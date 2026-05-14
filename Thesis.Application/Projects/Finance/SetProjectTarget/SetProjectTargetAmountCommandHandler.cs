using Thesis.Application.Common;
using Thesis.Domain.Interfaces;

namespace Thesis.Application.Projects.Finance.SetProjectTarget;

public sealed class SetProjectTargetAmountCommandHandler : ICommandHandler<SetProjectTargetAmountCommand, Unit>
{
    private readonly IProjectRepository _projectRepository;

    public SetProjectTargetAmountCommandHandler(IProjectRepository projectRepository)
    {
        _projectRepository = projectRepository;
    }

    public async Task<Unit> HandleAsync(SetProjectTargetAmountCommand command, CancellationToken ct)
    {
        if (command.TargetAmount <= 0) throw new ApplicationException("Target amount must be greater than zero");

        var project = await _projectRepository.GetByIdAsync(command.ProjectId, ct);
        if (project is null) throw new ArgumentNullException(nameof(project));

        project.SetTargetAmount(command.TargetAmount);
        await _projectRepository.UpdateAsync(project, ct);

        return new Unit();
    }
}
