---
phase: 6
slug: hexagon-radar-chart
status: approved
shadcn_initialized: false
preset: none
created: 2026-04-03
---

# Phase 6 — UI Design Contract: Hexagon Radar Chart

> Visual and interaction contract for soft-skill radar on hero profiles.  
> Aligns with Phase 4 UI-SPEC (Obsidian Citadel / emerald tokens).  
> Source: ROADMAP Phase 6, existing `components/ui/hex-radar.tsx`, `app/globals.css` axis tokens.

---

## Scope

| Surface | Behaviour |
|---------|-----------|
| `/hero/me` | Full radar when `user.soft_skills` present; draw-on animation on mount; axis labels + hover values |
| `/hero/[id]` | Same chart **readonly** (no edit affordances tied to radar); public view |
| No `soft_skills` | Empty / placeholder card with primary CTA → onboarding or profile completion |

Out of scope for Phase 6 UI: Roll Hero overlay (`target` prop on `HexRadar`) — visual language defined here for reuse in Phase 7.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none (Tailwind v4 + CSS variables per Phase 4) |
| Preset | not applicable |
| Component library | Existing `HexRadar` SVG; no new UI kit |
| Icon library | Lucide (optional chevron/info near legend only — not required) |
| Font — axis labels | `var(--font-mono)`, uppercase, tight tracking (match current 7px / `letterSpacing: 0.05em`) |
| Font — section title | `.dr-heading` or page h2 using `var(--font-fantasy)` per Phase 4 |

---

## Spacing Scale

Use **multiples of 4px**. Radar lives inside existing `.dr-card` sections on profile pages.

| Context | Token | Value |
|---------|-------|-------|
| Radar wrapper padding | md | 16px minimum inside card body |
| Gap radar ↔ legend / copy | md–lg | 16–24px |
| Tooltip offset from cursor/focus | sm | 8px |

Exceptions: none.

---

## Typography

| Role | Size | Weight | Notes |
|------|------|--------|-------|
| Section title ("Soft skills" / "Profile radar") | 1rem–1.125rem | 700 | `.dr-heading` or semantic h2 |
| Axis label (short) | 7px SVG `fontSize` | 400 | Keep mono; **full phase may increase to 8px** if legibility fails WCAG zoom |
| Tooltip / hover value | 0.75rem | 500 | `var(--font-mono)` for numeric alignment |
| Empty state heading | 1rem | 700 | `var(--font-sans)` |
| Empty state body | 0.875rem | 400 | `var(--color-dr-text-2)` |
| CTA button | existing `.dr-btn-primary` | — | Phase 4 contract |

**Axis copy (locked labels for hover + optional longer aria):**

| Key | Short label (SVG) | Accessible / hover name |
|-----|-------------------|-------------------------|
| initiative | INIT | Initiative |
| expertise | EXPERT | Expertise |
| speed | SPEED | Execution speed |
| communication | COMM | Communication |
| flexibility | FLEX | Flexibility |

Executor may switch short labels to full words (Initiative, Expertise, …) on `/hero/me` **full** variant only if layout still fits `viewBox` without collision; otherwise keep short + rich `title` on each axis group.

---

## Color

| Element | Token | Usage |
|---------|-------|-------|
| Radar fill | `--color-dr-glow-dim` | Hero polygon fill |
| Radar stroke | `--color-dr-glow` | Hero polygon stroke |
| Grid / axes | `--color-dr-edge` | Hex grid, axis lines (opacity per existing component) |
| Axis vertex dots | `--color-dr-axis-*` | One token per axis (already in `@theme`) |
| Target overlay (Phase 7) | `--color-dr-gold-dim` / `--color-dr-gold` | Dashed overlay — already in `HexRadar` |
| Tooltip surface | `--color-dr-surface-2` | Background |
| Tooltip border | `--color-dr-edge-2` | 1px |
| Tooltip text | `--color-dr-text` | Value + label |

Accent (emerald) is **not** added as a second fill**; radar remains glow/emerald system from Phase 4.

---

## Motion: Draw-on animation

**Intent:** On mount, the hero polygon (and optionally grid rings) **animates from center** to final vertices over ~**600–900ms**, easing `cubic-bezier(0.4, 0, 0.2, 1)` or Framer `easeOut`.

**Preferred implementation (choose one in plan; default recommended):**

1. **SVG stroke-dasharray / stroke-dashoffset** on the profile polygon outline (stroke visible, fill fades in after or in parallel), **or**
2. **Framer Motion** `motion.polygon` with `pathLength` from 0→1 if using `framer-motion` already on page (respect `useReducedMotion()` — **skip animation**, show final state).

**Rules:**

- `prefers-reduced-motion: reduce` → **no** draw-on; static chart.
- Staggering grid rings is **optional**; if used, keep total perceived time &lt; 1.2s.
- No `Math.random()` or `Date.now()` in render paths that affect SVG attributes (hydration-safe).

---

## Interaction

| Interaction | Requirement |
|-------------|-------------|
| Hover axis vertex | Show tooltip: **axis name + numeric value (0–100)** |
| Hover polygon fill | Optional: show aggregate line "Soft skills overview" — not required |
| Focus (keyboard) | Each axis dot or a single focusable wrapper with `role="img"` and `aria-describedby` pointing to summary text |
| Touch | Tap axis dot shows same tooltip (sticky until tap outside or 3s timeout) — **mobile**: minimum 44×44px hit target if dots enlarged |

---

## Empty / missing `soft_skills`

| Condition | UI |
|-----------|-----|
| Authenticated, no hex | Card with illustration or hex silhouette at low opacity; heading **"Map your soft skills"**; body one line explaining value; CTA **"Complete assessment →"** linking to `/onboarding` |
| Public `/hero/[id]`, no data | Neutral copy **"Soft skills not shared"** — no CTA for viewer |

Copywriting locked:

- Primary CTA: **Complete assessment →**
- Empty heading: **Map your soft skills**
- Empty body: **Answer a short questionnaire to generate your five-axis profile and stand out to captains.**

---

## Layout placement

- **`/hero/me`:** New section below hero header card (or below Skills & Profile block per existing page order). Title: **Soft skills** or **Your profile radar** (pick one in implementation; prefer **Soft skills** for consistency with onboarding).
- **`/hero/[id]`:** Mirror layout; readonly; if profile is mock-only without `soft_skills`, follow empty state rules.

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn | none new | not required |
| Radix Tooltip | optional for hover | If added, use `@radix-ui/react-tooltip` consistent with existing Radix usage; no duplicate popover libs |

---

## Verification hooks (for planner / executor)

- [ ] `npm run build` passes
- [ ] Lighthouse: no layout shift &gt; 0.1 on radar mount (animation optional check)
- [ ] Keyboard: focus order includes chart summary or tooltip trigger

---

## Checker Sign-Off (6 dimensions)

- [x] Dimension 1 Copywriting: PASS — CTAs and empty states specified
- [x] Dimension 2 Visuals: PASS — SVG radar, grid, overlay rules aligned with existing component
- [x] Dimension 3 Color: PASS — tokens from Phase 4 / globals only
- [x] Dimension 4 Typography: PASS — mono labels + heading utilities defined
- [x] Dimension 5 Spacing: PASS — 4px scale inside cards
- [x] Dimension 6 Registry Safety: PASS — no new registry without gate

**Approval:** approved 2026-04-03 (orchestrated ui-phase in Cursor; no separate CONTEXT.md — decisions derived from ROADMAP + Phase 4 UI-SPEC + code audit)

---

## UI-SPEC COMPLETE

Phase 6 design contract is ready for `/gsd-plan-phase 6` (or `$gsd-plan-phase` with phase 6).

**Execution:** Plans 06-01 / 06-02 completed 2026-04-03 — see `06-01-SUMMARY.md`, `06-02-SUMMARY.md`, `06-VERIFICATION.md`.
