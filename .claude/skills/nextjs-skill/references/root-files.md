# Root Files Reference

Exact content for `README.md`, `CHANGELOG.md`, `CONTEXT.md`, `CLAUDE.md`, and `Dockerfile`.

---

## `README.md`

````markdown
# [Project Name]

> Short one-line description of what this project does.

## Tech Stack

| Layer         | Technology                       |
| ------------- | -------------------------------- |
| Framework     | Next.js 16 (App Router)          |
| Language      | TypeScript                       |
| Styling       | Tailwind CSS                     |
| Data Fetching | React Query + Axios              |
| Validation    | Zod                              |
| Animations    | Framer Motion                    |
| Theming       | next-themes                      |
| Notifications | react-hot-toast                  |
| Icons         | react-icons                      |
| Utilities     | lodash                           |
| Linting       | ESLint + Prettier                |
| Git Hooks     | Husky + lint-staged + commitlint |

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
git clone https://github.com/your-org/your-repo.git
cd your-repo
npm install
cp .env.example .env.local
# Fill in .env.local values
npm run dev
```
````

### Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run format       # Prettier format
npm run type-check   # TypeScript check (no emit)
```

## Project Structure

See `CLAUDE.md` for the full folder structure and architectural decisions.

## Environment Variables

See `.env.example` for all required variables.

## Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/).

Format: `type(scope): subject`

Types: `feat` | `fix` | `docs` | `style` | `refactor` | `perf` | `test` | `chore` | `revert`

## License

MIT

````

---

## `CHANGELOG.md`

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project scaffold

---

## [0.1.0] - YYYY-MM-DD

### Added
- Project initialized with Next.js 16 App Router
- TypeScript, Tailwind CSS, React Query, Axios
- Zod validation, Framer Motion, next-themes
- react-hot-toast, react-icons, lodash
- ESLint, Prettier, Husky, lint-staged, commitlint
- Dockerfile (multi-stage)
- Root documentation files
````

---

## `CONTEXT.md`

```markdown
# Project Context

This file defines the domain language used in this project.
Claude reads this file every session. Use these exact terms consistently.

## Domain Glossary

| Term   | Definition                      |
| ------ | ------------------------------- |
| [Term] | [What it means in this project] |

## Business Rules

- [Rule 1]
- [Rule 2]

## Data Relationships

- A `[Entity A]` belongs to one `[Entity B]`
- A `[Entity B]` can have many `[Entity A]`s

## Status Flows
```

[StateA] → [StateB] → [StateC]

```

## API Conventions

- Base URL: `NEXT_PUBLIC_API_URL`
- Auth: httpOnly cookie (refresh token) + access token
- Error shape: `{ type, errors: [{ code, detail, attr }] }`
- Pagination: `{ count, next, previous, results }`
```

---

## `CLAUDE.md`

```markdown
# CLAUDE.md — AI Project Bible

This file is read by Claude at the start of every session.
It contains all conventions, patterns, and rules for this project.

## Tech Stack

- **Framework**: Next.js 16, App Router, TypeScript
- **Styling**: Tailwind CSS (dark mode via `class`)
- **Data Fetching**: React Query + Axios
- **Validation**: Zod
- **Animations**: Framer Motion
- **Theming**: next-themes
- **Notifications**: react-hot-toast
- **Icons**: react-icons
- **Utilities**: lodash

## Folder Structure
```

src/
├── app/ # App Router (pages, layouts, route groups)
├── components/ # ui/, layout/, [feature]/
├── hooks/ # useQueryWithTokenRefresh, useMutationWithTokenRefresh, etc.
├── service/ # One file per domain (projectsService, companiesService)
├── lib/ # api.ts (Axios), queryClient.ts, validations/
├── types/ # TypeScript interfaces per domain
├── context/ # React contexts
├── config/ # config.ts (env vars via Config object)
├── utils/ # Pure utility functions
└── styles/ # globals.css

````

## API Layer Rules

### Axios Instance
Located at `src/lib/api.ts`. Includes:
- `baseURL` from `Config.API_URL`
- `withCredentials: true` (httpOnly cookies)
- 401 interceptor with token refresh and retry
- Exported helpers: `get<T>`, `post<T>`, `patch<T>`, `del<T>`

### Config Object
Located at `src/config/config.ts`.
**Never read `process.env` directly in components or services.**
Always use `Config.API_URL`, `Config.BACKEND_URL`, `Config.SITE_URL`.

### Service Pattern
Each domain has a service file, e.g. `src/service/projectsService.ts`:
```ts
import { get, post, patch, del } from "@/lib/api";
import { ProjectType } from "@/types/project";

export const projectsService = () => ({
  getProjects: () => get<ProjectType[]>("/projects/"),
  getProjectById: (id: number) => get<ProjectType>(`/projects/${id}/`),
  createProject: (data: Partial<ProjectType>) => post<ProjectType>("/projects/", data),
  updateProject: (id: number, data: Partial<ProjectType>) =>
    patch<ProjectType>(`/projects/${id}/`, data),
  deleteProject: (id: number) => del<void>(`/projects/${id}/`),
});
````

### GET Calls — useQueryWithTokenRefresh

```tsx
const { data, isLoading, error } = useQueryWithTokenRefresh(
  ["query-key", dependency],
  async () => {
    const response = await domainService().getMethod(dependency);
    return response;
  },
  { enabled: !!dependency },
);
```

### POST/PATCH/DELETE — useMutationWithTokenRefresh

```tsx
const handleAction = useMutationWithTokenRefresh(
  (data: DataType) => domainService().mutateMethod(data),
  {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["query-key"] });
      toast.success("Success message");
    },
    onError: (error: unknown) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  },
);
// Call: handleAction.mutate(data)
```

## Naming Conventions

| Thing         | Convention              | Example                       |
| ------------- | ----------------------- | ----------------------------- |
| Components    | PascalCase              | `UserCard.tsx`                |
| Hooks         | `use` prefix, camelCase | `useQueryWithTokenRefresh.ts` |
| Services      | camelCase + `Service`   | `projectsService.ts`          |
| Types         | PascalCase              | `ProjectType.ts`              |
| Zod schemas   | camelCase + `Schema`    | `projectSchema.ts`            |
| Route folders | kebab-case              | `user-management/`            |

## TypeScript Rules

- No `any` — use `unknown` and narrow
- All API shapes have a type in `src/types/`
- Zod schemas in `src/lib/validations/`

## Component Rules

- One default export per file
- `"use client"` only when needed (state, events, browser APIs)
- Props interfaces defined above the component in the same file

## Do Not

- Read `process.env` directly in components
- Use hardcoded colors — add to `tailwind.config.ts`
- Use `any` type
- Commit directly to `main` — always use PRs

````

---

## `Dockerfile`

Multi-stage build for Next.js:

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build args for public env vars (injected at build time)
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_SITE_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
````

> **Important:** Add `output: "standalone"` to `next.config.ts` for the Dockerfile to work:
>
> ```ts
> const nextConfig: NextConfig = {
>   output: "standalone",
>   // ...
> };
> ```

### Build & Run

```bash
# Build
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://api.example.com \
  --build-arg NEXT_PUBLIC_BACKEND_URL=https://api.example.com \
  --build-arg NEXT_PUBLIC_SITE_URL=https://example.com \
  -t my-app:latest .

# Run
docker run -p 3000:3000 my-app:latest
```

### `docker-compose.yml` (optional)

```yaml
version: "3.8"
services:
  web:
    build:
      context: .
      args:
        NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
        NEXT_PUBLIC_BACKEND_URL: ${NEXT_PUBLIC_BACKEND_URL}
        NEXT_PUBLIC_SITE_URL: ${NEXT_PUBLIC_SITE_URL}
    ports:
      - "3000:3000"
    restart: unless-stopped
```
