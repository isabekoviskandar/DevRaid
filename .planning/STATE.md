---
gsd_state_version: 1.0
milestone: v1.1
milestone_name: "— Emerald Guild: Fantasy UI Immersion"
current_phase: 16
status: verifying
stopped_at: Completed 16-component-library-02-PLAN.md
last_updated: "2026-04-03T10:52:01.429Z"
last_activity: 2026-04-03 -- Completed 16-02 hero and captain component upgrade
progress:
  total_phases: 17
  completed_phases: 12
  total_plans: 16
  completed_plans: 20
---

# Project State: DevRaid Frontend

**Last updated:** 2026-04-03  
**Current milestone:** v1.1 — Emerald Guild: Fantasy UI Immersion  
**Current phase:** 16

## Project Reference

See: `.planning/PROJECT.md`

**Core value:** Герой находит Рейд под свои навыки и подаёт заявку за 3 клика  
**Current focus:** Phase 16 — component-library

## Current Position

Phase: 16 (component-library) — EXECUTING
Plan: 2 of 2
Status: Phase complete — ready for verification
Last activity: 2026-04-03 -- Completed 16-02 hero and captain component upgrade

## Current Position

- **Phases 1–5** — ✅ Complete (prior sessions)
- **Phase 6** — ✅ Complete — HexRadar + `/hero/me` + `/hero/[id]` — `06-01-SUMMARY`, `06-02-SUMMARY`, `06-VERIFICATION.md`
- **Phase 7** — ✅ Complete (mock) — D20 + Roll Hero + re-roll + invite stub — `07-EXECUTION-SUMMARY.md`
- **Phase 8** — ✅ Complete (mock) — `/raids` filters + live search — `08-EXECUTION-SUMMARY.md`
- **Phase 9** — ⚠️ **Partial** — Applications on **`/captain/[id]`** + Approve/Reject mock; **09-02 Active Heroes Sheet** not built — `09-EXECUTION-SUMMARY.md`
- **Phase 10** — ✅ Complete — Onboarding now uses `/api/metrics/questions` + `/api/metrics/score`
- **Phase 11** — ✅ Complete — Hydration warning suppression + `/favicon.ico` route fix
- **Phase 12** — ✅ Complete — Local frontend API base aligned to backend (`8087`)
- **Phase 13** — ✅ Complete — Middleware/auth store consistency fixed (cookie + localStorage sync)
- **Phase 14** — ✅ Complete — Demo Day visual baseline and phase artifacts prepared for the Emerald Guild sprint
- **Phase 15** — ✅ Complete — `app/globals.css` now owns stable theme/runtime tokens, display-font aliases, and aurora guardrails — `15-01-SUMMARY.md`

## Recent Progress

### Session 19 (2026-04-03) — Phase 16-02 hero and captain component execution (Cursor)

- Added shared `AvatarGlow` and `SkillBar` primitives, then wired them into `HeroCard`, `/hero/me`, and `/hero/[id]` for visible hero-surface polish.
- Switched `HexRadar` to profile-polygon draw-on animation while preserving `mini` behavior, tooltips, and reduced-motion fallbacks.
- Upgraded `RollHeroReveal` and `D20RollAnimation` with calmer Emerald Guild composition using shared avatar and score treatment.
- Verified `npm run build` EXIT 0 after the component changes.

### Session 18 (2026-04-03) — Phase 16-01 component execution (Cursor)

- Added reusable `FitScoreBadge`, `HexSlotIndicator`, and `StepProgress` primitives for the first Emerald Guild component wave.
- Upgraded `components/features/raids/raid-card.tsx` with extracted atoms, `--glow-x` / `--glow-y` spotlight hover, scan-friendly metadata, and `Join Raid` CTA copy.
- Replaced onboarding's bare progress treatment with `StepProgress` plus a supporting fill bar while preserving the existing questionnaire, submit, and routing logic.
- Verified `npm run build` EXIT 0 after the component changes.

### Session 16 (2026-04-03) — Milestone v1.1 Roadmap (GSD Roadmapper)

- Roadmap for Phases 15–18 created in `.planning/ROADMAP.md`
- 30/30 v1.1 requirements mapped with 100% coverage across 4 phases
- Traceability table updated in `.planning/REQUIREMENTS.md`
- Phase order: 15 (tokens) → 16 (components) → 17 (pages) → 18 (animations/FX)
- Key constraints encoded: Phase 15 zero-risk (globals.css only), Phase 18 requires stable DOM from Phase 17
- Next: `/gsd-plan-phase 15`

### Session 17 (2026-04-03) — Phase 15 discuss-phase context capture

- Visual direction corrected from full `Obsidian Citadel` toward `Emerald Guild`
- Locked decisions captured for Phase 15:
  - dark foundation + lighter emerald/taupe panels
  - mist + subtle hex-grid + noise background
  - Cinzel only for hero/page-title/logo hierarchy
  - restrained premium glow
  - emerald primary with taupe/gold support
  - clean UI with fantasy edges, not maximum-RPG ornament
- Created:
  - `.planning/phases/15-design-system-2-0/15-CONTEXT.md`
  - `.planning/phases/15-design-system-2-0/15-DISCUSSION-LOG.md`
- Build after early Phase 15 foundation edits: `npm run build` EXIT 0

### Session 15 (2026-04-03) — Phase 13 auth guard consistency (Cursor)

- Root cause fixed: middleware relied on `auth_token` cookie while client persisted token only in `localStorage`
- Implemented bidirectional runtime consistency:
  - cookie write/remove in auth store
  - legacy localStorage session cookie backfill
- Hidden app shell sidebar on auth routes (`/login`, `/register`) to avoid contradictory UI
- Build verification passed

### Session 14 (2026-04-03) — Phase 12 local API endpoint alignment (Cursor)

- Updated `.env.local` to `NEXT_PUBLIC_API_URL=http://127.0.0.1:8087`
- Updated `lib/api.ts` fallback base URL and dynamic network error message
- Eliminated stale `port 8000` guidance in UI error text

### Session 13 (2026-04-03) — Phase 11 hydration + favicon stability (Cursor)

- Added `suppressHydrationWarning` on root `html/body` in `app/layout.tsx`
- Added `app/favicon.ico/route.ts` (favicon endpoint now returns `200`)
- Verified:
  - `npm run build` EXIT 0
  - `/favicon.ico` returns 200

### Session 12 (2026-04-03) — Phase 10-02 local FE/BE contract smoke (Cursor)

- Local backend contract smoke against `http://127.0.0.1:8087`:
  - auth register/login token path
  - metrics questions (`6` axes, `18` questions)
  - metrics scoring and user profile persistence
  - authenticated raid matching response with `scores` + `explainability`
- Added phase artifacts:
  - `10-02-PLAN.md`
  - `10-02-SUMMARY.md`

### Session 11 (2026-04-03) — Phase 10 onboarding metrics migration (Cursor)

- `app/onboarding/page.tsx` migrated from local 20-question bank to backend-driven metrics flow
- `lib/api.ts` metrics types expanded; `patchUser` switched from mock to `PUT /api/user/update`
- `/hero/me` soft skills render now supports `soft_profile` fallback
- `npm run build` — EXIT 0

### Session 10 (2026-04-03) — Execute phases 6–9 + planning closeout (Cursor)

- Phase 6: `HexRadar` tooltips/motion/mini; hero pages; `resolveMockHeroProfile`
- Phase 7: `D20RollAnimation`, `CaptainRollSection` phase machine, `RollHeroReveal` profile links
- Phase 8: `RaidBoardView` — role chips + search; `app/raids/page.tsx` thin server wrapper
- Phase 9: `CaptainApplicationsSection`, `MOCK_PENDING_APPLICATIONS`, `pendingApplicationsForRaid`
- `npm run build` — EXIT 0
- Planning: `06-*-SUMMARY`, `06-VERIFICATION`, `07–09` execution summaries, ROADMAP/REQUIREMENTS/STATE/HANDOFF updates

### Session 09 (2026-04-03) — GSD plan-phase Phase 6

- `06-RESEARCH.md`, `06-01-PLAN.md`, `06-02-PLAN.md`

### Session 08 (2026-04-03) — GSD ui-phase Phase 6

- `06-UI-SPEC.md`

### Session 07 (2026-04-03) — Phase 5 gap closure (Cursor)

- ApiResponse narrowing, `SoftSkillHexagon` mock alignment, build green

*(Earlier sessions 03–06 unchanged — see git history.)*

## Key Decisions

- **Phase 16 hero primitives:** Reuse shared `AvatarGlow` and `SkillBar` on hero surfaces while keeping `HeroCard` as the domain-aware composition layer.
- **Phase 16 radar reveal:** Animate the `HexRadar` profile polygon itself so full charts feel revealed and mini contexts stay visually quiet.
- **Phase 16 roll hero polish:** Reuse `FitScoreBadge` and `AvatarGlow` in candidate cards instead of inventing a separate score/avatar visual language.
- **Phase 16 raid-card spotlight:** Keep hover tracking local to `RaidCard` via card-root CSS custom properties instead of adding shared spotlight infrastructure.
- **Phase 16 onboarding progress:** Keep `StepProgress` presentational-only and let `app/onboarding/page.tsx` continue owning question, scoring, and routing state.
- **Phase 15 token ownership:** `@theme` now holds only utility-backed namespaces; glass, duration, z-index, and atmosphere controls moved to `:root`.
- **Phase 15 typography + perf guardrails:** Display font is reserved for `.dr-heading`, `.dr-font-display`, and `.dr-title-fantasy`, while `will-change: transform` remains limited to aurora layers.
- **Roll flow:** Three UI phases — intro card → D20 (~1.2s) → `RollHeroReveal`; re-roll shuffles and replays D20.
- **Reduced motion:** D20 screen skips spin; `onComplete` via ref-stable timeout to avoid effect churn.
- **Raid board filters:** Implemented as **role family** chips (Frontend / Backend+data+devops / Design / Mobile), not raid `stage` — document in ROADMAP/REQUIREMENTS.
- **Applications:** First ship on **captain dashboard** (`/captain/[id]`) instead of `/raids/[id]/board` until board page is extended.

## Open Items

- [ ] Backend integration polish: wire remaining raid/apply/application APIs end-to-end
- [ ] ROADMAP **09-02** Active Heroes Sheet
- [ ] Optional: stage filter on `/raids`; applications duplicated on `/raids/[id]/board`

## Tech Notes

- `lib/mock-data.ts` — adds `MOCK_PENDING_APPLICATIONS`, `pendingApplicationsForRaid`, `resolveMockHeroProfile`
- `components/features/raids/raid-board-view.tsx` — client discovery UI
- Next.js 15: async `params` in dynamic routes

## Performance Metrics

| Phase | Plan | Duration | Tasks | Files | Notes |
|-------|------|----------|-------|-------|-------|
| 16-component-library | 02 | 8 min | 3 | 8 | Hero primitives, radar reveal, roll polish, build green |
| Phase 16-component-library P02 | 8 min | 3 tasks | 8 files |

## Session Continuity

Stopped at: Completed 16-component-library-02-PLAN.md

---
*Session log: F:/_WORK_/SECOND_BRAIN/projects/(team-projects)/DEVRAID/sessions/*
