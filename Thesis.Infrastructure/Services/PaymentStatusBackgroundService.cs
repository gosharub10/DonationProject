using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Thesis.Application.Interfaces;
using Thesis.Domain.Interfaces;

namespace Thesis.Infrastructure.Services;

public class PaymentStatusBackgroundService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<PaymentStatusBackgroundService> _logger;

    private const int IntervalSeconds = 30;
    private const int RequiredConfirmations = 4;

    public PaymentStatusBackgroundService(
        IServiceProvider serviceProvider,
        ILogger<PaymentStatusBackgroundService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        _logger.LogInformation("Payment BG service started");

        await Task.Delay(TimeSpan.FromSeconds(5), ct);

        while (!ct.IsCancellationRequested)
        {
            try
            {
                await Process(ct);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "BG loop error");
            }

            await Task.Delay(TimeSpan.FromSeconds(IntervalSeconds), ct);
        }
    }

    private async Task Process(CancellationToken ct)
    {
        using var scope = _serviceProvider.CreateScope();

        var payments = scope.ServiceProvider.GetRequiredService<IPaymentRepository>();
        var projects = scope.ServiceProvider.GetRequiredService<IProjectRepository>();
        var blockchain = scope.ServiceProvider.GetRequiredService<IBlockchainTransactionService>();

        var pending = await payments.GetPendingPaymentsAsync(ct);

        _logger.LogInformation("Pending payments: {Count}", pending.Count);

        foreach (var p in pending)
        {
            try
            {
                var tx = await blockchain.GetTransactionStatusAsync(p.TxHash, ct);

                // 1. ERROR from RPC
                if (!string.IsNullOrEmpty(tx.ErrorMessage))
                {
                    _logger.LogWarning("Blockchain error {TxHash}: {Error}", p.TxHash, tx.ErrorMessage);
                    continue;
                }

                // 2. NOT MINED YET
                if (tx.BlockNumber == null)
                {
                    _logger.LogDebug("Not mined yet {TxHash}", p.TxHash);
                    continue;
                }

                // 3. FAILED TX
                if (tx.Status == "failed")
                {
                    p.MarkAsFailed();
                    await payments.UpdateAsync(p, ct);

                    _logger.LogWarning("FAILED payment {Id}", p.Id);
                    continue;
                }

                // 4. UPDATE CONFIRMATIONS (always safe now)
                p.UpdateConfirmations(tx.Confirmations);
                await payments.UpdateAsync(p, ct);

                _logger.LogInformation(
                    "Tx {TxHash} confirmations {Conf}/{Req}",
                    p.TxHash,
                    tx.Confirmations,
                    RequiredConfirmations);

                // 5. NOT ENOUGH CONFIRMATIONS YET
                if (tx.Confirmations < RequiredConfirmations)
                    continue;

                // 6. FINAL CONFIRMATION
                p.MarkAsConfirmed(tx.BlockNumber ?? 0, tx.Confirmations);
                await payments.UpdateAsync(p, ct);

                var project = await projects.GetByIdAsync(p.ProjectId, ct);

                if (project != null)
                {
                    project.AddDonation(p.Amount);
                    project.CheckFundingStatus();

                    await projects.UpdateAsync(project, ct);
                }

                _logger.LogInformation(
                    "CONFIRMED payment {PaymentId} tx={TxHash}",
                    p.Id,
                    p.TxHash);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    "Error processing payment {Id} tx={Tx}",
                    p.Id,
                    p.TxHash);
            }
        }
    }
}