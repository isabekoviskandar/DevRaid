---
phase: 03-hero-profile
plan: 01
subsystem: ui
tags: [framer-motion, lucide-react, localStorage, typescript, next-js]

requires:
  - phase: 02-raid-actions
    provides: design tokens, dr-card/dr-btn classes, AnimatePresence pattern from apply-modal

provides:
  - ApiUser extended with github_url, linkedin_url, hard_skills fields
  - api.auth.patchUser() stub returning resolved Promise (localStorage-only save)
  - authStore.updateUser() patching localStorage cache in-place
  - /hero/me page: skills chips display, GitHub/LinkedIn icon links, animated inline edit panel

affects: [04-raid-board, 05-captain-board, future hero profile backend integration]

tech-stack:
  added: []
  patterns:
    - "Lazy useState initializer to read localStorage without re-render loop"
    - "useReducedMotion spread pattern for accessible Framer Motion (empty object {} skips all animation props)"
    - "Optimistic UI: update React state from authStore after patchUser stub, no page reload"
    - "Tag input: Enter/comma appends chip to draft array; X button filters it out"

key-files:
  created: []
  modified:
    - lib/api.ts
    - lib/auth-store.ts
    - app/hero/me/page.tsx

key-decisions:
  - "patchUser is a localStorage stub — returns Promise.resolve({ data: _patch }) — real PATCH /api/auth/user pending backend"
  - "draft state initialized once via lazy useState (() => authStore.getUser()) to avoid resetting on re-renders"
  - "panelMotion spreads {} when useReducedMotion() is true — no separate conditional render needed"
  - "hard_skills stored in localStorage only; not sent to backend until PATCH endpoint available"

patterns-established:
  - "inputStyle / labelStyle as module-level as const objects — reuse across auth/profile forms"

requirements-completed: [HERO-02, HERO-03, HERO-04]

duration: 15min
completed: 2026-04-02
---

# Phase 03 Plan 01: Hero Profile — Skills & Edit Panel Summary

**Skills chips + GitHub/LinkedIn icon links on /hero/me, with Framer Motion inline edit panel that saves bio/skills/socials to localStorage via authStore.updateUser()**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-04-02T00:00:00Z
- **Completed:** 2026-04-02T00:15:00Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments

- Extended ApiUser with `github_url?`, `linkedin_url?`, `hard_skills?` and added `patchUser()` stub to api.auth
- Added `authStore.updateUser()` to patch localStorage cache without clearing token
- Replaced "coming soon" placeholder with live skills chips and social icon links
- Built animated edit panel (AnimatePresence height 0 → auto) with bio textarea, URL inputs, tag chip input/remove, and idle/saving/saved button states

## Task Commits

1. **Task 1: Extend ApiUser and add authStore.updateUser()** - `cb661c2` (feat)
2. **Task 2: Replace coming-soon with skills display** - `ae895df` (feat)
3. **Task 3: Inline animated edit panel** - `c2945e6` (feat)

## Files Created/Modified

- `lib/api.ts` - ApiUser extended with 3 optional fields; patchUser() stub added to api.auth
- `lib/auth-store.ts` - updateUser(patch) method merges partial update into localStorage cache
- `app/hero/me/page.tsx` - Full skills/edit UI: 188 lines (was 114), replaces coming-soon block

## Decisions Made

- patchUser is a stub (no real API call) — backend PATCH endpoint is pending. Resolves with the patch object so callers can await it safely.
- Lazy `useState(() => authStore.getUser())` for draft initialization avoids reading stale `user` state on mount.
- `useReducedMotion()` returns `boolean | null`; spreading `{}` when truthy skips all Framer props cleanly.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## Known Stubs

- `api.auth.patchUser()` in `lib/api.ts` (line ~90): Returns `Promise.resolve({ data: _patch })` with no HTTP call. Comment reads "TODO: replace mock with real call when backend adds PATCH /api/auth/user". Data is saved to localStorage only. This is intentional — waiting on Iskandar's backend.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- /hero/me profile page is feature-complete for localStorage-based hero data
- When backend adds PATCH /api/auth/user, replace the patchUser stub body with a real `req<...>('PATCH', ...)` call — no other changes needed
- Ready for Phase 04 (Raid Board) — hero profile data is now accessible via authStore.getUser()

---
*Phase: 03-hero-profile*
*Completed: 2026-04-02*
