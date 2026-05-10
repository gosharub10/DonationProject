namespace Thesis.Application.DTOs.Wallet;

public record GetWalletResponse(Guid Id, string WalletAddress, DateOnly CreatedAt);
