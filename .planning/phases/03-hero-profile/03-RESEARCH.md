# Phase 3: Hero Profile (Edit) — Research

**Researched:** 2026-04-02
**Domain:** React inline-edit form, localStorage-backed optimistic state, Framer Motion expand/collapse
**Confidence:** HIGH — all findings sourced directly from project files

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HERO-02 | /hero/me отображает секцию навыков с реальными hard_skills из профиля (не placeholder) | ApiUser does NOT have hard_skills; must use local state seeded from HeroProfile mock — see Gap Analysis |
| HERO-03 | Кнопка "Edit Profile" открывает inline-форму: bio, GitHub, LinkedIn, hard_skills (теги) | Inline edit-panel pattern; AnimatePresence expand pattern from apply-modal.tsx |
| HERO-04 | Сохранение профиля (mock PATCH — реальный PATCH /api/hero/{id} когда появится endpoint) | authStore.set() update + localStorage cache; api.ts needs patchUser() stub |
</phase_requirements>

---

## Summary

The current `/hero/me` page already loads the real `ApiUser` from `GET /api/auth/user` and displays username, bio, email, role, status. The "coming soon" placeholder block is the only thing separating the current state from HERO-02/03/04. The challenge is that `ApiUser` (the live type from the backend) is missing `hard_skills`, `github_url`, and `linkedin_url` — those fields exist only in the domain `HeroProfile` type in `types/index.ts`, not in the database schema.

The backend `users` table (confirmed from migration) has no `hard_skills` column and no social link columns. The database schema is: `id, username, email, photo, phone, bio, status, gender, first_name, last_name, date_of_birth, role, type, ...`. There is no `PATCH /api/hero/{id}` endpoint yet.

The implementation strategy is: extend `ApiUser` with optional fields (`github_url?`, `linkedin_url?`, `hard_skills?`), store them in the existing `localStorage` user cache via `authStore.set()`, and show a success indicator inline. When the backend adds the PATCH endpoint, only `api.ts` needs to be updated.

**Primary recommendation:** Use a single-panel inline edit form that expands below the hero header card (Framer Motion `height: auto` animate) with the established `inputStyle` pattern from register/login pages. No separate modal — keep everything in one scroll-page layout.

---

## Standard Stack

### Core (already installed — no new dependencies)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js 15 App Router | 15.x | Page/routing | Project stack |
| React 19 | 19.x | UI | Project stack |
| Tailwind v4 | 4.x | Utility CSS (`@theme` tokens) | Project stack |
| Framer Motion | latest (in package.json) | AnimatePresence height expand | Already used in apply-modal.tsx |
| lucide-react | latest (in package.json) | Icons: Github, Linkedin, Pencil, Check, X, Plus, Trash2 | Already installed (X used in apply-modal) |

### No New Installs Required

All required libraries are already in `package.json`. This phase is pure feature code.

---

## Architecture Patterns

### Recommended File Layout for This Phase

```
app/hero/me/page.tsx                          ← extend (already exists)
components/features/hero/
├── profile-skills-section.tsx               ← NEW: skills display + edit toggle
└── skill-tag.tsx                            ← NEW: individual chip with remove button
lib/api.ts                                   ← extend: add patchUser() stub
lib/auth-store.ts                            ← extend: add updateUser() helper
```

The page itself stays as the data-loading orchestrator (fetches user, passes to child). The edit panel lives in `profile-skills-section.tsx` as a self-contained 'use client' component.

### Pattern 1: Edit-Mode Toggle (inline expand)

The register page already established the `inputStyle` const pattern. The edit panel should reuse this directly.

```tsx
// Reuse from register/page.tsx — copy as module-level const in profile-skills-section.tsx
const inputStyle = {
  background:   'rgba(8, 11, 19, 0.8)',
  border:       '1px solid rgba(255,255,255,0.08)',
  borderRadius: 'var(--radius-badge)',
  color:        'var(--color-dr-text)',
  fontFamily:   'var(--font-sans)',
  fontSize:     '0.875rem',
  padding:      '0.6rem 0.875rem',
  outline:      'none',
  transition:   'border-color 0.2s',
  width:        '100%',
} as const
```

### Pattern 2: Framer Motion Expand Panel

The existing `apply-modal.tsx` demonstrates the established Framer Motion idiom for this project:

```tsx
// Source: components/features/raids/apply-modal.tsx
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

const prefersReducedMotion = useReducedMotion()

// For inline panel expand (height animation):
const panelMotion = prefersReducedMotion
  ? {}
  : {
      initial: { opacity: 0, height: 0 },
      animate: { opacity: 1, height: 'auto', transition: { duration: 0.25, ease: 'easeOut' } },
      exit:    { opacity: 0, height: 0,    transition: { duration: 0.18 } },
    }

// Usage:
<AnimatePresence>
  {isEditing && (
    <motion.div style={{ overflow: 'hidden' }} {...panelMotion}>
      {/* form content */}
    </motion.div>
  )}
</AnimatePresence>
```

**Critical:** `overflow: hidden` is required on the motion wrapper for height animation to clip correctly.

### Pattern 3: Skill Tag Chips with Add/Remove

Skills in `MOCK_HERO` and `MOCK_CANDIDATES` are `string[]` — free-text names like `'React'`, `'TypeScript'`, `'Figma'`. The `RoleChip` component in `card.tsx` renders coloured chips using CSS `color-mix()` against role-colour vars. Skill tags should be visually similar but use the glow colour since they are not role-typed.

```tsx
// Skill tag chip — display mode
function SkillTag({ skill, onRemove }: { skill: string; onRemove?: () => void }) {
  return (
    <span
      className="dr-label px-2 py-0.5 rounded-[var(--radius-pill)] flex items-center gap-1"
      style={{
        color:      'var(--color-dr-glow)',
        background: 'var(--color-dr-glow-dim)',
        border:     '1px solid var(--color-dr-glow-mid)',
      }}
    >
      {skill}
      {onRemove && (
        <button onClick={onRemove} className="ml-0.5 opacity-60 hover:opacity-100">
          <X size={10} />
        </button>
      )}
    </span>
  )
}
```

### Pattern 4: Adding Skills (keyboard-driven input)

"Press Enter or comma to add" is standard for tag inputs. Keep it simple — a controlled `<input>` that fires `addSkill()` on `keyDown` Enter/`,` and clears itself. No third-party tag-input library needed.

```tsx
function handleSkillKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    const trimmed = skillInput.trim().replace(/,$/, '')
    if (trimmed && !draft.hard_skills.includes(trimmed)) {
      setDraft(d => ({ ...d, hard_skills: [...d.hard_skills, trimmed] }))
    }
    setSkillInput('')
  }
}
```

### Pattern 5: GitHub/LinkedIn Display with Icons

`lucide-react` is already installed (confirmed: `X` imported in apply-modal.tsx). Use `Github` and `Linkedin` icons from the same package.

```tsx
import { Github, Linkedin, ExternalLink } from 'lucide-react'

// Display link row:
{user.github_url && (
  <a
    href={user.github_url.startsWith('http') ? user.github_url : `https://${user.github_url}`}
    target="_blank" rel="noopener noreferrer"
    className="flex items-center gap-1.5 text-sm"
    style={{ color: 'var(--color-dr-text-2)' }}
  >
    <Github size={14} />
    {user.github_url}
  </a>
)}
```

### Pattern 6: Mock Save — localStorage Update

`authStore.set(token, user)` overwrites both `dr_token` and `dr_user` in localStorage. To update user in place without re-fetching the token:

```tsx
// Extend auth-store.ts with:
updateUser(patch: Partial<ApiUser>) {
  const current = this.getUser()
  const token   = this.getToken()
  if (current && token) {
    this.set(token, { ...current, ...patch })
  }
},
```

The page already calls `setUser(authStore.getUser())` for optimistic init — after save, call `authStore.updateUser(patch)` then `setUser(updated)` locally. No re-fetch needed.

### Pattern 7: Success Indicator (no Toast system)

PROJECT.md explicitly states "Toast-уведомления — v2 / Out of Scope". Do not add a toast library. Use inline success state:

```tsx
const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle')

// After mock save:
setSaveState('saved')
setTimeout(() => setSaveState('idle'), 2000)

// In the save button:
<button className="dr-btn-primary" disabled={saveState === 'saving'}>
  {saveState === 'saved' ? '✓ Saved' : 'Save Changes'}
</button>
```

### Pattern 8: CSS-only Stagger for Skills Display

`globals.css` already defines `.dr-enter`, `.dr-enter-2` ... `.dr-enter-5` with `animation: dr-fade-up`. Use these for staggered entrance of skill chips in display mode — no JS needed.

### Anti-Patterns to Avoid

- **Using HeroProfile type directly on the page** — the page works with `ApiUser`. Either extend `ApiUser` or keep a local `profileDraft` state that merges `ApiUser` with `localStorage`-stored extra fields.
- **Calling `api.auth.getUser()` on every save** — unnecessary round-trip. The save is mock; update local state + localStorage only.
- **Blocking render on edit form load** — the edit panel should open instantly with pre-filled values from current `user` state. No fetch on open.
- **`as const` on inputStyle in JSX inline** — define it as a module-level `const` (as done in register/page.tsx) so it doesn't re-create on every render.

---

## Gap Analysis — Key Issue: ApiUser vs HeroProfile

This is the central challenge of the phase.

| Field | In DB? | In ApiUser? | In HeroProfile? | Action |
|-------|--------|------------|-----------------|--------|
| `bio` | YES (text) | YES (optional) | YES | Already works — display + edit |
| `github_url` | NO | NO | YES (via `links.github`) | Add to ApiUser as optional; store in localStorage only for now |
| `linkedin_url` | NO | NO | YES (via `links.linkedin`) | Same as above |
| `hard_skills` | NO | NO | YES (string[]) | Same; seed from empty array |
| `headline` | NO | NO | YES | Out of scope for this phase |
| `preferred_roles` | NO | NO | YES | Out of scope |
| `soft_profile` | NO | NO | YES | Out of scope (v2) |

**Decision:** Extend `ApiUser` interface in `lib/api.ts` with optional fields:

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
  // Extended client-side fields (stored in localStorage, backend pending)
  github_url?:   string
  linkedin_url?: string
  hard_skills?:  string[]
}
```

Add a stub in `api.ts` for the future PATCH:

```typescript
// In api.auth:
patchUser(token: string, patch: Partial<Pick<ApiUser, 'bio' | 'github_url' | 'linkedin_url' | 'hard_skills'>>) {
  // TODO: replace mock with real call when backend adds PATCH /api/hero/{id}
  return Promise.resolve({ data: patch } as ApiResponse<typeof patch>)
},
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Tag input with add/remove | Custom autocomplete widget | Simple `<input>` + Enter key handler | Skills are free-text, no autocomplete needed for MVP |
| Toast notifications | Custom notification stack | Inline button state (`saving / saved`) | Toasts are explicitly v2 in PROJECT.md |
| Animation | CSS keyframes from scratch | Framer Motion (already in codebase) with `useReducedMotion` | Accessibility + consistency |
| Form validation library | react-hook-form, zod | Inline `if (!value.trim())` checks | Two text fields + array; no library needed at this scale |
| Rich text editor for bio | Tiptap, Quill | `<textarea>` with resize:vertical | Bio is plain text, consistent with register form |

---

## Common Pitfalls

### Pitfall 1: `height: 'auto'` animation without overflow:hidden
**What goes wrong:** Content pops in instead of sliding — the height transition clips nothing.
**Why it happens:** Framer Motion animates height but the container doesn't clip children.
**How to avoid:** Always add `style={{ overflow: 'hidden' }}` to the `motion.div` wrapper.
**Warning signs:** Panel appears instantly instead of expanding smoothly.

### Pitfall 2: localStorage reads during SSR
**What goes wrong:** Hydration mismatch / crash on server.
**Why it happens:** `localStorage` doesn't exist in Node.js.
**How to avoid:** `authStore` already has `isClient()` guard — use it. The page is already `'use client'` with `useEffect` for all localStorage access.
**Warning signs:** `ReferenceError: localStorage is not defined` in server logs.

### Pitfall 3: Skill array mutation instead of replace
**What goes wrong:** React doesn't re-render because reference equality holds.
**Why it happens:** `skills.push(newSkill)` mutates in place.
**How to avoid:** Always `setDraft(d => ({ ...d, hard_skills: [...d.hard_skills, skill] }))`.

### Pitfall 4: `StatusBadge` type collision
**What goes wrong:** TypeScript error — `user.status` is `string` but `StatusBadge` expects `StatusVariant`.
**Why it happens:** `ApiUser.status` is typed as `string` (could be any DB value), `StatusBadge` has a narrow union.
**How to avoid:** Cast: `status={user.status as StatusVariant}` or add `string` to the union in card.tsx. The page already does this without issue — keep the same pattern.

### Pitfall 5: Edit form resets on parent re-render
**What goes wrong:** User types in bio, then a parent state update resets the form.
**Why it happens:** Initializing draft state from `user` prop in the component body (re-runs on every render).
**How to avoid:** Initialize draft only once with `useState(() => ({ bio: user.bio ?? '', ... }))` (lazy initializer) or with `useEffect` that runs only when `isEditing` transitions to `true`.

---

## Code Examples

### Skills Display Section (HERO-02)

```tsx
// Source: analysis of existing card.tsx + mock-data.ts patterns
function SkillsSection({ skills }: { skills: string[] }) {
  if (!skills.length) {
    return (
      <p className="dr-label" style={{ color: 'var(--color-dr-muted)' }}>
        No skills added yet.
      </p>
    )
  }
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((s, i) => (
        <span
          key={s}
          className={`dr-label px-2 py-0.5 rounded-[var(--radius-pill)] dr-enter-${Math.min(i + 1, 5)}`}
          style={{
            color:      'var(--color-dr-glow)',
            background: 'var(--color-dr-glow-dim)',
            border:     '1px solid var(--color-dr-glow-mid)',
          }}
        >
          {s}
        </span>
      ))}
    </div>
  )
}
```

### Edit Profile Button Pattern

```tsx
// "Edit Profile" button — ghost style consistent with codebase
<button
  onClick={() => setIsEditing(e => !e)}
  className="dr-label px-3 py-1.5 rounded-[var(--radius-badge)] transition-all"
  style={{
    color:      isEditing ? 'var(--color-dr-text)' : 'var(--color-dr-glow)',
    background: isEditing ? 'rgba(255,255,255,0.05)' : 'var(--color-dr-glow-dim)',
    border:     `1px solid ${isEditing ? 'rgba(255,255,255,0.1)' : 'var(--color-dr-glow-mid)'}`,
  }}
>
  {isEditing ? 'Cancel' : 'Edit Profile'}
</button>
```

### authStore.updateUser() (new helper)

```typescript
// Add to auth-store.ts
updateUser(patch: Partial<ApiUser>) {
  const current = this.getUser()
  const token   = this.getToken()
  if (current && token) {
    this.set(token, { ...current, ...patch })
  }
},
```

---

## Backend State (iskandar_back_ver)

**Confirmed from `database/migrations/0001_01_01_000000_create_users_table.php`:**

The users table has: `id, username, email, photo, phone, bio, status, gender, first_name, last_name, date_of_birth, role, type, email_verified_at, password`.

**No `hard_skills`, `github_url`, `linkedin_url` columns.** These fields do not exist in the backend at all.

**Confirmed from `routes/api.php`:** Only 4 auth routes exist. No PATCH/PUT user routes. No hero profile routes.

**PATCH endpoint pattern to anticipate (for future wire-up):**
When Iskandar adds the endpoint, it will likely be:
- `PATCH /api/auth/user` (updating the authenticated user via Sanctum) or
- `PATCH /api/hero/{id}` (a separate HeroProfile resource)

The `api.ts` stub should use `PATCH /api/auth/user` as the most likely path given the current auth-centric route structure.

---

## Environment Availability

Step 2.6: SKIPPED — this phase is purely React/TypeScript code changes with no new external tool dependencies. All required libraries (Framer Motion, lucide-react) are confirmed already installed in the project.

---

## Validation Architecture

Validation is not configured for this project (no `jest.config.*`, `vitest.config.*`, `pytest.ini`, or test directories found). This is consistent with the hackathon MVP context in PROJECT.md.

**Smoke test strategy (manual):**
1. Sign in as existing user → navigate to `/hero/me`
2. Verify skills section renders (not "coming soon" placeholder)
3. Click "Edit Profile" → verify form expands with animation
4. Edit bio, add 2 skills, add GitHub URL, click Save
5. Verify success indicator appears, form closes
6. Refresh page → verify bio persists (from localStorage cache), skills/links visible
7. Sign out → sign in again → verify cache is re-seeded from `GET /api/auth/user` (bio from backend) while skills/links come from localStorage

---

## Sources

### Primary (HIGH confidence — direct file reads)
- `F:/_WORK_/PROJECTS/TEAM-PROJECTS/devraid-front/app/hero/me/page.tsx` — current page implementation
- `F:/_WORK_/PROJECTS/TEAM-PROJECTS/devraid-front/lib/api.ts` — ApiUser type, req() wrapper
- `F:/_WORK_/PROJECTS/TEAM-PROJECTS/devraid-front/lib/auth-store.ts` — localStorage pattern
- `F:/_WORK_/PROJECTS/TEAM-PROJECTS/devraid-front/types/index.ts` — HeroProfile domain type
- `F:/_WORK_/PROJECTS/TEAM-PROJECTS/devraid-front/lib/mock-data.ts` — skill names, HeroProfile shape
- `F:/_WORK_/PROJECTS/TEAM-PROJECTS/devraid-front/components/ui/card.tsx` — RoleChip, StatusBadge patterns
- `F:/_WORK_/PROJECTS/TEAM-PROJECTS/devraid-front/app/globals.css` — design tokens, CSS utilities
- `F:/_WORK_/PROJECTS/TEAM-PROJECTS/devraid-front/app/login/page.tsx` — inputStyle pattern
- `F:/_WORK_/PROJECTS/TEAM-PROJECTS/devraid-front/app/register/page.tsx` — Field component, inputStyle const
- `F:/_WORK_/PROJECTS/TEAM-PROJECTS/devraid-front/components/features/raids/apply-modal.tsx` — Framer Motion AnimatePresence pattern, useReducedMotion
- `F:/_WORK_/PROJECTS/TEAM-PROJECTS/devraid-front/.planning/PROJECT.md` — constraints (toast v2, mock-data OK)
- `F:/_WORK_/PROJECTS/TEAM-PROJECTS/devraid-front/.planning/REQUIREMENTS.md` — HERO-02/03/04 definitions
- `F:/_WORK_/PROJECTS/TEAM-PROJECTS/iskandar_back_ver/database/migrations/0001_01_01_000000_create_users_table.php` — confirmed no hard_skills/social columns
- `F:/_WORK_/PROJECTS/TEAM-PROJECTS/iskandar_back_ver/routes/api.php` — confirmed no PATCH routes

---

## Metadata

**Confidence breakdown:**
- ApiUser shape: HIGH — read directly from source
- HeroProfile vs ApiUser gap: HIGH — confirmed by migration schema
- Form patterns (inputStyle, Field): HIGH — exact code available to copy
- Framer Motion patterns: HIGH — working code in apply-modal.tsx
- Mock save strategy: HIGH — authStore API fully understood
- Future PATCH URL: MEDIUM — educated guess from existing route naming convention

**Research date:** 2026-04-02
**Valid until:** 2026-05-02 (stable stack, no fast-moving dependencies in this phase)
