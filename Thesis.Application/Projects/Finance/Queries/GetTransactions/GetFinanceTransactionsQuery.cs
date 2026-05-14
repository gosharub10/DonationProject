using Thesis.Application.Common;
using Thesis.Application.DTOs.Payments;

namespace Thesis.Application.Projects.Finance.Queries.GetTransactions;

public sealed record GetFinanceTransactionsQuery(Guid? ProjectId = null, DateTime? From = null, DateTime? To = null) : IQuery<IEnumerable<PaymentHistoryResponse>>;
