using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Thesis.Application.Common;
using Thesis.Application.DTOs.Payments;
using Thesis.Application.Payments.Create;
using Thesis.Application.Payments.GetByProject;
using Thesis.Application.Payments.GetPublic;

namespace Thesis.Server.Controllers;

[ApiController]
[Route("api/payments")]
public class PaymentsController : ControllerBase
{
    private readonly ICommandHandler<CreatePaymentCommand, CreatePaymentResponse> _createPaymentCommandHandler;
    private readonly IQueryHandler<GetProjectPaymentsQuery, IEnumerable<PaymentHistoryResponse>> _getProjectPaymentsQueryHandler;
    private readonly IQueryHandler<GetPublicDonationsQuery, PublicDonationsSummary> _getPublicDonationsQueryHandler;

    public PaymentsController(
        ICommandHandler<CreatePaymentCommand, CreatePaymentResponse> createPaymentCommandHandler,
        IQueryHandler<GetProjectPaymentsQuery, IEnumerable<PaymentHistoryResponse>> getProjectPaymentsQueryHandler,
        IQueryHandler<GetPublicDonationsQuery, PublicDonationsSummary> getPublicDonationsQueryHandler)
    {
        _createPaymentCommandHandler = createPaymentCommandHandler;
        _getProjectPaymentsQueryHandler = getProjectPaymentsQueryHandler;
        _getPublicDonationsQueryHandler = getPublicDonationsQueryHandler;
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePaymentCommand command, CancellationToken ct)
    {
        try
        {
            var result = await _createPaymentCommandHandler.HandleAsync(command, ct);
            return CreatedAtAction(nameof(Create), new { id = result.Id }, result);
        }
        catch (ApplicationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "An error occurred while processing your request" });
        }
    }

    [Authorize]
    [HttpGet("project/{projectId}")]
    public async Task<IActionResult> GetProjectPayments(Guid projectId, CancellationToken ct)
    {
        try
        {
            var query = new GetProjectPaymentsQuery(projectId);
            var result = await _getProjectPaymentsQueryHandler.HandleAsync(query, ct);
            return Ok(result);
        }
        catch (ApplicationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "An error occurred while processing your request" });
        }
    }

    /// <summary>
    /// Get all public donations across all projects (read-only, no authentication required).
    /// Returns summary with totals and recent donations ordered by CreatedAt descending.
    /// </summary>
    [HttpGet("public")]
    public async Task<IActionResult> GetPublicDonations([FromQuery] int limit = 50, CancellationToken ct = default)
    {
        try
        {
            if (limit <= 0 || limit > 100)
                limit = 50;

            var query = new GetPublicDonationsQuery(limit);
            var result = await _getPublicDonationsQueryHandler.HandleAsync(query, ct);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "An error occurred while retrieving public donations" });
        }
    }
}
