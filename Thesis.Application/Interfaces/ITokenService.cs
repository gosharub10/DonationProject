using Thesis.Domain.Entities;

namespace Thesis.Application.Interfaces;

public interface ITokenService
{
    string GenerateToken(User user);
    DateTime GetTokenExpiration();
}