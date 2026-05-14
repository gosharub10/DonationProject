using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Thesis.Application.Interfaces;

namespace Thesis.Server.Controllers;

[ApiController]
[Route("api/finance")]
[Authorize(Roles = "FinanceManager")]
public sealed class FinanceReportsController : ControllerBase
{
    private readonly IProjectFinancialReportPdfService _pdfService;

    public FinanceReportsController(IProjectFinancialReportPdfService pdfService)
    {
        _pdfService = pdfService;
    }

    [HttpGet("projects/{projectId:guid}/report/pdf")]
    public async Task<IActionResult> DownloadProjectPdf(Guid projectId, CancellationToken ct)
    {
        var pdfBytes = await _pdfService.GeneratePdfAsync(projectId, ct);
        var fileName = $"project-{projectId}-financial-report.pdf";

        return File(pdfBytes, "application/pdf", fileName);
    }
}
