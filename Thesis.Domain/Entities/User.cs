using Thesis.Domain.Enums;

namespace Thesis.Domain.Entities;
//todo: надо будет сделать валидацию на этом уровне 
public class User
{
    public Guid Id { get; init; }
    public string Name { get; private set; }
    public string Email { get; init; }
    public string PasswordHash { get; private set; }
    public Role Role { get; private set; }
    public DateOnly CreatedAt { get; init; }
    
    private User() { }

    public User(Guid id, string name, string email, string passwordHash, DateOnly createdAt ,Role role = Role.User)
    {
        Id = id;
        Name = name;
        Email = email;
        PasswordHash = passwordHash;
        Role = role;
        CreatedAt = createdAt;
    }
    
    public void SetName(string name) => Name = name;
    
    public void ChangeRole(Role newRole) => Role = newRole;
}