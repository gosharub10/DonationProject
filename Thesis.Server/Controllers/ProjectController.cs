using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Thesis.Application.Common;
using Thesis.Application.DTOs.Project;
using Thesis.Application.Projects.Create;
using Thesis.Application.Projects.Delete;
using Thesis.Application.Projects.GetAll;
using Thesis.Application.Projects.GetById;
using Thesis.Application.Projects.Update;

namespace Thesis.Server.Controllers;

[ApiController]
[Route("api/projects")]
public class ProjectController : ControllerBase
{
    private readonly ICommandHandler<CreateProjectCommand, CreateProjectResponse> _createProjectCommandHandler;
    private readonly IQueryHandler<GetAllProjectsQuery, IEnumerable<GetProjectResponse>> _getProjectsQueryHandler;
    private readonly IQueryHandler<GetProjectByIdQuery, GetProjectResponse> _getProjectByIdQueryHandler;
    private readonly ICommandHandler<UpdateProjectCommand, UpdateProjectResponse> _updateProjectCommandHandler;
    private readonly ICommandHandler<DeleteProjectCommand, Unit> _deleteProjectCommandHandler;

    public ProjectController(
        ICommandHandler<CreateProjectCommand, CreateProjectResponse> createProjectCommandHandler,
        IQueryHandler<GetAllProjectsQuery, IEnumerable<GetProjectResponse>> getProjectsQueryHandler,
        IQueryHandler<GetProjectByIdQuery, GetProjectResponse> getProjectByIdQueryHandler,
        ICommandHandler<UpdateProjectCommand, UpdateProjectResponse> updateProjectCommandHandler,
        ICommandHandler<DeleteProjectCommand, Unit> deleteProjectCommandHandler)
    {
        _createProjectCommandHandler = createProjectCommandHandler;
        _getProjectsQueryHandler = getProjectsQueryHandler;
        _getProjectByIdQueryHandler = getProjectByIdQueryHandler;
        _updateProjectCommandHandler = updateProjectCommandHandler;
        _deleteProjectCommandHandler = deleteProjectCommandHandler;
    }
    
    [Authorize(Policy = "AdminOnly")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProjectCommand command, CancellationToken ct)
    {
        var result = await _createProjectCommandHandler.HandleAsync(command, ct);
        
        return Ok(result);
    }
    
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var result = await _getProjectsQueryHandler.HandleAsync(new GetAllProjectsQuery(), ct);
        
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await _getProjectByIdQueryHandler.HandleAsync(new GetProjectByIdQuery(id), ct);
        
        return Ok(result);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpPut]
    public async Task<IActionResult> Update([FromBody] UpdateProjectCommand command, CancellationToken ct)
    {
        var result = await _updateProjectCommandHandler.HandleAsync(command, ct);
        
        return Ok(result);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await _deleteProjectCommandHandler.HandleAsync(new DeleteProjectCommand(id), ct);
        
        return Ok();
    }
}