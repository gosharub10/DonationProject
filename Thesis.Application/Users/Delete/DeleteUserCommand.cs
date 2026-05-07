using Thesis.Application.Common;

namespace Thesis.Application.Users.Delete;

public record DeleteUserCommand(Guid Id) : ICommand<Unit>;