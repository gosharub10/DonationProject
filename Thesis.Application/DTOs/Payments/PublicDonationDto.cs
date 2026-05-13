namespace Thesis.Application.DTOs.Payments;

/// <summary>
/// Public DTO for donations displayed on the public dashboard
/// No sensitive user information is included
/// </summary>
public record PublicDonationDto(
    string ProjectTitle,
    decimal Amount,
    string Currency,
    string TxHash,
    string Status,
    DateTime CreatedAt,
    string EtherscanUrl
);

/// <summary>
/// Summary statistics for public donations dashboard
/// </summary>
public record PublicDonationsSummary(
    int TotalDonations,
    decimal TotalEthRaised,
    int ConfirmedDonations,
    IEnumerable<PublicDonationDto> RecentDonations
);
