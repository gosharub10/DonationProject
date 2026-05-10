using Thesis.Application.Common;
using Thesis.Application.DTOs.Project;
using Thesis.Domain.Interfaces;

namespace Thesis.Application.Projects.GetAll;

public class GetAllProjectsQueryHandler : IQueryHandler<GetAllProjectsQuery, IEnumerable<GetProjectResponse>>
{
    private readonly IProjectRepository _projectRepository;

    public GetAllProjectsQueryHandler(IProjectRepository projectRepository)
    {
        _projectRepository = projectRepository;
    }
    
    public async Task<IEnumerable<GetProjectResponse>> HandleAsync(GetAllProjectsQuery query, CancellationToken ct)
    {
        var users = await _projectRepository.GetAllAsync(ct);

        return users.Select(project => new GetProjectResponse(
            Id: project.Id,
            Title: project.Title,
            Description: project.Description,
            TargetAmount: project.TargetAmount,
            CollectedAmount: project.CollectedAmount,
            Status: project.Status.ToString(),
            CreatedAt: project.CreatedAt,
            WalletAddress: project.WalletAddress
        )).ToList();
    }
}