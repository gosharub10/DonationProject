namespace Thesis.Application.DTOs.Project;

public record UpdateProjectResponse(
    Guid Id,
    string Title,
    string Description,
    decimal TargetAmount,
    decimal CollectedAmount,
    string Status,
    DateOnly CreatedAt,
    string WalletAddress,
    ICollection<string> PhotoUrls
);