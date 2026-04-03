---
phase: 02-raid-actions
plan: 01
subsystem: ui
tags: [react, typescript, nextjs, form, controlled-inputs, uuid]

requires:
  - phase: 01-auth-hardening
    provides: Auth guard pattern (useEffect + authStore.isAuthenticated + router.replace) used as structural template

provides:
  - Full raid creation form at /captain/new with title, mission, stage, dynamic roles, and mock-submit success state
  - RoleEntry + RaidFormData local form interfaces pattern (define local types, import only domain types)
  - STAGE_OPTIONS constant pattern for typed select options
  - Stable UUID key pattern for dynamic list items (crypto.randomUUID, never index)

affects:
  - 02-02-apply-modal (same page/component conventions: dr-card, dr-btn-*, inline var(--color-dr-*) tokens, space-y classes)

tech-stack:
  added: []
  patterns:
    - "Local form interfaces defined in component file, domain types imported as type-only"
    - "crypto.randomUUID() for stable list item keys — never array index"
    - "Conditional render pattern: formState === 'success' ? <SuccessCard> : <Form>"
    - "Handler functions defined after auth guard but before return — inside component body"
    - "All colors via CSS custom properties (var(--color-dr-*)), layout via Tailwind utility classes"

key-files:
  created: []
  modified:
    - app/captain/new/page.tsx

key-decisions:
  - "Mock submit only (setFormState('success')) — no API call until POST /raids endpoint ready from backend"
  - "Local RoleEntry/RaidFormData interfaces rather than extending RaidRole domain type — avoids coupling to backend shape"
  - "Handler functions placed after auth guard check but inside component — they only run when checked=true"
  - "remove button disabled (not hidden) when roles.length <= 1 — preserves layout stability"

patterns-established:
  - "Form card structure: dr-card p-6 > dr-label header > hr.dr-divider > space-y-N fields"
  - "Input style: background/border/color via inline style, layout/focus via Tailwind"
  - "Dynamic list: roles.map(role => <div key={role.id}>) with updateRole(id, field, value) dispatch"

requirements-completed: [CAPTAIN-01, CAPTAIN-02, CAPTAIN-03, CAPTAIN-04]

duration: 15min
completed: 2026-04-02
---

# Phase 02 Plan 01: Raid Creation Form Summary

**Full /captain/new form: controlled title/mission/stage inputs, dynamic UUID-keyed role rows with add/remove guards, and mock-submit success state — all inside preserved auth guard**

## Performance

- **Duration:** 15 min
- **Started:** 2026-04-02T00:00:00Z
- **Completed:** 2026-04-02T00:15:00Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments

- TypeScript interfaces (RoleEntry, RaidFormData) and STAGE_OPTIONS constant defined in component file
- Full form JSX: Mission Brief card (title, mission, stage) + Roles Needed card (dynamic rows) + submit button
- Mock-submit flow: handleSubmit calls setFormState('success') revealing a success card with the raid title
- Dynamic roles: addRole (crypto.randomUUID key), removeRole (filter by id), updateRole (map by id) — no index keys, no value shifting
- Remove button disabled when roles.length <= 1, enforcing minimum one-role constraint
- Auth guard (useEffect + router.replace('/login') + if (!checked) return null) preserved byte-for-byte

## Task Commits

1. **Task 1: Define TypeScript interfaces and state shape** - `030f177` (feat)
2. **Task 2: Build full form JSX with success state and dynamic roles** - `fe58c9d` (feat)

## Files Created/Modified

- `app/captain/new/page.tsx` - Complete rewrite: RoleEntry/RaidFormData interfaces, STAGE_OPTIONS, form state + handlers, full form JSX with success state

## Decisions Made

- Mock submit (no API): `handleSubmit` calls `setFormState('success')` — no POST /raids until backend endpoint ready
- Local form types only: `RoleEntry` and `RaidFormData` are local interfaces; only `RaidStage` is imported as type from `@/types` (avoids coupling to full RaidRole backend shape)
- Handlers after guard: handler functions (`handleFormChange`, `addRole`, etc.) are defined inside the component body after `if (!checked) return null` — they only need to exist when authenticated
- Disable not hide: remove button uses `disabled` prop so the button element stays in layout (prevents row height jump)

## Deviations from Plan

None - plan executed exactly as written. Both tasks implemented in a single Write operation since they produce a single cohesive file; two git commits document them as separate logical steps.

## Issues Encountered

None. TypeScript: EXIT:0. ESLint: EXIT:0. All grep contract checks passed.

## Known Stubs

- `handleSubmit` does not call any API — intentional stub per CAPTAIN-04 spec ("mock submit — no API call yet"). The success state is fully rendered. Real POST /raids submission is deferred to when the backend endpoint is available.

## Next Phase Readiness

- Plan 02-02 (Apply modal) can follow same conventions: `dr-card` wrapper, inline `var(--color-dr-*)` tokens for colors, Tailwind for layout, UUID keys for list items.
- The `/captain/new` page now renders a complete functional form — no blockers for 02-02.
- Pattern to follow: conditional render with `formState` state variable is established and proven.

## Self-Check: PASSED

- FOUND: app/captain/new/page.tsx
- FOUND: .planning/phases/02-raid-actions/02-01-SUMMARY.md
- FOUND: commit 030f177 (feat(02-01): TypeScript interfaces and state shape)
- FOUND: commit fe58c9d (feat(02-01): full form JSX)
- TypeScript: EXIT:0 (cmd /c npx tsc --noEmit)
- ESLint: EXIT:0 (cmd /c npx next lint)
- grep key={role.id}: FOUND line 242
- grep setFormState.*success: FOUND line 75
- grep roles.length: FOUND lines 285, 288, 290, 291
- grep crypto.randomUUID: FOUND lines 10, 40, 60
- grep authStore|router.replace: FOUND lines 5, 44, 45

---
*Phase: 02-raid-actions*
*Completed: 2026-04-02*
