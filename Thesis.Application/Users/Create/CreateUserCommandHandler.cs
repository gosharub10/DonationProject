using Thesis.Application.Common;
using Thesis.Application.DTOs.User;
using Thesis.Application.Interfaces;
using Thesis.Domain.Entities;
using Thesis.Domain.Interfaces;

namespace Thesis.Application.Users.Create;

public sealed class CreateUserCommandHandler : ICommandHandler<CreateUserCommand, CreateUserResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;

    public CreateUserCommandHandler(IUserRepository userRepository, IPasswordHasher passwordHasher)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
    }
    
    public async Task<CreateUserResponse> HandleAsync(CreateUserCommand command, CancellationToken ct)
    {
        var userId = Guid.NewGuid();
        var createdAt = DateOnly.FromDateTime(DateTime.UtcNow);
        var passwordHash = _passwordHasher.HashPassword(command.Password);
        
        var newUser = new User(userId, command.Name, command.Email, passwordHash, createdAt);

        await _userRepository.AddAsync(newUser, ct);
        
        return new CreateUserResponse(newUser.Id);
    }
}