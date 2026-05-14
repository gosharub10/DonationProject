using Thesis.Application.Common;

namespace Thesis.Application.Projects.Finance.SetProjectTarget;

public sealed record SetProjectTargetAmountCommand(Guid ProjectId, decimal TargetAmount) : ICommand<Unit>;
