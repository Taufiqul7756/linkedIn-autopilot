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
- [x] Light toggle, bell icon, user avatar

### Page Header
- [x] LinkedIn icon + title + subtitle
- [x] Calendar + Generate Posts action buttons

### Account & Knowledge Base Section
- [x] LinkedIn account card (Connected status, Manage button → LinkedInManageModal)
- [x] Website knowledge base card (Ready status, Add Sources button → KnowledgeBaseUploadModal, Re-crawl button)
- [x] 5 stats cards row (Awaiting · Approved · Scheduled · Published · Avg Engagement)

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
- [x] Section header with awaiting badge + "View all drafts" link
- [x] Two-column draft post cards
- [x] Author info, Draft badge, post body, hashtags
- [x] Image prompt / read time / CTA metadata row
- [x] Edit button → EditPostModal (content textarea + hashtags input)
- [x] Regenerate button
- [x] Reject button → RejectConfirmModal (confirmation + optional reason)
- [x] Approve button

### Post Management Section
- [x] Section header with timezone label
- [x] Filter icon → dropdown (All / Draft / Scheduled / Published) with active indicator
- [x] Checkbox column with select-all (indeterminate state)
- [x] "Delete" button appears when ≥ 2 rows selected (Run Agent removed — Leads page feature)
- [x] Table with 8 columns (checkbox + POST + CREATED + SCHEDULED + PUBLISHED + STATUS + ENGAGEMENT + ACTIONS)
- [x] Status pills with color coding
- [x] Engagement metrics (impressions, likes, comments, rate) for Published
- [x] Schedule button (Approved rows) → ScheduleModal
- [x] Reschedule button (Scheduled rows) → ScheduleModal in reschedule mode
- [x] Review / Retry buttons for Draft / Failed rows
- [x] Three-dot dropdown per row → View post / Delete

### Autopilot Agent Workflow Section
- [x] Section header with Live badge
- [x] Orchestrator banner (Coordinating status, agents active / posts in flight / gate count)
- [x] 7 agent cards in 4+3 grid
- [x] Per-agent status badges: Connected · Working (spinning) · Needs you

### Modals (reusable base + 5 feature modals)
- [x] `Modal.tsx` — base component (backdrop blur, ESC key, title, close button, 3 widths)
- [x] `LinkedInManageModal` — connected account info + Connect your LinkedIn button + disconnect link
- [x] `KnowledgeBaseUploadModal` — drag-and-drop file upload (PDF/DOC/DOCX) + text textarea
- [x] `ScheduleModal` — date picker + time picker + timezone display (schedule & reschedule modes)
- [x] `EditPostModal` — post content textarea with char count + hashtags input
- [x] `RejectConfirmModal` — warning icon + confirmation + optional reason textarea

## Phase 4 — Polish

- [x] Fix page background color (blue-lavender `#E9ECF5`)
- [x] Fix Generate Posts card background (gradient `#ECEEF8` → white)
- [x] Fix Agent Workflow section background to match design
- [x] Global `cursor: pointer` for buttons and checkboxes
- [x] Responsive layout (mobile / tablet / MacBook / desktop breakpoints)
- [x] Dark mode removed (not needed for this page)
- [ ] Loading skeleton states
- [ ] Empty states (no posts, no connection)

## Phase 5 — Real Integration (future)

- [ ] LinkedIn OAuth connect flow
- [ ] Website crawler + knowledge base API
- [ ] AI post generation (Claude API)
- [ ] Approve / reject post mutations
- [ ] Schedule post via API
- [ ] Real-time agent status polling (WebSocket or polling)
- [ ] Calendar view page
- [ ] "View all drafts" page
- [ ] Analytics page
- [ ] Bulk delete confirmation modal
- [ ] Run Agent API call with selected post IDs
