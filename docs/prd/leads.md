# PRD — Leads Page

## Overview

A single-page dashboard that lets users source, validate, enrich, and outreach to leads — all orchestrated by an agentic swarm. Users describe who they want to reach, review the pipeline, manage the leads table, and monitor 8 autonomous agents running in parallel.

## Problem

GTM teams spend hours manually sourcing and qualifying leads. Outreach is inconsistent and slow. There's no unified view of where each lead is in the pipeline.

## Goal

Give users a fully automated lead generation and outreach pipeline with clear human gates and one-click agent execution modes — so they stay in control without doing the manual work.

---

## Sections

### 1. Account Connection
- **LinkedIn account card**: Connected status, authorized user, OAuth scope. Action: **Manage**
- **Website knowledge base card**: Ready status, domain, facet count. Action: **Re-crawl**
- Two-column grid. No stats row (stats live in the Leads section).

### 2. Source Leads with AI
- Gradient card (same `#ECEEF8` → white as Generate Posts)
- Header: Sparkles icon + "Source leads with AI" + subtitle "Describe who you want to reach — Claude finds, validates, and enriches them."
- Full-width search input with placeholder: "e.g. Give me the top 5 coffee shops from Bangladesh with their owner emails and phone numbers"
- Primary action: **Find Leads** (blue, right of input)
- Suggestion chips row labeled "Try:": "Top 5 coffee shops from Bangladesh" · "SaaS founders in Berlin, Series A" · "Dental clinics in Austin, TX"

### 3. Pipeline
- Header: "Pipeline · Batch #A-1042 · currently in **Review & Load**" + "4 stages · 2 client gates" (right)
- 6 stages in horizontal flow with `>` arrows between:
  1. **ICP Build** (stage 01) — Complete
  2. **Client Sign-off** (CLIENT GATE) — Signed off · Jun 28, 14:32
  3. **Data Build** (stage 02) — Complete
  4. **Client Review** (CLIENT GATE) — Comments actioned · 6 of 7 resolved
  5. **Agentic Approach** (stage 03) — Complete
  6. **Review & Load** (stage 04) — In progress (active, blue border)
- **Load to Salesforce** sub-panel below stages:
  - Header: Salesforce icon + "Load to Salesforce" + subtitle + **Syncing** badge (right)
  - 3 cards: Accounts loaded (1,204 accounts · Done) · Contacts loaded (912 of 2,481 · In progress) · Errors fixed (2 errors fixed · Done)

### 4. Leads Table
- Section header: "Leads" + "2,481 leads across 4 active campaigns" (subtitle)
- **Stats row** (5 metrics): Total Leads · Validated · Contacted · Replies · Bounce Rate
- **Table toolbar**: Search leads input + **Run Agent** (always visible, primary blue) + Import + Export + **Delete** (appears when ≥ 1 row selected)
- **Columns**: ☐ · LEAD · EMAIL · PHONE · STATUS · OUTREACH · LAST ACTIVITY · ACTIONS
  - LEAD: avatar initials + name + company
  - EMAIL: email address + "Corporate mail" badge below
  - PHONE: phone number
  - STATUS pills: Valid (green) · Invalid (red) · Risky (amber)
  - OUTREACH: Replied · Email sent · WhatsApp sent · LinkedIn sent · Not contacted
  - LAST ACTIVITY: time ago
  - ACTIONS: 3 icon buttons — WhatsApp · Email · LinkedIn
- Checkbox per row + select-all (indeterminate state)

### 5. Agentic Swarm
- Header: "Agentic Swarm" + **Live** badge + "8 autonomous agents · working in parallel · orchestrator-coordinated" (right)
- **Orchestrator banner**: Sparkles icon + "Orchestrator" + "Coordinating" badge + description. Stats: 6/8 agents active · 312 tasks in flight · 1.2s avg handoff
- **8 agent cards in 4+4 grid**:
  - Row 1: Prospector (Working) · Validator (Working) · Enricher (Working) · Copywriter (Working)
  - Row 2: WhatsApp Agent (Working) · Email Agent (Waiting) · LinkedIn Agent (Working) · Analyst (Working)
- Each card: icon + status badge + name + subtitle + current task description + stat line

---

## Modals

| Modal | Trigger | Content |
| --- | --- | --- |
| `RunAgentModal` | Run Agent button | 3 selectable mode cards: Fully Automated · Partial Automated · Fully Manual. Each with icon, name, description. Confirm button. |

---

## Run Agent Modes

| Mode | Description |
| --- | --- |
| Fully Automated | Agents run end-to-end without any human touch |
| Partial Automated | Agents draft outreach (email, LinkedIn, WhatsApp); user approves before sending |
| Fully Manual | Agent surfaces leads only; user handles all outreach manually |

---

## Data Model (mock)

| Entity | Key Fields |
| --- | --- |
| Lead | id, name, company, email, phone, status, outreach, lastActivity, avatarColor |
| PipelineStage | id, type (stage\|gate), label, stageNumber, status, statusLabel, statusDetail |
| SalesforceItem | id, label, detail, status |
| SwarmAgent | id, name, subtitle, status, task, stat, iconType, color |

## Status Flows

```
[Sourced] → [Validated] → [Enriched] → [Contacted] → [Replied]
```

## Out of Scope (v1 mock)

- Real LinkedIn OAuth / KB crawler
- Actual AI lead sourcing
- Real outreach sending (WhatsApp / Email / LinkedIn)
- Multiple pipeline batches
- Run Agent API call
- Lead detail / profile page
- Bulk approve
