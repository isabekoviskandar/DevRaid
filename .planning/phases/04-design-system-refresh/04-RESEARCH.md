# Phase 4 Research: Design System Refresh

**Date:** 2026-04-02
**Phase:** 04 — Design System Refresh

## Key Finding: Token Cascade

`--color-dr-glow` is used in ~12 places inside `globals.css` (aurora, glow-ring, btn-primary, text-glow, card hover, selection). Replacing the token value propagates to all these places automatically — no component file changes needed for most effects.

**Direct hardcoded RGB** occurrences that DON'T auto-update and need manual replacement:
- `app/page.tsx` line 53: `stroke="rgba(91,135,255,0.06)"` — bottom-left hex wireframe
- `app/page.tsx` line 57: `stroke="rgba(91,135,255,0.035)"` — bottom-left inner hex
- `globals.css` aurora blobs: `rgba(91, 135, 255, 0.10)` — not via token

Emerald RGB equivalent: `rgba(0, 217, 126, ...)` — same alpha values.

## CSS Architecture

Tailwind v4 uses `@theme {}` block. All custom tokens live there. Adding new tokens is safe and additive — no migration risk. Existing `--color-dr-glow` references in TSX (`var(--color-dr-glow)`) update automatically when token value changes.

**Safe rename strategy:** Change the VALUE of `--color-dr-glow` (not the name). All existing `var(--color-dr-glow)` references continue working. Add `--color-dr-info: #5B87FF` as the blue alias for places that need to stay blue (role chips for non-frontend roles, axis colors).

## What needs manual update in globals.css (beyond token swap)

1. **Aurora `.dr-aurora` blobs** — hardcoded rgba values, not via token
2. **`.dr-glow-ring`** — hardcoded rgba values
3. **`.dr-card:hover`** — hardcoded rgba `rgba(91, 135, 255, 0.07)`
4. **`.dr-btn-primary`** — gradient colors hardcoded (`#5B87FF → #3B65D8`)
5. **`.dr-btn-primary:hover`** — glow shadow hardcoded
6. **`.dr-text-glow`** — gradient hardcoded
7. **`::selection`** — hardcoded rgba

## New CSS classes to add

- `.dr-heading` — Cinzel font, weight 700, letter-spacing 0.04em, line-height 1.15
- `.dr-divider-rune` — section divider with `::after` diamond ◆ accent
- `.dr-card-interactive` — additive hover class for clickable cards (emerald ring)

## Empty State Component Strategy

Create `components/ui/empty-state.tsx` as a reusable shell:
```tsx
interface EmptyStateProps {
  svg: React.ReactNode      // inline SVG passed as child
  heading: string
  body: string
  cta?: { label: string; onClick?: () => void; href?: string }
}
```

**Two inline SVGs needed:**
1. Raids empty state — crossed swords / shield silhouette
2. Skills empty state — scroll / rune tablet silhouette

Both: monochromatic, `aria-hidden`, 80-120px tall, body fill `#263047`, accent stroke `#00D97E` (raids) / `#C8943A` (skills).

## Page edits scope

| File | Change | Risk |
|------|--------|------|
| `app/globals.css` | Token swap + new classes | Low — additive + controlled replacement |
| `app/page.tsx` | `dr-title-fantasy` → `dr-heading` on h1; fix hardcoded blue rgba | Low — class rename only |
| `app/raids/page.tsx` | `dr-title-fantasy` → `dr-heading` on h1; add empty-state branch | Low |
| `app/hero/me/page.tsx` | h2 class upgrade; replace "No skills" text with EmptyState | Low |
| `components/ui/empty-state.tsx` | New file | No risk |

## Pitfalls

1. **Don't rename `--color-dr-glow`** — it's used across TSX with `var(--color-dr-glow)`. Change value, not name.
2. **Role chip colors** — `--color-dr-role-frontend` currently `#5B87FF`. Per UI-SPEC it should become `#00D97E` (emerald). Other role colors (backend purple, design pink, etc.) stay untouched.
3. **`dr-title-fantasy` backward compat** — keep the class, just add `dr-heading` as the new standard. Don't delete `dr-title-fantasy`.
4. **Empty state render** — conditional render (`arr.length === 0 ? <EmptyState> : <List>`), NOT CSS `display: none`.
5. **TypeScript** — `tsc --noEmit` must pass after all changes.
