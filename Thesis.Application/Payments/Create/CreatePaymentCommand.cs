using Thesis.Application.Common;
using Thesis.Application.DTOs.Payments;

namespace Thesis.Application.Payments.Create;

public sealed record CreatePaymentCommand(
    Guid ProjectId,
    decimal Amount,
    string Currency,
    string TxHash,
    string Status
) : ICommand<CreatePaymentResponse>;
