# Phase 5: Onboarding & Soft Skill Generation — Complete Plan

**Phase Goal:** After registration, hero completes 20-question onboarding flow → receives 5-axis Soft Skill Profile (0-100 values per axis).

**Timeline:**
- Phase locked: 2026-04-02
- Plans created: 2 plans, 2 waves
- Estimated duration: 4-6 hours Claude execution time

---

## Phase Breakdown

### Wave 1: Data & Types Foundation (Plan 01)

**What:** Create question bank, calculation algorithm, and type extensions.

**Tasks:**
1. **Question Bank** (`lib/onboarding-questions.ts`) — 20 questions (5 axes × 4 questions)
2. **Calculation Algorithm** (`lib/skill-calculator.ts`) — A/B/C/D weights → 0-100 hexagon
3. **Type Extensions** (`types/index.ts`, `lib/api.ts`) — SoftSkillHexagon, ApiUser.onboarding_completed

**Deliverables:**
- QUESTIONS array (20 items, fully typed)
- AXIS_QUESTIONS mapping ({initiative, expertise, speed, communication, flexibility} → 4 questions each)
- calculateHexagon(answers) function
- SoftSkillHexagon interface (5 axes, 0-100 range)
- ApiUser extended with onboarding_completed, soft_skills fields

**Duration:** ~2 hours
**Dependencies:** None (this is Wave 1)
**Blocks:** Wave 2 tasks (form UI needs question data + calculator)

---

### Wave 2: UI & Middleware (Plan 02)

**What:** Build interactive form, results screen, and redirect middleware.

**Tasks:**
1. **Onboarding Form** (`app/onboarding/page.tsx`) — Client Component, 20-step form + results
2. **Layout Wrapper** (`app/onboarding/layout.tsx`) — Minimal metadata/layout
3. **Middleware** (`middleware.ts`) — Auth redirect + onboarding completion check (client-side for Phase 5)

**Deliverables:**
- Multi-step form (1 question per screen)
- Progress bar (emerald, 4px, fixed top)
- Radio cards with glow effects (per UI-SPEC)
- Results screen (5 skill values)
- CTA: "Go to Profile" → /hero/me
- Middleware auth + onboarding redirect stubs

**Duration:** ~2-3 hours
**Dependencies:** Plan 01 complete (needs question data, calculateHexagon function)
**Blocks:** Phase 6 (radar chart visualization, backend persistence)

---

## Execution Sequence

```
Wave 1 (Parallel): Plan 01 (4 tasks)
  ├─ Task 1: Question bank
  ├─ Task 2: Calculator algorithm
  ├─ Task 3: Types/SoftSkillHexagon
  └─ Task 4: ApiUser extension

    ↓ (Plan 01 complete)

Wave 2 (Parallel): Plan 02 (3 tasks)
  ├─ Task 1: Onboarding form component
  ├─ Task 2: Layout wrapper
  └─ Task 3: Middleware
```

---

## File Structure

```
devraid-front/
├── lib/
│   ├── onboarding-questions.ts     (NEW — Plan 01, Task 1)
│   ├── skill-calculator.ts         (NEW — Plan 01, Task 2)
│   ├── api.ts                      (UPDATED — Plan 01, Task 4)
│   └── ...
├── app/
│   ├── onboarding/
│   │   ├── page.tsx                (NEW — Plan 02, Task 1)
│   │   └── layout.tsx              (NEW — Plan 02, Task 2)
│   └── ...
├── types/
│   └── index.ts                    (UPDATED — Plan 01, Task 3)
├── middleware.ts                   (NEW — Plan 02, Task 3)
└── ...
```

---

## Key Design Decisions

### Axes (5 total, per Phase 5 spec)
1. **Initiative** — Passive → Leadership
2. **Expertise** — Shallow → Deep knowledge
3. **Speed** — Perfectionist → Fast executor
4. **Communication** — Silent → Loud collaborator
5. **Flexibility** — Rigid → Adaptable

### Calculation Formula
- A = 1, B = 2, C = 3, D = 4
- Per axis: average of 4 question weights × 25 = 0-100 value
- Example: All A's → 25/25/25/25/25, All D's → 100/100/100/100/100

### Styling (inherited from Phase 4)
- Colors: Emerald primary (#00D97E), dark surfaces, accent glows
- Typography: Cinzel headings, Sora body, JetBrains Mono labels
- Spacing: 4pt grid (4/8/12/16/24/32px)
- Components: `.dr-card`, `.dr-btn-primary`, `.dr-label`, `.dr-heading`
- **No shadcn, no external chart libraries**

### Onboarding Completion
- **Client-side (Phase 5):** localStorage flag `onboarding_completed` set after step 20
- **Middleware (Phase 5):** Stub — checks cookie/token, client-side localStorage fallback
- **Backend (Phase 6+):** POST results to /api/onboarding/complete, persist in DB

---

## Success Criteria

### Phase Complete When:

**Plan 01 (Wave 1):**
- [ ] QUESTIONS array: 20 items, 4 per axis, fully typed
- [ ] calculateHexagon(): A/B/C/D → 0-100 hexagon
- [ ] SoftSkillHexagon: 5 axes (initiative, expertise, speed, communication, flexibility)
- [ ] ApiUser: onboarding_completed (boolean), soft_skills (SoftSkillHexagon)
- [ ] TypeScript: npx tsc --noEmit exits 0

**Plan 02 (Wave 2):**
- [ ] `/onboarding` renders first question
- [ ] Radio cards: select → button enabled
- [ ] Progress bar: fills 0% → 100%, smooth animation
- [ ] Step transitions: fade out → fade in
- [ ] Step 20: calculates hexagon, shows results
- [ ] Results: 5 skill values displayed
- [ ] CTA: navigates to `/hero/me`
- [ ] Middleware: auth redirect + onboarding stub
- [ ] Mobile responsive
- [ ] Accessibility: ARIA labels, keyboard nav

**Full Phase:**
- [ ] Both plans complete (4 + 3 tasks = 7 total)
- [ ] User flow: register → /onboarding → 20 steps → results → /hero/me
- [ ] Design contract honored (UI-SPEC verified)
- [ ] TypeScript strict mode: exit 0
- [ ] Ready for Phase 6: radar chart + backend integration

---

## Known Limitations (Phase 5 Scope)

### Out of Scope
- Full hexagon radar chart visualization (Phase 6)
- Backend persistence (Phase 6+)
- Matching algorithm using soft skills (Phase 7)
- Skip/cancel button (Phase 5.5, optional)
- Animations beyond CSS transitions (Framer Motion ready for Phase 6)

### Assumptions
- No skip allowed (per FULL-ROADMAP)
- User must answer all 20 questions
- Results calculated client-side (no API delay)
- Onboarding completion tracked via localStorage (backend integration later)

---

## Dependencies

### From Phase 4
- Design system: color tokens, typography, spacing, components
- Layout: AppShell, responsive viewport, background effects (aurora, noise)

### To Phase 6
- Hexagon radar chart visualization
- Backend API integration (POST /api/onboarding/complete)
- Persistent soft_skills storage
- Matching algorithm integration

---

## Testing Checklist

**Manual Testing:**
1. Visit `/onboarding` → first question visible, progress bar at 5%
2. Hover over radio option → glow effect visible
3. Click option → button enabled, selection highlighted
4. Click Next → fade transition, new question appears, progress bar fills
5. Repeat 19 times → step counter updates (Step 20 of 20)
6. On step 20, click Finish → results page displays 5 values
7. Click "Go to Profile" → navigates to `/hero/me`
8. Refresh → localStorage flag persists (optional)

**Mobile Testing:**
1. Width 375px (mobile) → cards stack, no overflow
2. Progress bar: visible and responsive
3. Radio cards: tap-friendly (18px+ targets)

**Accessibility Testing:**
1. Tab: cycles through radio options → button
2. Arrow keys: navigate options (native radio behavior)
3. Space: select option
4. Screen reader: fieldset/legend + ARIA labels

---

## Notes for Executor

### Important Patterns

**Question Data:**
```typescript
const q: OnboardingQuestion = {
  id: 'q_init_01',
  axis: 'initiative',
  text: 'Команда застряла. Ты...',
  options: [
    { value: 'A', label: 'Жду, пока сам разберётся' },
    { value: 'B', label: 'Спокойно разговариваю тет-а-тет' },
    { value: 'C', label: 'Сразу эскалирую тимлиду' },
    { value: 'D', label: 'Предлагаю синхрон со всей командой' },
  ]
}
```

**Form State:**
```typescript
const [currentStep, setCurrentStep] = useState(0)  // 0-19
const [answers, setAnswers] = useState<Record<string, 'A'|'B'|'C'|'D'>>({})
const [hexagon, setHexagon] = useState<SoftSkillHexagon | null>(null)
```

**Calculation:**
```typescript
const hexagon = calculateHexagon(answers)  // sync, no async
// Returns: { initiative: 0-100, expertise: 0-100, ... }
```

**Radio Card Styling:**
- Default: border-[rgba(255,255,255,0.055)]
- Hover: bg-[rgba(0,217,126,0.08)]
- Selected: border-[rgba(0,217,126,0.4)] bg-[rgba(0,217,126,0.15)]

**Progress Bar:**
- Fixed top: `position: fixed; top: 0; left: 0; z-index: 10`
- Height: 4px
- Width: `(currentStep + 1) / 20 * 100%`
- Animation: `transition-all duration-400 ease-out`

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Radio cards not visually distinct | Use glow ring + background color on selected (per UI-SPEC) |
| Progress bar jittery | Use CSS transition (duration-400, ease-out) not Framer Motion in Phase 5 |
| Step transitions unclear | Fade animation + visual progress bar both signal progression |
| Mobile layout breaks | Constrain to viewport, test at 375px width |
| Accessibility missed | Include ARIA labels, fieldset/legend, test Tab key nav |
| Calculation errors | Test: all A's → 25, all D's → 100, mixed → correct average |

---

## Post-Phase 6 Handoff

After Phase 5 complete:

1. **Phase 6 Team** inherits:
   - Question data (QUESTIONS, AXIS_QUESTIONS)
   - Calculation function (calculateHexagon)
   - Form logic (currentStep, answers state)
   - Results page (stub, no chart yet)

2. **Phase 6 Adds:**
   - Radar chart visualization (recharts or custom canvas)
   - Backend API integration (POST /api/onboarding/complete)
   - Persistent storage (user.soft_skills in DB)
   - Matching algorithm (Phase 7 uses soft_skills for scoring)

3. **Middleware Update (Phase 6+):**
   - Replace localStorage check with backend verification
   - Fetch user.onboarding_completed from JWT or API
   - Return 401 if not completed, redirect to /onboarding

---

## Links

- **CONTEXT.md:** 05-CONTEXT.md (locked decision, Phase 5 spec)
- **UI-SPEC.md:** 05-UI-SPEC.md (design contract, color/spacing/typography)
- **Plan 01:** 05-PLAN.md (Wave 1 — data & types)
- **Plan 02:** 05-PLAN-02.md (Wave 2 — form UI & middleware)
- **Phase 4 Summary:** (check .planning/phases/04-*/04-*-SUMMARY.md for design system details)

---

**Phase 5 locked:** 2026-04-02
**Ready for execution:** Yes
**Next phase:** Phase 6 (Radar Chart Visualization)
