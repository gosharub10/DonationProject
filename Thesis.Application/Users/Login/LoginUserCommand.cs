using Thesis.Application.Common;
using Thesis.Application.DTOs.User;

namespace Thesis.Application.Users.Login;

public record LoginUserCommand(
    string Email,
    string Password
) : ICommand<LoginUserResponse>;