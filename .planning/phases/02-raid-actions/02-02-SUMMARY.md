---
phase: 02-raid-actions
plan: 02
subsystem: ui
tags: [radix-dialog, framer-motion, react, nextjs, typescript, modal, animation]

# Dependency graph
requires:
  - phase: 02-raid-actions/02-01
    provides: captain/new form — established Client Island pattern for this phase
provides:
  - ApplyModal Client Island with Radix Dialog + AnimatePresence + role selector + motivation form + success state
  - /raids/[id] page wired to ApplyModal replacing static Apply button
affects:
  - hero application flow
  - any future phase connecting modal submission to POST /apply endpoint

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Client Island wrapping interactive modal in an otherwise Server Component page"
    - "Radix Dialog + Framer Motion AnimatePresence forceMount pattern for exit animation"
    - "useReducedMotion guard — skip animation props entirely when prefers-reduced-motion active"
    - "Controlled dialog open state with setTimeout reset to avoid flash during exit animation"

key-files:
  created:
    - components/features/raids/apply-modal.tsx
  modified:
    - app/raids/[id]/page.tsx

key-decisions:
  - "Mock submit (setFormState success) — no POST /apply until backend ready"
  - "Single ApplyModal per role row receives full openRoles array — hero picks role inside modal"
  - "Form reset on close via setTimeout 300ms to avoid flash during Framer exit animation"
  - "useReducedMotion passes empty object spread to motion props — zero animation when active"

patterns-established:
  - "Radix Dialog forceMount + AnimatePresence {open && Portal} for controllable exit animation"
  - "role=radiogroup / role=radio + aria-checked for accessible custom radio cards"
  - "onFocus/onBlur inline style swap for textarea focus ring (no Tailwind focus: class needed)"

requirements-completed: [RAID-01, RAID-02, RAID-03]

# Metrics
duration: 15min
completed: 2026-04-02
---

# Phase 02 Plan 02: Apply Modal Summary

**Radix Dialog + Framer Motion apply modal with role radio cards, motivation textarea validation, and success state on /raids/[id] Server Component page**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-04-02T00:00:00Z
- **Completed:** 2026-04-02
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- ApplyModal Client Island created at `components/features/raids/apply-modal.tsx` with full modal UI
- Radix Dialog controlled open state + Framer Motion AnimatePresence forceMount pattern for smooth exit animation
- Role selector renders all openRoles as accessible radio cards with selected/unselected design token styles
- Motivation textarea with char counter (muted < 20, glow >= 20) and validation error below field
- Success state "Quest Application Submitted!" with fantasy flavor text and form reset on close
- /raids/[id] page remains Server Component — ApplyModal is the only client boundary

## Task Commits

Each task was committed atomically:

1. **Task 1: Create ApplyModal Client Island** - `c372ceb` (feat)
2. **Task 2: Wire ApplyModal into /raids/[id] page** - `3b2d69f` (feat)

**Plan metadata:** see final metadata commit below

## Files Created/Modified

- `components/features/raids/apply-modal.tsx` - 'use client' island: Dialog.Root, AnimatePresence, role radio cards, motivation textarea with validation, success state
- `app/raids/[id]/page.tsx` - Added ApplyModal import, replaced static Apply button with `<ApplyModal openRoles={openRoles} />`

## Decisions Made

- Mock submit (setFormState success) for now — no POST /apply until backend ready (Iskandar's endpoint)
- Single ApplyModal instance per role row, receives full openRoles array — hero picks target role inside modal (not pre-seeded per row)
- Form reset via setTimeout 300ms on close when formState === 'success' to prevent visible flash during exit animation
- useReducedMotion: spread empty object `{}` onto motion props to disable all animation (no initial/animate/exit)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None — TypeScript passed clean (exit 0) on both tasks. No blocking issues encountered.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Apply Modal flow fully functional with mock submit
- Ready to wire to real POST /apply endpoint once Iskandar's backend delivers it
- openRoles prop is already typed as RaidRole[] (serialisable) — backend integration requires only replacing handleSubmit with an API call

---
*Phase: 02-raid-actions*
*Completed: 2026-04-02*

## Self-Check: PASSED

- FOUND: components/features/raids/apply-modal.tsx
- FOUND: app/raids/[id]/page.tsx
- FOUND: .planning/phases/02-raid-actions/02-02-SUMMARY.md
- FOUND commit c372ceb: feat(02-02): create ApplyModal Client Island
- FOUND commit 3b2d69f: feat(02-02): wire ApplyModal into /raids/[id] page
- TypeScript: EXIT:0 (no errors)
