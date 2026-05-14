using Thesis.Application.Common;

namespace Thesis.Application.Projects.Finance.ActivateProject;

public sealed record ActivateProjectCommand(Guid ProjectId) : ICommand<Unit>;
