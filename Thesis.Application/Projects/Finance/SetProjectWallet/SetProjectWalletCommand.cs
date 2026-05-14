using Thesis.Application.Common;

namespace Thesis.Application.Projects.Finance.SetProjectWallet;

public sealed record SetProjectWalletCommand(Guid ProjectId, string WalletAddress) : ICommand<Unit>;
