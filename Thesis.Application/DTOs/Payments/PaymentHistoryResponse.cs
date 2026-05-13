namespace Thesis.Application.DTOs.Payments;

public record PaymentHistoryResponse(
    Guid Id,
    decimal Amount,
    string Currency,
    string TxHash,
    string Status,
    DateTime CreatedAt,
    string EtherscanUrl,
    Guid? UserId
)
{
    private const string SepoliaEtherscanBaseUrl = "https://sepolia.etherscan.io/tx/";

    public static string GetEtherscanUrl(string txHash)
    {
        if (string.IsNullOrWhiteSpace(txHash))
            throw new ArgumentException("Transaction hash cannot be empty", nameof(txHash));

        return $"{SepoliaEtherscanBaseUrl}{txHash}";
    }

    public static PaymentHistoryResponse FromPayment(Domain.Entities.Payment payment)
    {
        return new PaymentHistoryResponse(
            payment.Id,
            payment.Amount,
            payment.Currency,
            payment.TxHash,
            payment.Status,
            payment.CreatedAt,
            GetEtherscanUrl(payment.TxHash),
            payment.UserId
        );
    }
}
