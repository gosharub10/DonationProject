namespace Thesis.Application.DTOs.User;

public record LoginUserResponse(
    string Token,
    DateTime Expires
);