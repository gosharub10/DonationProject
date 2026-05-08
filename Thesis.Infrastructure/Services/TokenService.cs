using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Thesis.Application.Interfaces;
using Thesis.Domain.Entities;

namespace Thesis.Infrastructure.Services;

public class TokenService(IConfiguration configuration) : ITokenService
{
    public string GenerateToken(User user)
    {
        // var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!));
        // var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        //
        // var claims = new List<Claim>
        // {
        //     new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
        //     new(JwtRegisteredClaimNames.Email, user.Email),
        //     new("role", user.Role.ToString()),
        // };
        //
        // var token = new JwtSecurityToken(
        //     issuer: configuration["Jwt:Issuer"],
        //     audience: configuration["Jwt:Audience"],
        //     claims: claims,
        //     expires: DateTime.UtcNow.AddMinutes(GetExpirationMinutes()),
        //     signingCredentials: creds
        // );
        //
        // return new JwtSecurityTokenHandler().WriteToken(token);
        
        var issuer = configuration["Jwt:Issuer"];
        var audience = configuration["Jwt:Audience"];
        var lifetime = int.Parse(configuration["Jwt:Expired"] ?? "60");
        var secret = configuration["Jwt:Key"];
        
        // дата окончания срока жизни токена
        var expires = DateTime.UtcNow.AddMinutes(lifetime);

        var tokenHandler = new JwtSecurityTokenHandler();

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
        };
        
        var descriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Issuer = issuer,
            Audience = audience,
            Expires = expires,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),
                SecurityAlgorithms.HmacSha256Signature)
        };
        
        var securityToken = tokenHandler.CreateToken(descriptor);
        return tokenHandler.WriteToken(securityToken);
    }

    public DateTime GetTokenExpiration()
    {
        return DateTime.UtcNow.AddMinutes(GetExpirationMinutes());;
    }
    
    private int GetExpirationMinutes()
    {
        return int.Parse(configuration["Jwt:Expired"] ?? "60");;
    }
}