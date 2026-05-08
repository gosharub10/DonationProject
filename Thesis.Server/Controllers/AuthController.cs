using Microsoft.AspNetCore.Mvc;
using Thesis.Application.Common;
using Thesis.Application.DTOs.User;
using Thesis.Application.Users.Create;
using Thesis.Application.Users.Login;

namespace Thesis.Server.Controllers;

[ApiController]
[Route("api")]
public class AuthController(
    ICommandHandler<CreateUserCommand, CreateUserResponse> createUserCommandHandler,
    ICommandHandler<LoginUserCommand, LoginUserResponse> loginUserCommandHandler)
    : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> RegisterAsync([FromBody] CreateUserCommand command,
        CancellationToken ct = default)
    {
        var result = await createUserCommandHandler.HandleAsync(command, ct);
        
        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> LoginAsync([FromBody] LoginUserCommand command, CancellationToken ct = default)
    {
        var result = await loginUserCommandHandler.HandleAsync(command, ct);
        
        return Ok(result);
    }
}