# PRD — LinkedIn Autopilot Page

## Overview

A single-page dashboard that lets users generate on-brand LinkedIn posts from their workspace knowledge base, review and approve drafts, schedule, and auto-publish — all orchestrated by a multi-agent AI workflow.

Every API call is scoped to the **active workspace** via `/workspaces/{workspace_pk}/` prefix. The workspace type (`corporate` / `personal`) controls knowledge grounding and writing voice. `?scope=` param is gone everywhere.

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
  - Action: **Add sources** → opens AddUrlModal: add new URL + list existing indexed URLs with status dot + delete per URL
  - Action: **Add to Knowledge Base** → opens KnowledgeBaseUploadModal: drag-and-drop PDF upload + list of uploaded docs with status + delete per doc
  - Action: **Re-crawl** → triggers re-index of website
- **Stats grid** (2 rows × 4 cards, real API): Row 1 — Drafts · Approved · Scheduled · Published; Row 2 — Failed · Published This Week · Next Scheduled · Avg. Engagement
  - API: `GET /api/v1/workspaces/{workspace_pk}/content/posts/stats/`
  - Response fields: `drafts`, `approved`, `scheduled`, `published`, `failed`, `published_this_week`, `next_scheduled_at` (ISO), `avg_engagement`
  - `next_scheduled_at` displayed as relative time ("in 2h 40m")
  - `avg_engagement` displayed as percentage with 1 decimal

### 3. Generate Posts from Knowledge Base
- Controls: Number of posts (free-form input), Tone (dropdown), Length (Short/Medium/Long), Content Style (dropdown), Use Emoji (Yes/No toggle)
- Optional custom prompt textarea with placeholder
- "Suggest prompts" button → `POST /workspaces/{workspace_pk}/content/posts/suggest_prompts/` → shows clickable suggestion chips
- Footer note: posts stay as drafts until approved
- Primary action: Generate → `POST /workspaces/{workspace_pk}/content/posts/generate/` with `{ prompt, tone, length, content_style, use_emoji, count }` — **no `scope` field**
- Generate is **synchronous**: posts created immediately; images generated async (`image_status: "pending"`)
- On success: invalidates `["posts","draft"]`; sets `["posts-generating"]` flag for image polling
- If prompt not covered by KB → API returns `{ prompt, suggested_topics[] }` → amber warning banner
- Card has gradient background: blue-gray (`#ECEEF8`) → white

### 4. Review & Approval
- Shows drafts awaiting review (badge count)
- Polls every 5s after Generate fires (via `["posts-generating"]` flag); stops when all drafts have `image_status !== "pending"`
- Two-column card grid, each card showing:
  - Author avatar (initials from LinkedIn account name), Draft badge
  - Post body text (whitespace-pre-line)
  - **Image area**: `pending` → blue dashed spinner; `image_url` present → image; otherwise nothing
  - Hashtags (prefixed with `#`)
  - **Edit** → EditPostModal
  - **Regenerate Post** → RegeneratePostConfirmModal → `POST /workspaces/{workspace_pk}/content/posts/{id}/regenerate/`
  - **Regenerate Image** → floating prompt textarea → `POST /workspaces/{workspace_pk}/content/posts/{id}/generate_image/`
  - **Delete** → DeleteConfirmModal → `DELETE /workspaces/{workspace_pk}/content/posts/{id}/`
  - **Approve** → `POST /workspaces/{workspace_pk}/content/posts/{id}/approve/`
- APIs: `GET /workspaces/{workspace_pk}/content/posts/?status=draft`

### 5. Post Management
- Excludes draft posts server-side via `exclude_status=draft`
- Table with checkbox selection + select-all (indeterminate state)
- **Bulk delete** appears when ≥ 2 rows selected
- **Page size selector** (2 / 5 / 10 / 15 / 20 per page, default 10)
- **Filter** dropdown: All / Approved / Scheduled / Published / Failed (no Draft)
- Pagination bar always visible (Previous / Next, page X · N total)
- Columns: ☐ · POST · CREATED · SCHEDULED · PUBLISHED · STATUS · ENGAGEMENT · ACTIONS
- Status pills: Approved (emerald) · Scheduled (blue) · Published (green) · Failed (red)
- Per-row actions based on status:
  - Approved → **Schedule** → ScheduleModal → `POST /workspaces/{workspace_pk}/content/posts/{id}/schedule/`
  - Scheduled → **Reschedule** → ScheduleModal + ▶ play button
  - Failed → **Retry**
  - Published → **External link** icon
- Three-dot dropdown: **View** → ViewPostModal · **Delete** → DeleteConfirmModal → `DELETE /workspaces/{workspace_pk}/content/posts/{id}/`
- APIs: `GET /workspaces/{workspace_pk}/content/posts/?page_size=N&page=N&status=X&exclude_status=draft`

### 6. Autopilot Agent Workflow
- Live status indicator
- Orchestrator banner: coordinating status, agents active, posts in flight, gate needs-you count
- 7 agent cards in 4+3 grid (Connector, Knowledge, Generator, Review Gate, Scheduler, Publisher, Analytics)

---

## Modals

| Modal | Trigger | Content |
| --- | --- | --- |
| `LinkedInManageModal` | Manage button | Connected account info, Connect, Disconnect |
| `KnowledgeBaseUploadModal` | Add sources button | Drag-and-drop PDF/DOC/DOCX + textarea |
| `ScheduleModal` | Schedule / Reschedule | Date + time + timezone; `onConfirm(scheduledAt)` |
| `EditPostModal` | Edit button | Content textarea + image upload + hashtags |
| `RejectConfirmModal` | Delete button | Warning + post excerpt + Cancel + Delete |
| `ViewPostModal` | Three-dot → View | Full post detail from `GET /content/posts/{id}/` |
| `RegeneratePostConfirmModal` | Regenerate Post | Amber warning, post excerpt, Cancel + Regenerate |

---

## Data Model (real API)

| Type | Key Fields |
| --- | --- |
| `PostType` | id, body, hashtags (string[]), image_url, image_status (`"pending"`/`"done"`/`"failed"`), tone, length, content_style, use_emoji, status, scheduled_at, published_at, linkedin_urn, engagement, created_at |
| `PostEngagement` | impressions, likes, comments, rate, synced_at |
| `PostStatsType` | drafts, approved, scheduled, published, failed, published_this_week, next_scheduled_at, avg_engagement |
| `PaginatedPosts` | count, next, previous, results: PostType[] |

## Status Flow

```
[Draft] → [Approved] → [Scheduled] → [Published]
                                    ↘ [Failed → retry]
```

## API Endpoints (workspace-scoped)

All endpoints prefixed with `/api/v1/workspaces/{workspace_pk}/`

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `.../content/posts/stats/` | Stats grid |
| GET | `.../content/posts/?status=draft` | Draft posts list |
| GET | `.../content/posts/?exclude_status=draft&page=N&page_size=N` | Post management table |
| GET | `.../content/posts/{id}/` | View single post |
| POST | `.../content/posts/generate/` | Generate posts (no scope in body) |
| POST | `.../content/posts/suggest_prompts/` | Prompt suggestions |
| POST | `.../content/posts/{id}/approve/` | Approve draft |
| POST | `.../content/posts/{id}/schedule/` | Schedule post |
| POST | `.../content/posts/{id}/upload_image/` | Upload image (FormData, `image` field) |
| PATCH | `.../content/posts/{id}/` | Edit body / hashtags |
| DELETE | `.../content/posts/{id}/` | Delete post |
| POST | `.../content/posts/{id}/generate_image/` | Generate image (`{ image_prompt }`) |
| POST | `.../content/posts/{id}/regenerate/` | Regenerate post |
| POST | `.../content/posts/{id}/refresh_metrics/` | Refresh engagement metrics |
| GET | `.../websites/` | List indexed websites |
| POST | `.../websites/` | Add website URL (no scope field) |
| DELETE | `.../websites/{id}/` | Remove website URL |
| POST | `.../websites/{id}/recrawl/` | Re-crawl website |
| GET | `.../documents/` | List uploaded documents |
| POST | `.../documents/` | Upload document (no scope field) |
| DELETE | `.../documents/{id}/` | Delete document |
| POST | `.../documents/{id}/reextract/` | Re-extract document |
| GET | `.../linkedin/connect/` | Returns `{ authorize_url }` |
| GET/DEL | `.../linkedin/account/` | Status (GET) / disconnect (DELETE) |

Top-level (unchanged):
| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/v1/auth/logout/` | Sign out |
| GET | `/api/v1/linkedin/callback/` | OAuth callback (workspace from signed state) |

## Out of Scope (remaining)

- Real-time agent status polling (WebSocket)
- Calendar view
- Bulk delete confirmation modal
- Run Agent API call
- Image removal via PATCH
- Hashtag PATCH (backend fixing)
