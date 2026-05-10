using Thesis.Application.Common;
using Thesis.Application.DTOs.Wallet;
using Thesis.Domain.Interfaces;

namespace Thesis.Application.Wallets.GetMyWallet;

public class GetMyWalletQueryHandler : IQueryHandler<GetMyWalletQuery, GetWalletResponse>
{
    private readonly IWalletRepository _walletRepository;

    public GetMyWalletQueryHandler(IWalletRepository walletRepository)
    {
        _walletRepository = walletRepository;
    }
    
    public async Task<GetWalletResponse> HandleAsync(GetMyWalletQuery query, CancellationToken ct)
    {
        var wallet = await _walletRepository.GetByUserIdAsync(query.UserId, ct);

        if (wallet is null)
        {
            throw new ApplicationException("Wallet not found for this user.");
        }

        return new GetWalletResponse(
            Id: wallet.Id,
            WalletAddress: wallet.WalletAddress,
            CreatedAt: wallet.CreatedAt
        );
    }
}
