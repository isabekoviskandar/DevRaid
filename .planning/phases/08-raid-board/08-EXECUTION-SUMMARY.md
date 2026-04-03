---
phase: 08-raid-board
status: complete
execution: ad_hoc_after_phase_6
completed_at: 2026-04-03T12:00:00Z
---

# Phase 8 — Raid Board filters & search (execution summary)

## ROADMAP intent vs implementation

| ROADMAP item | Delivered |
|--------------|-----------|
| List from GET /raids | Still **`MOCK_RAIDS`** in Server Component; TODO on `app/raids/page.tsx` for API |
| Filters | **Role-category chips:** All, Frontend, Backend (includes `backend` / `data` / `devops`), Design, Mobile — not raid `stage` (stage filter deferred) |
| Live search | Client filter over title, mission, captain name, role names |

## Files

- `components/features/raids/raid-board-view.tsx` — client UI
- `app/raids/page.tsx` — passes mocks into `RaidBoardView`

## Follow-up

- Replace prop source with `fetch` + loading skeleton when backend exists.
- Add **stage** filter if product still requires RAID-05 literally.
