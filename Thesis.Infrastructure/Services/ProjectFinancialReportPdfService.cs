using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using Thesis.Application.Interfaces;
using Thesis.Domain.Entities;
using Thesis.Domain.Interfaces;

namespace Thesis.Infrastructure.Services;

public sealed class ProjectFinancialReportPdfService : IProjectFinancialReportPdfService
{
    private readonly IProjectRepository _projectRepository;
    private readonly IPaymentRepository _paymentRepository;

    public ProjectFinancialReportPdfService(IProjectRepository projectRepository, IPaymentRepository paymentRepository)
    {
        _projectRepository = projectRepository;
        _paymentRepository = paymentRepository;
    }

    public async Task<byte[]> GeneratePdfAsync(Guid projectId, CancellationToken ct)
    {
        var project = await _projectRepository.GetByIdAsync(projectId, ct)
            ?? throw new ApplicationException($"Проект с идентификатором {projectId} не найден");

        var payments = (await _paymentRepository.GetByProjectIdAsync(projectId, ct))
            .OrderByDescending(payment => payment.CreatedAt)
            .ToList();

        var totalDonations = payments.Count;
        var confirmedAmount = payments
            .Where(payment => IsStatus(payment.Status, "confirmed"))
            .Sum(payment => payment.Amount);
        var pendingCount = payments.Count(payment => IsStatus(payment.Status, "pending"));
        var failedCount = payments.Count(payment => IsStatus(payment.Status, "failed") || IsStatus(payment.Status, "cancelled"));

        var lastKnownBlock = payments
            .Where(payment => payment.BlockNumber.HasValue)
            .Select(payment => payment.BlockNumber!.Value)
            .DefaultIfEmpty(0)
            .Max();

        var generatedAt = DateTime.UtcNow;

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(24);
                page.DefaultTextStyle(style => style.FontSize(10));

                page.Header().Column(column =>
                {
                    column.Spacing(6);
                    column.Item().Text("Финансовый отчет по проекту")
                        .Bold()
                        .FontSize(20)
                        .FontColor(Colors.Blue.Darken2);
                    column.Item().Text($"Дата формирования: {generatedAt:dd.MM.yyyy HH:mm:ss} UTC")
                        .FontSize(10)
                        .FontColor(Colors.Grey.Darken2);
                });

                page.Content().PaddingVertical(10).Column(column =>
                {
                    column.Spacing(14);

                    column.Item().Element(block => RenderSectionHeader(block, "1. Информация о проекте"));
                    column.Item().Element(block => RenderKeyValueGrid(block, new[]
                    {
                        ("Название проекта", project.Title),
                        ("ID проекта", project.Id.ToString()),
                        ("Адрес кошелька", string.IsNullOrWhiteSpace(project.WalletAddress) ? "Не задан" : project.WalletAddress),
                        ("Целевая сумма", $"{FormatEth(project.TargetAmount)} ETH"),
                        ("Собранная сумма", $"{FormatEth(project.CollectedAmount)} ETH"),
                        ("Статус проекта", TranslateProjectStatus(project.Status.ToString()))
                    }));

                    column.Item().Element(block => RenderSectionHeader(block, "2. Финансовая сводка"));
                    column.Item().Element(block => RenderKeyValueGrid(block, new[]
                    {
                        ("Общее количество пожертвований", totalDonations.ToString()),
                        ("Подтвержденная сумма (ETH)", $"{FormatEth(confirmedAmount)} ETH"),
                        ("Ожидающие транзакции", pendingCount.ToString()),
                        ("Неуспешные транзакции", failedCount.ToString())
                    }));

                    column.Item().Element(block => RenderSectionHeader(block, "3. Таблица платежей"));
                    column.Item().Element(block => RenderPaymentsTable(block, payments));

                    column.Item().Element(block => RenderSectionHeader(block, "4. Информация блокчейна"));
                    column.Item().Element(block => RenderKeyValueGrid(block, new[]
                    {
                        ("Последний известный блок", lastKnownBlock == 0 ? "Нет данных" : lastKnownBlock.ToString()),
                        ("Время формирования отчета", generatedAt.ToString("dd.MM.yyyy HH:mm:ss 'UTC'"))
                    }));
                });

                page.Footer().AlignCenter().Text(text =>
                {
                    text.Span("Сформировано системой Thesis Finance. Страница ");
                    text.CurrentPageNumber();
                    text.Span(" из ");
                    text.TotalPages();
                });
            });
        });

        return document.GeneratePdf();
    }

    private static void RenderSectionHeader(IContainer container, string title)
    {
        container
            .PaddingVertical(6)
            .Background(Colors.Grey.Lighten3)
            .PaddingHorizontal(10)
            .Text(title)
            .SemiBold()
            .FontSize(12)
            .FontColor(Colors.Blue.Darken3);
    }

    private static void RenderKeyValueGrid(IContainer container, IEnumerable<(string Key, string Value)> rows)
    {
        container.Table(table =>
        {
            table.ColumnsDefinition(columns =>
            {
                columns.RelativeColumn(2);
                columns.RelativeColumn(3);
            });

            foreach (var (key, value) in rows)
            {
                table.Cell().Element(CellStyle).Text(key).SemiBold();
                table.Cell().Element(CellStyle).Text(value);
            }

            static IContainer CellStyle(IContainer cell) => cell
                .BorderBottom(1)
                .BorderColor(Colors.Grey.Lighten2)
                .PaddingVertical(6)
                .PaddingHorizontal(8);
        });
    }

    private static void RenderPaymentsTable(IContainer container, IReadOnlyCollection<Payment> payments)
    {
        if (payments.Count == 0)
        {
            container
                .Border(1)
                .BorderColor(Colors.Grey.Lighten2)
                .Padding(10)
                .Text("Платежи по проекту отсутствуют.")
                .FontColor(Colors.Grey.Darken2);
            return;
        }

        container.Table(table =>
        {
            table.ColumnsDefinition(columns =>
            {
                columns.RelativeColumn(2.3f);
                columns.RelativeColumn(0.9f);
                columns.RelativeColumn(0.8f);
                columns.RelativeColumn(1f);
                columns.RelativeColumn(1.4f);
                columns.RelativeColumn(0.7f);
                columns.RelativeColumn(0.9f);
            });

            table.Header(header =>
            {
                header.Cell().Element(HeaderCellStyle).Text("Хэш транзакции");
                header.Cell().Element(HeaderCellStyle).Text("Сумма (ETH)");
                header.Cell().Element(HeaderCellStyle).Text("Валюта");
                header.Cell().Element(HeaderCellStyle).Text("Статус");
                header.Cell().Element(HeaderCellStyle).Text("Дата создания");
                header.Cell().Element(HeaderCellStyle).Text("Номер блока");
                header.Cell().Element(HeaderCellStyle).Text("Подтверждения");
            });

            foreach (var payment in payments)
            {
                table.Cell().Element(BodyCellStyle).Text(payment.TxHash).FontSize(8);
                table.Cell().Element(BodyCellStyle).Text(FormatEth(payment.Amount));
                table.Cell().Element(BodyCellStyle).Text(payment.Currency);
                table.Cell().Element(BodyCellStyle).Text(TranslatePaymentStatus(payment.Status));
                table.Cell().Element(BodyCellStyle).Text(payment.CreatedAt.ToString("dd.MM.yyyy HH:mm"));
                table.Cell().Element(BodyCellStyle).Text(payment.BlockNumber?.ToString() ?? "-");
                table.Cell().Element(BodyCellStyle).Text(payment.ConfirmationCount?.ToString() ?? "0");
            }

            static IContainer HeaderCellStyle(IContainer cell) => cell
                .Background(Colors.Grey.Lighten3)
                .BorderBottom(1)
                .BorderColor(Colors.Grey.Darken1)
                .PaddingVertical(5)
                .PaddingHorizontal(4)
                .DefaultTextStyle(style => style.SemiBold().FontSize(9));

            static IContainer BodyCellStyle(IContainer cell) => cell
                .BorderBottom(1)
                .BorderColor(Colors.Grey.Lighten2)
                .PaddingVertical(4)
                .PaddingHorizontal(4)
                .DefaultTextStyle(style => style.FontSize(8));
        });
    }

    private static string FormatEth(decimal value)
    {
        return value.ToString("0.########");
    }

    private static string TranslatePaymentStatus(string status)
    {
        return status.ToLowerInvariant() switch
        {
            "confirmed" => "Подтверждена",
            "pending" => "Ожидает",
            "failed" => "Неуспешна",
            "cancelled" => "Отменена",
            _ => "Неизвестно"
        };
    }

    private static string TranslateProjectStatus(string status)
    {
        return status.ToLowerInvariant() switch
        {
            "active" => "Активный",
            "pending" => "Ожидает настройки",
            "completed" => "Завершен",
            "canceled" => "Отменен",
            _ => "Неизвестно"
        };
    }

    private static bool IsStatus(string source, string expected)
    {
        return source.Equals(expected, StringComparison.OrdinalIgnoreCase);
    }
}
