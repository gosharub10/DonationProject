using Thesis.Application.Common;
using Thesis.Application.DTOs.Wallet;
using Thesis.Domain.Entities;
using Thesis.Domain.Interfaces;

namespace Thesis.Application.Wallets.Connect;

public sealed class ConnectWalletCommandHandler : ICommandHandler<ConnectWalletCommand, ConnectWalletResponse>
{
    private readonly IWalletRepository _walletRepository;

    public ConnectWalletCommandHandler(IWalletRepository walletRepository)
    {
        _walletRepository = walletRepository;
    }
    
    public async Task<ConnectWalletResponse> HandleAsync(ConnectWalletCommand command, CancellationToken ct)
    {
        // Validate wallet address format
        if (string.IsNullOrWhiteSpace(command.WalletAddress) || !command.WalletAddress.StartsWith("0x"))
        {
            throw new ApplicationException("Invalid wallet address format. Must start with 0x");
        }

        // Check if user already has a wallet
        var userWallet = await _walletRepository.GetByUserIdAsync(command.UserId, ct);
        if (userWallet is not null)
        {
            throw new ApplicationException("User already has a connected wallet.");
        }

        // Check if wallet already exists for another user
        var existingWallet = await _walletRepository.GetByWalletAddressAsync(command.WalletAddress, ct);
        if (existingWallet is not null)
        {
            throw new ApplicationException("This wallet address is already connected to another user.");
        }

        // Create new wallet
        var walletId = Guid.NewGuid();
        var createdAt = DateOnly.FromDateTime(DateTime.UtcNow);
        
        var newWallet = new Wallet(walletId, command.UserId, command.WalletAddress, createdAt);
        await _walletRepository.AddAsync(newWallet, ct);
        
        return new ConnectWalletResponse(newWallet.Id, newWallet.WalletAddress, newWallet.CreatedAt);
    }
}
