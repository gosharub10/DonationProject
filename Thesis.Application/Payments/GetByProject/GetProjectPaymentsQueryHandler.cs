using Thesis.Application.Common;
using Thesis.Application.DTOs.Payments;
using Thesis.Domain.Interfaces;

namespace Thesis.Application.Payments.GetByProject;

public sealed class GetProjectPaymentsQueryHandler : IQueryHandler<GetProjectPaymentsQuery, IEnumerable<PaymentHistoryResponse>>
{
    private readonly IPaymentRepository _paymentRepository;
    private readonly IProjectRepository _projectRepository;

    public GetProjectPaymentsQueryHandler(
        IPaymentRepository paymentRepository,
        IProjectRepository projectRepository)
    {
        _paymentRepository = paymentRepository;
        _projectRepository = projectRepository;
    }

    public async Task<IEnumerable<PaymentHistoryResponse>> HandleAsync(GetProjectPaymentsQuery query, CancellationToken ct)
    {
        // Validate project exists
        var project = await _projectRepository.GetByIdAsync(query.ProjectId, ct);
        if (project is null)
            throw new ApplicationException($"Project with ID {query.ProjectId} not found");

        // Get payments for the project (already sorted by CreatedAt DESC from repository)
        var payments = await _paymentRepository.GetByProjectIdAsync(query.ProjectId, ct);

        // Map to response DTOs
        return payments.Select(PaymentHistoryResponse.FromPayment);
    }
}
