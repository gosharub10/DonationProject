using Microsoft.Extensions.Logging;
using Thesis.Application.Common;
using Thesis.Application.Interfaces;
using Thesis.Domain.Interfaces;

namespace Thesis.Application.Projects.Images.Delete;

public sealed class DeleteProjectImageCommandHandler : ICommandHandler<DeleteProjectImageCommand, Unit>
{
    private readonly IImageService _imageService;
    private readonly IProjectRepository _projectRepository;
    private readonly ILogger<DeleteProjectImageCommandHandler> _logger;

    public DeleteProjectImageCommandHandler(
        IImageService imageService,
        IProjectRepository projectRepository,
        ILogger<DeleteProjectImageCommandHandler> logger)
    {
        _imageService = imageService ?? throw new ArgumentNullException(nameof(imageService));
        _projectRepository = projectRepository ?? throw new ArgumentNullException(nameof(projectRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<Unit> HandleAsync(
        DeleteProjectImageCommand command,
        CancellationToken cancellationToken)
    {
        try
        {
            // Validate project exists
            var project = await _projectRepository.GetByIdAsync(command.ProjectId, cancellationToken);
            if (project is null)
            {
                throw new ApplicationException($"Project with id {command.ProjectId} not found.");
            }

            // Extract filename from URL
            var fileName = ExtractFileNameFromUrl(command.ImageUrl);

            // Delete from MinIO
            await _imageService.DeleteImageAsync(
                command.ProjectId,
                fileName,
                cancellationToken);

            // Remove URL from project
            project.RemovePhotoUrl(command.ImageUrl);

            // Update project in database
            await _projectRepository.UpdateAsync(project, cancellationToken);

            _logger.LogInformation($"Image deleted successfully for project {command.ProjectId}: {fileName}");

            return new Unit();
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error deleting image: {ex.Message}");
            throw;
        }
    }

    private static string ExtractFileNameFromUrl(string imageUrl)
    {
        // Extract file name from presigned URL
        // Format: /project-images/{projectId}/filename
        var parts = imageUrl.Split('/');
        return parts.Length > 0 ? parts[^1].Split('?')[0] : imageUrl;
    }
}
