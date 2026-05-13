using Thesis.Domain.Entities;
using Thesis.Domain.Support;

namespace Thesis.Domain.Interfaces;

public interface IPaymentRepository
{
    Task<Payment?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<Payment?> GetByTxHashAsync(string txHash, CancellationToken ct = default);
    Task<IEnumerable<Payment>> GetByProjectIdAsync(Guid projectId, CancellationToken ct = default);
    Task<IEnumerable<Payment>> GetByUserIdAsync(Guid userId, CancellationToken ct = default);
    
    /// <summary>
    /// Gets all payments with pending status for background service processing
    /// Ordered by CreatedAt ascending (process oldest first)
    /// </summary>
    Task<List<Payment>> GetPendingPaymentsAsync(CancellationToken ct = default);
    
    Task AddAsync(Payment payment, CancellationToken ct = default);
    
    /// <summary>
    /// Updates an existing payment record (status, confirmations, etc.)
    /// </summary>
    Task UpdateAsync(Payment payment, CancellationToken ct = default);
    
    /// <summary>
    /// Gets all public donations across all projects (joined with project data).
    /// Ordered by CreatedAt descending (newest first).
    /// No authorization checks - completely public.
    /// </summary>
    Task<List<PublicDonation>> GetAllPublicDonationsAsync(
        int limit, 
        CancellationToken ct = default);
}
