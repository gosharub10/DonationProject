using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Thesis.Application.Common;
using Thesis.Application.DTOs.Project;
using Thesis.Application.Projects.GetById;
using Thesis.Application.Projects.Update;
using Thesis.Application.Projects.Finance.Queries.GetTransactions;
using Thesis.Application.Projects.Finance.Queries.GetFinanceDashboard;
using Thesis.Application.Projects.Finance.SetProjectTarget;
using Thesis.Application.Projects.Finance.SetProjectWallet;
using Thesis.Application.Projects.Finance.ActivateProject;
using Thesis.Application.DTOs.Payments;

namespace Thesis.Server.Controllers;

[ApiController]
[Route("api/finance")]
[Authorize(Roles = "FinanceManager")]
public class FinanceController : ControllerBase
{
    private readonly IQueryHandler<GetProjectByIdQuery, GetProjectResponse> _getProjectByIdQueryHandler;
    private readonly ICommandHandler<UpdateProjectCommand, UpdateProjectResponse> _updateProjectCommandHandler;

    public FinanceController(
        IQueryHandler<GetProjectByIdQuery, GetProjectResponse> getProjectByIdQueryHandler,
        ICommandHandler<UpdateProjectCommand, UpdateProjectResponse> updateProjectCommandHandler)
    {
        _getProjectByIdQueryHandler = getProjectByIdQueryHandler;
        _updateProjectCommandHandler = updateProjectCommandHandler;
    }

    [HttpGet("projects/{projectId:guid}/settings")]
    public async Task<IActionResult> GetProjectFinancialSettings(Guid projectId, CancellationToken ct)
    {
        var result = await _getProjectByIdQueryHandler.HandleAsync(new GetProjectByIdQuery(projectId), ct);
        return Ok(result);
    }

    public sealed record FinanceSetupRequest(decimal TargetAmount, string WalletAddress, string BlockchainNetwork);

    [HttpPost("projects/{projectId:guid}/settings")]
    public async Task<IActionResult> SetProjectFinancials(Guid projectId, [FromBody] FinanceSetupRequest request, CancellationToken ct)
    {
        // Create update command that sets wallet, target and activates project
        // Prefer dedicated finance commands
        await _updateProjectCommandHandler.HandleAsync(new UpdateProjectCommand(projectId), ct);

        // set wallet
        var setWallet = new SetProjectWalletCommand(projectId, request.WalletAddress);
        await HttpContext.RequestServices.GetRequiredService<ICommandHandler<SetProjectWalletCommand, Unit>>().HandleAsync(setWallet, ct);

        // set target
        var setTarget = new SetProjectTargetAmountCommand(projectId, request.TargetAmount);
        await HttpContext.RequestServices.GetRequiredService<ICommandHandler<SetProjectTargetAmountCommand, Unit>>().HandleAsync(setTarget, ct);

        // activate
        var activate = new ActivateProjectCommand(projectId);
        await HttpContext.RequestServices.GetRequiredService<ICommandHandler<ActivateProjectCommand, Unit>>().HandleAsync(activate, ct);

        var result = await _getProjectByIdQueryHandler.HandleAsync(new GetProjectByIdQuery(projectId), ct);
        return Ok(result);
    }

    [HttpPut("projects/{projectId:guid}/wallet")]
    public async Task<IActionResult> SetWallet(Guid projectId, [FromBody] SetProjectWalletCommand request, CancellationToken ct)
    {
        await HttpContext.RequestServices.GetRequiredService<ICommandHandler<SetProjectWalletCommand, Unit>>().HandleAsync(request, ct);
        var result = await _getProjectByIdQueryHandler.HandleAsync(new GetProjectByIdQuery(projectId), ct);
        return Ok(result);
    }

    [HttpPut("projects/{projectId:guid}/target")]
    public async Task<IActionResult> SetTarget(Guid projectId, [FromBody] SetProjectTargetAmountCommand request, CancellationToken ct)
    {
        await HttpContext.RequestServices.GetRequiredService<ICommandHandler<SetProjectTargetAmountCommand, Unit>>().HandleAsync(request, ct);
        var result = await _getProjectByIdQueryHandler.HandleAsync(new GetProjectByIdQuery(projectId), ct);
        return Ok(result);
    }

    [HttpPut("projects/{projectId:guid}/activate")]
    public async Task<IActionResult> Activate(Guid projectId, CancellationToken ct)
    {
        await HttpContext.RequestServices.GetRequiredService<ICommandHandler<ActivateProjectCommand, Unit>>().HandleAsync(new ActivateProjectCommand(projectId), ct);
        var result = await _getProjectByIdQueryHandler.HandleAsync(new GetProjectByIdQuery(projectId), ct);
        return Ok(result);
    }

    [HttpGet("transactions")]
    public async Task<IActionResult> GetTransactions([FromQuery] Guid? projectId, [FromQuery] DateTime? from, [FromQuery] DateTime? to, CancellationToken ct)
    {
        var query = new GetFinanceTransactionsQuery(projectId, from, to);
        var handler = HttpContext.RequestServices.GetRequiredService<IQueryHandler<GetFinanceTransactionsQuery, IEnumerable<PaymentHistoryResponse>>>();
        var result = await handler.HandleAsync(query, ct);
        return Ok(result);
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard([FromQuery] DateTime? from, [FromQuery] DateTime? to, CancellationToken ct)
    {
        var query = new GetFinanceDashboardQuery(from, to);
        var handler = HttpContext.RequestServices.GetRequiredService<IQueryHandler<GetFinanceDashboardQuery, FinanceDashboardResponse>>();
        var result = await handler.HandleAsync(query, ct);
        return Ok(result);
    }
}
