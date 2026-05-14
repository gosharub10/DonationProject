using Microsoft.Extensions.DependencyInjection;
using Thesis.Application.Common;
using Thesis.Application.DTOs.Project;
using Thesis.Application.DTOs.User;
using Thesis.Application.DTOs.Wallet;
using Thesis.Application.DTOs.Payments;
using Thesis.Application.Projects.Create;
using Thesis.Application.Projects.Delete;
using Thesis.Application.Projects.GetAll;
using Thesis.Application.Projects.GetById;
using Thesis.Application.Projects.Images.Delete;
using Thesis.Application.Projects.Images.Upload;
using Thesis.Application.Projects.Update;
using Thesis.Application.Users.Create;
using Thesis.Application.Users.Delete;
using Thesis.Application.Users.GetAll;
using Thesis.Application.Users.GetById;
using Thesis.Application.Users.Login;
using Thesis.Application.Users.Update;
using Thesis.Application.Wallets.Connect;
using Thesis.Application.Wallets.GetMyWallet;
using Thesis.Application.Payments.Create;
using Thesis.Application.Payments.GetByProject;
using Thesis.Application.Payments.GetPublic;
using Thesis.Application.Projects.Finance.ActivateProject;
using Thesis.Application.Projects.Finance.Queries.GetFinanceDashboard;
using Thesis.Application.Projects.Finance.Queries.GetTransactions;
using Thesis.Application.Projects.Finance.SetProjectTarget;
using Thesis.Application.Projects.Finance.SetProjectWallet;


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
        
        //projects
        services.AddTransient<ICommandHandler<CreateProjectCommand, CreateProjectResponse>, CreateProjectCommandHandler>();
        services.AddTransient<ICommandHandler<UpdateProjectCommand, UpdateProjectResponse>, UpdateProjectCommandHandler>();
        services.AddTransient<ICommandHandler<DeleteProjectCommand, Unit>, DeleteProjectCommandHandler>();
        services.AddTransient<IQueryHandler<GetAllProjectsQuery, IEnumerable<GetProjectResponse>>, GetAllProjectsQueryHandler>();
        services.AddTransient<IQueryHandler<GetProjectByIdQuery, GetProjectResponse>, GetProjectByIdQueryHandler>();
        
        //project images
        services.AddTransient<ICommandHandler<UploadProjectImageCommand, UploadProjectImageResponse>, UploadProjectImageCommandHandler>();
        services.AddTransient<ICommandHandler<DeleteProjectImageCommand, Unit>, DeleteProjectImageCommandHandler>();
        
        //wallets
        services.AddTransient<ICommandHandler<ConnectWalletCommand, ConnectWalletResponse>, ConnectWalletCommandHandler>();
        services.AddTransient<IQueryHandler<GetMyWalletQuery, GetWalletResponse>, GetMyWalletQueryHandler>();
        
        //payments
        services.AddTransient<ICommandHandler<CreatePaymentCommand, CreatePaymentResponse>, CreatePaymentCommandHandler>();
        services.AddTransient<IQueryHandler<GetProjectPaymentsQuery, IEnumerable<PaymentHistoryResponse>>, GetProjectPaymentsQueryHandler>();
        services.AddTransient<IQueryHandler<GetPublicDonationsQuery, PublicDonationsSummary>, GetPublicDonationsQueryHandler>();
        
        // finance queries
        services.AddTransient<IQueryHandler<GetFinanceDashboardQuery, FinanceDashboardResponse>, GetFinanceDashboardQueryHandler>();
        services.AddTransient<IQueryHandler<GetFinanceTransactionsQuery, IEnumerable<Thesis.Application.DTOs.Payments.PaymentHistoryResponse>>, GetFinanceTransactionsQueryHandler>();
        
        // finance
        services.AddTransient<ICommandHandler<SetProjectWalletCommand, Unit>, SetProjectWalletCommandHandler>();
        services.AddTransient<ICommandHandler<SetProjectTargetAmountCommand, Unit>, SetProjectTargetAmountCommandHandler>();
        services.AddTransient<ICommandHandler<ActivateProjectCommand, Unit>, ActivateProjectCommandHandler>();
        
        services.AddHttpContextAccessor();
        
        return services;
    }
}