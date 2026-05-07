using Thesis.Application.Common;
using Thesis.Application.DTOs.User;

namespace Thesis.Application.Users.GetById;

public record GetUserByIdQuery(Guid Id) : IQuery<GetUserResponse>;