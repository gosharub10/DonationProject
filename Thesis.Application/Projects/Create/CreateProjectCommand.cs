using Thesis.Application.Common;
using Thesis.Application.DTOs.Project;

namespace Thesis.Application.Projects.Create;

public sealed record CreateProjectCommand(
    string Title,
    string Description,
    decimal TargetAmount,
    string WalletAddress
) : ICommand<CreateProjectResponse>;