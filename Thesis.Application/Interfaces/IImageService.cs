namespace Thesis.Application.Interfaces;

public interface IImageService
{
    /// <summary>
    /// Uploads an image file to MinIO for a specific project
    /// </summary>
    /// <param name="projectId">The ID of the project</param>
    /// <param name="fileName">The file name to save as</param>
    /// <param name="fileStream">The file stream to upload</param>
    /// <param name="contentType">The MIME type of the file</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>The URL of the uploaded image</returns>
    Task<string> UploadImageAsync(Guid projectId, string fileName, Stream fileStream, string contentType, CancellationToken cancellationToken);

    /// <summary>
    /// Deletes an image from MinIO for a specific project
    /// </summary>
    /// <param name="projectId">The ID of the project</param>
    /// <param name="fileName">The file name to delete</param>
    /// <param name="cancellationToken">Cancellation token</param>
    Task DeleteImageAsync(Guid projectId, string fileName, CancellationToken cancellationToken);

    /// <summary>
    /// Gets all image URLs for a specific project
    /// </summary>
    /// <param name="projectId">The ID of the project</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of image URLs</returns>
    Task<IEnumerable<string>> GetProjectImagesAsync(Guid projectId, CancellationToken cancellationToken);

    /// <summary>
    /// Generates a presigned URL for accessing an image
    /// </summary>
    /// <param name="projectId">The ID of the project</param>
    /// <param name="fileName">The file name</param>
    /// <param name="expirationSeconds">Expiration time in seconds (default 7 days)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Presigned URL</returns>
    Task<string> GetPresignedUrlAsync(Guid projectId, string fileName, int expirationSeconds = 604800, CancellationToken cancellationToken = default);
}
