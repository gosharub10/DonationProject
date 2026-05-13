using Thesis.Application.Common;
using Thesis.Application.DTOs.Payments;

namespace Thesis.Application.Payments.GetPublic;

/// <summary>
/// Query to get all public donations across all projects.
/// This is a read-only public endpoint - no authorization required.
/// </summary>
public sealed record GetPublicDonationsQuery(
    int Limit = 50
) : IQuery<PublicDonationsSummary>;
