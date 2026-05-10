using Thesis.Application.Common;
using Thesis.Domain.Interfaces;

namespace Thesis.Application.Projects.Delete;

public class DeleteProjectCommandHandler : ICommandHandler<DeleteProjectCommand, Unit>
{
    private readonly IProjectRepository _projectRepository;

    public DeleteProjectCommandHandler(IProjectRepository projectRepository)
    {
        _projectRepository = projectRepository;
    }
    
    public async Task<Unit> HandleAsync(DeleteProjectCommand command, CancellationToken ct)
    {
        var project = await _projectRepository.GetByIdAsync(command.Id, ct);
        if (project is null)
        {
            throw new ArgumentNullException(nameof(project));
        }

        await _projectRepository.DeleteAsync(command.Id, ct);

        return default;
    }
}