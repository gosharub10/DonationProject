using Thesis.Application.Common;
using Thesis.Application.DTOs.Payments;

namespace Thesis.Application.Payments.GetByProject;

public sealed record GetProjectPaymentsQuery(
    Guid ProjectId
) : IQuery<IEnumerable<PaymentHistoryResponse>>;
