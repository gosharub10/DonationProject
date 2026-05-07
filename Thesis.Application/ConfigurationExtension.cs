using Microsoft.Extensions.DependencyInjection;
using Thesis.Application.Common;
using Thesis.Application.DTOs.User;
using Thesis.Application.Users.Create;
using Thesis.Application.Users.Login;

namespace Thesis.Application;

public static class ConfigurationExtension
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddTransient<ICommandHandler<CreateUserCommand, CreateUserResponse>, CreateUserCommandHandler>();
        services.AddTransient<ICommandHandler<LoginUserCommand, LoginUserResponse>, LoginUserCommandHandler>();
        
        return services;
    }
}