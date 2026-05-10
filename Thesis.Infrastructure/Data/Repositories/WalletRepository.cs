using Microsoft.EntityFrameworkCore;
using Thesis.Domain.Entities;
using Thesis.Domain.Interfaces;

namespace Thesis.Infrastructure.Data.Repositories;

public class WalletRepository : IWalletRepository
{
    private readonly AppDbContext _context;

    public WalletRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Wallet?> GetByUserIdAsync(Guid userId, CancellationToken ct)
    {
        return await _context.Wallets
            .FirstOrDefaultAsync(w => w.UserId == userId, ct);
    }

    public async Task<Wallet?> GetByWalletAddressAsync(string walletAddress, CancellationToken ct)
    {
        return await _context.Wallets
            .FirstOrDefaultAsync(w => w.WalletAddress == walletAddress, ct);
    }

    public async Task AddAsync(Wallet wallet, CancellationToken ct)
    {
        await _context.Wallets.AddAsync(wallet, ct);
        await _context.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(Wallet wallet, CancellationToken ct)
    {
        _context.Wallets.Update(wallet);
        await _context.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Guid walletId, CancellationToken ct)
    {
        var wallet = await _context.Wallets.FindAsync(new object[] { walletId }, cancellationToken: ct);
        if (wallet is not null)
        {
            _context.Wallets.Remove(wallet);
            await _context.SaveChangesAsync(ct);
        }
    }
}
