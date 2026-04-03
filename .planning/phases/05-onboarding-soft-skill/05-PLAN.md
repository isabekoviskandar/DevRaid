---
phase: 05-onboarding-soft-skill
plan: 01
type: execute
wave: 1
status: verified
verified: 2026-04-02
depends_on: []
files_modified:
  - lib/onboarding-questions.ts
  - lib/skill-calculator.ts
  - types/index.ts
  - lib/api.ts
autonomous: true
requirements: [ONBOARDING-01, ONBOARDING-02, ONBOARDING-03]
user_setup: []

must_haves:
  truths:
    - "User can see 20-step onboarding form starting at `/onboarding`"
    - "Each step shows 1 question with 4 radio options"
    - "User can navigate through steps with Next button"
    - "Progress bar fills smoothly from 0% to 100%"
    - "After answering all 20 questions, results page shows 5 skill values"
    - "User redirected to `/hero/me` if visiting without completing onboarding"
  artifacts:
    - path: lib/onboarding-questions.ts
      provides: "Question data bank (20 questions × 5 axes)"
      min_lines: 80
    - path: lib/skill-calculator.ts
      provides: "Hexagon value calculation algorithm"
      min_lines: 40
    - path: types/index.ts (updated)
      provides: "SoftSkillHexagon interface matching Phase 5 spec"
    - path: lib/api.ts (updated)
      provides: "Extended ApiUser with soft_skills and onboarding_completed fields"
  key_links:
    - from: "app/onboarding/page.tsx"
      to: "lib/onboarding-questions.ts"
      via: "import QUESTIONS array"
      pattern: "import.*QUESTIONS"
    - from: "app/onboarding/page.tsx"
      to: "lib/skill-calculator.ts"
      via: "call calculateHexagon(answers)"
      pattern: "calculateHexagon"
    - from: "middleware.ts"
      to: "lib/api.ts"
      via: "check user.onboarding_completed"
      pattern: "onboarding_completed"
---

<objective>
**Phase 5, Plan 01: Onboarding Data & Types Foundation**

Create the data structures, question bank, and calculation algorithm that will power the 20-question onboarding flow. This is Wave 1 infrastructure — after this plan, Wave 2 can build the UI components with confidence.

**Purpose:**
- Define question data structure (20 questions × 5 axes)
- Implement skill calculation algorithm (A/B/C/D weights → 0-100 values)
- Extend ApiUser type to include soft_skills and onboarding_completed fields
- Set up proper TypeScript contracts for Phase 5 and beyond

**Output:**
- `lib/onboarding-questions.ts` — Complete question bank
- `lib/skill-calculator.ts` — Calculation function
- Updated `types/index.ts` with SoftSkillHexagon (Phase 5 spec: 5 axes)
- Updated `lib/api.ts` with ApiUser extension
</objective>

<execution_context>
@F:\_WORK_\PROJECTS\TEAM-PROJECTS\devraid-front\.planning\phases\05-onboarding-soft-skill\05-CONTEXT.md
@F:\_WORK_\PROJECTS\TEAM-PROJECTS\devraid-front\.planning\phases\05-onboarding-soft-skill\05-UI-SPEC.md
</execution_context>

<context>
@F:\_WORK_\PROJECTS\TEAM-PROJECTS\devraid-front\types\index.ts
@F:\_WORK_\PROJECTS\TEAM-PROJECTS\devraid-front\lib\api.ts
</context>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Create onboarding question bank & data structures</name>
  <files>lib/onboarding-questions.ts</files>
  <behavior>
    - Export QUESTIONS array with exactly 20 items
    - Each question has: id (string), axis ('initiative'|'expertise'|'speed'|'communication'|'flexibility'), text (string), options (array of 4 objects with label/description)
    - Each option has: value ('A'|'B'|'C'|'D'), label (string), description (optional)
    - Export AXIS_QUESTIONS object mapping each axis to 4 question IDs
    - All questions in Russian per CONTEXT.md examples
    - No hardcoded weights in questions — weights live in calculator
  </behavior>
  <action>
Create `lib/onboarding-questions.ts` with:

1. **Type definitions at top:**
```typescript
export interface OnboardingQuestion {
  id: string
  axis: 'initiative' | 'expertise' | 'speed' | 'communication' | 'flexibility'
  text: string
  options: OnboardingOption[]
}

export interface OnboardingOption {
  value: 'A' | 'B' | 'C' | 'D'
  label: string
  description?: string
}

export type AxisType = OnboardingQuestion['axis']
```

2. **QUESTIONS array with 20 items, 4 per axis:**
   - Initiative (q_init_01 through q_init_04): Passive→Leadership spectrum
   - Expertise (q_exp_01 through q_exp_04): Shallow→Deep learning
   - Speed (q_speed_01 through q_speed_04): Perfectionist→Fast executor
   - Communication (q_comm_01 through q_comm_04): Silent→Loud collaborator
   - Flexibility (q_flex_01 through q_flex_04): Rigid→Adaptable

3. **Example questions per CONTEXT.md (with Russian text):**
   - q_init_01: "Команда застряла. Ты..." → A=wait, B=suggest, C=lead, D=force
   - q_comm_01: "Разногласие с тиммейтом — как решаешь?" → A=ignore, B=talk 1-on-1, C=escalate, D=all-sync

4. **AXIS_QUESTIONS mapping:**
```typescript
export const AXIS_QUESTIONS: Record<AxisType, string[]> = {
  initiative:     ['q_init_01', 'q_init_02', 'q_init_03', 'q_init_04'],
  expertise:      ['q_exp_01', 'q_exp_02', 'q_exp_03', 'q_exp_04'],
  speed:          ['q_speed_01', 'q_speed_02', 'q_speed_03', 'q_speed_04'],
  communication:  ['q_comm_01', 'q_comm_02', 'q_comm_03', 'q_comm_04'],
  flexibility:    ['q_flex_01', 'q_flex_02', 'q_flex_03', 'q_flex_04'],
}
```

5. **Export TOTAL_QUESTIONS constant = 20**

Use Russian text from CONTEXT.md Section "Soft Skill Axes" as inspiration. Write realistic, situational questions (not generic). Ensure A/B/C/D labels are meaningful per-question, not letters alone.
  </action>
  <verify>
    <automated>
cd F:\_WORK_\PROJECTS\TEAM-PROJECTS\devraid-front && npx tsc --noEmit lib/onboarding-questions.ts 2>&1 | grep -E "(error|✓|success)" || echo "TypeScript check passed if no errors above"
    </automated>
  </verify>
  <done>
- `lib/onboarding-questions.ts` exists and exports QUESTIONS (length 20), AXIS_QUESTIONS, TOTAL_QUESTIONS
- All 20 questions have unique ids, axes, text, 4 options with A/B/C/D values
- TypeScript: no errors on import or type usage
- Questions cover all 5 axes (4 questions each)
  </done>
</task>

<task type="auto" tdd="true">
  <name>Task 2: Create skill calculation algorithm</name>
  <files>lib/skill-calculator.ts</files>
  <behavior>
    - Function `calculateHexagon(answers: Record<string, 'A'|'B'|'C'|'D'>): SoftSkillHexagon`
    - A=1, B=2, C=3, D=4 weight mapping
    - For each axis: average weight of 4 questions × 25 = final 0-100 value
    - Test case 1: All A's → all axes = 25
    - Test case 2: All D's → all axes = 100
    - Test case 3: Mix (2×A + 2×D per axis) → all axes = 62.5
    - Return object with exactly 5 fields: initiative, expertise, speed, communication, flexibility
  </behavior>
  <action>
Create `lib/skill-calculator.ts`:

```typescript
import { AXIS_QUESTIONS, AxisType } from './onboarding-questions'
import { SoftSkillHexagon } from '@/types'

const WEIGHT_MAP: Record<'A' | 'B' | 'C' | 'D', number> = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
}

export function calculateHexagon(
  answers: Record<string, 'A' | 'B' | 'C' | 'D'>
): SoftSkillHexagon {
  const result: Record<AxisType, number> = {
    initiative: 0,
    expertise: 0,
    speed: 0,
    communication: 0,
    flexibility: 0,
  }

  // For each axis, calculate average weight of 4 questions, then scale to 0-100
  for (const axis of Object.keys(AXIS_QUESTIONS) as AxisType[]) {
    const questionIds = AXIS_QUESTIONS[axis]
    const weights = questionIds.map(qId => WEIGHT_MAP[answers[qId]] ?? 0)
    const average = weights.reduce((sum, w) => sum + w, 0) / weights.length
    result[axis] = Math.round(average * 25)
  }

  return {
    initiative: result.initiative,
    expertise: result.expertise,
    speed: result.speed,
    communication: result.communication,
    flexibility: result.flexibility,
  }
}
```

**Notes:**
- Round final values to nearest integer (no decimals)
- Handle missing answers gracefully (default 0 weight, not error)
- Per Phase 5 spec: "average per axis × 25 = 0-100"
- Result is synchronous (no async needed)
  </action>
  <verify>
    <automated>
cd F:\_WORK_\PROJECTS\TEAM-PROJECTS\devraid-front && npx tsc --noEmit lib/skill-calculator.ts
    </automated>
  </verify>
  <done>
- `lib/skill-calculator.ts` exists with `calculateHexagon` function
- TypeScript strict mode: no errors
- Function correctly maps A/B/C/D → 1/2/3/4 weights
- Final values are 0-100 range, rounded to integers
- All 5 axes present in return object
  </done>
</task>

<task type="auto">
  <name>Task 3: Update types/index.ts — Add Phase 5 SoftSkillHexagon type</name>
  <files>types/index.ts</files>
  <action>
**Modify `types/index.ts`:**

1. **Replace existing SoftSkillProfile with Phase 5 SoftSkillHexagon:**
   - Old interface had 6 axes (initiative, communication, adaptability, execution, ownership, planning)
   - New Phase 5 has 5 axes: initiative, expertise, speed, communication, flexibility
   - All values are 0-100 numbers (no confidence_score)

2. **Update SoftSkillProfile:**
```typescript
// Phase 5: Onboarding Soft Skill Generation (5-axis hexagon)
export interface SoftSkillHexagon {
  initiative: number      // 0-100: Passive → Leadership
  expertise: number       // 0-100: Shallow → Deep knowledge
  speed: number           // 0-100: Perfectionist → Fast executor
  communication: number   // 0-100: Silent → Loud collaborator
  flexibility: number     // 0-100: Rigid → Adaptable
}

// Keep SoftSkillProfile as alias for backward compatibility during transition
export type SoftSkillProfile = SoftSkillHexagon
```

3. **Update HeroProfile to use new type:**
```typescript
export interface HeroProfile {
  id: string
  user_id: string
  display_name: string
  avatar_url?: string
  headline: string
  bio: string
  availability_status: 'open' | 'busy' | 'unavailable'
  preferred_roles: string[]
  hard_skills: string[]
  links: { github?: string; linkedin?: string; portfolio?: string }
  soft_profile?: SoftSkillHexagon  // Updated type
  reputation?: ReputationSnapshot
}
```

**Note:** Don't delete old SoftSkillProfile interface yet — use as type alias for backward compatibility with Phase 4. New code uses SoftSkillHexagon.
  </action>
  <verify>
    <automated>
cd F:\_WORK_\PROJECTS\TEAM-PROJECTS\devraid-front && npx tsc --noEmit types/index.ts
    </automated>
  </verify>
  <done>
- `types/index.ts` updated with SoftSkillHexagon (5 axes, 0-100 range)
- HeroProfile.soft_profile uses SoftSkillHexagon type
- TypeScript: no errors on import or type references
- Backward compatibility: SoftSkillProfile alias exists
  </done>
</task>

<task type="auto">
  <name>Task 4: Extend lib/api.ts — Add onboarding_completed & soft_skills to ApiUser</name>
  <files>lib/api.ts</files>
  <action>
**Modify `lib/api.ts`:**

1. **Import SoftSkillHexagon at top:**
```typescript
import { SoftSkillHexagon } from '@/types'
```

2. **Extend ApiUser interface to include:**
```typescript
export interface ApiUser {
  id: number
  username: string
  email: string
  bio?: string
  gender?: string
  photo?: string
  role:   string
  status: string
  created_at: string
  // Extended client-side fields
  github_url?:   string
  linkedin_url?: string
  hard_skills?:  string[]

  // Phase 5: Onboarding fields (NEW)
  onboarding_completed?: boolean     // Whether user finished 20-question flow
  soft_skills?: SoftSkillHexagon    // Result of onboarding (5 axis values, 0-100)
}
```

3. **Add stub API endpoint (optional, for future use):**
```typescript
postOnboardingResults(
  token: string,
  hexagon: SoftSkillHexagon
): Promise<ApiResponse<{ message: string }>> {
  return req<{ message: string }>('POST', '/api/onboarding/complete', hexagon, token)
}
```

**Note:** Backend integration is Phase 6+. For now, just extend the type. Client-side will store results in localStorage or state.
  </action>
  <verify>
    <automated>
cd F:\_WORK_\PROJECTS\TEAM-PROJECTS\devraid-front && npx tsc --noEmit lib/api.ts
    </automated>
  </verify>
  <done>
- `lib/api.ts` imports SoftSkillHexagon from types
- ApiUser interface includes onboarding_completed (boolean) and soft_skills (SoftSkillHexagon)
- TypeScript: no errors
- Types are optional (?) per existing pattern
  </done>
</task>

</tasks>

<verification>
After all Wave 1 tasks complete:

1. **File existence check:**
   ```bash
   ls -lh lib/onboarding-questions.ts lib/skill-calculator.ts
   ```

2. **TypeScript compilation (full project):**
   ```bash
   cd F:\_WORK_\PROJECTS\TEAM-PROJECTS\devraid-front && npx tsc --noEmit
   ```
   Must exit with code 0 (no errors).

3. **Import verification:**
   - Create a test file importing all three:
   ```typescript
   import { QUESTIONS, AXIS_QUESTIONS } from '@/lib/onboarding-questions'
   import { calculateHexagon } from '@/lib/skill-calculator'
   import { SoftSkillHexagon } from '@/types'
   import { api } from '@/lib/api'
   ```
   All imports resolve without errors.

4. **Data integrity:**
   - QUESTIONS.length === 20
   - AXIS_QUESTIONS has 5 keys (one per axis)
   - Each axis has exactly 4 question IDs
   - calculateHexagon({all A's}) returns 5 × 25
   - calculateHexagon({all D's}) returns 5 × 100

5. **Type safety:**
   - SoftSkillHexagon has exactly 5 keys: initiative, expertise, speed, communication, flexibility
   - All values are numbers
   - ApiUser type checks pass in existing code

</verification>

<success_criteria>
Wave 1 is complete when:

- [ ] `lib/onboarding-questions.ts` exists with 20 questions, fully typed, Russian text
- [ ] `lib/skill-calculator.ts` exists with calculateHexagon() function, handles all weights correctly
- [ ] `types/index.ts` updated: SoftSkillHexagon (5 axes), HeroProfile uses new type
- [ ] `lib/api.ts` updated: ApiUser includes onboarding_completed, soft_skills
- [ ] `npx tsc --noEmit` passes (exit 0)
- [ ] All imports resolve without errors
- [ ] Test: calculateHexagon with all A's → 25/25/25/25/25
- [ ] Test: calculateHexagon with all D's → 100/100/100/100/100
- [ ] Ready for Wave 2: Form UI, middleware, results screen

</success_criteria>

<output>
After completion, create `.planning/phases/05-onboarding-soft-skill/05-01-SUMMARY.md`:

```markdown
# Phase 5, Plan 01 — Summary

**Status:** COMPLETE

**Artifacts Created:**
- lib/onboarding-questions.ts (130 lines, 20 questions)
- lib/skill-calculator.ts (45 lines, calculateHexagon function)
- types/index.ts (updated, SoftSkillHexagon type)
- lib/api.ts (updated, ApiUser extension)

**Key Outputs:**
- QUESTIONS array: 20 questions across 5 axes
- AXIS_QUESTIONS mapping: {initiative, expertise, speed, communication, flexibility} → 4 questions each
- calculateHexagon(): A/B/C/D weights → 0-100 hexagon values
- ApiUser.onboarding_completed: middleware redirect signal
- ApiUser.soft_skills: SoftSkillHexagon object

**Wave 2 Unblocked:**
- Form UI (app/onboarding/page.tsx) can now import question data
- Results screen can use calculateHexagon()
- Middleware can check user.onboarding_completed

**Next:** Execute Plan 02 (Form UI + middleware + results)
```

</output>
