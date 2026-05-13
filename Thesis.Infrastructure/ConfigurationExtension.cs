using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Minio;
using Npgsql;
using Thesis.Application.Interfaces;
using Thesis.Domain.Interfaces;
using Thesis.Infrastructure.Data;
using Thesis.Infrastructure.Data.Repositories;
using Thesis.Infrastructure.Services;

namespace Thesis.Infrastructure;

public static class ConfigurationExtension
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>((serviceProvider, options) =>
        {
            var dataSource = serviceProvider.GetRequiredService<NpgsqlDataSource>();
            options.UseNpgsql(dataSource);
        });
        
        //repos
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IProjectRepository, ProjectRepository>();
        services.AddScoped<IWalletRepository, WalletRepository>();
        services.AddScoped<IPaymentRepository, PaymentRepository>();
        
        //services
        services.AddScoped<IImageService, MinioImageService>();
        services.AddTransient<IPasswordHasher, PasswordHasher>();
        services.AddTransient<ITokenService, TokenService>();
        
        services.AddSingleton<IBlockchainTransactionService, BlockchainTransactionService>();
        // Background service for payment status monitoring
        services.AddHostedService<PaymentStatusBackgroundService>();
        
        return services;
    }
}