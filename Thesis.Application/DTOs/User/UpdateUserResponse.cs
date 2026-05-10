using Thesis.Domain.Enums;

namespace Thesis.Application.DTOs.User;

public record UpdateUserResponse(
    Guid Id,
    string Name,
    string Email,
    string Role
);