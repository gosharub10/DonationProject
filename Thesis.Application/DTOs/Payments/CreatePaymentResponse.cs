namespace Thesis.Application.DTOs.Payments;

public record CreatePaymentResponse(
    Guid Id,
    Guid ProjectId,
    decimal Amount,
    string Currency,
    string TxHash,
    string Status,
    DateTime CreatedAt
);
