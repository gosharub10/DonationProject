using Microsoft.EntityFrameworkCore;
using Thesis.Infrastructure.Data;

namespace Thesis.MigrationService;

public class Worker(
    IServiceProvider serviceProvider,
    IHostApplicationLifetime hostApplicationLifetime) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var scope = serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        Console.WriteLine("Applying database migrations...");

        // CRITICAL STEP: Applies all EF Core Migrations
        await dbContext.Database.MigrateAsync(stoppingToken);

        Console.WriteLine("Database migrations and schema creation complete.");

        // Signal the AppHost that this worker is done.
        hostApplicationLifetime.StopApplication();
    }
}