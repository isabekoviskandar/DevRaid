# Architecture

**Analysis Date:** 2026-04-01

## Pattern Overview

**Overall:** Next.js 15 App Router — hybrid SSR/CSR

**Key Characteristics:**
- Server Components are the default for all pages (data fetching happens at page level without `'use client'`)
- Client Components are opted in explicitly with `'use client'` — used only for interactivity (forms, toggled UI, animation)
- No global client-side state management library; auth state is managed via `localStorage` accessed in a single layout-level Client Component (`AppShell`)
- Data layer is currently all mock — backend (Laravel 11 + Sanctum) is integrated only for auth; all other data comes from `lib/mock-data.ts`
- Feature-based component grouping under `components/features/`, with a small shared UI primitive layer under `components/ui/`

## Rendering Modes by Route

| Route | Mode | Notes |
|-------|------|-------|
| `/` | Server Component | Static landing page, no data fetch |
| `/raids` | Server Component | Reads `MOCK_RAIDS`; marked for future `fetch()` |
| `/raids/[id]` | Server Component (async) | Awaits `params`, reads mock |
| `/raids/[id]/board` | Server Component (async) | Kanban board, reads mock quests |
| `/captain/[id]` | Server Component (async) | Captain dashboard, reads mock candidates |
| `/captain/new` | Placeholder | Directory exists, no page file yet |
| `/hero/me` | Server Component | Reads `MOCK_HERO` |
| `/hero/me/edit` | Placeholder | Directory exists, no page file yet |
| `/hero/[id]` | Placeholder | Directory exists, no page file yet |
| `/login` | Client Component | Form state, router navigation |
| `/register` | Client Component | Form state, field-level validation |

## Routing

**Approach:** Next.js App Router file-based routing

**Conventions:**
- `app/[segment]/page.tsx` → route pages
- `app/[segment]/[id]/page.tsx` → dynamic segments
- Dynamic param access: `async function Page({ params }: { params: Promise<{ id: string }> })` — awaiting params is required in Next.js 15

**No route handlers** (`app/api/`) exist yet. All API calls go directly from Client Components to the external Laravel backend via `lib/api.ts`.

## Layers

**Pages (`app/`):**
- Purpose: Route entry points. Compose feature components. Handle data fetching (currently mocks, intended to be server-side `fetch()` calls).
- Depends on: `components/features/`, `components/ui/`, `lib/mock-data.ts`, `types/`
- Pattern: Server Components by default; `'use client'` only when the page itself needs hooks (login, register)

**Feature Components (`components/features/`):**
- Purpose: Domain-scoped UI components tied to specific product features (raids, heroes, captain, quests)
- Depends on: `components/ui/`, `types/`, `lib/`
- Used by: `app/` pages
- Pattern: Most are Server-compatible (pure render); interactive ones use `'use client'` (e.g., `captain-roll-section.tsx`, `roll-hero-reveal.tsx`)

**UI Primitives (`components/ui/`):**
- Purpose: Reusable, domain-agnostic building blocks
- Files: `card.tsx` (Card anatomy + StatusBadge + RoleChip), `hex-radar.tsx` (SVG soft-skill radar)
- `hex-radar.tsx` is `'use client'` (uses SVG animation-compatible patterns; stateless but client-rendered)
- `card.tsx` is a Server Component

**Layout (`components/layout/`):**
- Purpose: Persistent application shell (sidebar nav + main content area)
- File: `app-shell.tsx` — `'use client'` because it reads `localStorage` (auth state), uses `usePathname`, `useRouter`, and manages a user state via `useState`/`useEffect`
- Auth verification pattern: optimistic display of cached user from `localStorage`, then re-verify against backend on every navigation

**Library (`lib/`):**
- `api.ts` — Typed HTTP client wrapping `fetch`. Bearer-token auth. Returns tagged union `ApiResponse<T>` (Ok | Err). Backend: Laravel 11 at `NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'`.
- `auth-store.ts` — `localStorage`-backed auth token/user cache. Client-only (guards with `typeof window !== 'undefined'`). Explicit upgrade note: move to httpOnly cookie.
- `mock-data.ts` — Static mock arrays for `Raid[]`, `HeroProfile`, `Quest[]`, `RollCandidate[]`. All page-level data comes from here until backend endpoints exist.
- `utils.ts` — Single `cn()` helper combining `clsx` + `tailwind-merge`.

**Types (`types/`):**
- `index.ts` — Single source of truth for domain types. Mirrors backend Laravel entity model. Key types: `HeroProfile`, `Raid`, `RaidRole`, `Quest`, `RollCandidate`, `MatchRequest`, `SoftSkillProfile`.

## State Management

**No global state library** (no Zustand, Redux, Jotai, etc.)

**Auth State:**
- Stored in `localStorage` via `lib/auth-store.ts`
- Surfaced in React tree via `useState` inside `AppShell` (the layout component)
- Re-validated against backend API on every client navigation (`useEffect` depends on `usePathname()`)
- Pattern: `authStore.set(token, user)` on login/register, `authStore.clear()` on logout

**Page-local State:**
- Form pages (`/login`, `/register`) use local `useState` for form fields, errors, and loading state
- `CaptainRollSection` uses local `useState` for reveal toggle and candidate list mutation (client-side filter on invite)

**No shared React Context** exists — no auth context provider, no theme context. AppShell handles auth display; pages are independent.

## Data Fetching Patterns

**Current state:** All non-auth data is from `lib/mock-data.ts` imported directly into Server Component pages.

**Auth data fetching:**
```typescript
// lib/api.ts pattern — all endpoints return ApiResponse<T>
const res = await api.auth.login({ username, password })
if (res.error) { /* handle */ }
else { authStore.set(res.data.token, res.data.user) }
```

**Intended server-side fetch pattern** (per TODO comments in pages):
```typescript
// app/raids/page.tsx comment:
// TODO: replace with fetch(`${API}/raid-board`) — Server Component, so async fetch goes here
export default async function RaidBoardPage() {
  const raids = await fetch(...)   // will become this
}
```

**No SWR, React Query, or other data fetching libraries.** All fetching is plain `fetch()` via the `lib/api.ts` wrapper.

## Component Architecture

**Pattern:** Feature-based grouping with primitive UI layer

**Composition model:**
- `app/` pages are thin orchestrators — they fetch data and pass it to feature components
- Feature components receive typed props, render domain UI
- UI primitives (`Card`, `StatusBadge`, `RoleChip`, `HexRadar`) are composited inside feature components

**Card anatomy system** (`components/ui/card.tsx`):
```
Card
├── CardHeader    (title, subtitle, status badge)
├── CardBody      (main content)
└── CardFooter    (tags/chips, primary action)
```

**Animation:** Framer Motion used in `roll-hero-reveal.tsx` — staggered card entrance with `motion.ul`/`motion.li`. Respects `useReducedMotion()`.

## Error Handling

**API errors:** `ApiResponse<T>` tagged union — callers check `res.error` before accessing `res.data`. Field-level errors returned in `res.errors: Record<string, string[]>`.

**Not-found:** `notFound()` from `next/navigation` used in dynamic routes when mock/data lookup fails (`raids/[id]`, `captain/[id]`, `raids/[id]/board`).

**Network errors:** Caught in `lib/api.ts` `try/catch` — returns `{ error: 'Network error — is the backend running on port 8000?' }`.

**No global error boundary** (`error.tsx`) exists yet.

## Key Design Decisions

1. **Mock-first development** — Backend API integration is planned but not built for most features. Pages contain `// TODO: replace with fetch(...)` comments marking where server fetches should go.

2. **CSS custom properties for design tokens** — All colours, radii, and spacing use `var(--color-dr-*)` tokens. No Tailwind `theme.extend` config — tokens are defined in `globals.css`.

3. **Tailwind for layout, CSS vars for brand** — Tailwind utilities handle spacing, grid, flex. Brand-specific colours (gold, glow, role colours, status colours) use CSS variables referenced in inline `style` props and Tailwind's arbitrary value syntax.

4. **`cn()` utility pattern** — All conditional className composition goes through `cn()` (`clsx` + `tailwind-merge`), never string concatenation.

5. **Framer Motion with reduced motion respect** — Animation code checks `useReducedMotion()` and skips variants entirely, not just disabling them.

6. **TypeScript strict mode** — `strict: true` in `tsconfig.json`. Path alias `@/*` maps to project root.

---

*Architecture analysis: 2026-04-01*
