namespace Thesis.Domain.Support;

public class PublicDonation
{
    public string ProjectTitle { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; }
    public string TxHash { get; set; }
    public string Status { get; set; } 
    public DateTime CreatedAt { get; set; }
}