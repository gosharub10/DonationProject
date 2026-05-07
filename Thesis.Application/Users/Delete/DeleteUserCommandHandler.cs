using Thesis.Application.Common;
using Thesis.Domain.Interfaces;

namespace Thesis.Application.Users.Delete;

public class DeleteUserCommandHandler : ICommandHandler<DeleteUserCommand, Unit>
{
    private readonly IUserRepository _userRepository;

    public DeleteUserCommandHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }
    
    public async Task<Unit> HandleAsync(DeleteUserCommand command, CancellationToken ct)
    {
        var user = await _userRepository.GetByIdAsync(command.Id, ct);
        if (user is null)
        {
            throw new ArgumentNullException(nameof(user));
        }

        await _userRepository.DeleteAsync(command.Id, ct);

        return default;
    }
}