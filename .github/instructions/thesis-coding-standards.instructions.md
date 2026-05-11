---
description: "Use when implementing backend CQRS operations, frontend components, services, or API integrations. Covers naming conventions, folder structure, design patterns, and type-safety principles for both .NET backend and React/TypeScript frontend."
name: "Thesis Coding Standards"
---

# Thesis Project Coding Standards

This guide ensures consistency across the Thesis application's .NET backend and React/TypeScript frontend.

## Backend (.NET) - CQRS Pattern

### Naming Conventions

- **Commands** (mutations): `Create{Entity}Command`, `Update{Entity}Command`, `Delete{Entity}Command`
- **Queries** (reads): `GetAll{Entity}Query`, `GetById{Entity}Query`, `GetMy{Entity}Query`
- **Command Handlers**: `Create{Entity}CommandHandler`, `Update{Entity}CommandHandler`, etc.
- **Query Handlers**: `GetAll{Entity}QueryHandler`, `GetById{Entity}QueryHandler`, etc.
- **Response DTOs**: `{Operation}{Entity}Response` (e.g., `CreateProjectResponse`, `GetAllProjectsResponse`)
- **Controllers**: `{Entity}Controller` (e.g., `ProjectController`, `UserController`)

### Command and Query Structure

Commands and Queries must implement their respective interfaces:

```csharp
// Command: sealed record for immutability and type safety
public sealed record CreateProjectCommand(
    string Title,
    string Description
) : ICommand<CreateProjectResponse>;

// Query: similar structure
public sealed record GetProjectByIdQuery(int ProjectId) : IQuery<ProjectResponse>;
```

### Handlers

Place handlers in the same folder as their command/query, following the folder-per-operation pattern:

```
Thesis.Application/
├── Projects/
│   ├── Create/
│   │   ├── CreateProjectCommand.cs
│   │   └── CreateProjectCommandHandler.cs
│   ├── GetAll/
│   │   ├── GetAllProjectsQuery.cs
│   │   └── GetAllProjectsQueryHandler.cs
│   └── ...
```

Handlers inject repositories and services:

```csharp
public sealed class CreateProjectCommandHandler : ICommandHandler<CreateProjectCommand, CreateProjectResponse>
{
    private readonly IProjectRepository _repository;
    private readonly IMapper _mapper;

    public CreateProjectCommandHandler(IProjectRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<CreateProjectResponse> Handle(CreateProjectCommand request, CancellationToken cancellationToken)
    {
        // Implement logic
    }
}
```

### DTOs Organization

Group response DTOs by entity type:

```
Thesis.Application/DTOs/
├── Project/
│   ├── CreateProjectResponse.cs
│   ├── GetProjectResponse.cs
│   └── UpdateProjectResponse.cs
├── User/
│   ├── CreateUserResponse.cs
│   ├── UserLoginResponse.cs
│   └── GetUserResponse.cs
├── Wallet/
│   ├── ConnectWalletResponse.cs
│   └── GetWalletResponse.cs
```

### Dependency Injection

Use extension methods in `ConfigurationExtension.cs` to register services:

```csharp
// In Thesis.Application/ConfigurationExtension.cs
public static IServiceCollection AddApplication(this IServiceCollection services)
{
    services.AddScoped<ICommandHandler<CreateProjectCommand, CreateProjectResponse>, CreateProjectCommandHandler>();
    services.AddScoped<IQueryHandler<GetAllProjectsQuery, IEnumerable<GetProjectResponse>>, GetAllProjectsQueryHandler>();
    return services;
}
```

Registrations:
- **Commands/Queries**: Transient or Scoped (typically Transient for handlers)
- **Repositories**: Scoped
- **Services**: Scoped (db context dependent) or Singleton (stateless utilities)

### Entity Design

Entities must encapsulate business logic:

- Use private setters for encapsulation
- Init-only properties for IDs and timestamps
- Business logic methods should validate state before modifications
- Use domain enums for statuses

```csharp
public class Project
{
    public int Id { get; init; }
    public string Title { get; private set; }
    public ProjectStatus Status { get; private set; }
    
    public void Activate()
    {
        if (Status != ProjectStatus.Draft)
            throw new InvalidOperationException("Only draft projects can be activated.");
        Status = ProjectStatus.Active;
    }
}
```

---

## Frontend (React/TypeScript) - Structure and Conventions

### Naming Conventions

- **Components**: PascalCase (e.g., `MetaMaskConnect`, `ProjectCard`, `UserForm`)
- **Services**: camelCase + `Service` suffix (e.g., `authService.ts`, `projectService.ts`, `walletService.ts`)
- **Types/Models**: PascalCase interfaces (e.g., `AuthUser`, `ProjectData`, `WalletInfo`)
- **Context**: `{Domain}Context.tsx` (e.g., `AuthContext.tsx`) with companion provider component `{Domain}Provider`
- **Pages**: PascalCase (e.g., `ProjectsPage`, `DashboardPage`)
- **Hooks**: camelCase, prefixed with `use` (e.g., `useAuth`, `useProject`)

### Folder Structure

```
src/
├── components/
│   ├── form/         # Form-related components (inputs, validation)
│   ├── layout/       # Layout wrappers, templates
│   ├── navbar/       # Navigation and header components
│   └── protected/    # Auth-gated/wrapper components
├── context/          # React Context providers (AuthContext.tsx)
├── services/         # API client wrappers, one per domain
├── models/           # TypeScript interfaces and types
├── api/              # Axios instance and base configuration
├── pages/            # Page-level components (App routes)
├── router/           # React Router setup and route definitions
├── index.css         # Global styles
└── main.tsx          # Entry point
```

### Services Layer

Create one service file per backend domain, abstracting axios calls:

```typescript
// src/services/projectService.ts
import api from '../api/axiosInstance';
import { ProjectData, CreateProjectRequest } from '../models/Project';

export const projectService = {
  getAll: async (): Promise<ProjectData[]> => {
    const { data } = await api.get('/projects');
    return data;
  },

  getById: async (id: number): Promise<ProjectData> => {
    const { data } = await api.get(`/projects/${id}`);
    return data;
  },

  create: async (payload: CreateProjectRequest): Promise<ProjectData> => {
    const { data } = await api.post('/projects', payload);
    return data;
  },
};
```

### Models/Types

Centralize all TypeScript interfaces in `src/models/`:

```typescript
// src/models/Project.ts
export interface ProjectData {
  id: number;
  title: string;
  description: string;
  status: 'Draft' | 'Active' | 'Completed';
  createdAt: Date;
}

export interface CreateProjectRequest {
  title: string;
  description: string;
}
```

### Context and State Management

Use React Context API for global state (authentication, user data):

```typescript
// src/context/AuthContext.tsx
import { createContext, useContext } from 'react';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Implementation
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

### Component Structure

- Keep components focused on a single responsibility
- Lift state up only when necessary
- Use context for cross-cutting concerns (auth, user preferences)
- Props should be typed with interfaces

```typescript
interface CardProps {
  title: string;
  description: string;
  onDelete: () => void;
}

export const ProjectCard: React.FC<CardProps> = ({ title, description, onDelete }) => {
  return (
    <div>
      <h3>{title}</h3>
      <p>{description}</p>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
};
```

### API Integration Pattern

1. **Define types** in `models/`
2. **Create service** in `services/`
3. **Use in component** via service calls or custom hooks

```typescript
// src/components/ProjectList.tsx
import { useEffect, useState } from 'react';
import { projectService } from '../services/projectService';
import { ProjectData } from '../models/Project';

export const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectService.getAll().then(data => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{projects.map(p => <div key={p.id}>{p.title}</div>)}</div>;
};
```

---

## Cross-Layer Design Principles

### 1. Domain Alignment
Backend domain structure (Projects, Users, Wallets) directly mirrors frontend service organization. When adding a new domain:
- Create `{Domain}` folder in `Thesis.Application`
- Add Create/Update/Delete/GetAll/GetById operations
- Create corresponding response DTOs
- Create matching frontend service in `src/services/{domain}Service.ts`

### 2. Type Safety
- Backend: Use sealed records for commands, interfaces for responses
- Frontend: Use TypeScript interfaces matching backend DTOs
- Ensure API contracts match on both sides

### 3. Authorization
- JWT tokens passed in Authorization header (`Bearer {token}`)
- Backend validates with `[Authorize]` attribute
- Frontend stores token in context/localStorage and includes in all API requests

### 4. Error Handling
- Backend returns consistent error responses with status codes and messages
- Frontend services catch errors and propagate to components
- Components display user-friendly error messages from error context

---

## Example: Adding a New Feature

**Backend:**
1. Create new entity (if needed) in `Thesis.Domain/Entities/`
2. Create new operations in `Thesis.Application/NewDomain/Create`, `GetAll`, etc.
3. Register commands/queries in `ConfigurationExtension.cs`
4. Add endpoints in `Thesis.Server/Controllers/NewDomainController.cs`

**Frontend:**
1. Create TypeScript models in `src/models/NewDomain.ts`
2. Create service in `src/services/newDomainService.ts`
3. Create components in `src/components/` with proper folder nesting
4. Integrate with pages and router

Maintain parallel structure for consistency and discoverability.
