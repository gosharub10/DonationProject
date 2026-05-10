using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace Thesis.Server.Controllers;

/// <summary>
/// Debug контроллер для тестирования JWT токена
/// УДАЛИТЬ в production!
/// </summary>
[ApiController]
[Route("api/debug")]
[Authorize]
public class DebugJwtController : ControllerBase
{
    /// <summary>
    /// GET /api/debug/claims
    /// Показать все claims из токена для отладки
    /// </summary>
    [HttpGet("claims")]
    public IActionResult GetClaims()
    {
        var claims = User.Claims
            .Select(c => new { c.Type, c.Value })
            .ToList();

        return Ok(new
        {
            isAuthenticated = User.Identity?.IsAuthenticated ?? false,
            claims = claims,
            claimsCount = claims.Count
        });
    }

    /// <summary>
    /// GET /api/debug/identity
    /// Показать информацию о пользователе
    /// </summary>
    [HttpGet("identity")]
    public IActionResult GetIdentity()
    {
        return Ok(new
        {
            name = User.Identity?.Name,
            authenticationType = User.Identity?.AuthenticationType,
            isAuthenticated = User.Identity?.IsAuthenticated,
            
            // Стандартные claims
            sub = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value,
            email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value,
            role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value,
            
            // Все роли
            roles = User.FindAll(System.Security.Claims.ClaimTypes.Role)
        });
    }

    /// <summary>
    /// GET /api/debug/token-info
    /// Показать полную информацию о токене
    /// </summary>
    [HttpGet("token-info")]
    public IActionResult GetTokenInfo()
    {
        var authHeader = Request.Headers.Authorization.ToString();
        var hasToken = !string.IsNullOrEmpty(authHeader);
        
        return Ok(new
        {
            hasAuthorizationHeader = hasToken,
            authorizationHeaderFormat = authHeader.Split(' ').FirstOrDefault() ?? "N/A",
            principalIdentity = User.Identity?.Name,
            principalIsAuthenticated = User.Identity?.IsAuthenticated,
            claimsCount = User.Claims.Count(),
            allClaims = User.Claims.ToDictionary(c => c.Type, c => c.Value)
        });
    }

    /// <summary>
    /// GET /api/debug/check-user-id
    /// Проверить, может ли мы извлечь User ID
    /// </summary>
    [HttpGet("check-user-id")]
    public IActionResult CheckUserId()
    {
        var subClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        var nameIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        
        var canParseSubAsGuid = Guid.TryParse(subClaim, out var subGuid);
        var canParseNameIdAsGuid = Guid.TryParse(nameIdClaim, out var nameIdGuid);

        return Ok(new
        {
            subClaimValue = subClaim ?? "NOT FOUND",
            canParseSubAsGuid = canParseSubAsGuid,
            subAsGuid = canParseSubAsGuid ? subGuid : (Guid?)null,
            
            nameIdClaimValue = nameIdClaim ?? "NOT FOUND",
            canParseNameIdAsGuid = canParseNameIdAsGuid,
            nameIdAsGuid = canParseNameIdAsGuid ? nameIdGuid : (Guid?)null,
            
            message = canParseSubAsGuid ? "✓ User ID successfully extracted" : "✗ Cannot extract User ID"
        });
    }
}

/// <summary>
/// Контроллер для эмуляции JWT без аутентификации
/// УДАЛИТЬ в production!
/// </summary>
[ApiController]
[Route("api/debug-noauth")]
public class DebugNoAuthController : ControllerBase
{
    /// <summary>
    /// POST /api/debug-noauth/test-endpoint
    /// Тестовый endpoint без аутентификации для проверки связи
    /// </summary>
    [HttpPost("test-endpoint")]
    public IActionResult TestEndpoint([FromBody] TestRequest request)
    {
        return Ok(new
        {
            message = "Success! Connection works.",
            receivedData = request,
            timestamp = DateTime.UtcNow
        });
    }

    /// <summary>
    /// POST /api/debug-noauth/echo
    /// Эхо для проверки JSON сериализации
    /// </summary>
    [HttpPost("echo")]
    public IActionResult Echo([FromBody] object data)
    {
        return Ok(new { echo = data });
    }
}

public record TestRequest(string Message, string Data);
