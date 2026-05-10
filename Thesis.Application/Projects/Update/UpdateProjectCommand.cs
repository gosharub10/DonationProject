using Thesis.Application.Common;
using Thesis.Application.DTOs.Project;

namespace Thesis.Application.Projects.Update;

public sealed record UpdateProjectCommand(
    Guid Id,
    string? Title = null,
    string? Description = null,
    decimal? TargetAmount = null,
    string? Status = null,
    string? WalletAddress = null
) : ICommand<UpdateProjectResponse>;