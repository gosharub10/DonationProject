using Thesis.Application.Common;
using Thesis.Domain.Interfaces;
using Thesis.Domain.Enums;

namespace Thesis.Application.Projects.Finance.Queries.GetFinanceDashboard;

public sealed class GetFinanceDashboardQueryHandler : IQueryHandler<GetFinanceDashboardQuery, FinanceDashboardResponse>
{
    private readonly IPaymentRepository _paymentRepository;
    private readonly IProjectRepository _projectRepository;

    public GetFinanceDashboardQueryHandler(IPaymentRepository paymentRepository, IProjectRepository projectRepository)
    {
        _paymentRepository = paymentRepository;
        _projectRepository = projectRepository;
    }

    public async Task<FinanceDashboardResponse> HandleAsync(GetFinanceDashboardQuery request, CancellationToken ct)
    {
        var payments = (await _paymentRepository.GetAllPaymentsAsync(ct)).ToList();

        if (request.From.HasValue)
        {
            payments = payments.Where(payment => payment.CreatedAt >= request.From.Value).ToList();
        }

        if (request.To.HasValue)
        {
            payments = payments.Where(payment => payment.CreatedAt <= request.To.Value).ToList();
        }

        var activeProjects = (await _projectRepository.GetAllAsync(ct))
            .Count(project => project.Status == ProjectStatus.Active);

        var completedProjects = (await _projectRepository.GetAllAsync(ct))
            .Count(project => project.Status == ProjectStatus.Completed);

        var totalTransactions = payments.Count;
        var totalDonations = payments.Count;
        var totalConfirmed = payments
            .Where(payment => payment.Status.Equals("confirmed", StringComparison.OrdinalIgnoreCase))
            .Sum(payment => payment.Amount);

        var failedTransactions = payments
            .Count(payment => payment.Status.Equals("failed", StringComparison.OrdinalIgnoreCase));

        var pendingTransactions = payments
            .Count(payment => payment.Status.Equals("pending", StringComparison.OrdinalIgnoreCase));

        return new FinanceDashboardResponse(
            TotalDonations: totalDonations,
            TotalConfirmedEth: totalConfirmed,
            TotalTransactions: totalTransactions,
            ActiveProjects: activeProjects,
            CompletedProjects: completedProjects,
            FailedTransactions: failedTransactions,
            PendingTransactions: pendingTransactions
        );
    }
}
