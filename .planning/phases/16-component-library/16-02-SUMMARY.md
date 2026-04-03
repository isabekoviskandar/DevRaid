---
phase: 16-component-library
plan: 02
subsystem: ui
tags: [react, nextjs, framer-motion, radix-avatar, radix-progress, emerald-guild]

# Dependency graph
requires:
  - phase: 16-01
    provides: FitScoreBadge and the first Emerald Guild component wave reused by roll hero cards
provides:
  - shared AvatarGlow primitive for hero-facing portraits
  - shared SkillBar primitive with one-time in-view activation
  - HexRadar polygon draw-on reveal with reduced-motion fallback
  - calmer premium Roll Hero cards and D20 transition polish
affects: [17-page-redesign, hero-surfaces, captain-matching]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - radix-backed avatar and progress primitives for shared hero UI
    - polygon-level radar reveal instead of whole-chart entrance motion
    - stagger-preserving captain matching polish with shared score/avatar atoms

key-files:
  created:
    - components/ui/avatar-glow.tsx
    - components/ui/skill-bar.tsx
  modified:
    - components/ui/hex-radar.tsx
    - components/features/hero/hero-card.tsx
    - app/hero/me/page.tsx
    - app/hero/[id]/page.tsx
    - components/features/raids/roll-hero-reveal.tsx
    - components/features/captain/d20-roll-animation.tsx

key-decisions:
  - "Hero surfaces consume shared AvatarGlow and SkillBar primitives while HeroCard keeps domain-aware role and status composition."
  - "HexRadar reveals the profile polygon itself and keeps mini consumers quiet by default."
  - "Roll Hero cards reuse FitScoreBadge and AvatarGlow instead of introducing a separate matching-card visual system."

patterns-established:
  - "Hero primitive pattern: shared avatar and progress atoms in components/ui, feature-level composition in HeroCard and route consumers."
  - "Radar motion pattern: animate only the profile polygon draw-on, not the whole chart container."
  - "Captain matching polish pattern: preserve existing stagger timing and upgrade presentation with shared atoms."

requirements-completed: [HERO-01, HERO-02, HERO-03, CAPTAIN-02]

# Metrics
duration: 8 min
completed: 2026-04-03
---

# Phase 16 Plan 02: Hero and Captain Component Pass Summary

**Shared avatar glow and skill-bar primitives, polygon-draw HexRadar, and premium Roll Hero/D20 polish across the live hero and captain surfaces**

## Performance

- **Duration:** 8 min
- **Started:** 2026-04-03T10:41:00Z
- **Completed:** 2026-04-03T10:49:05.9598309+00:00
- **Tasks:** 3
- **Files modified:** 8

## Accomplishments

- Added reusable `AvatarGlow` and `SkillBar` primitives and applied them to `HeroCard`, `/hero/me`, and `/hero/[id]`.
- Switched `HexRadar` from whole-chart entrance motion to profile-polygon draw-on while preserving tooltips, variants, and reduced-motion behavior.
- Polished `RollHeroReveal` and `D20RollAnimation` with calmer Emerald Guild presentation while keeping the working stagger/timing flow intact.
- Verified `npm run build` passes after the component changes.

## Task Commits

Each implementation task was committed atomically:

1. **Task 1: Create shared hero primitives and wire them into `HeroCard` plus live hero pages** - `28b6d36f` (feat)
2. **Task 2: Upgrade `HexRadar`, Roll Hero results, and the D20 transition without Phase 18 creep** - `61cd02ee` (feat)
3. **Task 3: Run build verification for the hero and captain component pass** - No source changes required; `npm run build` passed cleanly

**Plan metadata:** Pending final docs commit after state and roadmap updates

## Files Created/Modified

- `components/ui/avatar-glow.tsx` - Radix Avatar-based premium portrait wrapper with readable fallback and restrained emerald halo.
- `components/ui/skill-bar.tsx` - Accessible progress primitive with one-time in-view activation and reduced-motion immediate state.
- `components/ui/hex-radar.tsx` - Shared radar upgraded to reveal the profile polygon through `pathLength` animation.
- `components/features/hero/hero-card.tsx` - Domain-aware hero summary now consumes `AvatarGlow`, `SkillBar`, and the existing mini radar/status contracts.
- `app/hero/me/page.tsx` - Live profile page now uses `AvatarGlow` and `SkillBar` without changing auth, edit, or link flows.
- `app/hero/[id]/page.tsx` - Public hero header now uses the shared avatar treatment.
- `components/features/raids/roll-hero-reveal.tsx` - Candidate cards now reuse `AvatarGlow` and `FitScoreBadge` while preserving stagger reveal timing.
- `components/features/captain/d20-roll-animation.tsx` - D20 state now has calmer premium emerald/gold framing while preserving `ROLL_MS` timing.

## Decisions Made

- Shared hero-facing visuals live in `components/ui/*`, but `HeroCard` remains the domain-aware mapper of hero data to UI.
- `HexRadar` motion now lives on the polygon itself so full-size charts feel revealed and mini charts stay quiet.
- Roll Hero score treatment now reuses the Phase 16-01 badge tiering instead of forking a separate score display language.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- PowerShell rejected the initial bash-style chained commit command, so the task commits were retried with PowerShell-safe here-string commit messages.

## Known Stubs

- `app/hero/me/page.tsx:13` and `app/hero/me/page.tsx:206` still rely on `MOCK_SKILL_LEVELS` because the profile route does not yet have real per-skill proficiency data.
- `app/hero/me/page.tsx:13` and `app/hero/me/page.tsx:263` still rely on `MOCK_REVIEWS` because review data is still mock-backed in the current MVP.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Hero and captain surfaces now have stable component-level building blocks for Phase 17 page assembly.
- Build verification is green, so Phase 17 can focus on composition rather than reworking hero/captain primitives.

## Self-Check: PASSED

- Verified summary file exists at `.planning/phases/16-component-library/16-02-SUMMARY.md`.
- Verified created files exist: `components/ui/avatar-glow.tsx`, `components/ui/skill-bar.tsx`.
- Verified task commits exist: `28b6d36f`, `61cd02ee`.

