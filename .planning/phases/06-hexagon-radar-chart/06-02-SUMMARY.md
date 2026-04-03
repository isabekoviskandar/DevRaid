---
phase: 06-hexagon-radar-chart
plan: 02
status: complete
completed_at: 2026-04-03T12:00:00Z
---

# Phase 6, Plan 02 — Hero surfaces + public profile summary

**Goal:** Show soft-skill radar on `/hero/me` and readonly `/hero/[id]` with empty states and mock resolution per `06-UI-SPEC.md`.

## Deliverables

| Surface | Behavior |
|---------|----------|
| `/hero/me` | Soft skills card: `HexRadar` when `user.soft_skills` (or equivalent mock path); otherwise empty copy + link to `/onboarding` |
| `/hero/[id]` | Public profile; `notFound()` for unknown id; radar or “not shared” when no `soft_profile` |
| Mock API | `resolveMockHeroProfile(id)` in `lib/mock-data.ts` resolves `me`, `MOCK_HERO`, and Roll Hero candidate heroes (`c1`…`c5`) |

## Files

- `app/hero/me/page.tsx`
- `app/hero/[id]/page.tsx`
- `components/features/hero/public-hero-radar.tsx` (client wrapper where needed)
- `lib/mock-data.ts` — `resolveMockHeroProfile`

## Verification

- `npm run build` — routes include `ƒ /hero/[id]`, `/hero/me` bundle updated (2026-04-03)
