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
- Actions: Calendar (secondary), Generate Posts (primary)

### 2. Account & Knowledge Base
- **LinkedIn account card**: Shows connection status (Connected/Disconnected), authorized user, OAuth scope.
  - Action: **Manage** → opens LinkedInManageModal (current account info + "Connect your LinkedIn" button + disconnect link)
- **Website knowledge base card**: Shows crawl status (Ready/Stale), domain, facet count.
  - Action: **Add sources** → opens KnowledgeBaseUploadModal (file upload: PDF/DOC/DOCX + text textarea)
  - Action: **Re-crawl** → triggers re-index of website
- **Stats grid** (2 rows × 4 cards, real API): Row 1 — Drafts · Approved · Scheduled · Published; Row 2 — Failed · Published This Week · Next Scheduled · Avg. Engagement
  - API: `GET /api/v1/content/posts/stats/`
  - Response fields: `drafts`, `approved`, `scheduled`, `published`, `failed`, `published_this_week`, `next_scheduled_at` (ISO), `avg_engagement`
  - `next_scheduled_at` displayed as relative time ("in 2h 40m")
  - `avg_engagement` displayed as percentage with 1 decimal

### 3. Generate Posts from Knowledge Base
- Controls: Number of posts (3/5/10), Tone (dropdown), Length (Short/Medium/Long), Content Style (dropdown)
- Optional custom prompt textarea with placeholder
- "Suggest prompts" button → `POST /content/posts/suggest_prompts/` with `website_profile` UUID → shows clickable suggestion chips; clicking a chip fills the prompt textarea
- Footer note: posts stay as drafts until approved
- Primary action: Generate → `POST /content/posts/generate/` with `{ website_profile, documents, prompt, tone, length, content_style, count }`; both buttons disabled if no website connected
- Card has a gradient background: blue-gray (`#ECEEF8`) → white (top to bottom)

### 4. Review & Approval
- Shows drafts awaiting review (badge count)
- Two-column card grid, each card showing:
  - Author avatar, name, title, follower count, Draft badge
  - Post body text + hashtags
  - Metadata: image prompt ready, read time, CTA
  - **Edit** → EditPostModal (content textarea with char count + hashtags input)
  - **Regenerate** → re-generates post (future)
  - **Reject** → RejectConfirmModal (warning, post excerpt, optional reason, Cancel + Reject)
  - **Approve** → moves post to Approved status
- "View all drafts" link

### 5. Post Management
- Table with checkbox selection per row + select-all checkbox (indeterminate state)
- **Bulk actions** (appear in header when rows selected):
  - **Run Agent** → visible when ≥ 1 row selected
  - **Delete** → visible when ≥ 2 rows selected
- **Filter** → icon button opening dropdown: All / Draft / Scheduled / Published (with colored dots + checkmark for active)
- Columns: ☐ · POST · CREATED · SCHEDULED · PUBLISHED · STATUS · ENGAGEMENT · ACTIONS
- Status pills: Draft (violet) · Approved (green) · Scheduled (blue) · Published (green) · Failed (red)
- Engagement for Published: impressions · likes · comments · engagement rate %
- Per-row actions based on status:
  - Approved → **Schedule** → ScheduleModal (date + time + timezone)
  - Scheduled → **Reschedule** → ScheduleModal (reschedule mode, shows current schedule) + ▶ play button
  - Draft → **Review**
  - Failed → **Retry**
  - Published → **External link** icon
- Three-dot dropdown on every row: **View post** · **Delete**

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
| `ScheduleModal` | Schedule / Reschedule button | Post preview, date picker, time picker, timezone (read-only) |
| `EditPostModal` | Edit button | Post content textarea (char count), hashtags input |
| `RejectConfirmModal` | Reject button | Warning icon, post excerpt, optional reason, Cancel + Reject |

---

## Data Model (mock)

| Entity | Key Fields |
| --- | --- |
| Post | id, excerpt, tags, style, created, scheduled, published, status, engagement |
| DraftPost | id, author, content, hashtags, imagePromptReady, readTime, cta |
| Agent | id, name, subtitle, status, description, detail, iconType, color |

## Status Flows

```
[Draft] → [Approved] → [Scheduled] → [Published]
                                    ↘ [Failed → retry]
```

## Out of Scope (v1 mock)

- Real LinkedIn OAuth integration
- Actual AI post generation
- Real-time agent status polling
- Calendar view
- Full "View all drafts" page
- Bulk delete confirmation modal
- Run Agent API call
