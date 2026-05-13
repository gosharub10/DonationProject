using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Nethereum.Web3;
using Thesis.Application.DTOs.Payments;
using Thesis.Application.Interfaces;

namespace Thesis.Infrastructure.Services;

public class BlockchainTransactionService : IBlockchainTransactionService
{
    private readonly Web3 _web3;
    private readonly ILogger<BlockchainTransactionService> _logger;
    private readonly int _requiredConfirmations;

    public BlockchainTransactionService(
        IConfiguration configuration,
        ILogger<BlockchainTransactionService> logger)
    {
        _logger = logger;

        var rpcUrl = configuration["Blockchain:RpcUrl"]
            ?? throw new InvalidOperationException("Blockchain:RpcUrl is missing");

        _requiredConfirmations =
            configuration.GetValue("Blockchain:RequiredConfirmations", 12);

        _web3 = new Web3(rpcUrl);

        _logger.LogInformation("Blockchain service started. RPC={RpcUrl}", rpcUrl);
    }

    public async Task<BlockchainTransactionInfo> GetTransactionStatusAsync(
        string txHash,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(txHash))
            return Fail(txHash, "Empty txHash");

        try
        {
            _logger.LogDebug("Checking tx {TxHash}", txHash);

            var receipt = await _web3.Eth
                .Transactions
                .GetTransactionReceipt
                .SendRequestAsync(txHash);

            // 1. NOT MINED
            if (receipt == null)
            {
                return Pending(txHash, "not mined yet");
            }

            var currentBlock = await _web3.Eth
                .Blocks
                .GetBlockNumber
                .SendRequestAsync();

            var txBlock = (long)receipt.BlockNumber.Value;
            var latestBlock = (long)currentBlock.Value;

            var confirmations = Math.Max(0, latestBlock - txBlock);

            var success = receipt.Status?.Value == 1;

            var isConfirmed = success && confirmations >= _requiredConfirmations;

            var status =
                !success ? "failed" :
                isConfirmed ? "success" :
                "pending";

            _logger.LogInformation(
                "Tx {TxHash} => {Status}, conf={Conf}",
                txHash,
                status,
                confirmations);

            return new BlockchainTransactionInfo(
                TxHash: txHash,
                IsConfirmed: isConfirmed,
                Confirmations: (int)confirmations,
                BlockNumber: (int)txBlock,
                Status: status,
                BlockTimestamp: null,
                ErrorMessage: null
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Blockchain error tx={TxHash}", txHash);
            return Fail(txHash, ex.Message);
        }
    }

    public async Task<long> GetCurrentBlockNumberAsync(CancellationToken ct = default)
    {
        var block = await _web3.Eth.Blocks.GetBlockNumber.SendRequestAsync();
        return (long)block.Value;
    }

    public async Task<bool> HasSufficientConfirmationsAsync(
        string txHash,
        int requiredConfirmations,
        CancellationToken ct = default)
    {
        var tx = await GetTransactionStatusAsync(txHash, ct);
        return tx.Confirmations >= requiredConfirmations;
    }

    private static BlockchainTransactionInfo Pending(string txHash, string msg) =>
        new(txHash, false, 0, null, "pending", null, msg);

    private static BlockchainTransactionInfo Fail(string txHash, string msg) =>
        new(txHash, false, 0, null, "failed", null, msg);
}