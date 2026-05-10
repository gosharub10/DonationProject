using Thesis.Application.Common;
using Thesis.Application.DTOs.User;
using Thesis.Domain.Enums;

namespace Thesis.Application.Users.Update;

public record UpdateUserCommand(
    Guid Id,
    string? Name = null,
    string? Email = null,
    string? Role = null
) : ICommand<UpdateUserResponse>;