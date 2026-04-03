---
phase: 05
slug: onboarding-soft-skill
status: gap_closure_2026-04-03
created: 2026-04-02
verified: 2026-04-02
---

## Gap closure — 2026-04-03 (Cursor)

**Build:** `npm run build` — OK.

**Закрыто в коде:**

- Gap 1 (SoftSkillHexagon vs legacy profile): единый тип `SoftSkillProfile = SoftSkillHexagon`; mock-данные переведены на 5 осей (`lib/mock-data.ts`).
- Gap 2 (Framer / hero/me): актуальный `panelMotion` без проблемного `ease`-string (регрессии нет).
- Gap 4: явные проверки `res.data` в `app/login/page.tsx`, `app/register/page.tsx`; `app-shell` — `res.data ?? null`.
- StatusBadge: приём `string | StatusVariant` + guard в `components/ui/card.tsx`.

**Остаётся намеренно:** Gap 3 (middleware / API onboarding) — см. ниже, Phase 6+.

---

# Phase 5: Gaps & Outstanding Items

**Phase Goal Achievement:** 9/11 criteria met. Onboarding form fully functional.

**Phase Status:** GAPS REQUIRE CLOSURE before merge to main

---

## Gap 1: TypeScript Type Mismatch (SoftSkillHexagon vs SoftSkillProfile)

**Severity:** BLOCKER (prevents build)
**Location:** Multiple files reference incompatible soft skill types

**Issue:**
- Phase 5 introduced `SoftSkillHexagon` (5 axes: initiative, expertise, speed, communication, flexibility)
- Existing code uses `SoftSkillProfile` (6 axes: adaptability, execution, ownership, planning + 2 others)
- Components expect `SoftSkillProfile` but receive `SoftSkillHexagon`

**Errors:**
```
components/features/hero/hero-card.tsx(54,15): error TS2739: Type 'SoftSkillHexagon' is missing the following properties from type 'SoftSkillProfile': adaptability, execution, ownership, planning

components/features/raids/roll-hero-reveal.tsx(154,21): error TS2739: Type 'SoftSkillHexagon' is missing the following properties from type 'SoftSkillProfile': adaptability, execution, ownership, planning
```

**Root Cause:** Phase 4 may have used older soft skills naming. Phase 5 created new naming without checking compatibility.

**Fix Options:**
1. **Rename SoftSkillHexagon → SoftSkillProfile** and update all Phase 5 references
2. **Create wrapper/adapter** that converts between types
3. **Update consuming components** to accept union type

**Recommended:** Option 1 (rename for consistency) — simplest, most aligned with existing codebase

**Responsibility:** Phase 5 gap closure or Phase 6 integration

---

## Gap 2: Framer Motion Animation Type Errors

**Severity:** BLOCKER (prevents build)
**Location:** `app/hero/me/page.tsx` line 265

**Issue:**
```
error TS2322: Types of property 'transition' are incompatible.
  Type '{ duration: number; ease: string; }' is not assignable to 'TransitionWithValueOverrides<any>'
```

Framer Motion's `transition` prop expects specific easing types, not string literals.

**Fix:**
Replace string `ease: "cubic-bezier(0.4,0,0.2,1)"` with proper easing constant:
```typescript
// Before:
transition: { duration: 0.4, ease: "cubic-bezier(0.4,0,0.2,1)" }

// After:
transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }  // Framer Motion easing array
```

**Responsibility:** Phase 3 code cleanup (not Phase 5 responsibility)

---

## Gap 3: Middleware Onboarding Enforcement (Intentional Stub)

**Severity:** DESIGN DECISION (not a bug)
**Location:** `middleware.ts` lines 45-51

**Status:** INTENTIONAL STUB per Phase 5 CONTEXT.md

**Current Behavior:**
- Middleware check for `onboarding_completed` is commented out
- Client-side localStorage flag used as interim
- No server-side validation

**Why Stubbed:**
- Backend endpoint `/api/onboarding/complete` not ready
- Phase 5 scope: client-side form only
- Phase 6 scope: backend persistence + middleware integration

**Phase 6 Requirement:**
1. Implement POST `/api/onboarding/complete` endpoint (store in database)
2. Middleware: fetch `user.onboarding_completed` from API
3. Remove localStorage workaround
4. Uncomment lines 45-51 and add proper API call

**Is Phase 5 Complete Without This?** Yes — design contract acknowledged this as Phase 6 scope (FLAG F3 in UI-SPEC)

---

## Gap 4: Undefined Type Checks (login/register pages)

**Severity:** WARNING (does not block Phase 5)
**Location:** `app/login/page.tsx` line 28, `app/register/page.tsx` line 104

**Issue:**
```
error TS18048: 'res.data' is possibly 'undefined'
```

**Root Cause:** Pre-existing in Phase 3 code. Response object type allows `undefined` data.

**Fix:** Add null coalescing:
```typescript
// Before:
const token = res.data.token

// After:
const token = res.data?.token ?? ''
```

**Responsibility:** Phase 3 debt (not Phase 5)

---

## Summary: Gap Closure Plan

### Blocker Issues (Must Fix Before Merge)

| Gap | File | Fix | Effort | Owner |
|-----|------|-----|--------|-------|
| SoftSkillHexagon type mismatch | Multiple | Rename or create adapter | 30min | Phase 5 gap closure |
| Framer Motion easing syntax | hero/me/page.tsx | Update transition format | 15min | Phase 3 cleanup |

### Intentional Stubs (Phase 6 Scope)

| Gap | File | Status | Phase |
|-----|------|--------|-------|
| Middleware onboarding API | middleware.ts | Stubbed per design | Phase 6 |

### Pre-Existing Debt (Low Priority)

| Gap | File | Effort | Priority |
|-----|------|--------|----------|
| Undefined checks (login/register) | app/login/page.tsx | 10min | Low |
| StatusVariant string assignment | hero/me/page.tsx | 5min | Low |

---

## Recommended Next Steps

**IMMEDIATE (before merge):**
1. Resolve SoftSkillHexagon type mismatch
2. Fix Framer Motion easing syntax

**PLANNED (Phase 6):**
1. Implement backend `/api/onboarding/complete`
2. Uncomment and wire middleware onboarding check
3. Clean up pre-existing TypeScript debt

---

*Gap analysis complete: 2026-04-02*
*Phase 5 functional (Form, Calculator, Types all working)*
*Blockers identified and scoped for gap closure*
