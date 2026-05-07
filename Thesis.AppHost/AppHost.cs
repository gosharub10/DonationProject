using Scalar.Aspire;

var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder.AddPostgres("postgres")
    .WithPgAdmin();

var databaseName = "thesis_db";
var createScript = $$"""
    CREATE DATABASE {{databaseName}};
""";

var db = postgres.AddDatabase(
        name: "thesis-db", 
        databaseName
    )
    .WithCreationScript(createScript);

var migrationService = builder.AddProject<Projects.Thesis_MigrationService>("migration-service")
    .WithReference(db)
    .WaitFor(db);

var server = builder.AddProject<Projects.Thesis_Server>("server")
    .WithReference(db)
    .WaitFor(db)
    .WaitForCompletion(migrationService)
    .WithHttpHealthCheck("/health")
    .WithExternalHttpEndpoints();

var scalar = builder.AddScalarApiReference()
    .WithApiReference(server);

var webfrontend = builder.AddViteApp("webfrontend", "../frontend")
    .WithReference(server)
    .WaitFor(server);

server.PublishWithContainerFiles(webfrontend, "wwwroot");

builder.Build().Run();