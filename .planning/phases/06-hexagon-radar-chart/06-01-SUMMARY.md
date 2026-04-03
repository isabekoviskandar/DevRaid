---
phase: 06-hexagon-radar-chart
plan: 01
status: complete
completed_at: 2026-04-03T12:00:00Z
---

# Phase 6, Plan 01 — HexRadar component summary

**Goal:** SVG hexagon radar aligned with `06-UI-SPEC.md`: motion, tooltips, accessibility, `mini` variant for dense lists.

## Deliverables

| Area | Implementation |
|------|----------------|
| Axes | Five axes (`HEX_AXES`), exported `AXIS_DISPLAY_NAMES` for labels |
| Motion | `animated` prop; mount animation on `motion.g` when allowed; `useReducedMotion` respected |
| Mini variant | `variant="mini"`: no vertex animation, no tooltips (list cards) |
| Tooltips | Radix Tooltip on vertex hits for full-size radar only; `Tooltip.Provider` wraps SVG |
| A11y | `role="img"`, `aria-label` describing the chart |

## Primary file

- `components/ui/hex-radar.tsx`

## Verification

- `npm run build` — EXIT 0 (2026-04-03)

## Notes

- Target overlay / desired soft profile still supported where `RollHeroReveal` passes `target`.
