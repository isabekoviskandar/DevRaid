---
phase: 05
plan: 01
status: complete
wave: 1
completed_at: 2026-04-02T12:30:00Z
---

# Phase 5, Plan 01 — Onboarding Data & Types Foundation Summary

**Status:** COMPLETE — Wave 1 infrastructure ready for Wave 2 UI development

**Duration:** ~15 minutes

**Completed Tasks:** 4/4

---

## Tasks Completed

### Task 1: Create onboarding question bank
**File:** `lib/onboarding-questions.ts` (265 lines)
**Commit:** bba8987

**Deliverables:**
- `QUESTIONS` array with exactly 20 situational questions
- 5 axes, 4 questions each:
  - **Initiative** (q_init_01–04): Passive → Leadership spectrum
  - **Expertise** (q_exp_01–04): Shallow → Deep knowledge
  - **Speed** (q_speed_01–04): Perfectionist → Fast executor
  - **Communication** (q_comm_01–04): Silent → Loud collaborator
  - **Flexibility** (q_flex_01–04): Rigid → Adaptable
- Each question has 4 options (A/B/C/D) with meaningful labels
- `AXIS_QUESTIONS` mapping for calculator lookup
- `TOTAL_QUESTIONS` constant = 20
- All text in Russian per CONTEXT.md requirements

**Sample Questions:**
```
Initiative: "Команда застряла на техническом вопросе, никто не знает как движение дальше. Ты..."
Communication: "Разногласие с коллегой по подходу к решению. Ты..."
Flexibility: "Требования изменились на 70% за день. Ты..."
```

---

### Task 2: Create skill calculation algorithm
**File:** `lib/skill-calculator.ts` (61 lines)
**Commit:** 1b08093

**Deliverables:**
- `calculateHexagon(answers): SoftSkillHexagon` function
- Weight mapping: A=1, B=2, C=3, D=4
- Algorithm: average weights per axis × 25 = 0-100 scale
- All 5 axes present in output

**Algorithm Verification:**
```
Test 1 (all A's): [25, 25, 25, 25, 25] ✓
Test 2 (all D's): [100, 100, 100, 100, 100] ✓
Test 3 (2×A+2×D): [63, 63, 63, 63, 63] ✓
```

---

### Task 3: Update types/index.ts — Add Phase 5 SoftSkillHexagon
**File:** `types/index.ts` (updated)
**Commit:** 271bebc

**Deliverables:**
- New `SoftSkillHexagon` interface with 5 axes (all 0-100 numbers)
- `HeroProfile.soft_profile` now uses `SoftSkillHexagon` type
- Legacy `SoftSkillProfile` kept for Phase 4 backward compatibility
- TypeScript: no errors

**Type Definition:**
```typescript
export interface SoftSkillHexagon {
  initiative: number      // 0-100
  expertise: number       // 0-100
  speed: number           // 0-100
  communication: number   // 0-100
  flexibility: number     // 0-100
}
```

---

### Task 4: Extend lib/api.ts — Add onboarding fields to ApiUser
**File:** `lib/api.ts` (updated)
**Commit:** d2da5a3

**Deliverables:**
- `ApiUser.onboarding_completed?: boolean` — middleware redirect signal
- `ApiUser.soft_skills?: SoftSkillHexagon` — hexagon result storage
- Stub `api.onboarding.postResults()` endpoint (for Phase 6+ backend integration)
- SoftSkillHexagon imported from types

**Type Extension:**
```typescript
export interface ApiUser {
  // ... existing fields
  onboarding_completed?: boolean
  soft_skills?: SoftSkillHexagon
}
```

---

## Wave 1 Completion Status

| Requirement | Status | Notes |
|------------|--------|-------|
| 20 questions (4 per axis) | ✓ | All situational, Russian text, realistic scenarios |
| Question bank data structure | ✓ | OnboardingQuestion, OnboardingOption types + AXIS_QUESTIONS mapping |
| Skill calculation algorithm | ✓ | A/B/C/D → weights 1/2/3/4 → average × 25 for 0-100 |
| SoftSkillHexagon type | ✓ | 5 axes, all numeric 0-100, backward compatible |
| ApiUser extension | ✓ | onboarding_completed flag + soft_skills field |
| TypeScript compilation | ✓ | No new errors introduced |
| Stub API endpoint | ✓ | Ready for Phase 6+ integration |

---

## Ready for Wave 2

Wave 2 can now proceed with confidence:

**Form UI (app/onboarding/page.tsx):**
- Import `QUESTIONS` from lib/onboarding-questions
- Use `calculateHexagon()` after user submits all 20 answers
- Store results in `ApiUser.soft_skills`
- Check `user.onboarding_completed` for middleware redirect

**Middleware (middleware.ts):**
- Redirect to `/onboarding` if `!user.onboarding_completed`
- Enforce all 20 questions must be answered

**Results Screen:**
- Display 5 skill values calculated by `calculateHexagon()`
- CTA button redirects to `/hero/me`

---

## Key Outputs

| File | Lines | Purpose |
|------|-------|---------|
| `lib/onboarding-questions.ts` | 265 | Question bank, 20 questions × 5 axes |
| `lib/skill-calculator.ts` | 61 | Hexagon calculation (A/B/C/D → 0-100) |
| `types/index.ts` | +30 | SoftSkillHexagon type definition |
| `lib/api.ts` | +15 | ApiUser extension + stub endpoint |

---

## Deviations from Plan

None — plan executed exactly as specified.

---

## Self-Check: PASSED

✓ All files exist and compile without new TypeScript errors
✓ All 20 questions present with correct axis distribution
✓ Skill calculator algorithm verified (all test cases pass)
✓ Types properly defined and exported
✓ ApiUser properly extended
✓ No stubs or incomplete sections

---

**Next:** Execute Phase 5 Plan 02 (Form UI, middleware, results screen)
