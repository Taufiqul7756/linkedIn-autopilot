# System Design

## Design Tokens

### Colors

| Token    | Light        | Dark         |
| -------- | ------------ | ------------ |
| primary  | `#2563eb`    | `#3b82f6`    |
| surface  | `#ffffff`    | `#0a0a0a`    |
| border   | `#e5e7eb`    | `#374151`    |

### Typography

- Font: Geist Sans (variable: `--font-geist-sans`)
- Mono: Geist Mono (variable: `--font-geist-mono`)

### Spacing

Uses Tailwind CSS default spacing scale (4px base unit).

## Component Architecture

- Atomic design: `ui/` (atoms) → `layout/` (organisms) → `[feature]/` (feature-level)
- Server components by default; `"use client"` only where necessary

## Screenshots

Place feature screenshots in `docs/designs/ss/` for AI context.
