# PRD — LinkedIn Autopilot Page

## Overview

A single-page dashboard that lets users generate on-brand LinkedIn posts from their website, review and approve drafts, schedule, and auto-publish — all orchestrated by a multi-agent AI workflow.

## Problem

Marketing and GTM teams struggle to maintain a consistent LinkedIn presence. Writing posts manually is time-consuming, tone is inconsistent, and scheduling is ad-hoc.

## Goal

Give users a fully automated LinkedIn content pipeline with a single human approval gate — so they stay in control without doing the manual work.

---

## Sections

### 1. Page Header
- Title: "LinkedIn Autopilot" with LinkedIn icon
- Subtitle: "Generate on-brand posts from your website, approve, schedule, and auto-publish."
- No header action buttons

### 2. Account & Knowledge Base
- **LinkedIn account card**: Shows connection status (Connected/Disconnected), authorized user, OAuth scope.
  - Action: **Manage** → opens LinkedInManageModal (current account info + "Connect your LinkedIn" button + disconnect link)
- **Website knowledge base card**: Shows crawl status (Ready/Stale), domain, facet count.
  - Action: **Add sources** → opens AddUrlModal: add new URL + list existing indexed URLs with status dot + delete per URL (`DELETE /websites/{id}/`)
  - Action: **Add to Knowledge Base** → opens KnowledgeBaseUploadModal: drag-and-drop PDF upload + list of uploaded docs with status + delete per doc (`DELETE /documents/{id}/`)
  - Action: **Re-crawl** → triggers re-index of website
- **Stats grid** (2 rows × 4 cards, real API): Row 1 — Drafts · Approved · Scheduled · Published; Row 2 — Failed · Published This Week · Next Scheduled · Avg. Engagement
  - API: `GET /api/v1/content/posts/stats/`
  - Response fields: `drafts`, `approved`, `scheduled`, `published`, `failed`, `published_this_week`, `next_scheduled_at` (ISO), `avg_engagement`
  - `next_scheduled_at` displayed as relative time ("in 2h 40m")
  - `avg_engagement` displayed as percentage with 1 decimal

### 3. Generate Posts from Knowledge Base
- Controls: Number of posts (free-form input), Tone (dropdown), Length (Short/Medium/Long), Content Style (dropdown), Use Emoji (Yes/No toggle)
- Optional custom prompt textarea with placeholder
- "Suggest prompts" button → `POST /content/posts/suggest_prompts/` with `website_profile` UUID → shows clickable suggestion chips; clicking a chip fills the prompt textarea
- Footer note: posts stay as drafts until approved
- Primary action: Generate → `POST /content/posts/generate/` with `{ website_profile, documents, prompt, tone, length, content_style, use_emoji, count }`; both buttons disabled if no website connected
- Generate is now **synchronous**: posts are created immediately (no queue); images are generated async in the background (`image_status: "pending"`)
- On success: immediately invalidates `["posts","draft"]` so cards appear; sets `["posts-generating"]` flag to trigger image polling
- If prompt is not covered by KB, API returns `{ prompt, suggested_topics[] }` → shown as amber warning banner with clickable topic chips
- Card has a gradient background: blue-gray (`#ECEEF8`) → white (top to bottom)

### 4. Review & Approval
- Shows drafts awaiting review (badge count)
- Polls every 5s after Generate fires (via `["posts-generating"]` React Query cache flag); stops when **all** draft posts have `image_status !== "pending"`
- Section-level generating spinner shown while polling and no posts yet (or all posts still pending images)
- Two-column card grid, each card showing:
  - Author avatar (initials from LinkedIn account name), Draft badge
  - Post body text (whitespace-pre-line)
  - **Image area**: if `image_status === "pending"` → blue dashed placeholder with spinner ("Generating image…"); if `image_url` present → renders image; otherwise nothing
  - Hashtags (prefixed with `#`)
  - **Edit** → EditPostModal
  - **Regenerate Post** → RegeneratePostConfirmModal ("your current version will be lost")
  - **Regenerate Image** → floating prompt textarea dropdown; "Generate Image" button enabled when prompt non-empty → `POST /content/posts/{id}/generate_image/`; on success re-fetches draft list so card auto-updates
  - **Delete** → DeleteConfirmModal → `DELETE /content/posts/{id}/`
  - **Approve** → `POST /content/posts/{id}/approve/`
- No "View all drafts" link
- APIs: `GET /content/posts/?status=draft`, `POST /approve/`, `DELETE`

### 5. Post Management
- Excludes draft posts server-side via `exclude_status=draft` query param (drafts live in Review & Approval only)
- Table with checkbox selection + select-all (indeterminate state)
- **Bulk delete** appears when ≥ 2 rows selected
- **Page size selector** (2 / 5 / 10 / 15 / 20 per page, default 10) — passed as `page_size` to API
- **Filter** dropdown: All / Approved / Scheduled / Published / Failed (no Draft option)
- Pagination bar always visible at bottom (Previous / Next, page X · N total)
- Columns: ☐ · POST · CREATED · SCHEDULED · PUBLISHED · STATUS · ENGAGEMENT · ACTIONS
- Status pills: Approved (emerald) · Scheduled (blue) · Published (green) · Failed (red)
- Engagement cell: Published → impressions/likes/comments/rate%; Scheduled → "In queue"; Approved → "Ready"; Failed → "Publishing failed"
- Per-row actions based on status:
  - Approved → **Schedule** → ScheduleModal → `POST /content/posts/{id}/schedule/`
  - Scheduled → **Reschedule** → ScheduleModal (reschedule mode, shows current) + ▶ play button
  - Failed → **Retry**
  - Published → **External link** icon (opens LinkedIn post)
- Three-dot dropdown per row: **View** → ViewPostModal · **Delete** → DeleteConfirmModal → `DELETE /content/posts/{id}/`
- APIs: `GET /content/posts/?page_size=N&page=N&status=X&exclude_status=draft`, `POST /schedule/`, `DELETE`

### 6. Autopilot Agent Workflow
- Live status indicator
- Orchestrator banner: coordinating status, agents active, posts in flight, gate needs-you count
- 7 agent cards in a 4+3 grid:
  - Connector Agent (OAuth & tokens) — Connected
  - Knowledge Agent (crawls site, builds KB) — Working
  - Generator Agent (drafts posts from KB) — Working
  - Review Gate (human approval) — Needs you
  - Scheduler Agent (queue & timezone) — Working
  - Publisher Agent (auto-publish, retry, log) — Working
  - Analytics Agent (pulls post metrics) — Working

---

## Modals

| Modal | Trigger | Content |
| --- | --- | --- |
| `LinkedInManageModal` | Manage button | Connected account info, Connect your LinkedIn, Disconnect |
| `KnowledgeBaseUploadModal` | Add sources button | Drag-and-drop file upload (PDF/DOC/DOCX), additional context textarea |
| `ScheduleModal` | Schedule / Reschedule button | Post preview, date picker, time picker, timezone (read-only); `onConfirm(scheduledAt: string)` callback |
| `EditPostModal` | Edit button | Post content textarea (char count), image section (view/remove/upload), hashtags input; image auto-uploads on select via `POST /upload_image/` |
| `RejectConfirmModal` | Delete button (Review & Approval + Post Management three-dot) | Warning icon, post excerpt, Cancel + Delete post |
| `ViewPostModal` | Three-dot → View | Fetches `GET /content/posts/{id}/`; shows status, tone/length/style chips, body, image, hashtags, dates, engagement |
| `RegeneratePostConfirmModal` | Regenerate Post button | Amber warning icon, post excerpt, warning that current version will be lost; Cancel + Regenerate |

---

## Data Model (real API)

Defined in `src/types/Post.ts`:

| Type | Key Fields |
| --- | --- |
| `PostType` | id, body, hashtags (string[]), cta, image_url, image_file, image_query, image_status (`"pending"` while async generation in progress), tone, length, content_style, use_emoji, status, scheduled_at, published_at, linkedin_urn, engagement (PostEngagement\|null), created_at |
| `PostEngagement` | impressions, likes, comments, rate, synced_at |
| `PostStatsType` | drafts, approved, scheduled, published, failed, published_this_week, next_scheduled_at, avg_engagement (all nullable) |
| `PaginatedPosts` | count, next, previous, results: PostType[] |

## Status Flows

```
[Draft] → [Approved] → [Scheduled] → [Published]
                                    ↘ [Failed → retry]
```

## API Endpoints Used

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/auth/logout/` | Sign out (clears session + localStorage) |
| GET | `/content/posts/stats/` | Stats grid |
| GET | `/content/posts/?status=draft` | Draft posts list |
| GET | `/content/posts/?exclude_status=draft&page=N&page_size=N` | Post management table (excludes drafts server-side) |
| GET | `/content/posts/{id}/` | View single post |
| POST | `/content/posts/generate/` | Generate posts |
| POST | `/content/posts/suggest_prompts/` | Prompt suggestions |
| POST | `/content/posts/{id}/approve/` | Approve draft |
| POST | `/content/posts/{id}/schedule/` | Schedule post |
| POST | `/content/posts/{id}/upload_image/` | Upload post image (binary FormData, `image` field) |
| PATCH | `/content/posts/{id}/` | Edit body / hashtags |
| DELETE | `/content/posts/{id}/` | Delete post |
| POST | `/content/posts/{id}/generate_image/` | Generate image for post (`{ image_prompt }` → updates `image_url`) |
| GET | `/websites/` | List indexed websites |
| POST | `/websites/` | Add website URL |
| DELETE | `/websites/{id}/` | Remove website URL |
| GET | `/documents/` | List uploaded documents |
| POST | `/documents/` | Upload document (PDF) |
| DELETE | `/documents/{id}/` | Delete document |

## Out of Scope (remaining)

- Real-time agent status polling (WebSocket)
- Calendar view
- Bulk delete confirmation modal
- Run Agent API call
- Regenerate Post API
- Image removal via PATCH (backend to support `image_url: ""`)
- Hashtag PATCH (backend fixing)
