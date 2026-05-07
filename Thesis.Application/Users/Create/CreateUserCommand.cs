using Thesis.Application.Common;
using Thesis.Application.DTOs.User;
using Thesis.Domain.Enums;

namespace Thesis.Application.Users.Create;

public sealed record CreateUserCommand(
    string Name,
    string Email,
    string Password
) : ICommand<CreateUserResponse>;