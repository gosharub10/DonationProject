using Thesis.Domain.Entities;

namespace Thesis.Domain.Interfaces;

public interface IWalletRepository
{
    Task<Wallet?> GetByUserIdAsync(Guid userId, CancellationToken ct);
    Task<Wallet?> GetByWalletAddressAsync(string walletAddress, CancellationToken ct);
    Task AddAsync(Wallet wallet, CancellationToken ct);
    Task UpdateAsync(Wallet wallet, CancellationToken ct);
    Task DeleteAsync(Guid walletId, CancellationToken ct);
}
