---
phase: 07-roll-hero
status: complete
execution: ad_hoc_after_phase_6
completed_at: 2026-04-03T12:00:00Z
---

# Phase 7 — Roll Hero (execution summary)

No separate `07-*-PLAN.md` was written; work executed in the same MVP pass as phases 6 tail and 8–9.

## ROADMAP criteria addressed

| Criterion | Implementation |
|-----------|------------------|
| D20 ~1.2s before results | `components/features/captain/d20-roll-animation.tsx`; `CaptainRollSection` phases `intro → rolling → results` |
| Candidates with scores | Existing `MOCK_CANDIDATES` + `RollHeroReveal` (hard/soft/score chips, `HexRadar` mini) |
| Re-roll | Shuffles order + returns to rolling phase (`captain-roll-section.tsx`) |
| Invite | Removes row from list (mock); TODO comment for POST |

## Files

- `components/features/captain/captain-roll-section.tsx`
- `components/features/captain/d20-roll-animation.tsx`
- `components/features/raids/roll-hero-reveal.tsx` — hero name links to `/hero/[id]`

## Follow-up

- Real matching API and persisted invite state.
