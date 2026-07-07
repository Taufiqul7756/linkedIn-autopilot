# Tasks — Authentication

## Status Legend
- [x] Done
- [ ] To do
- [~] In progress

---

## Phase 1 — Core Auth

- [x] `src/types/Auth.ts` — `AuthUser`, `LoginResponse` types
- [x] `src/lib/validations/authSchema.ts` — Zod login schema (email + password ≥ 8 chars)
- [x] `src/service/authService.ts` — `login()` (throws on error), `getMe()`, `logout()`, `refresh()`
- [x] `src/context/AuthContext.tsx` — token + user state from `localStorage`, `login()`, `logout()`
- [x] `src/components/layout/AuthGuard.tsx` — client-side redirect guard for all routes
- [x] `src/app/providers.tsx` — wrapped with `AuthProvider` + `AuthGuard`
- [x] `src/app/login/page.tsx` — login form (email, password toggle, Zod validation, loading state)
- [x] `src/components/layout/Navbar.tsx` — hides on `/login`, shows real user initials from context
- [x] `src/utils/extractErrorMessage.ts` — handles `AxiosError` (Django `detail`, `message`, `non_field_errors`)
- [x] `.env.local` — `NEXT_PUBLIC_API_URL=https://relayapi.azurewebsites.net/api/v1`
- [x] Fixed CORS: removed `withCredentials` from `authApi` (server returns wildcard `Access-Control-Allow-Origin`)

## Phase 2 — Future

- [ ] Logout button in Navbar / user menu
- [ ] `/api/v1/auth/me/` call on app boot to validate token freshness
- [ ] Token injection in Axios request interceptor (`Authorization: Bearer`)
- [ ] Forgot password flow
- [ ] Session expiry handling (401 → clear storage → redirect `/login`)
