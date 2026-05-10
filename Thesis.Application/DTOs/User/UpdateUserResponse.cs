namespace Thesis.Application.DTOs.User;

public record UpdateUserResponse(
    Guid Id,
    string Name,
    string Email,
    string Role
);