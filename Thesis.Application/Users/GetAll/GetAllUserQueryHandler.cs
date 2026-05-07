using Thesis.Application.Common;
using Thesis.Application.DTOs.User;
using Thesis.Domain.Interfaces;

namespace Thesis.Application.Users.GetAll;

public class GetAllUserQueryHandler : IQueryHandler<GetAllUsersQuery, IEnumerable<GetUserResponse>>
{
    private readonly IUserRepository _userRepository;
    
    public GetAllUserQueryHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }
    
    public async Task<IEnumerable<GetUserResponse>> HandleAsync(GetAllUsersQuery query, CancellationToken ct)
    {
        var users = await _userRepository.GetAllAsync(ct);

        return users.Select(user => new GetUserResponse(
            Id: user.Id,
            Name: user.Name,
            Email: user.Email,
            Role: user.Role,
            CreatedAt: user.CreatedAt
        )).ToList();
    }
}