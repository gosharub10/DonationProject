using Thesis.Application.Common;
using Thesis.Application.DTOs.Project;

namespace Thesis.Application.Projects.GetAll;

public record GetAllProjectsQuery() : IQuery<IEnumerable<GetProjectResponse>>;