namespace Thesis.Application.Interfaces;

public interface IProjectFinancialReportPdfService
{
    Task<byte[]> GeneratePdfAsync(Guid projectId, CancellationToken ct);
}
