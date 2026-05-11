using Thesis.Domain.Enums;

namespace Thesis.Domain.Entities;

public class Project
{
    public Guid Id { get; init; }
    public string Title { get; private set; }
    public string Description { get; private set; }
    public decimal TargetAmount { get; private set; }
    public decimal CollectedAmount { get; private set; }
    public ProjectStatus Status { get; private set; }
    public DateOnly CreatedAt { get; init; }
    public string WalletAddress { get; private set; }
    public List<string> PhotoUrls { get; private set; }
    
    private Project() {}

    public Project(Guid id, string title, string description, decimal targetAmount, string walletAddress, DateOnly createdAt, ProjectStatus status = ProjectStatus.Pending, decimal collectedAmount = 0m, List<string>? photoUrls = null)
    {
        Id = id;
        Title = title;
        Description = description;
        TargetAmount = targetAmount;
        WalletAddress = walletAddress;
        CollectedAmount = collectedAmount;
        Status = status;
        CreatedAt = createdAt;
        PhotoUrls = photoUrls ?? new List<string>();
    }
    
    public void Contribute(decimal amount)
    {
        CollectedAmount += amount;
    }

    public void Cancel()
    {
        Status = ProjectStatus.Canceled;
    }

    public void Activate()
    {
        Status = ProjectStatus.Active;
    }

    public void SetTitle(string title)
    {
        Title = title.Trim();
    }

    public void SetDescription(string description)
    {
        Description = description.Trim();
    }

    public void SetTargetAmount(decimal amount)
    {
        TargetAmount = amount;
    }

    public void SetStatus(ProjectStatus status)
    {
        Status = status;
    }

    public void SetWalletAddress(string walletAddress)
    {
        if (string.IsNullOrWhiteSpace(walletAddress))
            throw new ArgumentException("Wallet address cannot be empty", nameof(walletAddress));

        if (!walletAddress.StartsWith("0x"))
            throw new ArgumentException("Wallet address must start with '0x'", nameof(walletAddress));

        WalletAddress = walletAddress;
    }

    public void AddPhotoUrl(string photoUrl)
    {
        if (string.IsNullOrWhiteSpace(photoUrl))
            throw new ArgumentException("Photo URL cannot be empty", nameof(photoUrl));

        PhotoUrls.Add(photoUrl);
    }

    public void RemovePhotoUrl(string photoUrl)
    {
        PhotoUrls.Remove(photoUrl);
    }

    public void ClearPhotoUrls()
    {
        PhotoUrls.Clear();
    }
}