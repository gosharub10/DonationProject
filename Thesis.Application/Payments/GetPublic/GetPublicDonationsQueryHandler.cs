using Thesis.Application.Common;
using Thesis.Application.DTOs.Payments;
using Thesis.Domain.Interfaces;

namespace Thesis.Application.Payments.GetPublic;

/// <summary>
/// Handles retrieval of all public donations across all projects.
/// Returns summary with totals and recent confirmed/pending donations.
/// </summary>
public sealed class GetPublicDonationsQueryHandler : IQueryHandler<GetPublicDonationsQuery, PublicDonationsSummary>
{
    private readonly IPaymentRepository _paymentRepository;

    public GetPublicDonationsQueryHandler(IPaymentRepository paymentRepository)
    {
        _paymentRepository = paymentRepository;
    }

    public async Task<PublicDonationsSummary> HandleAsync(GetPublicDonationsQuery query, CancellationToken ct)
    {
        // Get all public donations (no authorization check needed)
        var donations = await _paymentRepository.GetAllPublicDonationsAsync(query.Limit, ct);

        // Calculate totals
        var totalDonations = donations.Count;
        var totalEthRaised = donations.Sum(d => d.Amount);
        var confirmedDonations = donations.Count(d => d.Status == "confirmed");

        // Map to DTOs with Etherscan URLs
        var publicDonations = donations.Select(d => new PublicDonationDto(
            ProjectTitle: d.ProjectTitle,
            Amount: d.Amount,
            Currency: d.Currency,
            TxHash: d.TxHash,
            Status: d.Status,
            CreatedAt: d.CreatedAt,
            EtherscanUrl: GenerateEtherscanUrl(d.TxHash)
        )).ToList();

        return new PublicDonationsSummary(
            TotalDonations: totalDonations,
            TotalEthRaised: totalEthRaised,
            ConfirmedDonations: confirmedDonations,
            RecentDonations: publicDonations
        );
    }

    /// <summary>
    /// Generates Etherscan URL for the transaction hash.
    /// Uses Sepolia testnet by default.
    /// </summary>
    private static string GenerateEtherscanUrl(string txHash)
    {
        return $"https://sepolia.etherscan.io/tx/{txHash}";
    }
}
