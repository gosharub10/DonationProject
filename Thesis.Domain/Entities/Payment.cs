namespace Thesis.Domain.Entities;

public class Payment
{
    public Guid Id { get; init; }
    public Guid? UserId { get; init; }
    public Guid ProjectId { get; init; }
    public decimal Amount { get; init; }
    public string Currency { get; init; }
    public string TxHash { get; init; }
    public string Status { get; private set; }
    public DateTime CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; private set; }
    public int? BlockNumber { get; private set; }
    public int? ConfirmationCount { get; private set; }

    private Payment() { }

    /// <summary>
    /// Constructor for creating new payment - status is set to "pending" by default
    /// </summary>
    public Payment(
        Guid id,
        Guid? userId,
        Guid projectId,
        decimal amount,
        string currency,
        string txHash,
        DateTime createdAt)
    {
        Id = id;
        UserId = userId;
        ProjectId = projectId;
        Amount = amount;
        Currency = currency;
        TxHash = txHash;
        Status = "pending";
        CreatedAt = createdAt;
        UpdatedAt = null;
        BlockNumber = null;
        ConfirmationCount = 0;
    }

    /// <summary>
    /// Alternative constructor for backwards compatibility
    /// </summary>
    public Payment(
        Guid id,
        Guid? userId,
        Guid projectId,
        decimal amount,
        string currency,
        string txHash,
        string status,
        DateTime createdAt)
    {
        Id = id;
        UserId = userId;
        ProjectId = projectId;
        Amount = amount;
        Currency = currency;
        TxHash = txHash;
        Status = status;
        CreatedAt = createdAt;
        UpdatedAt = null;
        BlockNumber = null;
        ConfirmationCount = 0;
    }

    public void UpdateConfirmations(int confirmations)
    {
        if (Status == "failed")
            return;

        ConfirmationCount = confirmations;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkAsConfirmed(int blockNumber, int confirmations)
    {
        Status = "confirmed";
        BlockNumber = blockNumber;
        ConfirmationCount = confirmations;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkAsFailed()
    {
        if (Status == "confirmed")
            return;

        Status = "failed";
        UpdatedAt = DateTime.UtcNow;
    }

    public bool IsPending => Status == "pending";
    public bool IsConfirmed => Status == "confirmed";
    public bool IsFailed => Status == "failed";
}
