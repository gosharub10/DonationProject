using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;
using Thesis.Application.Interfaces;
using Thesis.Infrastructure.Settings;

namespace Thesis.Infrastructure.Services;

public sealed class SmtpEmailService : IEmailService
{
    private readonly EmailSettings _settings;
    private readonly ILogger<SmtpEmailService> _logger;

    private const string EtherscanBaseUrl = "https://sepolia.etherscan.io/tx";

    public SmtpEmailService(
        IOptions<EmailSettings> settings,
        ILogger<SmtpEmailService> logger)
    {
        _settings = settings.Value;
        _logger = logger;

        ValidateSettings();
    }

    public async Task SendDonationReceiptAsync(
        string toEmail,
        string projectTitle,
        decimal amount,
        string currency,
        string txHash,
        DateTime donatedAt,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(toEmail))
        {
            _logger.LogWarning("Recipient email is empty, skipping email send");
            return;
        }

        if (string.IsNullOrWhiteSpace(_settings.SmtpHost))
        {
            _logger.LogWarning("SMTP configuration is not configured, skipping email send");
            return;
        }

        try
        {
            var etherscanUrl = $"{EtherscanBaseUrl}/{txHash}";
            var htmlBody = EmailTemplates.GenerateDonationReceiptHtml(
                projectTitle,
                amount,
                currency,
                txHash,
                etherscanUrl,
                donatedAt
            );

            using var client = new SmtpClient(_settings.SmtpHost, _settings.SmtpPort);
            client.EnableSsl = true;
            client.Credentials = new NetworkCredential(_settings.SmtpUsername, _settings.SmtpPassword);

            using var message = new MailMessage();
            message.From = new MailAddress(_settings.FromEmail, _settings.FromName);
            message.Subject = "Thank you for your donation! - Blockchain Receipt";
            message.Body = htmlBody;
            message.IsBodyHtml = true;

            message.To.Add(new MailAddress(toEmail));

            await client.SendMailAsync(message, ct);

            _logger.LogInformation(
                "Donation receipt email sent successfully to {Email} for amount {Amount} {Currency}",
                toEmail,
                amount,
                currency
            );
        }
        catch (SmtpException ex)
        {
            _logger.LogError(
                ex,
                "SMTP error while sending donation receipt to {Email}: {SmtpStatusCode}",
                toEmail,
                ex.StatusCode
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Unexpected error while sending donation receipt to {Email}",
                toEmail
            );
        }
    }

    private void ValidateSettings()
    {
        if (string.IsNullOrWhiteSpace(_settings.SmtpHost))
        {
            _logger.LogWarning(
                "Email:SmtpHost is not configured. Email notifications will be skipped."
            );
            return;
        }

        if (string.IsNullOrWhiteSpace(_settings.SmtpUsername))
        {
            _logger.LogWarning(
                "Email:SmtpUsername is not configured. Email notifications may fail."
            );
        }

        if (string.IsNullOrWhiteSpace(_settings.FromEmail))
        {
            _logger.LogWarning(
                "Email:FromEmail is not configured. Email notifications will not have a proper sender."
            );
        }
    }
}
