using Thesis.Application.Common;

namespace Thesis.Application.Projects.Delete;

public record DeleteProjectCommand(Guid Id) : ICommand<Unit>;