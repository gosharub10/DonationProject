using Thesis.Application.Common;
using Thesis.Application.DTOs.User;

namespace Thesis.Application.Users.GetAll;

public record GetAllUsersQuery() : IQuery<IEnumerable<GetUserResponse>>;