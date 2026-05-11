using Thesis.Application.Common;

namespace Thesis.Application.Projects.Images.Upload;

public sealed record UploadProjectImageCommand(
    Guid ProjectId,
    string FileName,
    Stream FileStream,
    string ContentType
) : ICommand<UploadProjectImageResponse>;
