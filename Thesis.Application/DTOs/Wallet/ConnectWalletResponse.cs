namespace Thesis.Application.DTOs.Wallet;

public record ConnectWalletResponse(Guid Id, string WalletAddress, DateOnly CreatedAt);
