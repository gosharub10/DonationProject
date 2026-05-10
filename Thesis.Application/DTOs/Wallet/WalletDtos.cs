using Thesis.Application.Common;

namespace Thesis.Application.DTOs.Wallet;

public record ConnectWalletCommand(
    Guid UserId,
    string WalletAddress
) : ICommand<ConnectWalletResponse>;

public record ConnectWalletResponse(Guid Id, string WalletAddress, DateOnly CreatedAt);

public record GetWalletResponse(Guid Id, string WalletAddress, DateOnly CreatedAt);
