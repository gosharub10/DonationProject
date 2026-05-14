using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Thesis.Application.Common;
using Thesis.Application.DTOs.Project;
using Thesis.Application.Projects.Create;
using Thesis.Application.Projects.Delete;
using Thesis.Application.Projects.GetAll;
using Thesis.Application.Projects.GetById;
using Thesis.Application.Projects.Images.Delete;
using Thesis.Application.Projects.Images.Upload;
using Thesis.Application.Projects.Update;
using Thesis.Server.Extensions;

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
    private readonly ICommandHandler<UploadProjectImageCommand, UploadProjectImageResponse> _uploadImageCommandHandler;
    private readonly ICommandHandler<DeleteProjectImageCommand, Unit> _deleteImageCommandHandler;

    public ProjectController(
        ICommandHandler<CreateProjectCommand, CreateProjectResponse> createProjectCommandHandler,
        IQueryHandler<GetAllProjectsQuery, IEnumerable<GetProjectResponse>> getProjectsQueryHandler,
        IQueryHandler<GetProjectByIdQuery, GetProjectResponse> getProjectByIdQueryHandler,
        ICommandHandler<UpdateProjectCommand, UpdateProjectResponse> updateProjectCommandHandler,
        ICommandHandler<DeleteProjectCommand, Unit> deleteProjectCommandHandler,
        ICommandHandler<UploadProjectImageCommand, UploadProjectImageResponse> uploadImageCommandHandler,
        ICommandHandler<DeleteProjectImageCommand, Unit> deleteImageCommandHandler)
    {
        _createProjectCommandHandler = createProjectCommandHandler;
        _getProjectsQueryHandler = getProjectsQueryHandler;
        _getProjectByIdQueryHandler = getProjectByIdQueryHandler;
        _updateProjectCommandHandler = updateProjectCommandHandler;
        _deleteProjectCommandHandler = deleteProjectCommandHandler;
        _uploadImageCommandHandler = uploadImageCommandHandler;
        _deleteImageCommandHandler = deleteImageCommandHandler;
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
        // Admins are not allowed to change financial fields (wallet, target)
        var safeCommand = command;
        if (this.IsAdmin())
        {
            safeCommand = command with { TargetAmount = null, WalletAddress = null };
        }

        var result = await _updateProjectCommandHandler.HandleAsync(safeCommand, ct);
        
        return Ok(result);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await _deleteProjectCommandHandler.HandleAsync(new DeleteProjectCommand(id), ct);
        
        return Ok();
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpPost("{projectId:guid}/images")]
    public async Task<IActionResult> UploadImage(Guid projectId, IFormFile file, CancellationToken ct)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file provided");

        // Validate file
        var allowedContentTypes = new[] { "image/jpeg", "image/png", "image/webp" };
        if (!allowedContentTypes.Contains(file.ContentType))
            return BadRequest("Invalid file type. Only jpg, png, and webp are allowed.");

        const long maxFileSize = 5 * 1024 * 1024; // 5 MB
        if (file.Length > maxFileSize)
            return BadRequest("File size exceeds 5 MB limit.");

        try
        {
            using var stream = file.OpenReadStream();
            var command = new UploadProjectImageCommand(
                projectId,
                file.FileName,
                stream,
                file.ContentType
            );

            var result = await _uploadImageCommandHandler.HandleAsync(command, ct);
            return Ok(result);
        }
        catch (ApplicationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpDelete("{projectId:guid}/images")]
    public async Task<IActionResult> DeleteImage(Guid projectId, [FromQuery] string imageUrl, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(imageUrl))
            return BadRequest("Image URL is required");

        try
        {
            var command = new DeleteProjectImageCommand(projectId, imageUrl);
            await _deleteImageCommandHandler.HandleAsync(command, ct);
            return Ok();
        }
        catch (ApplicationException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}