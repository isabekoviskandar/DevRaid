---
phase: 09-captain-applications
status: partial
execution: ad_hoc_after_phase_6
completed_at: 2026-04-03T12:00:00Z
---

# Phase 9 — Captain review (execution summary)

## Completed (mock)

| ROADMAP / REQ | Implementation |
|---------------|----------------|
| Applications list (mock) | `CaptainApplicationsSection` on **`/captain/[id]`** (not `/raids/[id]/board`) |
| Card: hero, role, message | `PendingRaidApplication` + `MOCK_PENDING_APPLICATIONS` in `lib/mock-data.ts` |
| Approve / Reject | Local state removes row; TODO for API |

**Type:** `PendingRaidApplication` in `types/index.ts`.

## Not done (explicit deferral)

| Item | Note |
|------|------|
| **09-02** Active Heroes Sheet | Not implemented — ROADMAP checkbox remains open |
| **CAPTAIN-05** as specified | List lives on captain dashboard route, not Quest Board URL |
| Status column + micro radar on application cards | Optional polish; radar not required on application rows in current UI |

## Follow-up

- Move or duplicate applications block to `/raids/[id]/board` if URL parity with REQUIREMENTS matters.
- Implement Active Heroes Sheet and backend persistence for approve/reject.
