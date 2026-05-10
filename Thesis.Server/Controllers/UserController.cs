using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Thesis.Application.Common;
using Thesis.Application.DTOs.User;
using Thesis.Application.Users.Delete;
using Thesis.Application.Users.GetAll;
using Thesis.Application.Users.GetById;
using Thesis.Application.Users.Update;

namespace Thesis.Server.Controllers;

[Route("api/users")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IQueryHandler<GetAllUsersQuery, IEnumerable<GetUserResponse>> _getAllUsersQueryHandler;
    private readonly IQueryHandler<GetUserByIdQuery, GetUserResponse> _getUserByIdQueryHandler;
    private readonly ICommandHandler<UpdateUserCommand, UpdateUserResponse> _updateUserCommandHandler;
    private readonly ICommandHandler<DeleteUserCommand, Unit> _deleteUserCommandHandler;

    public UserController(
        IQueryHandler<GetAllUsersQuery, IEnumerable<GetUserResponse>> getAllUsersQueryHandler,
        IQueryHandler<GetUserByIdQuery, GetUserResponse> getUserByIdQueryHandler, 
        ICommandHandler<UpdateUserCommand, UpdateUserResponse> updateUserCommandHandler, ICommandHandler<DeleteUserCommand, Unit> deleteUserCommandHandler)
    {
        _getAllUsersQueryHandler = getAllUsersQueryHandler;
        _getUserByIdQueryHandler = getUserByIdQueryHandler;
        _updateUserCommandHandler = updateUserCommandHandler;
        _deleteUserCommandHandler = deleteUserCommandHandler;
    }
    
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var result = await _getAllUsersQueryHandler.HandleAsync(new GetAllUsersQuery(),ct);
        
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await _getUserByIdQueryHandler.HandleAsync(new GetUserByIdQuery(id), ct);
        
        return Ok(result);
    }

    [HttpPut]
    public async Task<IActionResult> Update([FromBody] UpdateUserCommand command, CancellationToken ct)
    {
        var result = await _updateUserCommandHandler.HandleAsync(command, ct);
        
        return Ok(result);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await _deleteUserCommandHandler.HandleAsync(new DeleteUserCommand(id), ct);
        
        return Ok();
    }
}