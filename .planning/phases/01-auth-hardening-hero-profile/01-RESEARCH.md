# Phase 1: Auth Hardening & Hero Profile — Research

**Researched:** 2026-04-01
**Domain:** Next.js 15 App Router — client-side auth guards, localStorage-based auth, real API data fetching
**Confidence:** HIGH (based on direct codebase inspection + framework knowledge)

---

## Summary

Phase 1 has two requirements: AUTH-03 (protect `/captain/*` from unauthenticated users) and HERO-01 (replace MOCK_HERO on `/hero/me` with real API data). Both are achievable with minimal new infrastructure — the existing `authStore` and `api.ts` already provide everything needed.

The codebase uses localStorage-based auth with no Next.js middleware. The existing `AppShell` component already re-validates the token on every client navigation. Auth guard for `/captain/*` should be implemented as a Client Component wrapper (not middleware), because the token lives in localStorage which is inaccessible to Next.js middleware at the Edge. The `/hero/me` page must become a `'use client'` component to read the token from `authStore` and call `api.auth.getUser()`.

The critical constraint is hydration: localStorage does not exist during SSR. Both the auth guard and the hero profile page must handle the "not yet mounted" state to avoid hydration mismatches. The pattern for this already exists in `AppShell` — a `useEffect` to read from localStorage after mount.

**Primary recommendation:** Implement AUTH-03 as a `useAuthGuard` hook (or inline `useEffect` redirect) inside a thin `'use client'` wrapper page at `app/captain/new/page.tsx`. Implement HERO-01 by converting `app/hero/me/page.tsx` to a Client Component that calls `api.auth.getUser(token)` and renders the `ApiUser` fields, falling back gracefully if no user.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| AUTH-03 | `/captain/*` protected by auth guard — redirect to `/login` if no token in localStorage | Client Component `useEffect` redirect pattern; `authStore.isAuthenticated()` + `router.push('/login')` |
| HERO-01 | `/hero/me` shows real authenticated user data (GET /api/auth/user, not MOCK_HERO) | `api.auth.getUser(token)` already exists in `lib/api.ts`; page must become `'use client'` with mounted/loading state |
</phase_requirements>

---

## Current Auth Implementation

### What Exists

**`lib/auth-store.ts`** — localStorage wrapper with SSR guard:
- `getToken()` — returns `dr_token` from localStorage, null on server
- `getUser()` — returns cached `ApiUser` from `dr_user` key (JSON.parse), null on server
- `set(token, user)` — writes both keys
- `clear()` — removes both keys
- `isAuthenticated()` — boolean, `!!getToken()`

**`lib/api.ts`** — typed fetch wrapper:
- `api.auth.getUser(token)` — `GET /api/auth/user` with Bearer token, returns `ApiResponse<ApiUser>`
- `ApiUser` shape: `{ id, username, email, bio?, gender?, photo?, role, status, created_at }`

**`components/layout/app-shell.tsx`** — the only place auth state currently lives in React:
- `'use client'` component wrapping the entire app (via `app/layout.tsx`)
- On mount + every `usePathname()` change: reads token from `authStore`, shows cached user optimistically, then calls `api.auth.getUser(token)` to re-validate
- Handles logout: calls `api.auth.logout(token)`, clears store, redirects to `/login`

**No `middleware.ts` exists.** No route-level auth protection is implemented anywhere.

### Current State of Target Routes

| Route | File | Current Auth Handling | Needs Change |
|-------|------|-----------------------|--------------|
| `/captain/new` | No page file | None (placeholder directory only) | Create page with auth guard |
| `/captain/[id]` | `app/captain/[id]/page.tsx` | None (Server Component, reads mock) | Pattern reference only |
| `/hero/me` | `app/hero/me/page.tsx` | None (Server Component, uses MOCK_HERO) | Convert to Client Component with real API |

---

## Standard Stack

No new dependencies are needed for this phase. Everything required is already in the project.

### Relevant Existing Libraries

| Library | Purpose | Used In |
|---------|---------|---------|
| `next/navigation` (`useRouter`, `usePathname`) | Client-side redirect | `app-shell.tsx` — established pattern |
| `lib/auth-store.ts` | Read/write token from localStorage | `app-shell.tsx`, login/register pages |
| `lib/api.ts` (`api.auth.getUser`) | Fetch real user from backend | `app-shell.tsx` |
| React `useState`, `useEffect` | Client-side mounted state and side effects | `app-shell.tsx`, login/register pages |

**No new packages to install.**

---

## Architecture Patterns

### Pattern 1: Client Component Auth Guard (for `/captain/new`)

**What:** A `'use client'` page that uses `useEffect` to check token on mount and redirects if missing. Shows a loading/blank state during the check to avoid flash of content.

**When to use:** Any route that must be inaccessible without a token, where the token lives in localStorage.

**Why not middleware:** Next.js middleware runs at the Edge before the response — it has no access to `localStorage`. Cookie-based tokens could use middleware; `localStorage` cannot. This is a known constraint of the current architecture (noted in `auth-store.ts` comment: "Production upgrade path: move to httpOnly cookie via Next.js route handler").

**Pattern (established in `app-shell.tsx`, adapted for a page):**
```typescript
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authStore } from '@/lib/auth-store'

export default function CaptainNewPage() {
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!authStore.isAuthenticated()) {
      router.replace('/login')
    } else {
      setChecked(true)
    }
  }, [router])

  if (!checked) return null  // blank while checking — no SSR content flash

  return (
    // page content here
  )
}
```

**Key detail:** Use `router.replace('/login')` not `router.push('/login')` so the unauthenticated user cannot press Back to return to `/captain/new`.

### Pattern 2: Client Component with Real API Data (for `/hero/me`)

**What:** Convert the Server Component page to `'use client'`, read the cached user from `authStore` for optimistic display, then call `api.auth.getUser(token)` to get fresh data.

**When to use:** Any page that displays the authenticated user's own data.

**Pattern:**
```typescript
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authStore } from '@/lib/auth-store'
import { api, type ApiUser } from '@/lib/api'

export default function MyHeroProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<ApiUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = authStore.getToken()
    if (!token) {
      // Graceful fallback: not logged in
      setLoading(false)
      return
    }
    // Optimistic: show cached user immediately
    setUser(authStore.getUser())
    // Then fetch fresh data
    api.auth.getUser(token).then(res => {
      if (res.error) {
        authStore.clear()
        setUser(null)
      } else {
        setUser(res.data)
      }
      setLoading(false)
    })
  }, [])

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Sign in to view your profile.</div>

  // render with real user data
}
```

### Data Mapping: ApiUser vs MOCK_HERO

The current page renders `HeroProfile` fields. The API returns `ApiUser`. These are different types — the page UI must adapt.

| UI Element in current page | MOCK_HERO field (HeroProfile) | ApiUser equivalent | Notes |
|---------------------------|-------------------------------|---------------------|-------|
| Avatar initial | `hero.display_name[0]` | `user.username[0]` | Direct swap |
| Name | `hero.display_name` | `user.username` | `ApiUser` has no `display_name` |
| Headline | `hero.headline` | (none) | `ApiUser` has no headline field |
| Bio | `hero.bio` | `user.bio` (optional) | May be empty |
| Preferred roles | `hero.preferred_roles[]` | (none) | Not in `ApiUser` |
| Hard skills | `hero.hard_skills[]` | (none) | Not in `ApiUser` |
| Soft-skill hex radar | `hero.soft_profile` | (none) | Not in `ApiUser` |
| Raids Completed | `hero.reputation.completed_raids` | (none) | Not in `ApiUser` |
| Reviews | `hero.reputation.reviews[]` | (none) | Not in `ApiUser` |
| Email | (not displayed) | `user.email` | New field to display |

**Key finding:** `ApiUser` only has `id, username, email, bio, gender, photo, role, status, created_at`. The rich HeroProfile fields (skills, soft profile, reputation, reviews) do not come from `GET /api/auth/user`. They would require a separate endpoint that doesn't exist yet.

**Implication for HERO-01:** The page must be redesigned to show what `ApiUser` actually provides (username, email, bio, role, status) rather than trying to map non-existent fields. The complex sections (HexRadar, hard skills, reviews) should either be hidden or replaced with placeholder "coming soon" UI for this phase.

### Anti-Patterns to Avoid

- **SSR localStorage access:** Never call `authStore.getToken()` outside of `useEffect` or a function triggered by user interaction. The SSR guard in `auth-store.ts` returns `null` on server, which will cause hydration mismatches if the client then re-renders with a non-null value.
- **Middleware for localStorage auth:** Cannot access `localStorage` in `middleware.ts` (Edge runtime). Do not add a middleware.ts for this phase.
- **Rendering protected content before the `useEffect` check completes:** Always gate the actual page content behind a `checked` / `!loading` state flag to prevent flash of protected content.
- **`router.push` vs `router.replace` for auth redirects:** Use `replace` so the browser history doesn't include the protected route. Using `push` allows the user to navigate Back into the protected page.
- **Reading `authStore.getUser()` as the only source of truth:** The cached user in localStorage may be stale. Always follow up with `api.auth.getUser(token)` to validate, as the AppShell already does.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead |
|---------|-------------|-------------|
| Token storage | Custom cookie / sessionStorage logic | `authStore` (already exists) |
| Authenticated fetch | Custom headers logic | `api.auth.getUser(token)` (already exists) |
| Redirect on no-auth | Custom history manipulation | `useRouter().replace('/login')` from `next/navigation` |
| Loading state | Custom spinner component | Inline `null` return or simple text (no new component needed for MVP) |

---

## Common Pitfalls

### Pitfall 1: Hydration Mismatch from localStorage
**What goes wrong:** Server renders the page with `user = null` (SSR guard returns null). Client immediately re-renders with the cached user from localStorage. React sees a mismatch and logs a hydration error.
**Why it happens:** The `authStore.getUser()` call in the render path (not in `useEffect`) returns different values on server vs client.
**How to avoid:** Initialize state with `useState(null)` always. Only call `authStore` methods inside `useEffect`. The AppShell follows this exact pattern correctly.
**Warning signs:** React hydration warnings in browser console: "Prop `X` did not match. Server: null, Client: value".

### Pitfall 2: Flash of Protected Content
**What goes wrong:** On `/captain/new`, the page renders its full content for one frame before the `useEffect` redirect fires. Users can see the page briefly before being redirected.
**Why it happens:** Server renders HTML, client mounts, `useEffect` runs asynchronously after paint.
**How to avoid:** Return `null` (or a minimal loading shell) until the auth check is complete (`checked` state = true).
**Warning signs:** Brief flash of page content when navigating to protected route without a token.

### Pitfall 3: ApiUser ≠ HeroProfile
**What goes wrong:** Attempting to pass `ApiUser` where `HeroProfile` is expected causes TypeScript errors. Alternatively, rendering `user.display_name` crashes at runtime because `ApiUser` has `username` not `display_name`.
**Why it happens:** The types are architecturally separate. `HeroProfile` is a frontend domain type for the full profile. `ApiUser` is what the auth endpoint returns.
**How to avoid:** Use `ApiUser` type explicitly on `/hero/me`. Render `user.username` not `user.display_name`. Stub or hide sections that need fields not in `ApiUser`.
**Warning signs:** TypeScript errors on property access; runtime crashes on `undefined[0]`.

### Pitfall 4: Not Handling the Unauthenticated State on `/hero/me`
**What goes wrong:** If a logged-out user navigates to `/hero/me` and the page crashes or shows an error rather than a graceful fallback, the success criteria "Logout → /hero/me doesn't crash" fails.
**Why it happens:** Accessing `user.username` when `user` is `null` throws a TypeError.
**How to avoid:** Explicit `if (!user)` guard that returns a friendly "Sign in to view your profile" state (not a redirect — the requirement says "graceful fallback" not "redirect").
**Warning signs:** TypeError in console when loading the page while logged out.

---

## Files That Will Need Changes

| File | Change Type | What |
|------|-------------|------|
| `app/captain/new/page.tsx` | Create new | Client Component with auth guard; redirect to `/login` if no token |
| `app/hero/me/page.tsx` | Rewrite | Convert from Server Component using MOCK_HERO to Client Component using `api.auth.getUser()` |

**Files that do NOT need changes for this phase:**
- `lib/auth-store.ts` — already correct
- `lib/api.ts` — `api.auth.getUser()` already exists
- `components/layout/app-shell.tsx` — no changes needed
- `app/captain/[id]/page.tsx` — AUTH-03 only requires protecting `/captain/new` per the requirements

---

## Environment Availability

Step 2.6: SKIPPED (no external dependencies beyond existing project — all tools are already in place, backend runs on port 8000 as established in prior sessions).

---

## Open Questions

1. **Does `/captain/[id]` also need an auth guard (AUTH-03 says `/captain/*`)?**
   - What we know: AUTH-03 says `/captain/*` which would include `/captain/[id]`. However `app/captain/[id]/page.tsx` is a Server Component that reads mock data — adding a client-side auth guard to it requires converting it to a Client Component.
   - What's unclear: Whether the scope of AUTH-03 is meant to cover the existing `/captain/[id]` page or only `/captain/new` (the new page being created).
   - Recommendation: The success criteria only tests `/captain/new`. Scope AUTH-03 to `/captain/new` for this phase. A future refactor could add a `app/captain/layout.tsx` as a `'use client'` auth guard layout once all captain pages need protection.

2. **What should `/hero/me` look like with only `ApiUser` fields?**
   - What we know: `ApiUser` has `username, email, bio, gender, photo, role, status`. The current rich UI (HexRadar, hard skills, reviews, reputation) has no data source from the API yet.
   - What's unclear: Whether to show a simplified profile or show the same layout with empty/placeholder sections.
   - Recommendation: Show the fields that exist (`username` as name, `email`, `bio` if present, `role`, `status`). Hide or stub complex sections (skills, soft-profile radar, reviews) with a "Profile coming soon" placeholder. This is honest about current data limitations.

---

## Sources

### Primary (HIGH confidence)
- Direct codebase inspection: `lib/auth-store.ts`, `lib/api.ts`, `components/layout/app-shell.tsx`, `app/hero/me/page.tsx`, `app/captain/[id]/page.tsx`, `app/layout.tsx`, `types/index.ts`, `lib/mock-data.ts`
- `.planning/codebase/ARCHITECTURE.md` — authoritative architecture reference for this project
- `.planning/REQUIREMENTS.md` — authoritative requirements source

### Secondary (MEDIUM confidence)
- Next.js 15 App Router constraints on middleware + localStorage: well-established limitation documented in Next.js docs; consistent with `auth-store.ts` inline comment "Production upgrade path: move to httpOnly cookie"
- `useEffect` + `useState(null)` pattern for localStorage hydration safety: standard Next.js community practice, consistent with how `AppShell` is implemented in this codebase

---

## Metadata

**Confidence breakdown:**
- Current auth implementation: HIGH — inspected all relevant source files directly
- Auth guard pattern recommendation: HIGH — derived from existing codebase pattern in `AppShell` + known Next.js 15 constraints
- Hero profile data mapping: HIGH — both `ApiUser` (from `api.ts`) and `HeroProfile` (from `types/index.ts`) inspected; gap is clear
- SSR/hydration pitfalls: HIGH — pattern already correctly implemented in `AppShell`; described here for new pages

**Research date:** 2026-04-01
**Valid until:** 2026-05-01 (stable architecture, no fast-moving dependencies)
