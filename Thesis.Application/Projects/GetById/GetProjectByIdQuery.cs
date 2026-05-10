using Thesis.Application.Common;
using Thesis.Application.DTOs.Project;

namespace Thesis.Application.Projects.GetById;

public record GetProjectByIdQuery(Guid Id) : IQuery<GetProjectResponse>;