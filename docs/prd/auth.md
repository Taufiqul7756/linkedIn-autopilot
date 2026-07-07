# PRD — Authentication

## Overview

Token-based authentication gate. All routes require login except `/login`. On success, the API token and user object are persisted to `localStorage` and the user is redirected to `/linkedin-autopilot`.

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/v1/auth/login/` | Login — body: `{ email, password }` |
| GET | `/api/v1/auth/me/` | Fetch current user profile |

### Login response
```json
{
  "token": "string",
  "user": { "id": "uuid", "email": "string", "username": "string" }
}
```

## Storage

- Full login response stored in `localStorage` under key `"auth"`
- Token read back on every page load to restore session
- On logout: `localStorage` entry removed, state cleared

## Auth flow

```
/ → redirect → /login
/login (unauthenticated) → show form
/login → POST /auth/login/ → store token → redirect /linkedin-autopilot
/login (already authenticated) → redirect /linkedin-autopilot
any protected route (no token) → redirect /login
```

## Scope

- Email + password login only (no OAuth, no signup, no forgot-password in v1)
- Client-side route protection via `AuthGuard` (no middleware cookie check)
- Token sent as `Authorization: Bearer` header via Axios request interceptor (future — currently cookie-based for other endpoints)

## Out of scope (v1)

- Signup / registration
- Forgot password / reset
- LinkedIn OAuth login
- httpOnly cookie session (backend uses wildcard CORS, so `withCredentials` disabled on login)
