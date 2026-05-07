using Thesis.Application.Common;
using Thesis.Application.DTOs.User;
using Thesis.Application.Interfaces;
using Thesis.Domain.Interfaces;

namespace Thesis.Application.Users.Login;

public class LoginUserCommandHandler : ICommandHandler<LoginUserCommand, LoginUserResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;

    public LoginUserCommandHandler(
        IUserRepository userRepository, 
        IPasswordHasher passwordHasher,
        ITokenService tokenService)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
    }
    
    public async Task<LoginUserResponse> HandleAsync(LoginUserCommand command, CancellationToken ct)
    {
        var user = await _userRepository.GetByEmailAsync(command.Email, ct);
        
        var isValid = user != null && _passwordHasher.VerifyPassword(command.Password, user.PasswordHash);

        if (!isValid)
        {
            throw new ArgumentNullException("Проверьте пароль и логин");
        }
        
        var token = _tokenService.GenerateToken(user!);

        return new LoginUserResponse(
            Token: token,
            Expires: _tokenService.GetTokenExpiration()
        );
    }
}