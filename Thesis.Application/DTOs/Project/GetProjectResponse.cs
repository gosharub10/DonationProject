using Thesis.Domain.Enums;

namespace Thesis.Application.DTOs.Project;

public record GetProjectResponse(
    Guid Id, 
    string Title, 
    string Description, 
    decimal TargetAmount, 
    decimal CollectedAmount, 
    string Status, 
    DateOnly CreatedAt
);