---
name: nextjs-project
description: >
  Use this skill whenever a user wants to scaffold, set up, or start a new Next.js project,
  or when they ask how to structure a Next.js app. Triggers include: "create a Next.js project",
  "set up Next.js", "Next.js app router", "scaffold a Next.js app", "new Next.js project",
  "Next.js folder structure", "Next.js with TypeScript", "Next.js with Tailwind", or any
  combination of these. Also trigger when the user asks about installing any subset of:
  react-query, axios, zod, framer-motion, next-themes, react-hot-toast, react-icons,
  lodash, husky, prettier, eslint in a Next.js context. Always use this skill before writing
  any Next.js boilerplate — it encodes the correct folder structure, tooling config, and
  stack conventions so Claude doesn't guess.
---

# Next.js Project Skill

Stack: **Next.js 16 (App Router) · TypeScript · Tailwind CSS · React Query · Axios · Zod · Framer Motion · next-themes · react-hot-toast · react-icons · lodash · ESLint · Prettier · Husky**

Read `references/folder-structure.md` for the full folder tree.
Read `references/tooling-config.md` for ESLint, Prettier, Husky, and tsconfig.
Read `references/root-files.md` for README, CHANGELOG, CONTEXT, CLAUDE, and Dockerfile content.

---

## 1. Create the Project

```bash
npx create-next-app@latest my-app \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
cd my-app
```

## 2. Install All Dependencies

```bash
npm install \
  @tanstack/react-query \
  @tanstack/react-query-devtools \
  axios \
  zod \
  framer-motion \
  next-themes \
  react-hot-toast \
  react-icons \
  lodash

npm install -D \
  @types/lodash \
  prettier \
  eslint-config-prettier \
  eslint-plugin-prettier \
  husky \
  lint-staged \
  @commitlint/cli \
  @commitlint/config-conventional
```

## 3. Folder Structure

See `references/folder-structure.md` for the full annotated tree. Summary:

```
src/
├── app/                    # App Router pages and layouts
├── components/             # Shared UI components
├── hooks/                  # Custom React hooks (query, mutation, etc.)
├── service/                # API service functions per domain
├── lib/                    # Axios instance, query client, utilities
├── types/                  # Global TypeScript types/interfaces
├── context/                # React context providers
├── config/                 # Config constants (env vars, site config)
├── utils/                  # Pure utility functions
├── styles/                 # Global CSS / Tailwind base
└── middleware.ts            # Next.js middleware
```

## 4. Key Setup Steps

### QueryClient Provider

Wrap the app in a `QueryClientProvider` inside a `"use client"` component at `src/app/providers.tsx`, then import it in `src/app/layout.tsx`.

### Theme Provider

Wrap with `ThemeProvider` from `next-themes` — set `attribute="class"` and `defaultTheme="system"`. Place inside `providers.tsx` alongside QueryClientProvider.

### Toaster

Add `<Toaster />` from `react-hot-toast` inside `providers.tsx`.

### Axios Instance

Create `src/lib/api.ts` — see `references/folder-structure.md` for placement. The Config type lives at `src/config/config.ts`.

### Environment Variables

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_BACKEND_URL=
NEXT_PUBLIC_SITE_URL=
```

Always use `Config` object from `src/config/config.ts` — never read `process.env` directly in components.

## 5. Naming Conventions

| Thing             | Convention                   | Example                       |
| ----------------- | ---------------------------- | ----------------------------- |
| Components        | PascalCase                   | `UserCard.tsx`                |
| Hooks             | camelCase + `use` prefix     | `useQueryWithTokenRefresh.ts` |
| Services          | camelCase + `Service` suffix | `projectsService.ts`          |
| Types/interfaces  | PascalCase                   | `ProjectType.ts`              |
| Utility functions | camelCase                    | `extractErrorMessage.ts`      |
| Route folders     | kebab-case                   | `app/user-management/`        |
| Context files     | PascalCase + `Context`       | `LanguageContext.tsx`         |

## 6. TypeScript Rules

- **No `any`** — use `unknown` and narrow
- All API response shapes must have a corresponding interface in `src/types/`
- Zod schemas live in `src/lib/validations/` and are named `<domain>Schema.ts`
- Always export types from the file they're defined in

## 7. Component Rules

- Every component file exports exactly one default component
- `"use client"` only when the component uses browser APIs, state, or event handlers
- Keep server components as the default — add `"use client"` deliberately
- Props interfaces are defined in the same file, above the component

## 8. Tailwind Conventions

- Dark mode via `class` strategy (set in `tailwind.config.ts`)
- Custom tokens in `tailwind.config.ts` under `theme.extend`
- Never use arbitrary values (`[#abc123]`) for colors — always add to theme
- Responsive prefix order: `sm:` → `md:` → `lg:` → `xl:`

## 9. Framer Motion

- Import from `framer-motion`: `import { motion, AnimatePresence } from "framer-motion"`
- Define variants as `const` objects above the component, not inline
- Page transitions go in `src/components/PageTransition.tsx`

## 10. After Scaffold Checklist

- [ ] `npx husky init` and configure `.husky/pre-commit`
- [ ] Add `lint-staged` config to `package.json`
- [ ] Add `commitlint.config.ts`
- [ ] Verify `npm run build` passes with zero errors
- [ ] Create `.env.local` from `.env.example`
- [ ] Create root files: `README.md`, `CHANGELOG.md`, `CONTEXT.md`, `CLAUDE.md`, `Dockerfile`

Read `references/root-files.md` for exact content of each root file.
Read `references/tooling-config.md` for exact config file content.
