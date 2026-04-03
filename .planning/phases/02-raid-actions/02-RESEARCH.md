# Phase 2: Raid Actions — Research

**Researched:** 2026-04-01
**Domain:** Next.js 15 forms, dynamic state, modal patterns, Framer Motion, Radix UI Dialog
**Confidence:** HIGH

---

## Summary

Phase 2 requires two interactive flows: a captain raid-creation form at `/captain/new` and a hero apply-modal triggered from `/raids/[id]`. Both pages currently have placeholders. The captain page has an auth guard already in place. The detail page is a Server Component that needs to become a hybrid — keeping SSR for data rendering while extracting the interactive Apply button into a Client Component island.

The project already has `@radix-ui/react-dialog` installed (v1.1.6) but unused. This is the correct tool for the apply modal — no new libraries needed. Framer Motion (v12.6.3, React 19-compatible) is already used in `roll-hero-reveal.tsx` and provides `AnimatePresence` for entrance/exit transitions. The dynamic roles list in the creation form should be managed with a plain `useState` array — the project has no form library and the requirement is simple enough that one is not needed.

**Primary recommendation:** Use `@radix-ui/react-dialog` for the apply modal (already installed), plain `useState` array for dynamic roles, and extract an `ApplyModalTrigger` Client Component island from the otherwise-Server-Component detail page.

---

## Current State of Both Pages

### `/captain/new` — `app/captain/new/page.tsx`

- Already a `'use client'` component (line 1).
- Has a complete auth guard pattern: `useEffect` checks `authStore.isAuthenticated()`, redirects to `/login` if not authenticated, sets `checked = true` otherwise. Returns `null` while checking (prevents flash).
- Current render is a placeholder: `<h1>Create New Raid</h1>` + `<p>Raid creation form coming soon.</p>`.
- Uses `var(--color-dr-text)` and `var(--color-dr-muted)` inline styles — matches design system.
- **No form, no state beyond the auth guard.** The entire form content needs to be added inside the `if (!checked) return null` guard.

### `/raids/[id]` — `app/raids/[id]/page.tsx`

- Server Component (async, no `'use client'`).
- Awaits `params` correctly per Next.js 15 pattern: `const { id } = await params`.
- Calls `notFound()` when raid is not in `MOCK_RAIDS`.
- Renders header card, open roles list, and a Quest Board CTA link.
- **Apply button exists** (line 112–117) inside each open role's card row — it is a static `<button>` with no `onClick`. No modal, no state.
- The Apply button style: `background: var(--color-dr-glow)`, white text, `rounded-[var(--radius-badge)]`, hover scale effects.
- **Critical gotcha:** This is a Server Component. To add modal state (`useState`, `useEffect`), the Apply button must be extracted to a Client Component. The rest of the page can remain server-rendered.

---

## Role Data Shape (from `lib/mock-data.ts` and `types/index.ts`)

`RaidRole` interface:
```typescript
interface RaidRole {
  id: string
  raid_id: string
  role_name: string               // e.g. 'frontend', 'backend', 'design'
  required_hard_skills: string[]
  desired_soft_profile?: Partial<SoftSkillProfile>
  slots_total: number             // total seats for this role
  slots_filled: number            // how many already taken
}
```

For the **apply modal role selector**, only `id`, `role_name`, and `slots_total - slots_filled` (open slots count) are needed. The modal receives `openRoles: RaidRole[]` as a prop from the parent Server Component — this is safe because props crossing the Server/Client boundary must be serialisable, and `RaidRole` is a plain JSON-serialisable object.

For the **creation form**, the captain defines roles by `role_name` (string, free text or select from a known list) and `slots_total` (number). `slots_filled` defaults to `0`, `id` and `raid_id` are assigned by the backend later.

Known role names in the codebase (from `ROLE_COLOR` map in `raid-card.tsx`):
`frontend`, `backend`, `design`, `mobile`, `devops`, `marketing`, `data`

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React `useState` | (React 19) | Dynamic roles array, modal open state, form fields | Project has no form library; useState is sufficient for this scope |
| `@radix-ui/react-dialog` | ^1.1.6 | Apply modal — accessible, focus-trapped, keyboard dismissible | Already installed, unused, purpose-built for this |
| `framer-motion` | ^12.6.3 | Modal entrance/exit animation via `AnimatePresence` | Already in use in `roll-hero-reveal.tsx`; provides `motion` + `AnimatePresence` |
| `lucide-react` | ^0.487.0 | Icons (X close, plus/minus for role rows) | Already installed, already used throughout |

### No New Libraries Needed
The full dependency list for this phase is already installed. No `npm install` step required.

---

## Architecture Patterns

### Server/Client Boundary for `/raids/[id]`

The page must remain a Server Component (data fetch happens at page level). The Apply button cannot be a `useState`-driven element inside a Server Component. The solution is the **Client Island pattern**:

```
app/raids/[id]/page.tsx         ← Server Component (stays async, no 'use client')
  └── passes openRoles as prop
      └── components/features/raids/apply-modal.tsx   ← 'use client' island
            contains: ApplyModal (Dialog) + trigger button
```

The Server Component renders the page structure and passes `openRoles: RaidRole[]` to the Client Island. The Client Island manages `open` state and submits the form mock.

**Why not make the whole page client?** The ARCHITECTURE.md is explicit: "Server Components are the default for all pages... Client Components are opted in explicitly — used only for interactivity." Making the full detail page client would be an anti-pattern for this project.

### Recommended Project Structure (new files)

```
app/
  captain/new/page.tsx            ← modify (add form, keep auth guard)
  raids/[id]/page.tsx             ← modify (import ApplyModal island)

components/
  features/
    raids/
      apply-modal.tsx             ← NEW 'use client' island
    captain/
      raid-form.tsx               ← NEW 'use client' form component
                                     (optional split — form can live in page.tsx
                                      given the page is already 'use client')
```

Since `/captain/new/page.tsx` is already `'use client'`, the form can live directly in the page file. There is no Server/Client boundary to work around. Splitting to `raid-form.tsx` is optional for organisation but not required by the architecture.

### Pattern 1: Dynamic Roles Array (useState)

**What:** Manage a list of `{ role_name: string; slots_total: number }` entries with add/remove.
**When to use:** Simple dynamic list with no cross-field validation, no library needed.

```typescript
// Source: project convention — plain useState, mirrors register page patterns

interface RoleEntry {
  id: string         // local key only, e.g. crypto.randomUUID() or Date.now() string
  role_name: string
  slots_total: number
}

const [roles, setRoles] = useState<RoleEntry[]>([
  { id: '1', role_name: 'frontend', slots_total: 1 },
])

function addRole() {
  setRoles(prev => [...prev, { id: crypto.randomUUID(), role_name: '', slots_total: 1 }])
}

function removeRole(id: string) {
  setRoles(prev => prev.filter(r => r.id !== id))
}

function updateRole(id: string, field: keyof Omit<RoleEntry, 'id'>, value: string | number) {
  setRoles(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
}
```

**Pitfall:** Using array index as key causes React reconciliation bugs when items are removed mid-list. Always use a stable local `id` (UUID or timestamp string).

### Pattern 2: Radix Dialog + Framer Motion

**What:** `@radix-ui/react-dialog` handles accessibility (focus trap, aria, Escape key, overlay close). Framer Motion's `AnimatePresence` adds enter/exit animation.

**Key insight:** Radix Dialog's `DialogContent` conditionally unmounts when closed. To animate the exit, wrap inside `AnimatePresence` and use `motion.div` as the content container, OR use Radix's `forceMount` prop + manual `AnimatePresence` controlled visibility.

The simpler approach (recommended for this phase — no exit animation complexity needed):

```typescript
// Source: @radix-ui/react-dialog docs pattern + framer-motion AnimatePresence
// components/features/raids/apply-modal.tsx
'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

// Overlay fades, content slides up — mirrors roll-hero-reveal.tsx spring style
```

The overlay uses `Dialog.Overlay` with `asChild` + `motion.div` for the backdrop fade. The content panel uses `Dialog.Content` with `asChild` + `motion.div` for the slide-up. `AnimatePresence` wraps the entire `Dialog.Portal` and is keyed on the `open` prop.

**Radix Dialog controlled pattern** (use controlled `open` state since button lives in the same component):
```typescript
const [open, setOpen] = useState(false)

<Dialog.Root open={open} onOpenChange={setOpen}>
  <Dialog.Trigger asChild>
    <button ...>Apply →</button>
  </Dialog.Trigger>
  <AnimatePresence>
    {open && (
      <Dialog.Portal forceMount>
        <Dialog.Overlay asChild>
          <motion.div
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(5,7,13,0.7)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        </Dialog.Overlay>
        <Dialog.Content asChild>
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
          >
            {/* dr-card panel */}
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    )}
  </AnimatePresence>
</Dialog.Root>
```

**Important:** `useReducedMotion()` must be respected — same pattern as `roll-hero-reveal.tsx`: pass `undefined` variants and skip `initial`/`animate` when `prefersReducedMotion` is true.

### Pattern 3: Mock Submit (success state)

For both forms, submit transitions to a success state using a local `type FormState = 'form' | 'success'` state variable. No routing, no API call.

```typescript
const [formState, setFormState] = useState<'form' | 'success'>('form')

function handleSubmit(e: React.FormEvent) {
  e.preventDefault()
  // future: POST /raids or POST /applications
  setFormState('success')
}
```

The success state renders an in-place confirmation message styled with design tokens, replacing the form content.

### Anti-Patterns to Avoid

- **Making `/raids/[id]/page.tsx` a Client Component:** Page fetches data server-side; adding `'use client'` would break the data-fetching pattern and add unnecessary hydration cost. Extract only the interactive button to a client island.
- **Using array index as role list key:** Causes broken input state when rows are removed. Use stable `id` field.
- **Inline animation logic without `useReducedMotion`:** The codebase explicitly uses `useReducedMotion()` (see `roll-hero-reveal.tsx` line 62). Respect this pattern.
- **Hardcoding hex colors:** Never use literal hex values outside `globals.css`. Use `var(--color-dr-*)` tokens via inline `style` prop.
- **No `any` types:** TypeScript strict mode is on. The `RaidRole[]` prop to the apply modal must be typed correctly.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Accessible modal | Custom `div` overlay with manual focus trap | `@radix-ui/react-dialog` | Focus trap, Escape key, aria-modal, screen reader — already installed |
| Modal backdrop | Custom z-index stacking hack | `Dialog.Overlay` + `Dialog.Portal` | Radix handles portal rendering above app z-stack |
| Role name → color | Re-implementing ROLE_COLOR map | Reuse `RoleChip` from `components/ui/card.tsx` | Already handles all role colors via CSS vars |

---

## Design Tokens to Use

From `app/globals.css` `@theme` block:

### Backgrounds / Surfaces
| Token | Value | Use |
|-------|-------|-----|
| `--color-dr-bg` | `#05070D` | Page background (set by html/body) |
| `--color-dr-surface` | `#0C0F19` | Modal panel background |
| `--color-dr-surface-2` | `#111520` | Input field background, secondary areas |
| `--color-dr-surface-3` | `#171C28` | Hover states on interactive elements |
| `--color-dr-edge` | `#1C2236` | Input borders, dividers |
| `--color-dr-edge-2` | `#263047` | Hover border state |

### Text
| Token | Use |
|-------|-----|
| `--color-dr-text` | Primary text (labels, headings) |
| `--color-dr-text-2` | Secondary text, placeholder-like |
| `--color-dr-muted` | Tertiary — `.dr-label` mono caps |

### Accent / Actions
| Token | Use |
|-------|-----|
| `--color-dr-glow` | `#5B87FF` — primary button bg, focus rings, Apply button |
| `--color-dr-glow-dim` | `rgba(91,135,255,0.10)` — subtle glow backgrounds |
| `--color-dr-gold` | `#C8943A` — secondary button border, warnings |

### CSS Utility Classes (use these, don't re-implement)
| Class | Purpose |
|-------|---------|
| `.dr-card` | Glassmorphism card — modal panel, form sections |
| `.dr-btn-primary` | Blue gradient primary button — main submit |
| `.dr-btn-secondary` | Gold-bordered secondary — cancel, add role |
| `.dr-label` | JetBrains Mono uppercase caption |
| `.dr-title-fantasy` | Cinzel serif heading — form title, modal title |
| `.dr-enter` / `.dr-enter-2` etc. | CSS entrance stagger animations |
| `.dr-divider` | Gradient horizontal rule between form sections |

### Radii
| Token | Value | Use |
|-------|-------|-----|
| `--radius-card` | `14px` | Card containers, modal panel |
| `--radius-badge` | `7px` | Inputs, buttons, chips |
| `--radius-pill` | `999px` | `RoleChip` |

### Stage Select Options (from existing `STAGE_LABELS` in both pages)
```
idea | planning | development | testing | launched
```

---

## Files That Need Changes

| File | Action | Notes |
|------|--------|-------|
| `app/captain/new/page.tsx` | Modify | Replace placeholder `<p>` with full form. Auth guard stays untouched. |
| `app/raids/[id]/page.tsx` | Modify | Import `ApplyModal` island, replace static `<button>Apply →</button>` with `<ApplyModal openRoles={openRoles} />` |
| `components/features/raids/apply-modal.tsx` | Create | New `'use client'` component. Contains trigger button + Radix Dialog + Framer Motion. |
| `lib/mock-data.ts` | No change | `MOCK_RAIDS` shape is sufficient; form saves to local state only |
| `types/index.ts` | No change | `RaidRole`, `RaidStage` already defined correctly |

---

## Common Pitfalls

### Pitfall 1: Server Component Cannot Use useState
**What goes wrong:** Developer adds `useState` directly to `app/raids/[id]/page.tsx`, causing Next.js build error: "You're importing a component that needs useState. It only works in a Client Component."
**Why it happens:** The page is a Server Component (no `'use client'` directive). Any hook usage requires client context.
**How to avoid:** Extract the Apply button + modal to `components/features/raids/apply-modal.tsx` with `'use client'`. The page imports and renders this component, passing `openRoles` as a serialisable prop.
**Warning signs:** Build error mentioning hooks in Server Components.

### Pitfall 2: AnimatePresence Exit Doesn't Fire Without forceMount
**What goes wrong:** Modal closes instantly without exit animation because Radix unmounts `DialogContent` before Framer Motion can animate the exit.
**Why it happens:** Radix Dialog conditionally renders content only when `open=true`. On close, the DOM node disappears immediately, cutting off any exit animation.
**How to avoid:** Use `Dialog.Portal forceMount` combined with `AnimatePresence` and `{open && ...}` conditional inside. This lets AnimatePresence control mounting/unmounting while Radix handles aria state.
**Warning signs:** Modal disappears abruptly on close instead of fading/sliding out.

### Pitfall 3: Role List Key Using Array Index
**What goes wrong:** When a role row in the middle of the list is removed, the inputs below it shift their values incorrectly because React associates input state with the index key.
**Why it happens:** `key={index}` means React reuses DOM nodes by position. When index 1 is deleted, what was index 2 becomes index 1 and React doesn't re-create it.
**How to avoid:** Generate a stable local `id` (e.g., `crypto.randomUUID()` or `String(Date.now() + Math.random())`) when creating a new role entry. Use this as the React `key`.
**Warning signs:** Deleting a middle role causes the role name of the next row to appear in the deleted row's position.

### Pitfall 4: params Must Be Awaited in Next.js 15
**What goes wrong:** Accessing `params.id` directly (without `await`) produces a TypeScript error and potential runtime warning.
**Why it happens:** Next.js 15 made `params` a Promise. The existing page already does this correctly.
**How to avoid:** The current `page.tsx` already has `const { id } = await params` — do not remove this when modifying the file.
**Warning signs:** TypeScript error: "Property 'id' does not exist on type 'Promise<...>'".

### Pitfall 5: Props Crossing Server/Client Boundary Must Be Serialisable
**What goes wrong:** Passing a function or class instance as a prop from a Server Component to a Client Component causes a build/runtime error.
**Why it happens:** Server Component output is serialised to JSON for hydration. Functions and class instances cannot be serialised.
**How to avoid:** Pass only plain data (`RaidRole[]` is fine — it's a plain object array with strings and numbers).
**Warning signs:** Error: "Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with 'use server'."

---

## Code Examples

### Verified patterns from existing codebase

#### Auth Guard Pattern (from `app/captain/new/page.tsx`)
```typescript
// Source: app/captain/new/page.tsx — keep this pattern, add form below it
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authStore } from '@/lib/auth-store'

export default function CaptainNewPage(): JSX.Element | null {
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!authStore.isAuthenticated()) {
      router.replace('/login')
    } else {
      setChecked(true)
    }
  }, [router])

  if (!checked) return null

  return (
    // ← add form content here
  )
}
```

#### Framer Motion Spring Style (from `roll-hero-reveal.tsx`)
```typescript
// Source: components/features/raids/roll-hero-reveal.tsx
const prefersReducedMotion = useReducedMotion()

// Skip all motion props when reduced motion is preferred
<motion.li
  variants={prefersReducedMotion ? undefined : cardVariants}
>
```

#### RoleChip Reuse (from `components/ui/card.tsx`)
```typescript
// Source: components/ui/card.tsx — use this for role display in modal
import { RoleChip } from '@/components/ui/card'
<RoleChip role={role.role_name} />
// Handles color via var(--color-dr-role-{roleName}) automatically
```

#### Styling Inputs (inferred from existing form patterns in `/login`, `/register`)
```typescript
// Consistent input styling — derive from existing form pages
<input
  type="text"
  className="w-full px-3 py-2 text-sm rounded-[var(--radius-badge)] outline-none transition-colors"
  style={{
    background: 'var(--color-dr-surface-2)',
    border: '1px solid var(--color-dr-edge)',
    color: 'var(--color-dr-text)',
  }}
/>
```

---

## Environment Availability

Step 2.6: SKIPPED — this phase is purely code changes. All dependencies are already in `package.json`. No external services, CLIs, or databases are required. No `npm install` step needed.

---

## Validation Architecture

No test infrastructure exists in this project (no `jest.config.*`, `vitest.config.*`, `pytest.ini`, no `tests/` or `__tests__/` directories detected). The phase validation is manual smoke testing:

| Req ID | Behavior | Validation |
|--------|----------|-----------|
| CAPTAIN-01 | `/captain/new` page exists | Navigate to `/captain/new` as authenticated user — page renders |
| CAPTAIN-02 | Form has title, mission, stage fields | All three inputs visible and functional |
| CAPTAIN-03 | Dynamic role rows add/remove | Add button adds row; remove button removes correct row without input value swap |
| CAPTAIN-04 | Submit shows success state | Submit button transitions page to success message |
| RAID-01 | Apply button opens modal | Click Apply on any open role row — modal appears |
| RAID-02 | Modal has role selector + motivation field | Role is pre-selected; motivation textarea is present |
| RAID-03 | Submit shows success state | Submit inside modal shows confirmation, modal remains open in success state |

**Auth guard check:** Navigating to `/captain/new` while logged out redirects to `/login`.

---

## Sources

### Primary (HIGH confidence)
- Direct file reads: `app/captain/new/page.tsx`, `app/raids/[id]/page.tsx`, `lib/mock-data.ts`, `types/index.ts`, `components/features/raids/raid-card.tsx`, `components/features/raids/roll-hero-reveal.tsx`, `components/ui/card.tsx`, `app/globals.css`
- `.planning/codebase/CONVENTIONS.md` — component patterns, CSS approach
- `.planning/codebase/ARCHITECTURE.md` — Server/Client rendering decisions
- `package.json` — verified dependency versions

### Secondary (MEDIUM confidence)
- `@radix-ui/react-dialog` v1.1.6 — `forceMount` + `AnimatePresence` pattern is well-documented in Radix UI docs and widely used; not verified against live docs in this session but package is confirmed installed

---

## Metadata

**Confidence breakdown:**
- Current page state: HIGH — read directly from source files
- Dynamic roles pattern: HIGH — plain useState, no library, standard React
- Modal pattern: HIGH — Radix Dialog installed, Framer Motion AnimatePresence pattern observed in existing codebase
- Design tokens: HIGH — read directly from globals.css
- Server/Client boundary: HIGH — ARCHITECTURE.md is explicit

**Research date:** 2026-04-01
**Valid until:** 2026-05-01 (stable stack, no fast-moving dependencies for this phase)
