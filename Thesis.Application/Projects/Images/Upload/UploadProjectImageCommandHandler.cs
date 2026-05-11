using Microsoft.Extensions.Logging;
using Thesis.Application.Common;
using Thesis.Application.Interfaces;
using Thesis.Domain.Interfaces;

namespace Thesis.Application.Projects.Images.Upload;

public sealed class UploadProjectImageCommandHandler : ICommandHandler<UploadProjectImageCommand, UploadProjectImageResponse>
{
    private readonly IImageService _imageService;
    private readonly IProjectRepository _projectRepository;
    private readonly ILogger<UploadProjectImageCommandHandler> _logger;

    // Allowed file types
    private static readonly HashSet<string> AllowedContentTypes = new()
    {
        "image/jpeg",
        "image/png",
        "image/webp"
    };

    // Max file size: 5 MB
    private const long MaxFileSize = 5 * 1024 * 1024;

    public UploadProjectImageCommandHandler(
        IImageService imageService,
        IProjectRepository projectRepository,
        ILogger<UploadProjectImageCommandHandler> logger)
    {
        _imageService = imageService ?? throw new ArgumentNullException(nameof(imageService));
        _projectRepository = projectRepository ?? throw new ArgumentNullException(nameof(projectRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<UploadProjectImageResponse> HandleAsync(
        UploadProjectImageCommand command,
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

            // Validate file type
            if (!AllowedContentTypes.Contains(command.ContentType))
            {
                throw new ApplicationException("Invalid file type. Only jpg, png, and webp are allowed.");
            }

            // Validate file size
            if (command.FileStream.Length > MaxFileSize)
            {
                throw new ApplicationException("File size exceeds 5 MB limit.");
            }

            // Reset stream position to beginning
            command.FileStream.Position = 0;

            // Upload to MinIO
            var imageUrl = await _imageService.UploadImageAsync(
                command.ProjectId,
                command.FileName,
                command.FileStream,
                command.ContentType,
                cancellationToken);

            // Add URL to project
            project.AddPhotoUrl(imageUrl);

            // Update project in database
            await _projectRepository.UpdateAsync(project, cancellationToken);

            _logger.LogInformation($"Image uploaded successfully for project {command.ProjectId}: {command.FileName}");

            return new UploadProjectImageResponse(imageUrl);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error uploading image: {ex.Message}");
            throw;
        }
    }
}
