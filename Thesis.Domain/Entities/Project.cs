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
    
    private Project() {}

    public Project(Guid id, string title, string description, decimal targetAmount, decimal collectedAmount, DateOnly createdAt, ProjectStatus status = ProjectStatus.Pending)
    {
        Id = id;
        Title = title;
        Description = description;
        TargetAmount = targetAmount;
        CollectedAmount = collectedAmount;
        Status = status;
        CreatedAt = createdAt;
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

    private void SetTitle(string title)
    {
        Title = title.Trim();
    }

    private void SetDescription(string description)
    {
        Description = description.Trim();
    }

    private void SetTargetAmount(decimal amount)
    {
        TargetAmount = amount;
    }
}