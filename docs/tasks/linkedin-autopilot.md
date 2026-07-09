# Tasks — LinkedIn Autopilot Page

## Status Legend
- [x] Done
- [ ] To do
- [~] In progress

---

## Phase 1 — Scaffold & Routing

- [x] Set up Next.js 16 project with App Router, TypeScript, Tailwind v4
- [x] Install all dependencies (React Query, Axios, Zod, Framer Motion, etc.)
- [x] Configure ESLint (flat config), Prettier, Husky, commitlint
- [x] Create root files: README, CHANGELOG, CONTEXT, CLAUDE, Dockerfile
- [x] Add Navbar to root layout (`src/app/layout.tsx`)
- [x] Create route `src/app/linkedin-autopilot/page.tsx`
- [x] Redirect `/` → `/linkedin-autopilot`
- [x] Remove unused `(auth)` and `(dashboard)` route groups

## Phase 2 — Mock Data

- [x] Define TypeScript types: `PostStatus`, `AgentStatus`, `DraftPost`, `ManagedPost`, `Agent`
- [x] Write mock data for account, stats, draft posts, managed posts, agents
  (`src/lib/mock/linkedinAutopilot.ts`)

## Phase 3 — UI Components

### Navbar
- [x] Logo + nav links (Leads, Campaigns, Inbox, Analytics)
- [x] LinkedIn Autopilot CTA button (active state on `/linkedin-autopilot`)
- [x] User avatar with logout dropdown (POST `/auth/logout/`, clears localStorage, redirects to `/login`)

### Page Header
- [x] LinkedIn icon + title + subtitle
- [x] No header action buttons (Calendar + Generate Posts removed)

### Account & Knowledge Base Section
- [x] LinkedIn account card (Connected status, Manage button → LinkedInManageModal)
- [x] Website knowledge base card (Ready status, Add Sources → AddUrlModal with existing URLs list + delete, Add to Knowledge Base → KnowledgeBaseUploadModal with docs list + delete, Re-crawl button)
- [x] 5 stats cards row (Awaiting · Approved · Scheduled · Published · Avg Engagement) — replaced with real API (see Phase 5)

### Generate Posts Section
- [x] Number of posts toggle (3 / 5 / 10)
- [x] Tone dropdown
- [x] Length toggle (Short / Medium / Long)
- [x] Content style dropdown
- [x] Custom prompt textarea
- [x] Suggest prompts button
- [x] Generate button + footer note
- [x] Gradient background (blue-gray → white, top to bottom)

### Review & Approval Section
- [x] Section header with awaiting badge
- [x] Two-column draft post cards
- [x] Author info, Draft badge, post body, image, hashtags (no CTA)
- [x] Post-generate polling: spins every 5s, stops when posts arrive
- [x] Edit button → EditPostModal (content + image upload + hashtags)
- [x] Regenerate Post button (UI only, future API)
- [x] Regenerate Image button → toggles image prompt textarea panel with Generate Image button (disabled, future API)
- [x] Delete button → RejectConfirmModal → DELETE API
- [x] Approve button → POST approve API

### Post Management Section
- [x] Filter dropdown: All / Approved / Scheduled / Published / Failed (no Draft)
- [x] Drafts excluded server-side via `exclude_status=draft` param (belong in Review & Approval)
- [x] Page size selector (2 / 5 / 10 / 15 / 20), default 10 — passed as `page_size` to API
- [x] Pagination bar always visible (Previous / Next, page info)
- [x] Checkbox column with select-all (indeterminate state)
- [x] Bulk delete when ≥ 2 rows selected
- [x] Table: 8 columns (☐ + POST + CREATED + SCHEDULED + PUBLISHED + STATUS + ENGAGEMENT + ACTIONS)
- [x] Status pills with color coding
- [x] Engagement cell (published metrics / queue / ready / failed states)
- [x] Schedule → ScheduleModal → POST /schedule/ API
- [x] Reschedule → ScheduleModal (reschedule mode) → POST /schedule/ API
- [x] Retry / External link buttons for Failed / Published rows
- [x] Three-dot dropdown: View → ViewPostModal · Delete → RejectConfirmModal → DELETE API

### Autopilot Agent Workflow Section
- [x] Section header with Live badge
- [x] Orchestrator banner (Coordinating status, agents active / posts in flight / gate count)
- [x] 7 agent cards in 4+3 grid
- [x] Per-agent status badges: Connected · Working (spinning) · Needs you

### Modals (reusable base + 6 feature modals)
- [x] `Modal.tsx` — base (backdrop blur, ESC, title, close, widths: sm/md/lg/xl/2xl, max-h-[90vh] scrollable body)
- [x] `LinkedInManageModal` — connected account info + Connect + Disconnect
- [x] `KnowledgeBaseUploadModal` — drag-and-drop file upload (PDF/DOC/DOCX) + text textarea
- [x] `ScheduleModal` — date + time + timezone; `onConfirm(scheduledAt: string)` + `isLoading` props
- [x] `EditPostModal` — content textarea (char count) + image (view/remove/auto-upload on select) + hashtags
- [x] `RejectConfirmModal` — warning + post excerpt + Cancel + Delete post (used in Review & Approval and Post Management)
- [x] `ViewPostModal` — full post detail fetched from API; status/tone/style chips, body, image, hashtags, CTA, dates, engagement

## Phase 4 — Polish

- [x] Fix page background color (blue-lavender `#E9ECF5`)
- [x] Fix Generate Posts card background (gradient `#ECEEF8` → white)
- [x] Fix Agent Workflow section background to match design
- [x] Global `cursor: pointer` for buttons and checkboxes
- [x] Responsive layout (mobile / tablet / MacBook / desktop breakpoints)
- [x] Dark mode removed (not needed for this page)
- [ ] Loading skeleton states
- [ ] Empty states (no posts, no connection)

## Phase 5 — Real Integration

- [x] LinkedIn OAuth connect flow
- [x] Post stats grid — `GET /content/posts/stats/`
- [x] Suggest prompts — `POST /content/posts/suggest_prompts/`
- [x] Generate posts — `POST /content/posts/generate/` (async, returns `{status:"queued"}`)
- [x] Post-generate polling via `["posts-generating"]` React Query cache flag
- [x] Draft posts list — `GET /content/posts/?status=draft`
- [x] Approve post — `POST /content/posts/{id}/approve/`
- [x] Reject / delete post — `DELETE /content/posts/{id}/`
- [x] Post management table — `GET /content/posts/?page_size=N&page=N&status=X`
- [x] Schedule post — `POST /content/posts/{id}/schedule/` with `{ scheduled_at }`
- [x] View single post — `GET /content/posts/{id}/`
- [x] Upload post image — `POST /content/posts/{id}/upload_image/` (FormData, `image` field, auto-triggers on file select)
- [x] Edit post body/hashtags — `PATCH /content/posts/{id}/`
- [x] Logout — `POST /auth/logout/` + clear localStorage + redirect to `/login`
- [x] Website URLs list + delete — `GET /websites/`, `DELETE /websites/{id}/`
- [x] Documents list + delete — `GET /documents/`, `DELETE /documents/{id}/`
- [x] Post management draft exclusion — `exclude_status=draft` query param
- [x] Delete confirmation modal on Post Management row delete
- [ ] Website crawler + knowledge base API
- [ ] Real-time agent status polling
- [ ] Calendar view page
- [ ] Bulk delete confirmation modal
- [ ] Run Agent API call
- [ ] Regenerate Post API
- [ ] Regenerate Image API
