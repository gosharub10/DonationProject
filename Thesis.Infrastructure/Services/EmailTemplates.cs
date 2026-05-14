namespace Thesis.Infrastructure.Services;

public static class EmailTemplates
{
    public static string GenerateDonationReceiptHtml(
        string projectTitle,
        decimal amount,
        string currency,
        string txHash,
        string etherscanUrl,
        DateTime donatedAt)
    {
        var formattedDate = donatedAt.ToString("MMMM d, yyyy 'at' HH:mm 'UTC'");
        var shortHash = txHash.Length > 10 
            ? $"{txHash[..6]}...{txHash[^4..]}" 
            : txHash;

        return $@"
<!DOCTYPE html>
<html lang=""en"">
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>Donation Receipt</title>
    <style>
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
        }}
        .container {{
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }}
        .header {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            padding: 40px 20px;
            text-align: center;
        }}
        .header h1 {{
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }}
        .badge {{
            display: inline-block;
            background-color: #10b981;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin-top: 15px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }}
        .content {{
            padding: 40px;
        }}
        .content h2 {{
            color: #1f2937;
            font-size: 18px;
            margin-top: 0;
            margin-bottom: 24px;
        }}
        .detail-row {{
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #e5e7eb;
        }}
        .detail-row:last-child {{
            border-bottom: none;
        }}
        .detail-label {{
            color: #6b7280;
            font-size: 14px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
        }}
        .detail-value {{
            color: #1f2937;
            font-size: 16px;
            font-weight: 400;
        }}
        .amount-box {{
            background-color: #f0f9ff;
            border-left: 4px solid #3b82f6;
            padding: 20px;
            border-radius: 4px;
            margin: 20px 0;
        }}
        .amount {{
            font-size: 32px;
            font-weight: 700;
            color: #1e40af;
            margin: 0;
        }}
        .project-title {{
            font-size: 16px;
            color: #6b7280;
            margin: 8px 0 0 0;
        }}
        .tx-hash {{
            font-family: 'Courier New', monospace;
            background-color: #f3f4f6;
            padding: 8px 12px;
            border-radius: 4px;
            word-break: break-all;
            font-size: 13px;
            color: #374151;
        }}
        .etherscan-button {{
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin-top: 12px;
            transition: opacity 0.2s;
            font-size: 14px;
        }}
        .etherscan-button:hover {{
            opacity: 0.9;
        }}
        .footer {{
            background-color: #f9fafb;
            padding: 30px 40px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }}
        .footer p {{
            color: #6b7280;
            font-size: 13px;
            margin: 8px 0;
            line-height: 1.6;
        }}
        .footer-logo {{
            font-weight: 600;
            color: #1f2937;
            font-size: 16px;
            margin-bottom: 12px;
        }}
    </style>
</head>
<body>
    <div class=""container"">
        <div class=""header"">
            <h1>🎉 Thank You!</h1>
            <div class=""badge"">✓ Donation Confirmed</div>
        </div>

        <div class=""content"">
            <h2>Your donation has been successfully confirmed on the blockchain</h2>

            <div class=""amount-box"">
                <p class=""amount"">{amount:F4} {currency}</p>
                <p class=""project-title"">Donated to: {projectTitle}</p>
            </div>

            <div class=""detail-row"">
                <div class=""detail-label"">Donation Date</div>
                <div class=""detail-value"">{formattedDate}</div>
            </div>

            <div class=""detail-row"">
                <div class=""detail-label"">Transaction Hash</div>
                <div class=""tx-hash"">{txHash}</div>
            </div>

            <div class=""detail-row"">
                <div class=""detail-label"">View on Blockchain</div>
                <a href=""{etherscanUrl}"" class=""etherscan-button"" target=""_blank"">View on Etherscan →</a>
            </div>

            <p style=""color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 30px;"">
                Your contribution is making a real impact. Thank you for supporting this project and helping to build a better future through blockchain technology.
            </p>
        </div>

        <div class=""footer"">
            <div class=""footer-logo"">Blockchain Donations</div>
            <p>This is an automated receipt from our donation platform.</p>
            <p>If you have any questions, please contact our support team.</p>
            <p style=""margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 12px;"">
                © 2026 Blockchain Donations. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>";
    }
}
