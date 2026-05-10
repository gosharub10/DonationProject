using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace Thesis.Server.Extensions;

/// <summary>
/// Расширения для безопасного извлечения пользователя из JWT токена
/// </summary>
public static class ControllerExtensions
{
    /// <summary>
    /// Получить ID пользователя из JWT токена (claim: sub)
    /// </summary>
    /// <param name="controller">Controller instance</param>
    /// <returns>Guid пользователя</returns>
    /// <exception cref="UnauthorizedAccessException">Если токен не содержит валидный ID</exception>
    public static Guid GetUserId(this ControllerBase controller)
    {
        var userIdClaim = controller.User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value ??
                         controller.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim))
        {
            throw new UnauthorizedAccessException("User ID not found in token");
        }

        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException("Invalid user ID format in token");
        }

        return userId;
    }

    /// <summary>
    /// Попытаться получить ID пользователя из JWT токена
    /// </summary>
    /// <param name="controller">Controller instance</param>
    /// <param name="userId">Извлеченный Guid пользователя</param>
    /// <returns>true если успешно, false если не найдено</returns>
    public static bool TryGetUserId(this ControllerBase controller, out Guid userId)
    {
        userId = Guid.Empty;
        
        var userIdClaim = controller.User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value ??
                         controller.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim))
        {
            return false;
        }

        return Guid.TryParse(userIdClaim, out userId);
    }

    /// <summary>
    /// Получить email пользователя из JWT токена
    /// </summary>
    public static string? GetUserEmail(this ControllerBase controller)
    {
        return controller.User.FindFirst(ClaimTypes.Email)?.Value;
    }

    /// <summary>
    /// Получить role пользователя из JWT токена
    /// </summary>
    public static string? GetUserRole(this ControllerBase controller)
    {
        return controller.User.FindFirst(ClaimTypes.Role)?.Value;
    }

    /// <summary>
    /// Проверить является ли пользователь администратором
    /// </summary>
    public static bool IsAdmin(this ControllerBase controller)
    {
        return controller.User.IsInRole("Admin");
    }

    /// <summary>
    /// Получить все claims пользователя (для отладки)
    /// </summary>
    public static Dictionary<string, string> GetAllClaims(this ControllerBase controller)
    {
        return controller.User.Claims
            .ToDictionary(c => c.Type, c => c.Value);
    }
}
