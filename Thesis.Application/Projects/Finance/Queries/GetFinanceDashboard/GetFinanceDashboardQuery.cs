using Thesis.Application.Common;

namespace Thesis.Application.Projects.Finance.Queries.GetFinanceDashboard;

public sealed record GetFinanceDashboardQuery(DateTime? From = null, DateTime? To = null) : IQuery<FinanceDashboardResponse>;

public sealed record FinanceDashboardResponse(
    int TotalDonations,
    decimal TotalConfirmedEth,
    int TotalTransactions,
    int ActiveProjects,
    int CompletedProjects,
    int FailedTransactions,
    int PendingTransactions
);
