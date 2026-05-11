using Thesis.Application.Common;

namespace Thesis.Application.Projects.Images.Delete;

public sealed record DeleteProjectImageCommand(
    Guid ProjectId,
    string ImageUrl
) : ICommand<Unit>;
