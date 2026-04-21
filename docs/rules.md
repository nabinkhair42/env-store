# ENV Store — Engineering Rules

> These rules govern every file in this codebase.
> When adding anything new, find an existing file that follows the pattern and match it exactly.

---

## Stack

| Concern | Tool |
|---------|------|
| Framework | Next.js (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS (CSS-first config, `globals.css`) |
| UI Primitives | shadcn/ui (radix-luma style, Base UI + Radix) |
| Icons | Hugeicons (`@hugeicons/core-free-icons`) |
| HTTP Client | Axios (centralized instance) |
| Server State | TanStack Query v5 |
| Validation | Zod |
| Forms | React Hook Form + Zod resolvers |
| Auth | NextAuth 5 (GitHub OAuth) |
| Database | MongoDB (native driver) |
| Encryption | Cryptr (AES-256-GCM, server-side only) |
| Package Manager | pnpm |

---

## Project Structure

```
src/
├── app/                                # Next.js App Router
│   ├── (marketing)/                    # Public pages (landing, legal)
│   │   └── page.tsx
│   ├── dashboard/                      # Protected pages
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── api/                            # API route handlers
│   │   └── {resource}/
│   │       ├── route.ts                # Collection endpoints
│   │       └── [id]/route.ts           # Item endpoints
│   ├── layout.tsx
│   ├── globals.css
│   ├── sitemap.ts
│   └── robots.ts
│
├── config/                             # App-wide configuration
│   ├── axios.ts                        # Axios instance + interceptors
│   ├── api-endpoints.ts                # Every API path in one place
│   ├── query-client.ts                 # TanStack Query client defaults
│   └── app-data.ts                     # Constants, enums, feature flags
│
├── services/                           # API service functions (Axios calls)
│   └── {resource}.service.ts           # One file per resource
│
├── hooks/                              # React hooks
│   ├── use-{resource}.ts               # TanStack Query hook per resource
│   └── use-{concern}.ts               # Non-query hooks (UI state, etc.)
│
├── schema/                             # Zod validation schemas
│   ├── index.ts                        # Barrel export
│   ├── env.ts                          # Server env var validation
│   ├── db/                             # Database document schemas (if needed)
│   └── {resource}.ts                   # Request/form validation schema
│
├── types/                              # ALL TypeScript types live here
│   ├── index.ts                        # Barrel export
│   └── {resource}.ts                   # Interfaces, type aliases, enums
│
├── components/
│   ├── ui/                             # shadcn primitives — NEVER hand-edit
│   ├── layouts/                        # Navbar, footer, user controls
│   ├── dialogs/                        # All modal/dialog components
│   ├── auth/                           # Sign-in, unauthorized states
│   ├── seo/                            # Structured data, JSON-LD
│   ├── loaders/                        # Skeletons, spinners
│   └── {feature}/                      # Feature-scoped components
│       ├── {component}.tsx
│       └── index.ts                    # Barrel export
│
├── contexts/                           # React context + provider + hook
│   └── {name}-context.tsx
│
├── providers/                          # Provider composition
│   ├── root-provider.tsx               # Wraps all providers
│   ├── theme-provider.tsx
│   └── query-provider.tsx              # TanStack QueryClientProvider
│
├── lib/                                # Pure utilities (no business logic)
│   ├── utils.ts                        # cn() and shared formatters
│   ├── db.ts                           # MongoDB connection
│   ├── crypto-helpers.ts               # Server-only encrypt/decrypt
│   ├── env-parser.ts                   # .env file parse/generate/download
│   └── sitemap.ts                      # siteConfig + metadata + sitemap
│
└── auth.ts                             # NextAuth configuration
```

---

## Integration Workflow

When adding a new resource or feature, follow this exact order.
Every layer depends on the one above it — never skip a step.

### Step 1 — Types (`types/{resource}.ts`)

Define all interfaces and types for the resource. These are used everywhere else.

```ts
// types/projects.ts
export interface IProject {
  _id?: ObjectId | string;
  name: string;
  description?: string;
  userId: string;
  variables?: IEnvVariable[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IProjectResponse {
  project: IProject;
  message?: string;
  warning?: string;
}

export interface IProjectListResponse {
  projects: IProject[];
  warning?: string;
}
```

Re-export from `types/index.ts`. Import everywhere as `import { IProject } from '@/types'`.

**Rules:**
- ALL types live in `types/`. No inline type definitions in components, hooks, services, or anywhere else.
- Prefix interfaces with `I` for database/domain models: `IProject`, `IEnvVariable`.
- Response shapes get their own interface: `IProjectResponse`, `IProjectListResponse`.
- Zod schemas in `schema/` export inferred types (e.g., `ProjectInput`) but these are ALSO re-exported from `types/index.ts` so there is one import path for everything.

### Step 2 — Schema (`schema/{resource}.ts`)

Define Zod schemas for validation. Used in API routes (server) and forms (client).

```ts
// schema/project.ts
export const ProjectSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().max(200).optional(),
  variables: z.array(EnvVariableSchema),
});

export const UpdateProjectSchema = ProjectSchema.partial().extend({
  id: z.string().min(1),
});

export type ProjectInput = z.infer<typeof ProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
```

Barrel export from `schema/index.ts`.

**Rules:**
- Zod schemas are the single source of truth for validation — API routes and forms use the same schema.
- Inferred types (`ProjectInput`) are exported alongside the schema.
- Database document schemas go in `schema/db/` if needed (e.g., MongoDB validation rules).
- Server env vars: `schema/env.ts` → import as `import { env } from '@/schema/env'`. Never use `process.env` directly.

### Step 3 — API Endpoints (`config/api-endpoints.ts`)

List every endpoint path in one file.

```ts
export const API_ENDPOINTS = {
  PROJECTS: {
    LIST: '/projects',
    CREATE: '/projects',
    GET: (id: string) => `/projects/${id}`,
    UPDATE: (id: string) => `/projects/${id}`,
    DELETE: (id: string) => `/projects/${id}`,
  },
} as const;
```

**Rules:**
- Every API path is defined here. No hardcoded paths anywhere else.
- Dynamic segments use functions.
- Group by resource.

### Step 4 — API Route (`app/api/{resource}/route.ts`)

Server-side handler. Follows: **auth → validate → encrypt → business logic → decrypt → respond**.

```ts
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const data = ProjectSchema.parse(body);

  const encrypted = safeEncryptVariables(data.variables);
  const result = await collection.insertOne({ ...data, variables: encrypted, userId: session.user.id });

  return NextResponse.json({ project: result, message: 'Created' }, { status: 201 });
}
```

**Response shapes — always consistent:**
```ts
// Single resource
{ project: IProject, message?: string, warning?: string }

// List
{ projects: IProject[], warning?: string }

// Error
{ error: string }
```

**Rules:**
- Every handler checks auth first.
- Zod `.parse()` for input validation. Let errors bubble to catch block → return `400`.
- Encrypt before storing, decrypt after reading.
- Never write URL params (`id`) into the MongoDB document — destructure them out.

### Step 5 — Service (`services/{resource}.service.ts`)

Thin Axios wrappers. One function per endpoint. No business logic.

```ts
import api from '@/config/axios';
import { API_ENDPOINTS } from '@/config/api-endpoints';
import { IProject, IProjectResponse, IProjectListResponse } from '@/types';
import { ProjectInput, UpdateProjectInput } from '@/schema';

export const projectService = {
  getAll: () =>
    api.get<never, IProjectListResponse>(API_ENDPOINTS.PROJECTS.LIST),

  getById: (id: string) =>
    api.get<never, IProjectResponse>(API_ENDPOINTS.PROJECTS.GET(id)),

  create: (data: ProjectInput) =>
    api.post<never, IProjectResponse>(API_ENDPOINTS.PROJECTS.CREATE, data),

  update: (id: string, data: Partial<UpdateProjectInput>) =>
    api.put<never, IProjectResponse>(API_ENDPOINTS.PROJECTS.UPDATE(id), data),

  delete: (id: string) =>
    api.delete<never, { message: string }>(API_ENDPOINTS.PROJECTS.DELETE(id)),
};
```

**Rules:**
- One service file per resource, named `{resource}.service.ts`.
- Services are plain objects — no classes, no state, no side effects, no toast.
- Types from `@/types`, schemas from `@/schema`.
- Use `<never, ResponseType>` generic since the Axios interceptor unwraps `.data`.
- Never import `axios` directly — always use the `api` instance from `config/axios.ts`.

### Step 6 — Hook (`hooks/use-{resource}.ts`)

TanStack Query hook. Handles queries, mutations, cache invalidation, and toast feedback.

```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '@/services/project.service';
import { toast } from 'react-hot-toast';

const projectKeys = {
  all:    ['projects'] as const,
  list:   () => [...projectKeys.all, 'list'] as const,
  detail: (id: string) => [...projectKeys.all, 'detail', id] as const,
};

// --- Queries ---

export function useProjects() {
  return useQuery({
    queryKey: projectKeys.list(),
    queryFn: async () => {
      const res = await projectService.getAll();
      if (res.warning) toast.error(res.warning, { duration: 8000 });
      return res.projects;
    },
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => projectService.getById(id),
    enabled: !!id,
  });
}

// --- Mutations ---

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: projectService.create,
    onSuccess: ({ message }) => {
      qc.invalidateQueries({ queryKey: projectKeys.all });
      toast.success(message);
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UpdateProjectInput> }) =>
      projectService.update(id, data),
    onSuccess: ({ project, warning }) => {
      qc.setQueryData(projectKeys.detail(String(project._id)), { project });
      qc.invalidateQueries({ queryKey: projectKeys.list() });
      toast.success('Project updated');
      if (warning) toast.error(warning, { duration: 8000 });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: projectService.delete,
    onSuccess: ({ message }) => {
      qc.invalidateQueries({ queryKey: projectKeys.all });
      toast.success(message);
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
```

**Rules:**
- One hook file per resource. Queries and mutations together — flat in `hooks/`, no subdirectories.
- Query keys are defined at the top of the hook file using the `resourceKeys` pattern.
- `useQuery` for reads, `useMutation` for writes. Never use `useState` + `useEffect` for server data.
- Mutations always invalidate relevant queries on success.
- Toast notifications live in hook callbacks (`onSuccess`, `onError`), never in components.
- Use `enabled` for conditional/dependent queries.
- Non-query hooks (UI state, variable editing) stay as plain `use-{concern}.ts` files alongside query hooks.

### Step 7 — Component (`components/{feature}/{component}.tsx`)

Consumes hooks. Focused on rendering.

```tsx
export function Dashboard() {
  const { data: projects, isLoading, error } = useProjects();
  const { mutate: deleteProject } = useDeleteProject();

  if (isLoading) return <DashboardSkeleton />;
  if (error) return <ErrorState message={error.message} />;
  if (!projects?.length) return <EmptyState />;

  return projects.map((p) => (
    <ProjectCard key={p._id} project={p} onDelete={() => deleteProject(String(p._id))} />
  ));
}
```

**Rules:**
- Components call hooks for data and mutations. No direct service or fetch calls.
- Handle all three states: loading (skeleton), error (message + retry), empty (CTA).
- Types from `@/types` only. Never define inline interfaces or types in component files.

---

## Axios Configuration

### `config/axios.ts`

```ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

api.interceptors.response.use(
  (res) => res.data,
  (error) => {
    const message =
      error.response?.data?.error || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  },
);

export default api;
```

**Rules:**
- Single instance. Every client HTTP call goes through it.
- Response interceptor unwraps `.data` — services receive the parsed body directly.
- Error interceptor normalizes to `Error` with human-readable message.
- Never import raw `axios` outside this file.

---

## TanStack Query Configuration

### `config/query-client.ts`

```ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: true,
    },
    mutations: { retry: 0 },
  },
});
```

### `providers/query-provider.tsx`

```tsx
'use client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/config/query-client';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
```

Wire into `providers/root-provider.tsx`.

---

## UI & Design System

### shadcn

- `components/ui/` is managed by shadcn CLI — **never hand-edit**.
- Add components: `npx shadcn@latest add <component>`.
- Config: `components.json` (radix-luma style, neutral base, CSS variables, hugeicons).
- Compose features from `ui/` primitives. Don't modify primitives.
- No barrel export for `components/ui/` — shadcn expects direct file imports.

### Icons

- **Hugeicons only.** `import { IconName } from '@hugeicons/core-free-icons'`.
- Render: `<HugeiconsIcon icon={IconName} size={16} strokeWidth={1.5} />`.
- No other icon libraries.

### Tailwind

- Tailwind utilities only. No CSS modules, no styled-components, no inline `style={}`.
- `cn()` for conditional classes. Import from `@/lib/utils`.
- Semantic tokens: `text-foreground`, `bg-background`, `border-border`, `bg-card`, `text-muted-foreground`. Defined in `globals.css`.
- **Never use `dark:` prefix.** Dark mode is CSS-variable-driven via `next-themes`.
- Responsive: mobile-first. Base = mobile, layer up with `sm:`, `md:`, `lg:`.
- Content width: `max-w-4xl mx-auto px-6`.
- Use Tailwind spacing scale. No arbitrary values like `p-[13px]`.
- `font-mono` for code and env variable values.

---

## File Naming & Exports

| Item | Convention | Example |
|------|-----------|---------|
| Files | kebab-case | `project-card.tsx`, `use-projects.ts` |
| Components | Named export, PascalCase | `export function ProjectCard()` |
| Hooks | Named export, camelCase | `export function useProjects()` |
| Services | Named export, camelCase | `export const projectService` |
| Types | Named export, PascalCase, `I` prefix for models | `export interface IProject` |
| Schemas | Named export, PascalCase | `export const ProjectSchema` |
| Constants | Named export, UPPER_SNAKE_CASE | `export const API_ENDPOINTS` |
| Pages/Layouts/Routes | `export default` (Next.js only) | `export default function Page()` |

- File name matches the primary export.
- One component per file.
- `export default` is reserved for pages, layouts, and route handlers only.

---

## Component Rules

### Server vs Client

- Default to server components (no directive).
- `'use client'` only for: hooks, events, browser APIs, context consumers.
- Push `'use client'` as low as possible — extract interactive leaves.

### States

- **Loading:** Skeletons from `components/loaders/`. Never blank screens.
- **Error:** Message + retry action. Never raw error objects.
- **Empty:** Helpful message + CTA.

### Props

- All prop types from `@/types`. Never inline.
- Simple props (≤3 fields) can be destructured without a named interface, but the types themselves still come from `@/types`.

---

## Context Rules

- Context files live in `contexts/{name}-context.tsx`.
- Each file exports three things: the Provider component, a consumer hook (`useXxxContext`), and the interface.
- Contexts are for **client-side global state only** (modals, sidebar, theme). Never for server data.

---

## Encryption

- Server-side only. `lib/crypto-helpers.ts` uses Cryptr.
- `safeEncryptVariables()` before DB writes. `safeDecryptVariables()` after DB reads.
- Returns `{ variables, failedKeys }`. Failed keys become `warning` in API response.
- Never expose `ENCRYPTION_SECRET` to the browser.
- Never claim "end-to-end encryption" in marketing copy.

---

## Auth

- Server: `const session = await auth()` → check `session?.user?.id`.
- Client: `useSession()` from `next-auth/react`.
- Every API route checks auth first → `401` if missing.
- GitHub OAuth only.

---

## Site Metadata

- `siteConfig` in `lib/sitemap.ts` is the single source of truth.
- Never hardcode app name, URL, author, or description. Reference `siteConfig`.
- Structured data in `components/seo/` references `siteConfig`.

---

## Error Handling

- API routes: try/catch → `console.error` → `{ error }` with HTTP status.
- Hooks: `onError` → `toast.error(error.message)`.
- Queries: Use TanStack Query's `error` state in components.
- Encryption: Per-variable isolation → `failedKeys` → warning toast.
- Never silently swallow errors. Every catch must log, surface, or re-throw.

---

## TypeScript

- Strict mode. No `any` (ESLint enforced).
- Unused vars: prefix with `_`.
- `interface` for object shapes, `type` for unions/intersections.
- ALL types in `types/`. None inline.

---

## Git

- Commits: `type: description` — `feat`, `fix`, `refactor`, `chore`, `docs`.
- No `console.log`. Use `console.error` for real errors only.
- No commented-out code.
- `tsc --noEmit` must pass before committing.

---

## Don'ts

- Don't use raw `fetch()` or direct `axios` — use the `api` instance from `config/axios.ts`.
- Don't use `useEffect` for data fetching — use TanStack Query.
- Don't store server data in `useState` — TanStack Query manages it.
- Don't define types inline — all types in `types/`.
- Don't hardcode API paths — use `config/api-endpoints.ts`.
- Don't put toast/UI logic in services — services are pure data layer.
- Don't manually edit `components/ui/` — use shadcn CLI.
- Don't hardcode values from `siteConfig` or `config/app-data.ts`.
- Don't use `dark:` Tailwind prefix — theme uses CSS variables.
- Don't install CSS-in-JS, alternative icon packs, mongoose, Redux, or Zustand.
- Don't create barrel exports for `components/ui/` — shadcn expects direct imports.
- Don't add `console.log` or commented-out code.
