using Thesis.Application.Common;
using Thesis.Domain.Interfaces;
using Thesis.Application.DTOs.Payments;

namespace Thesis.Application.Projects.Finance.Queries.GetTransactions;

public sealed class GetFinanceTransactionsQueryHandler : IQueryHandler<GetFinanceTransactionsQuery, IEnumerable<PaymentHistoryResponse>>
{
    private readonly IPaymentRepository _paymentRepository;

    public GetFinanceTransactionsQueryHandler(IPaymentRepository paymentRepository)
    {
        _paymentRepository = paymentRepository;
    }

    public async Task<IEnumerable<PaymentHistoryResponse>> HandleAsync(GetFinanceTransactionsQuery request, CancellationToken ct)
    {
        IEnumerable<Domain.Entities.Payment> payments;

        if (request.ProjectId.HasValue)
        {
            payments = await _paymentRepository.GetByProjectIdAsync(request.ProjectId.Value, ct);
        }
        else
        {
            payments = await _paymentRepository.GetAllPaymentsAsync(ct);
        }

        // apply simple time filter
        if (request.From.HasValue)
            payments = payments.Where(p => p.CreatedAt >= request.From.Value);
        if (request.To.HasValue)
            payments = payments.Where(p => p.CreatedAt <= request.To.Value);

        return payments.Select(PaymentHistoryResponse.FromPayment);
    }
}
