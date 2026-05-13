using Thesis.Application.DTOs.Payments;

namespace Thesis.Application.Interfaces;

/// <summary>
/// Service for querying blockchain transaction status via external API
/// Abstraction allows swapping implementations (Etherscan, Alchemy, Infura, etc.)
/// </summary>
public interface IBlockchainTransactionService
{
    /// <summary>
    /// Retrieves transaction info from blockchain API (Etherscan, Alchemy, etc.)
    /// Returns transaction receipt status, confirmation count, block number
    /// </summary>
    Task<BlockchainTransactionInfo> GetTransactionStatusAsync(string txHash, CancellationToken ct = default);

    /// <summary>
    /// Gets the current block number for confirmation calculation
    /// Needed to calculate: confirmations = currentBlock - txBlockNumber
    /// </summary>
    Task<long> GetCurrentBlockNumberAsync(CancellationToken ct = default);

    /// <summary>
    /// Checks if transaction has sufficient confirmations for finality
    /// Default: 12 confirmations on testnet (safer on mainnet)
    /// </summary>
    Task<bool> HasSufficientConfirmationsAsync(string txHash, int requiredConfirmations = 12, CancellationToken ct = default);
}
