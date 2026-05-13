using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Thesis.Application.Common;
using Thesis.Application.DTOs.Payments;
using Thesis.Domain.Entities;
using Thesis.Domain.Interfaces;

namespace Thesis.Application.Payments.Create;

/// <summary>
/// Creates a new payment record with PENDING status.
/// The background service (PaymentStatusBackgroundService) will monitor the blockchain
/// and update payment status to CONFIRMED or FAILED.
/// Project funding is updated ONLY after blockchain confirmation, not immediately.
/// </summary>
public sealed class CreatePaymentCommandHandler : ICommandHandler<CreatePaymentCommand, CreatePaymentResponse>
{
    private readonly IPaymentRepository _paymentRepository;
    private readonly IProjectRepository _projectRepository;
    private readonly IUserRepository _userRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CreatePaymentCommandHandler(
        IPaymentRepository paymentRepository,
        IProjectRepository projectRepository,
        IUserRepository userRepository,
        IHttpContextAccessor httpContextAccessor)
    {
        _paymentRepository = paymentRepository;
        _projectRepository = projectRepository;
        _userRepository = userRepository;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<CreatePaymentResponse> HandleAsync(CreatePaymentCommand command, CancellationToken ct)
    {
        // Validate amount
        if (command.Amount <= 0)
            throw new ApplicationException("Amount must be greater than 0");

        // Validate currency
        if (command.Currency != "ETH")
            throw new ApplicationException("Currency must be ETH");

        // Validate txHash is not empty
        if (string.IsNullOrWhiteSpace(command.TxHash))
            throw new ApplicationException("Transaction hash cannot be empty");

        // Check if project exists
        var project = await _projectRepository.GetByIdAsync(command.ProjectId, ct);
        if (project is null)
            throw new ApplicationException($"Project with ID {command.ProjectId} not found");

        // Check if txHash is unique (prevent duplicate payments)
        var existingPayment = await _paymentRepository.GetByTxHashAsync(command.TxHash, ct);
        if (existingPayment is not null)
            throw new ApplicationException("Payment with this transaction hash already exists");

        // Extract UserId from JWT token
        var userIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)
            ?? _httpContextAccessor.HttpContext?.User.FindFirst("sub");

        Guid? userId = null;
        if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out var parsedUserId))
        {
            userId = parsedUserId;
            
            // Verify user exists
            var user = await _userRepository.GetByIdAsync(userId.Value, ct);
            if (user is null)
                throw new ApplicationException("User not found");
        }

        // Create payment entity with PENDING status
        // NOTE: Using new constructor that automatically sets Status to "pending"
        // The background service will update it to "confirmed" or "failed" after blockchain confirmation
        var paymentId = Guid.NewGuid();
        var createdAt = DateTime.UtcNow;

        var payment = new Payment(
            paymentId,
            userId,
            command.ProjectId,
            command.Amount,
            command.Currency,
            command.TxHash,
            createdAt
        );

        // Save payment with PENDING status
        // DO NOT update project funding here - only after blockchain confirmation
        await _paymentRepository.AddAsync(payment, ct);

        return new CreatePaymentResponse(
            payment.Id,
            payment.ProjectId,
            payment.Amount,
            payment.Currency,
            payment.TxHash,
            payment.Status, // Will be "pending"
            payment.CreatedAt
        );
    }
}
