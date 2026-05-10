using Thesis.Application.Common;
using Thesis.Application.DTOs.Wallet;

namespace Thesis.Application.Wallets.GetMyWallet;

public record GetMyWalletQuery(Guid UserId) : IQuery<GetWalletResponse>;
