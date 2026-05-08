using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Thesis.Application.Common;
using Thesis.Application.DTOs.Project;
using Thesis.Application.Projects.GetAll;

namespace Thesis.Server.Controllers;

[ApiController]
[Route("api/projects")]
public class ProjectController : ControllerBase
{
    private readonly IQueryHandler<GetAllProjectsQuery, IEnumerable<GetProjectResponse>> _getProjectsQueryHandler;

    public ProjectController(
        IQueryHandler<GetAllProjectsQuery, IEnumerable<GetProjectResponse>> getProjectsQueryHandler)
    {
        _getProjectsQueryHandler = getProjectsQueryHandler;
    }
    
    [Authorize(Policy = "AdminOnly")]
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var result = await _getProjectsQueryHandler.HandleAsync(new GetAllProjectsQuery(), ct);
        
        return Ok(result);
    }
}