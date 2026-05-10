namespace Thesis.Domain.Entities;

public class Wallet
{
    public Guid Id { get; init; }
    public Guid UserId { get; init; }
    public string WalletAddress { get; private set; }
    public DateOnly CreatedAt { get; init; }
    
    private Wallet() { }

    public Wallet(Guid id, Guid userId, string walletAddress, DateOnly createdAt)
    {
        Id = id;
        UserId = userId;
        WalletAddress = walletAddress;
        CreatedAt = createdAt;
    }
    
    public void UpdateWalletAddress(string walletAddress) => WalletAddress = walletAddress;
}
