using Thesis.Application.Common;
using Thesis.Application.DTOs.Project;
using Thesis.Domain.Interfaces;

namespace Thesis.Application.Projects.GetById;

public class GetProjectByIdQueryHandler : IQueryHandler<GetProjectByIdQuery, GetProjectResponse>
{
    private readonly IProjectRepository _projectRepository;

    public GetProjectByIdQueryHandler(IProjectRepository projectRepository)
    {
        _projectRepository = projectRepository;
    }
    
    public async Task<GetProjectResponse> HandleAsync(GetProjectByIdQuery query, CancellationToken ct)
    {
        var project = await _projectRepository.GetByIdAsync(query.Id, ct);

        if (project is null)
        {
            throw new ApplicationException($"Project with id {query.Id} not found.");
        }

        return new GetProjectResponse(
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