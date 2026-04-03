---
phase: 15-design-system-2-0
plan: 01
subsystem: ui
tags: [css, tailwind-v4, design-system, tokens, typography]

# Dependency graph
requires:
  - phase: 14-demo-visual-overhaul
    provides: Emerald Guild visual direction and compatibility hooks carried into the global CSS layer
provides:
  - normalized Tailwind utility tokens and runtime CSS variables in `app/globals.css`
  - additive display-font and aurora utility contracts for later component/page phases
  - reduced-motion-safe atmospheric layers with explicit z-index ownership
affects: [16-component-library, 17-page-redesigns, 18-animations-fx]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - split utility-backed Tailwind tokens from runtime-only CSS variables
    - preserve existing `.dr-*` contracts while extending the design-system API additively

key-files:
  created: []
  modified: [app/globals.css]

key-decisions:
  - "Keep `@theme` limited to utility-backed namespaces and move glass, duration, z-index, and atmosphere controls into `:root`."
  - "Reserve display typography for `.dr-heading`, `.dr-font-display`, and `.dr-title-fantasy` while leaving body and label text on sans/mono contracts."

patterns-established:
  - "Token ownership: Tailwind utility tokens in `@theme`, runtime system tokens in `:root`."
  - "Atmosphere tuning via subtle intensity variables instead of page-specific background rewrites."

requirements-completed: [DESIGN-01, DESIGN-02, DESIGN-03, DESIGN-04, DESIGN-05, DESIGN-06, DESIGN-07, DESIGN-08]

# Metrics
duration: 13 min
completed: 2026-04-03
---

# Phase 15 Plan 01: Design System 2.0 Summary

**Emerald Guild token ownership split with additive display-font utilities, layered aurora controls, and compatibility-safe `.dr-*` contracts in `app/globals.css`**

## Performance

- **Duration:** 13 min
- **Started:** 2026-04-03T09:38:00Z
- **Completed:** 2026-04-03T09:50:53Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments
- Split `app/globals.css` into a clean `@theme` utility token layer and a `:root` runtime layer for glass, timing, z-index, and atmosphere controls.
- Rewired the global Emerald Guild utilities to consume the normalized token layer while preserving `.dr-card`, `.dr-btn-*`, `.dr-heading`, `.dr-title-fantasy`, and root hook compatibility.
- Added `.dr-font-display`, aurora pseudo-layers, and reduced-motion guardrails so later phases can reuse the system without spreading raw values into TSX files.

## Task Commits

Each task was committed atomically:

1. **Task 1: Split utility-backed tokens from runtime-only CSS vars** - `088fd6d4` (feat)
2. **Task 2: Rewire global utilities and atmosphere selectors to the Emerald Guild token layer** - `d7b19acb` (feat)

**Plan metadata:** Pending

## Files Created/Modified
- `app/globals.css` - Normalized Phase 15 token ownership, compatibility utilities, aurora layers, and reduced-motion coverage

## Decisions Made
- Moved `--glass-*`, `--dur-*`, `--z-*`, and the Emerald Guild atmosphere controls into `:root` so utility-backed Tailwind namespaces stay separate from runtime implementation details.
- Introduced `--font-display` plus `.dr-font-display` as the forward display contract while keeping `.dr-title-fantasy` and `.dr-heading` compatible for existing consumers.
- Kept the atmosphere layered and subtle by tokenizing aurora, mist, grid, and noise intensity rather than redesigning any page markup in Phase 15.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- `npm run lint` could not complete non-interactively because `next lint` launches the initial ESLint setup prompt in this repo instead of running a configured lint pass.
- The repository already had many unrelated modified and untracked files before execution, so the repo-wide "only this file changed" verification was adapted to targeted `app/globals.css` checks and direct file-edit audit.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Phase 16 can now consume stable shadow, glass, motion, z-index, display-font, and atmosphere tokens from `app/globals.css` without adding new literals in component files.
- Existing route markup and root hooks remain intact, so component/page phases can adopt the new system incrementally.
- `npm run build` is green. `npm run lint` still needs a repo-level ESLint configuration before it can be used as a non-interactive gate.

## Self-Check: PASSED

- Summary file exists on disk at `.planning/phases/15-design-system-2-0/15-01-SUMMARY.md`.
- Task commits `088fd6d4` and `d7b19acb` are present in git history.

---
*Phase: 15-design-system-2-0*
*Completed: 2026-04-03*
