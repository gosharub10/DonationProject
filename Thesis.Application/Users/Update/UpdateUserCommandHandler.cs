using Thesis.Application.Common;
using Thesis.Application.DTOs.User;
using Thesis.Domain.Interfaces;

namespace Thesis.Application.Users.Update;

public class UpdateUserCommandHandler : ICommandHandler<UpdateUserCommand, UpdateUserResponse>
{
    private readonly IUserRepository _userRepository;
    
    public UpdateUserCommandHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }
    
    public async Task<UpdateUserResponse> HandleAsync(UpdateUserCommand command, CancellationToken ct)
    {
        var user = await _userRepository.GetByIdAsync(command.Id, ct);
        if (user is null)
        {
            throw new ArgumentNullException(nameof(user));
        }

        if (command.Name is not null)
        {
            user.SetName(command.Name);
        }

        if (command.Email is not null && command.Email != user.Email)
        {
            var existing = await _userRepository.GetByEmailAsync(command.Email, ct);
            if (existing is not null && existing.Id != command.Id)
            {
                throw new ArgumentException($"User with id {command.Id} has already been updated");
            }
        }

        if (command.Role != user.Role)
        {
            user.ChangeRole(command.Role.Value); 
        }

        await _userRepository.UpdateAsync(user, ct);

        return new UpdateUserResponse(
            Id: user.Id,
            Name: user.Name,
            Email: user.Email,
            Role: user.Role
        );
    }
}