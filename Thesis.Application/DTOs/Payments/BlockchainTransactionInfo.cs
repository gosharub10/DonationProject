namespace Thesis.Application.DTOs.Payments;

/// <summary>
/// DTO for blockchain transaction status information from Etherscan API
/// </summary>
public record BlockchainTransactionInfo(
    string TxHash,
    bool IsConfirmed,
    int Confirmations,
    int? BlockNumber,
    string? Status, // "success" or "failed" or null if pending
    DateTime? BlockTimestamp,
    string? ErrorMessage
);
