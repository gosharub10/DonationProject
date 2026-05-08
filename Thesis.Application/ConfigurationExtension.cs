using Microsoft.Extensions.DependencyInjection;
using Thesis.Application.Common;
using Thesis.Application.DTOs.Project;
using Thesis.Application.DTOs.User;
using Thesis.Application.Projects.GetAll;
using Thesis.Application.Users.Create;
using Thesis.Application.Users.Delete;
using Thesis.Application.Users.GetAll;
using Thesis.Application.Users.GetById;
using Thesis.Application.Users.Login;
using Thesis.Application.Users.Update;

namespace Thesis.Application;

public static class ConfigurationExtension
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        //user
        services.AddTransient<ICommandHandler<CreateUserCommand, CreateUserResponse>, CreateUserCommandHandler>();
        services.AddTransient<ICommandHandler<LoginUserCommand, LoginUserResponse>, LoginUserCommandHandler>();
        services.AddTransient<ICommandHandler<UpdateUserCommand, UpdateUserResponse>, UpdateUserCommandHandler>();
        services.AddTransient<ICommandHandler<DeleteUserCommand, Unit>, DeleteUserCommandHandler>();
        services.AddTransient<IQueryHandler<GetAllUsersQuery, IEnumerable<GetUserResponse>>, GetAllUserQueryHandler>();
        services.AddTransient<IQueryHandler<GetUserByIdQuery, GetUserResponse>, GetUserByIdQueryHandler>();
        
        //proj
        services.AddTransient<IQueryHandler<GetAllProjectsQuery, IEnumerable<GetProjectResponse>>, GetAllProjectsQueryHandler>();
        
        return services;
    }
}