# Phase 5: Onboarding & Soft Skill Generation — PLANNING COMPLETE

**Status:** ✅ Ready for Execution

**Date:** 2026-04-02
**Planner:** Claude Code (gsd-planner)
**Model:** claude-haiku-4-5-20251001

---

## What Was Planned

### Phase Goal
Users complete a 20-question onboarding flow → receive a 5-axis Soft Skill Profile (0-100 values per axis).

**User Flow:**
```
Sign Up → /onboarding (20 questions, 1 per screen)
  → Calculate SoftSkillHexagon
  → Results page (5 values)
  → /hero/me (profile page)
```

### Planning Approach
- **Goal-backward methodology:** Defined observable truths, required artifacts, critical wiring
- **Dependency-first:** Grouped tasks by needs/creates relationships, not sequence
- **Wave-based execution:** 2 waves maximum parallelization
- **Design-first:** Honored Phase 5 CONTEXT.md + UI-SPEC.md contracts exactly

---

## Plans Created

### Plan 01: Data & Types Foundation (Wave 1)
**Duration:** ~2 hours
**Tasks:** 4
**Autonomous:** Yes

**Deliverables:**
- `lib/onboarding-questions.ts` — 20 questions (5 axes × 4 questions), Russian text, fully typed
- `lib/skill-calculator.ts` — calculateHexagon() function (A/B/C/D → 0-100)
- `types/index.ts` (updated) — SoftSkillHexagon interface (5 axes, per Phase 5 spec)
- `lib/api.ts` (updated) — ApiUser extended with onboarding_completed, soft_skills

**Key Outputs:**
- QUESTIONS array with OnboardingQuestion interface
- AXIS_QUESTIONS mapping {initiative, expertise, speed, communication, flexibility} → question IDs
- calculateHexagon(answers) → SoftSkillHexagon
- Weight mapping: A=1, B=2, C=3, D=4 → per-axis average × 25 = 0-100

**Must Pass:**
- TypeScript strict mode: `npx tsc --noEmit` exits 0
- calculateHexagon({all A's}) → {25, 25, 25, 25, 25}
- calculateHexagon({all D's}) → {100, 100, 100, 100, 100}

---

### Plan 02: Form UI & Middleware (Wave 2)
**Duration:** ~2-3 hours
**Tasks:** 3
**Autonomous:** Yes
**Depends On:** Plan 01 complete

**Deliverables:**
- `app/onboarding/page.tsx` — Client Component, multi-step form + results screen (250+ lines)
- `app/onboarding/layout.tsx` — Minimal wrapper with metadata
- `middleware.ts` — Auth redirect + onboarding completion check (stub for Phase 5)

**Key Outputs:**
- Form: 20 steps, 1 question per screen, state management with answers tracking
- UI: Radio cards with glow effects, progress bar (emerald, 4px, fixed top), step counter
- Results: 5 skill axes displayed as name/value grid
- CTA: "Go to Profile" button → router.push('/hero/me')
- Animations: CSS transitions (fade, progress bar width smooth)
- Accessibility: ARIA labels, keyboard nav (Tab, Arrow, Space, Enter)

**Must Pass:**
- Form renders at `/onboarding` with first question visible
- Progress bar fills smoothly 0% → 100% over 20 steps
- Radio cards: select → button enabled, visual feedback (glow)
- Step 20 → calculates hexagon, shows results
- Mobile responsive (tested at 375px width)
- TypeScript strict mode: exit 0

---

## Wave Structure

| Wave | Plans | Status | Duration |
|------|-------|--------|----------|
| 1 | Plan 01 (4 tasks) | Ready | ~2h |
| 2 | Plan 02 (3 tasks) | Ready | ~2-3h |

**Total:** 7 tasks, 2 plans, ~4-5 hours Claude execution time

**Parallelization:** Wave 1 runs independently. Wave 2 starts after Wave 1 complete.

---

## Files to Create/Modify

| File | Status | Type | Size |
|------|--------|------|------|
| `lib/onboarding-questions.ts` | New | TypeScript | ~130 lines |
| `lib/skill-calculator.ts` | New | TypeScript | ~50 lines |
| `types/index.ts` | Update | TypeScript | +20 lines |
| `lib/api.ts` | Update | TypeScript | +10 lines |
| `app/onboarding/page.tsx` | New | TSX (Client) | ~250 lines |
| `app/onboarding/layout.tsx` | New | TypeScript | ~30 lines |
| `middleware.ts` | New | TypeScript | ~70 lines |

**Total New Code:** ~570 lines
**Total Modified:** ~30 lines

---

## Key Design Decisions

### Question Structure (5 Axes, 4 Questions Each)
```
Initiative       (Leadership spectrum)     — q_init_01, q_init_02, q_init_03, q_init_04
Expertise        (Deep knowledge)          — q_exp_01, q_exp_02, q_exp_03, q_exp_04
Speed            (Fast vs perfect)         — q_speed_01, q_speed_02, q_speed_03, q_speed_04
Communication    (Silent vs loud)          — q_comm_01, q_comm_02, q_comm_03, q_comm_04
Flexibility      (Rigid vs adaptable)      — q_flex_01, q_flex_02, q_flex_03, q_flex_04
```

### Calculation Formula
```
For each axis:
  average(weights of 4 questions) × 25 = 0-100
where: A=1, B=2, C=3, D=4
```

### Styling (Inherited from Phase 4)
- **Color:** Emerald primary (#00D97E), dark surfaces (#0C0F19), accent glows
- **Typography:** Cinzel (headings), Sora (body), JetBrains Mono (labels)
- **Spacing:** 4pt grid (4/8/12/16/24/32px), no exceptions
- **Components:** `.dr-card`, `.dr-btn-primary`, `.dr-label`, `.dr-heading`
- **Animations:** CSS transitions (no Framer Motion in Phase 5)

### Onboarding Completion Flow (Phase 5)
1. **Client-side:** localStorage flag set after step 20
2. **Middleware (stub):** Checks cookie/token, fallback to localStorage
3. **Phase 6+:** Backend verification via JWT payload or API call

---

## Success Criteria

### Phase 5 Complete When:

**Plan 01 (Execution):**
- [ ] QUESTIONS.length === 20
- [ ] AXIS_QUESTIONS has 5 keys (one per axis)
- [ ] Each axis maps to 4 unique question IDs
- [ ] calculateHexagon(allA) → {25,25,25,25,25}
- [ ] calculateHexagon(allD) → {100,100,100,100,100}
- [ ] SoftSkillHexagon interface has 5 fields: initiative, expertise, speed, communication, flexibility
- [ ] ApiUser type includes onboarding_completed (boolean), soft_skills (SoftSkillHexagon)
- [ ] npx tsc --noEmit exits 0

**Plan 02 (Execution):**
- [ ] `/onboarding` route renders (page.tsx exists)
- [ ] First question visible on page load
- [ ] Progress bar at 5% (1 of 20)
- [ ] Radio cards functional: select → button enabled
- [ ] Next button disabled until answer selected
- [ ] Step transitions: fade animation + progress bar update
- [ ] Step counter updates: "Step X of 20"
- [ ] Step 20 → Results page calculated via calculateHexagon()
- [ ] Results display 5 values (name: value pairs)
- [ ] "Go to Profile" button → router.push('/hero/me')
- [ ] middleware.ts exists with auth redirect (+ onboarding stub)
- [ ] Mobile responsive (< 480px width works)
- [ ] Accessibility: Tab/Arrow/Space/Enter work, ARIA labels present
- [ ] npx tsc --noEmit exits 0

**Phase 5 Complete:**
- [ ] Both plans executed (7 tasks total)
- [ ] User flow works: register → /onboarding → 20 steps → results → /hero/me
- [ ] Design contract honored (UI-SPEC verified)
- [ ] TypeScript strict mode passes
- [ ] Ready for Phase 6

---

## Assumptions & Constraints

### Locked Decisions (from CONTEXT.md)
- ✅ 20 questions total (non-negotiable)
- ✅ 5 axes with semantic names (initiative, expertise, speed, communication, flexibility)
- ✅ A/B/C/D weights: 1/2/3/4 (not generic)
- ✅ Range: 0-100 per axis (4 questions avg'd × 25)
- ✅ No skip allowed (enforce via UI)
- ✅ Results immediately after step 20 (client-side calc, no API delay)
- ✅ Progress bar: emerald, 4px, fixed top
- ✅ No shadcn components, no external chart libraries
- ✅ Styling: inherit Phase 4 design system exactly

### Phase Scope
**In Scope:**
- 20-question form
- Skill calculation algorithm
- Results screen (5 values only)
- Middleware auth redirect
- Client-side completion flag

**Out of Scope (Phase 6+):**
- Hexagon radar chart visualization
- Backend persistence
- API integration for onboarding results
- Matching algorithm using soft skills
- Advanced animations (Framer Motion)
- Skip/cancel button
- Advanced undo/resume logic

---

## Testing Checklist for Executor

### Manual Flow Test
1. [ ] Visit `/onboarding` → page loads, first question visible
2. [ ] Progress bar shows 5% (1/20)
3. [ ] Step counter: "Step 1 of 20"
4. [ ] Hover radio option → glow effect visible
5. [ ] Click option → card highlights, Next button enabled
6. [ ] Click Next → fade transition, new question appears
7. [ ] Progress bar animates, now 10% (2/20)
8. [ ] Repeat steps 5-7 nineteen more times
9. [ ] On step 20: answer → Next button says "Finish" (not "Next")
10. [ ] Click Finish → results page appears
11. [ ] Results show: initiative: XX, expertise: XX, speed: XX, communication: XX, flexibility: XX
12. [ ] Click "Go to Profile" → navigates to /hero/me

### Type Safety
```bash
npx tsc --noEmit  # Must exit 0
```

### Imports Validation
```typescript
import { QUESTIONS, AXIS_QUESTIONS } from '@/lib/onboarding-questions'
import { calculateHexagon } from '@/lib/skill-calculator'
import { SoftSkillHexagon } from '@/types'
import type { ApiUser } from '@/lib/api'
// All imports resolve ✅
```

### Edge Cases
- [ ] calculateHexagon with all A's → {25,25,25,25,25}
- [ ] calculateHexagon with all D's → {100,100,100,100,100}
- [ ] calculateHexagon with mixed → correct averages
- [ ] Missing answer in calculateHexagon → graceful (defaults to 0, doesn't crash)
- [ ] Radio group: keyboard nav works (Tab, Arrow, Space)
- [ ] Mobile 375px: cards stack, no horizontal scroll

### Accessibility
- [ ] Screen reader: announces "Question X of 20: [question text]"
- [ ] Tab: focuses radio → button
- [ ] Arrow Up/Down: cycles through options
- [ ] Space: selects option
- [ ] Progress bar: aria-valuenow updates per step
- [ ] Reduce motion: animations respect prefers-reduced-motion

---

## Post-Execution Handoff

After Phase 5 complete:

**For Phase 6 Team:**
- [ ] Read PHASE-OVERVIEW.md (this directory)
- [ ] Review Plan 01 Summary (data structures)
- [ ] Review Plan 02 Summary (UI implementation)
- [ ] Question data is ready for visualization
- [ ] calculateHexagon() is production-ready
- [ ] Middleware is stubbed, ready for backend integration
- [ ] Results page is ready for radar chart (recharts/custom canvas)

**Remaining Work (Phase 6+):**
1. Add radar chart visualization (recharts or custom SVG)
2. POST results to backend (/api/onboarding/complete)
3. Persist soft_skills in user profile
4. Integrate middleware with backend verification
5. Add soft_skills to hero profile display
6. Phase 7: Use soft_skills for matching algorithm

---

## Documents in This Directory

| File | Purpose |
|------|---------|
| `05-CONTEXT.md` | Phase 5 locked requirements (locked, read-only) |
| `05-UI-SPEC.md` | Design contract (locked, read-only) |
| `05-PLAN.md` | **Plan 01 — Wave 1, 4 tasks** ← EXECUTE THIS |
| `05-PLAN-02.md` | **Plan 02 — Wave 2, 3 tasks** ← EXECUTE THIS |
| `PHASE-OVERVIEW.md` | Complete phase reference |
| `PLANNING-COMPLETE.md` | This file |

---

## Ready for Execution

✅ Phase 5 planning complete
✅ 2 plans created (7 tasks total)
✅ Wave structure optimized for parallelism
✅ Dependencies mapped (Plan 01 → Plan 02)
✅ Design contract honored (UI-SPEC verified)
✅ TypeScript types prepared
✅ Accessibility guidelines included
✅ Testing checklist provided

### Next Steps

1. **Execute Plan 01 (Wave 1):**
   ```bash
   cd F:\_WORK_\PROJECTS\TEAM-PROJECTS\devraid-front
   # Create lib/onboarding-questions.ts
   # Create lib/skill-calculator.ts
   # Update types/index.ts
   # Update lib/api.ts
   ```

2. **Verify Plan 01:**
   ```bash
   npx tsc --noEmit  # Must exit 0
   ```

3. **Execute Plan 02 (Wave 2):**
   ```bash
   # Create app/onboarding/page.tsx
   # Create app/onboarding/layout.tsx
   # Create middleware.ts
   ```

4. **Test Full Flow:**
   ```bash
   npm run dev
   # Visit http://localhost:3000/onboarding
   # Complete 20 steps
   # Verify results page
   # Verify redirect to /hero/me
   ```

---

**Planning completed:** 2026-04-02 00:00 UTC
**Planner:** Claude Code (Haiku 4.5)
**Phase status:** READY FOR EXECUTION
**Estimated execution time:** 4-5 hours
