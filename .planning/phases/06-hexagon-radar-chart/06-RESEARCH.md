---
phase: 06
slug: hexagon-radar-chart
created: 2026-04-03
---

# Phase 6 — Technical Research: Hexagon Radar Chart

## RESEARCH COMPLETE

### Goal (from ROADMAP)

- SVG radar on `/hero/me` with **draw-on** on mount, **5 labeled axes**, **hover → exact value**
- **`/hero/[id]`** readonly radar
- **No `soft_skills`** → CTA **Complete assessment →** (`/onboarding`)

### Canonical inputs

| Artifact | Path |
|----------|------|
| UI contract | `.planning/phases/06-hexagon-radar-chart/06-UI-SPEC.md` |
| Existing component | `components/ui/hex-radar.tsx` (static SVG, `target` overlay, axis tokens) |
| Types | `SoftSkillHexagon` in `types/index.ts`; `ApiUser.soft_skills?` in `lib/api.ts` |
| Motion precedent | `app/hero/me/page.tsx` — `useReducedMotion` + Framer spread pattern |
| Tooltip dep | `@radix-ui/react-tooltip` already in `package.json` |

### Implementation decisions

1. **Draw-on**  
   Pure SVG polygon has no single `pathLength` like a polyline path. **Recommended:** wrap chart content (grid + axes + hero polygon + dots) in `<motion.g>` (Framer Motion) with `initial={{ opacity: 0.6, scale: 0.15 }}` → `animate={{ opacity: 1, scale: 1 }}`, `transformOrigin: 'center'`, `duration` 0.65–0.85s, `ease` as cubic array `[0.4, 0, 0.2, 1]`.  
   If `useReducedMotion()` → render static final state (no `motion`, or `animate` equals initial skip).

2. **Tooltips**  
   Wrap each vertex `circle` (or invisible hit area `r>=8`) with Radix `Tooltip` + `TooltipProvider` scoped in a small client wrapper **or** one provider in `app/layout.tsx` if not present. Content: **full axis name + `NN/100`**.

3. **Accessibility**  
   Root `<svg>` keeps `aria-label="Soft skill profile"`. Add `role="img"` if not redundant. Optional `aria-describedby` to a visually hidden summary string.

4. **`/hero/[id]`**  
   Route **does not exist** today. Resolve profile from mocks: `MOCK_HERO` when `id === 'me'`, else `MOCK_CANDIDATES.find(c => c.hero.id === id)?.hero` — if none, `notFound()`. Readonly UI (no Edit, no onboarding CTA for viewers); if hero lacks `soft_profile`, show **Soft skills not shared** per UI-SPEC.

5. **`/hero/me` empty state**  
   When `!user.soft_skills`, new `.dr-card` with `EmptyState` or minimal copy matching UI-SPEC + `Link` to `/onboarding` styled as `.dr-btn-primary`.

### Risks

- **Hydration:** no `Date.now()` / `random` in SVG attributes; animation only after mount on client (`'use client'` already on `HexRadar`).
- **Bundle:** Framer already on page; Radix tooltip is tree-shakeable.

### Requirement traceability

| ID | Addressed by |
|----|----------------|
| HERO-05 | Plan 06-01 (component) + 06-02 (surfaces) |
| HERO-06 | Plan 06-02 (`/hero/[id]`) |

---

*Phase 6 research — ready for planning.*
