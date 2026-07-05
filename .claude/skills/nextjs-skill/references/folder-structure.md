# Folder Structure Reference

Full annotated folder tree for the Next.js App Router project.

```
my-app/
├── .husky/
│   └── pre-commit                  # Runs lint-staged before each commit
├── .vscode/
│   └── settings.json               # Format on save, default formatter = prettier
├── docs/
│   └── designs/
│       ├── system-design.md        # Design tokens: colors, fonts, spacing
│       └── ss/                     # Feature screenshots for AI context
├── public/
│   ├── favicon.ico
│   └── images/
├── src/
│   ├── app/
│   │   ├── (auth)/                 # Auth route group (no shared layout)
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/            # Main app route group
│   │   │   ├── layout.tsx          # Sidebar + header shell
│   │   │   └── [feature]/
│   │   │       └── page.tsx
│   │   ├── api/                    # Next.js Route Handlers (if needed)
│   │   │   └── [...]/
│   │   │       └── route.ts
│   │   ├── error.tsx               # Error boundary
│   │   ├── not-found.tsx
│   │   ├── loading.tsx
│   │   ├── layout.tsx              # Root layout — wraps <Providers />
│   │   └── providers.tsx           # "use client" — QueryClient, ThemeProvider, Toaster
│   │
│   ├── components/
│   │   ├── ui/                     # Generic, reusable primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── Badge.tsx
│   │   ├── layout/                 # Layout-level components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── [feature]/              # Feature-scoped components
│   │   │   └── FeatureCard.tsx
│   │   ├── Breadcrumbs.tsx
│   │   └── BackButton.tsx
│   │
│   ├── hooks/
│   │   ├── useQueryWithTokenRefresh.ts   # GET data fetching with auto token refresh
│   │   ├── useMutationWithTokenRefresh.ts # POST/PATCH/DELETE with auto token refresh
│   │   ├── useDebounce.ts               # lodash.debounce wrapper
│   │   └── useLocalStorage.ts
│   │
│   ├── service/                    # One file per domain — calls lib/api.ts handlers
│   │   ├── authService.ts
│   │   ├── projectsService.ts
│   │   ├── companiesService.ts
│   │   └── usersService.ts
│   │
│   ├── lib/
│   │   ├── api.ts                  # Axios instance + get/post/patch/del handlers
│   │   ├── queryClient.ts          # React Query client singleton
│   │   └── validations/            # Zod schemas per domain
│   │       ├── authSchema.ts
│   │       ├── projectSchema.ts
│   │       └── companySchema.ts
│   │
│   ├── types/
│   │   ├── Config.ts               # Config type (API_URL, BACKEND_URL, SITE_URL)
│   │   ├── auth.ts
│   │   ├── project.ts
│   │   ├── company.ts
│   │   └── api.ts                  # Generic ApiResponse<T>, PaginatedResponse<T>
│   │
│   ├── context/
│   │   ├── LanguageContext.tsx
│   │   └── AuthContext.tsx
│   │
│   ├── config/
│   │   └── config.ts               # Config object reading NEXT_PUBLIC_ env vars
│   │
│   ├── utils/
│   │   ├── extractErrorMessage.ts
│   │   ├── formatDate.ts
│   │   └── cn.ts                   # clsx/tailwind-merge utility
│   │
│   ├── styles/
│   │   └── globals.css             # Tailwind base + custom CSS vars
│   │
│   └── middleware.ts               # Auth guard, redirect logic
│
├── .env.example                    # Template — committed to git
├── .env.local                      # Actual values — gitignored
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── .prettierignore
├── CHANGELOG.md
├── CLAUDE.md
├── CONTEXT.md
├── commitlint.config.ts
├── Dockerfile
├── next.config.ts
├── package.json
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

---

## Key File Contents

### `src/app/providers.tsx`

```tsx
"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { queryClient } from "@/lib/queryClient";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        <Toaster position="top-right" />
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### `src/lib/queryClient.ts`

```ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});
```

### `src/config/config.ts`

```ts
export const Config = {
  API_URL: process.env.NEXT_PUBLIC_API_URL!,
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL!,
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL!,
} as const;
```

### `src/types/Config.ts`

```ts
export type Config = {
  API_URL: string;
  BACKEND_URL: string;
  SITE_URL: string;
};
```

### `src/lib/api.ts`

```ts
import axios from "axios";
import { Config } from "@/config/config";

declare module "axios" {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

const api = axios.create({
  baseURL: Config.API_URL,
  withCredentials: true,
});

let refreshPromise: Promise<void> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isRefreshEndpoint = originalRequest.url?.includes("/auth/refresh");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshEndpoint
    ) {
      originalRequest._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = api
            .post("/auth/refresh")
            .then(() => undefined)
            .finally(() => {
              refreshPromise = null;
            });
        }
        await refreshPromise;
        return api(originalRequest);
      } catch {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export async function get<T>(url: string): Promise<T | undefined> {
  try {
    const response = await api.get<T>(url);
    return response.data;
  } catch {
    return undefined;
  }
}

export async function post<T>(
  url: string,
  data?: unknown,
): Promise<T | undefined> {
  try {
    const response = await api.post<T>(url, data);
    return response.data;
  } catch {
    return undefined;
  }
}

export async function patch<T>(
  url: string,
  data?: unknown,
): Promise<T | undefined> {
  try {
    const response = await api.patch<T>(url, data);
    return response.data;
  } catch {
    return undefined;
  }
}

export async function del<T>(url: string): Promise<T | undefined> {
  try {
    const response = await api.delete<T>(url);
    return response.data;
  } catch {
    return undefined;
  }
}
```

### `src/utils/cn.ts`

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

> Install: `npm install clsx tailwind-merge`

### `src/hooks/useDebounce.ts`

```ts
import { useCallback, useRef } from "react";
import debounce from "lodash/debounce";

export function useDebounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay = 300,
) {
  const ref = useRef(fn);
  ref.current = fn;
  return useCallback(
    debounce((...args) => ref.current(...args), delay),
    [delay],
  );
}
```
