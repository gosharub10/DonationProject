namespace Thesis.Application.DTOs.User;

public record GetUserResponse(
    Guid Id, 
    string Email, 
    string Name, 
    string Role,
    DateOnly CreatedAt
);