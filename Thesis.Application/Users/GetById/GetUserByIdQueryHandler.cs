using Thesis.Application.Common;
using Thesis.Application.DTOs.User;
using Thesis.Domain.Interfaces;

namespace Thesis.Application.Users.GetById;

public class GetUserByIdQueryHandler : IQueryHandler<GetUserByIdQuery, GetUserResponse>
{
    private readonly IUserRepository _userRepository;

    public GetUserByIdQueryHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }
    
    public async Task<GetUserResponse> HandleAsync(GetUserByIdQuery query, CancellationToken ct)
    {
        var user = await _userRepository.GetByIdAsync(query.Id, ct);

        if (user is null)
        {
            throw new ApplicationException($"User with id {query.Id} not found.");
        }

        return new GetUserResponse(
            Id: user.Id,
            Name: user.Name,
            Email: user.Email,
            Role: user.Role.ToString(),
            CreatedAt: user.CreatedAt
        );
    }
}