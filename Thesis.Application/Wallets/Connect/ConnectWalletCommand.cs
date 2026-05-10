using Thesis.Application.Common;
using Thesis.Application.DTOs.Wallet;

namespace Thesis.Application.Wallets.Connect;

public record ConnectWalletCommand(
    Guid UserId,
    string WalletAddress
) : ICommand<ConnectWalletResponse>;