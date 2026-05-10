using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using Thesis.Application.Common;
using Thesis.Application.DTOs.Wallet;
using Thesis.Application.Wallets.Connect;
using Thesis.Application.Wallets.GetMyWallet;
using Thesis.Server.Extensions;

namespace Thesis.Server.Controllers;

[ApiController]
[Route("api/wallet")]
[Authorize]
public class WalletController : ControllerBase
{
    private readonly ICommandHandler<ConnectWalletCommand, ConnectWalletResponse> _connectWalletCommandHandler;
    private readonly IQueryHandler<GetMyWalletQuery, GetWalletResponse> _getMyWalletQueryHandler;

    public WalletController(
        ICommandHandler<ConnectWalletCommand, ConnectWalletResponse> connectWalletCommandHandler,
        IQueryHandler<GetMyWalletQuery, GetWalletResponse> getMyWalletQueryHandler)
    {
        _connectWalletCommandHandler = connectWalletCommandHandler;
        _getMyWalletQueryHandler = getMyWalletQueryHandler;
    }

    [HttpPost("connect")]
    public async Task<IActionResult> Connect([FromBody] ConnectWalletRequest request, CancellationToken ct)
    {
        try
        {
            var userId = this.GetUserId();
            
            var command = new ConnectWalletCommand(userId, request.WalletAddress);
            var result = await _connectWalletCommandHandler.HandleAsync(command, ct);
            
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (ApplicationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMyWallet(CancellationToken ct)
    {
        try
        {
            var userId = this.GetUserId();
            
            var query = new GetMyWalletQuery(userId);
            var result = await _getMyWalletQueryHandler.HandleAsync(query, ct);
            
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (ApplicationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}

public record ConnectWalletRequest(string WalletAddress);
