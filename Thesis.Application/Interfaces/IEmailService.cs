namespace Thesis.Application.Interfaces;

/// <summary>
/// Service for sending email notifications
/// </summary>
public interface IEmailService
{
    /// <summary>
    /// Sends a donation receipt email when a payment is confirmed
    /// </summary>
    /// <param name="toEmail">Recipient email address</param>
    /// <param name="projectTitle">Title of the project</param>
    /// <param name="amount">Donation amount</param>
    /// <param name="currency">Currency of the donation</param>
    /// <param name="txHash">Blockchain transaction hash</param>
    /// <param name="donatedAt">Timestamp of the donation</param>
    /// <param name="ct">Cancellation token</param>
    Task SendDonationReceiptAsync(
        string toEmail,
        string projectTitle,
        decimal amount,
        string currency,
        string txHash,
        DateTime donatedAt,
        CancellationToken ct = default);
}
