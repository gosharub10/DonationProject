using Thesis.Infrastructure.Data;
using Thesis.MigrationService;

var builder = Host.CreateApplicationBuilder(args);

builder.AddNpgsqlDbContext<AppDbContext>(connectionName: "thesis-db");
builder.Services.AddHostedService<Worker>();

var host = builder.Build();
host.Run();