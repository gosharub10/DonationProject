using Microsoft.EntityFrameworkCore;
using Thesis.Application.DTOs.Payments;
using Thesis.Domain.Entities;
using Thesis.Domain.Interfaces;
using Thesis.Domain.Support;

namespace Thesis.Infrastructure.Data.Repositories;

public class PaymentRepository(AppDbContext context) : IPaymentRepository
{
    public async Task<Payment?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await context.Payments
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id, ct);
    }

    public async Task<Payment?> GetByTxHashAsync(string txHash, CancellationToken ct = default)
    {
        return await context.Payments
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.TxHash == txHash, ct);
    }

    public async Task<IEnumerable<Payment>> GetByProjectIdAsync(Guid projectId, CancellationToken ct = default)
    {
        return await context.Payments
            .AsNoTracking()
            .Where(p => p.ProjectId == projectId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task<IEnumerable<Payment>> GetByUserIdAsync(Guid userId, CancellationToken ct = default)
    {
        return await context.Payments
            .AsNoTracking()
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task AddAsync(Payment payment, CancellationToken ct = default)
    {
        await context.AddAsync(payment, ct);
        await context.SaveChangesAsync(ct);
    }

    public async Task<List<Payment>> GetPendingPaymentsAsync(CancellationToken ct = default)
    {
        return await context.Payments
            .Where(p => p.Status == "pending")
            .OrderBy(p => p.CreatedAt) // Process oldest first
            .ToListAsync(ct);
    }

    public async Task UpdateAsync(Payment payment, CancellationToken ct = default)
    {
        context.Payments.Update(payment);
        await context.SaveChangesAsync(ct);
    }

    public async Task<List<PublicDonation>> GetAllPublicDonationsAsync(
        int limit,
        CancellationToken ct = default)
    {
        return await context.Payments
            .AsNoTracking()
            .Join(
                context.Projects,
                payment => payment.ProjectId,
                project => project.Id,
                (payment, project) => new PublicDonation
                {
                    ProjectTitle = project.Title,
                    Amount = payment.Amount,
                    Currency = payment.Currency,
                    TxHash = payment.TxHash,
                    Status = payment.Status,
                    CreatedAt = payment.CreatedAt
                }
            )
            .OrderByDescending(x => x.CreatedAt)
            .Take(limit)
            .ToListAsync(ct);
    }
}