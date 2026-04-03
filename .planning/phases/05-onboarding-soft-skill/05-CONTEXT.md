---
phase: 5
slug: onboarding-soft-skill
status: locked
gathered: 2026-04-02
source: FULL-ROADMAP.md (Phase 5 section)
---

# Phase 5: Onboarding & Soft Skill Generation - Context

**Goal:** После регистрации герой проходит опросник → система генерирует его Soft Skill Profile (5-значный hexagon).

**Depends on:** Phase 4 (Design System Refresh — color tokens, typography, spacing)

---

## Phase Boundary

**User Flow:**
```
Sign Up → /onboarding (20 questions) → Calculate Stats → Redirect /hero/me
```

**Out of Scope:**
- Radar chart visualization (Phase 6)
- Matching algorithm (Phase 7)
- Real API integration (stub for now)

---

## Implementation Decisions

### Onboarding Page Structure
- Route: `/onboarding`
- Multi-step form: **20 ситуационных вопросов** (5 axes × 4 questions each)
- Each question: **1 screen** (no scroll, transition between steps)
- No skip possible (enforce middleware redirect if `!onboarding_completed`)
- Progress bar: **linear, top fixed, 4px height, emerald fill**

### Question Format
- Presentation: **Question card** (centered, 600px max) with radio options
- Question text: **Cinzel, 20px, bold** (`.dr-heading`)
- Answer options: **4 radio buttons** (A/B/C/D or unique per-question labels)
- Answer styling: **radio cards** with glow-on-select, 16px gaps between options
- Example question: "Разногласие с тиммейтом — как решаешь?" (Communication axis)

### Soft Skill Axes (5 total, 4 questions per axis = 20 total)

| Axis | Weights | Example Question |
|------|---------|------------------|
| **Initiative** (Инициативность) | A=1, B=2, C=3, D=4 (passive→leader) | "Команда застряла. Ты..." |
| **Expertise** (Глубина/Экспертиза) | A=1, B=2, C=3, D=4 | "Перед дедлайном узнаёшь о баге. Ты..." |
| **Speed** (Скорость исполнения) | A=1, B=2, C=3, D=4 | "Предпочитаешь черновик сейчас или идеал потом?" |
| **Communication** (Коммуникация) | A=1, B=2, C=3, D=4 | "Разногласие с тиммейтом — как решаешь?" |
| **Flexibility** (Гибкость/Адаптивность) | A=1, B=2, C=3, D=4 | "Требования изменились на 70%. Реакция?" |

**Total:** 4 questions × 5 axes = 20 questions

### Calculation Algorithm

```typescript
function generateHexagon(answers: Record<questionId, 'A'|'B'|'C'|'D'>): SoftSkillHexagon {
  // Map A/B/C/D → weights 1/2/3/4
  const weights = Object.values(answers).map(ans => weights[ans]);

  return {
    initiative:     avg(weights, INITIATIVE_QUESTIONS)    * 25,    // 0-100
    expertise:      avg(weights, EXPERTISE_QUESTIONS)     * 25,
    speed:          avg(weights, SPEED_QUESTIONS)         * 25,
    communication:  avg(weights, COMMUNICATION_QUESTIONS) * 25,
    flexibility:    avg(weights, FLEXIBILITY_QUESTIONS)   * 25,
  };
  // Range: each axis 0-100 (4 values avg'd × 25 = 100 max)
}
```

### ApiUser Extension

```typescript
interface SoftSkillHexagon {
  initiative:     number;      // 0-100
  expertise:      number;
  speed:          number;
  communication:  number;
  flexibility:    number;
}

interface ApiUser {
  // ... existing fields
  soft_skills?: SoftSkillHexagon;
  onboarding_completed?: boolean;
}
```

### Results Screen

- Trigger: After question 20 submitted
- Display: "Your Soft Skills Profile" heading (Cinzel, 28px)
- Content: 5 values shown (numbers or small bars, no full hexagon)
  - Initiative: __
  - Expertise: __
  - Speed: __
  - Communication: __
  - Flexibility: __
- CTA: "Go to Profile" button → `window.location.href = '/hero/me'`
- Timing: Results show immediately (calculate client-side, no API delay)

### Middleware Redirect

**File:** `middleware.ts`

```typescript
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/hero/me' || '/hero/*') {
    const user = await getUser(); // from auth
    if (!user.onboarding_completed) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
  }
}
```

**Effect:** Users cannot access `/hero/me` or `/hero/[id]` without completing onboarding first.

---

## Files to Create/Modify

### New Files
- `app/onboarding/page.tsx` — Main onboarding form (Client Component)
- `lib/onboarding-questions.ts` — Question bank + axis mappings
- `lib/skill-calculator.ts` — Hexagon calculation function
- `lib/api.ts` — Update ApiUser type, stub for POST /onboarding (optional API call)

### Modified Files
- `lib/api.ts` — Extend `ApiUser` interface with `soft_skills` and `onboarding_completed`
- `middleware.ts` — Add redirect for `/hero/*` routes if not completed
- `types/index.ts` — Add `SoftSkillHexagon` type

---

## Design System Inheritance

**From Phase 4:**
- Colors: `--color-dr-glow` (#00D97E), `--color-dr-surface`, `--color-dr-bg`
- Typography: `.dr-heading`, `.dr-label`, Cinzel/Sora/JetBrains Mono fonts
- Spacing: 4pt grid (4/8/16/24/32px tokens)
- Components: `.dr-card`, `.dr-btn-primary`, `.dr-btn-secondary`
- Animations: Framer Motion ready, fade-up keyframes in globals.css

**No new components needed from shadcn** — all styling via internal dr-* classes

---

## Non-Blocking Clarifications (FLAGs from UI-SPEC)

- **F1:** Cancel button — optional. If implemented, use localStorage to allow resume.
- **F2:** Skip prevention — assumed yes (FULL-ROADMAP: "skip невозможен"). Enforce via button disable logic.
- **F3:** Already-completed redirect — assumed middleware auto-redirects to /hero/me.
- **F4:** Hexagon on results — assumed 5 number summary only (full chart in Phase 6).
- **F5:** Answer labels — assumed question-specific copy, no generic A/B/C/D.
- **F6:** Mobile layout — responsive, constrained to viewport.

---

## Success Criteria

- [ ] Onboarding form renders at `/onboarding` with step 1 visible
- [ ] Radio cards fully functional (select, visual feedback, button enable/disable)
- [ ] Progress bar fills smoothly from 0% to 100% over 20 steps
- [ ] Step transitions: fade out → fade in with stagger animation
- [ ] All 20 questions load (from onboarding-questions.ts)
- [ ] Results page shows after step 20, calculates hexagon values
- [ ] CTA button navigates to `/hero/me`
- [ ] Middleware enforces onboarding redirect
- [ ] TypeScript: EXIT:0
- [ ] Accessibility: keyboard nav (Tab, Arrow, Space, Enter) works
- [ ] Mobile responsive: cards stack, progress bar visible

---

*Phase: 05-onboarding-soft-skill*
*Context locked: 2026-04-02*
*UI-SPEC approved: 2026-04-02*
