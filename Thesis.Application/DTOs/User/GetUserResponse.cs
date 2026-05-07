using Thesis.Domain.Enums;

namespace Thesis.Application.DTOs.User;

public record GetUserResponse(
    Guid Id, 
    string Email, 
    string Name, 
    Role Role,
    DateOnly CreatedAt
);