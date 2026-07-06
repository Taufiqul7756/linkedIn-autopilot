# Tasks — Leads Page

## Status Legend
- [x] Done
- [x] To do
- [~] In progress

---

## Phase 1 — Route & Scaffold

- [x] Create route `src/app/leads/page.tsx`
- [x] Create mock data file `src/lib/mock/leads.ts` (Lead, PipelineStage, SalesforceItem, SwarmAgent types + data)

## Phase 2 — UI Components

### Account Connection Section
- [x] `AccountConnectionSection.tsx` — LinkedIn card (Manage) + KB card (Re-crawl), 2-col grid, no stats row

### Source Leads with AI Section
- [x] `SourceLeadsSection.tsx` — gradient card, search input, Find Leads button, suggestion chips

### Pipeline Section
- [x] `PipelineSection.tsx` — batch header, 6 stage cards with arrows, stage/gate type rendering
- [x] Stage status variants: Complete · Signed off · Comments actioned · In progress (active/blue border)
- [x] Load to Salesforce sub-panel — 3 cards with Done/In progress status

### Leads Table Section
- [x] `LeadsTableSection.tsx` — section header + stats row + toolbar + table
- [x] Stats row (5 cards): Total Leads · Validated · Contacted · Replies · Bounce Rate
- [x] Toolbar: search input + Run Agent button (always visible) + Import + Export
- [x] Delete button appears when ≥ 1 row selected
- [x] Checkbox per row + select-all (indeterminate state)
- [x] Table columns: ☐ · LEAD · EMAIL · PHONE · STATUS · OUTREACH · LAST ACTIVITY · ACTIONS
- [x] Status pills: Valid (green) · Invalid (red) · Risky (amber)
- [x] "Corporate mail" badge under each email
- [x] Per-row actions: WhatsApp · Email · LinkedIn icon buttons
- [x] Horizontal scroll on mobile (`overflow-x-auto`, `min-w-[900px]`)

### Agentic Swarm Section
- [x] `AgenticSwarmSection.tsx` — section header with Live badge + subtitle
- [x] Orchestrator banner: icon + name + Coordinating badge + description + 3 stats
- [x] 8 agent cards in 4+4 responsive grid
- [x] Agent status variants: Working (spinning) · Waiting (amber)

### Modal
- [x] `RunAgentModal.tsx` — 3 selectable mode cards (Fully Automated · Partial Automated · Fully Manual), Confirm button

## Phase 3 — Responsive

- [x] Mobile / tablet / MacBook breakpoints on all sections
- [x] Pipeline stages scroll horizontally on mobile

## Phase 4 — Polish

- [x] Page background `#E9ECF5`
- [x] Source Leads gradient `#ECEEF8` → white
- [x] Consistent spacing with LinkedIn Autopilot page

## Phase 5 — Real Integration (future)

- [ ] LinkedIn OAuth connect
- [ ] AI lead sourcing (Claude API)
- [ ] Real outreach send (WhatsApp / Email / LinkedIn)
- [ ] Multiple pipeline batches
- [ ] Run Agent API call with mode + selected lead IDs
- [ ] Lead detail / profile page
