# Codebase Concerns

**Analysis Date:** 2026-04-01

---

## Tech Debt

### Mock Data Used Everywhere Instead of Real API Calls

**Severity: HIGH**

Every data-displaying page imports from `lib/mock-data.ts` and uses static fixtures instead of fetching from the backend. The app's backend (Laravel + Sanctum) is wired up for auth only — all other entities (raids, heroes, quests, candidates) come from hardcoded mock data.

- Files: `app/raids/page.tsx:7`, `app/raids/[id]/page.tsx:13`, `app/raids/[id]/board/page.tsx:23-24`, `app/captain/[id]/page.tsx:9-14`, `app/hero/me/page.tsx:2`
- Affected mock exports: `MOCK_RAIDS`, `MOCK_HERO`, `MOCK_QUESTS`, `MOCK_CANDIDATES` in `lib/mock-data.ts`
- TODO comment exists: `app/raids/page.tsx:6` — `// TODO: replace with fetch(\`${API}/raid-board\`) — Server Component, so async fetch goes here`
- Impact: No real data ever renders. The app cannot be used beyond an interactive prototype.
- Fix approach: Replace each MOCK import with an async `fetch()` call to the corresponding backend endpoint. Since these are Server Components, they support `async/await` directly. Create a proper API layer (e.g., `lib/api-raids.ts`, `lib/api-hero.ts`) alongside the existing `lib/api.ts`.

---

### Invite Action (Roll Hero) Is Unimplemented

**Severity: HIGH**

The core captain flow — inviting a hero to a raid role — has a TODO comment and no real network call. Clicking "Invite →" removes the candidate from local state only.

- File: `components/features/captain/captain-roll-section.tsx:44`
- Code: `// TODO: POST /api/match { direction: 'invite', hero_id, role_id }`
- Impact: The key monetizable/engagement action of the product does nothing persistently. Any invite is lost on page reload.
- Fix approach: Implement `api.match.invite(heroId, roleId)` in `lib/api.ts`, call it inside the `onInvite` handler, handle optimistic UI with error rollback.

---

### Filter Chips on Raid Board Are Non-Functional

**Severity: MEDIUM**

The role filter chips (All / Frontend / Backend / Design / Mobile) on `/raids` are rendered but have no `onClick` handlers and no filtering logic.

- File: `app/raids/page.tsx:24-36`
- Impact: UI implies filtering capability that doesn't exist. Users see no feedback when clicking.
- Fix approach: Add `useState` for active filter, filter `raids` array by role before rendering, wire buttons to state setter.

---

### "Add Quest" Button Is Non-Functional

**Severity: MEDIUM**

The Quest Board header has a "+ Add Quest" button with no handler — it is a static element with no action.

- File: `app/raids/[id]/board/page.tsx:49-58`
- Impact: Quest creation is impossible from the UI.
- Fix approach: Implement a modal (Radix Dialog is already installed) or inline form for quest creation, backed by `POST /api/quests`.

---

### Quest Cards Have No Click Handling

**Severity: MEDIUM**

`QuestCard` renders with `cursor-pointer` CSS but has no `onClick` prop or navigation. Clicking a quest card does nothing.

- File: `components/features/quests/quest-card.tsx:20`
- Impact: Kanban board is view-only. There is no way to open, edit, or change the status of a quest.
- Fix approach: Add `onClick` prop that opens a detail/edit modal, or navigate to a quest detail page.

---

### "Apply" Button on Raid Detail Has No Handler

**Severity: MEDIUM**

The apply button on the open roles section has no `onClick` and submits nothing.

- File: `app/raids/[id]/page.tsx:112-117`
- Impact: Heroes cannot apply to join a raid.
- Fix approach: Wire to `POST /api/match { direction: 'apply', raid_role_id }` once auth is confirmed.

---

### `/captain/new` Route Exists as Directory But Has No Implementation

**Severity: HIGH**

The directory `app/captain/new/` exists and is linked from the sidebar ("Create Raid"), but contains no `page.tsx` file. Navigating to it causes a 404.

- Directory: `app/captain/new/` (empty)
- Linked from: `components/layout/app-shell.tsx:14`
- Impact: Clicking "Create Raid" in the nav leads to a broken page. This is a primary call-to-action.
- Fix approach: Implement `app/captain/new/page.tsx` with a raid creation form backed by the appropriate API endpoint.

---

### `/hero/me/edit` Route Exists as Directory But Has No Implementation

**Severity: MEDIUM**

The directory `app/hero/me/edit/` exists but has no `page.tsx`. There is no entry point to edit the hero profile.

- Directory: `app/hero/me/edit/` (empty)
- Impact: Profile editing is entirely inaccessible.
- Fix approach: Create `app/hero/me/edit/page.tsx` with a form pre-populated from the authenticated user's hero profile.

---

### `/hero/[id]` Route Exists as Directory But Has No Implementation

**Severity: MEDIUM**

The directory `app/hero/[id]/` exists but has no `page.tsx`. Public hero profiles are unreachable.

- Directory: `app/hero/[id]/` (empty)
- Impact: Captain view of individual heroes (e.g., from roll results) leads to 404.
- Fix approach: Create `app/hero/[id]/page.tsx` — a read-only version of the hero profile, similar to `app/hero/me/page.tsx`.

---

### `components/features/landing/`, `components/features/quest-board/` Are Empty Directories

**Severity: LOW**

Two feature directories exist with no files inside them — likely stubs for planned components.

- Directories: `components/features/landing/`, `components/features/quest-board/`
- Impact: No direct runtime impact, but they create structural noise and suggest unstarted work.
- Fix approach: Either populate them or remove them to keep the codebase clean.

---

## Pattern Inconsistencies

### Duplicate `SoftSkillProfile` Type Declaration

**Severity: MEDIUM**

`SoftSkillProfile` is defined twice: once in `types/index.ts` (the canonical location) and again in `components/ui/hex-radar.tsx`. The hex-radar version omits `confidence_score`, meaning the types diverge silently.

- `types/index.ts:4-12` — includes `confidence_score: 'high' | 'medium' | 'low'`
- `components/ui/hex-radar.tsx:3-10` — omits `confidence_score`
- Symptom: `roll-hero-reveal.tsx:155` uses `as any` to pass `desired_soft_profile` to `HexRadar.target`, directly caused by this mismatch.
- Fix approach: Remove the local `SoftSkillProfile` from `hex-radar.tsx` and import it from `@/types`. Update `HexRadar`'s `target` prop to accept `Partial<SoftSkillProfile>`.

---

### `STAGE_LABELS` Defined Twice

**Severity: LOW**

The mapping from `RaidStage` to display label is duplicated in two places with slightly different typings:

- `components/features/raids/raid-card.tsx:10` — typed as `Record<Raid['stage'], string>` (correct, exhaustive)
- `app/raids/[id]/page.tsx:6` — typed as `Record<string, string>` (looser)

Fix approach: Extract to `lib/raid-utils.ts` or `types/index.ts` as a shared constant and import it in both places.

---

### Inconsistent Styling Approach: CSS Variables vs. Hardcoded RGBA

**Severity: MEDIUM**

The design system uses CSS custom properties (`var(--color-dr-*)`) for theming, but multiple files bypass this by hardcoding raw RGBA values. This creates two parallel systems that can drift:

- Hardcoded color values found in:
  - `app/login/page.tsx:79-131` — `rgba(8,11,19,0.8)`, `rgba(255,255,255,0.08)`, `rgba(91,135,255,0.4)`, `#FF6B6B`
  - `app/register/page.tsx:51-151` — same color literals, duplicated
  - `components/layout/app-shell.tsx:68-153` — multiple `rgba(91,135,255,*)` literals
  - `components/features/raids/raid-card.tsx:102-118` — `rgba(91,135,255,*)` and `rgba(255,255,255,*)`
  - `app/page.tsx:32-78` — decorative SVG colors, acceptable but still raw
- Impact: A theme color change requires hunting down both CSS variables and RGBA literals across files.
- Fix approach: Add CSS variables for the glow color at various opacities (e.g., `--color-dr-glow-10`, `--color-dr-bg-raw`), then reference them everywhere.

---

### Input Styling Duplicated Between Login and Register

**Severity: MEDIUM**

The inline style object for form inputs (background, border, borderRadius, color, fontFamily, fontSize, padding, outline, transition, width) is defined identically in both auth pages.

- `app/login/page.tsx:78-90` — inlined directly on each `<input>`
- `app/register/page.tsx:50-61` — extracted to `inputStyle` const, but still duplicated per-file

Fix approach: Extract to a shared `components/ui/input.tsx` component or a shared style constant in `lib/styles.ts`. A Radix primitive or simple wrapper would eliminate the repetition entirely. Radix UI and `class-variance-authority` are already installed.

---

### Auth State Is Managed via Polling, Not a React Context

**Severity: MEDIUM**

Authentication state (current user) is fetched inside `AppShell` with a `useEffect` that fires on every path change. There is no React context, Zustand store, or any other shared state layer.

- File: `components/layout/app-shell.tsx:42-51`
- Pattern: `useEffect(..., [path])` — re-verifies token with a network call on every navigation
- Impact: Every route change triggers a `GET /api/auth/user` network request. If the backend is slow, the sidebar user display flickers. Child components have no access to auth state without prop-drilling or re-fetching.
- Fix approach: Wrap the app in a React Context that holds `user` and `setUser`, initialized once. Token verification can then be a single call on mount, not per-navigation.

---

## Security Concerns

### Auth Token Stored in localStorage

**Severity: MEDIUM**

The Sanctum bearer token is stored in `localStorage` under the key `dr_token`. This is acknowledged in a code comment as a dev/demo approach.

- File: `lib/auth-store.ts:3-4`
- Comment: `// Production upgrade path: move to httpOnly cookie via Next.js route handler.`
- Risk: XSS attacks can read `localStorage`. An httpOnly cookie is not accessible to JavaScript and is the correct production approach.
- Current mitigation: None beyond same-origin policy.
- Fix approach: Implement a Next.js route handler (`app/api/auth/login/route.ts`) that sets an httpOnly `Set-Cookie` on login, and remove the `localStorage` store entirely.

---

### No Route Protection / Auth Guard

**Severity: HIGH**

There is no middleware or per-page auth check preventing unauthenticated users from accessing protected routes. Any user can navigate directly to `/raids/1/board`, `/captain/1`, or `/hero/me` without being logged in.

- No `middleware.ts` exists at the project root.
- `AppShell` checks auth state for display purposes only — it does not redirect.
- Impact: Sensitive pages (captain dashboard, hero profile) are publicly accessible even when auth is required by business logic.
- Fix approach: Create `middleware.ts` using Next.js middleware to check for a session token (cookie or Authorization header) and redirect to `/login` for protected paths.

---

### No Input Validation Beyond `required` HTML Attribute

**Severity: MEDIUM**

Form validation relies entirely on the browser's `required` attribute and server-side errors from Laravel. There is no client-side validation library (e.g., Zod, react-hook-form).

- Files: `app/login/page.tsx`, `app/register/page.tsx`
- Impact: Invalid data (wrong email format, too-short password) is only caught after a round trip to the backend. Error display is minimal.
- Fix approach: Add Zod schema validation on form submit before the API call. The backend already returns structured `errors` per field — the frontend error handling for this is in place in `app/register/page.tsx:33-43`.

---

## Performance Concerns

### Auth Verification on Every Navigation

**Severity: MEDIUM**

As noted above, `AppShell` calls `GET /api/auth/user` on every route change via `useEffect(..., [path])`.

- File: `components/layout/app-shell.tsx:51`
- Impact: N network requests for N navigations. On a slow connection this will visibly delay the sidebar user display on each click.
- Fix approach: Move to a React Context initialized once on app mount. Re-verify the token only on explicit events (focus window, logout, specific user actions).

---

### Re-roll Uses `Math.random()` Sort — Not a Real Shuffle

**Severity: LOW**

The re-roll action shuffles candidates using `[...prev].sort(() => Math.random() - 0.5)`, which is a known biased sorting approach (not a true Fisher-Yates shuffle).

- File: `components/features/captain/captain-roll-section.tsx:47-49`
- Impact: Minor bias in shuffle results. Not a correctness bug in the demo context, but should be fixed before production.
- Fix approach: Replace with a proper Fisher-Yates shuffle utility.

---

### Installed Dependencies with No Apparent Usage

**Severity: LOW**

Several packages in `package.json` have no visible usage in the source code:

- `@chenglou/pretext` (`^0.0.3`) — unknown, found only in node_modules demos
- `@radix-ui/react-avatar` — HeroCard uses a plain `<div>` fallback, not `Radix Avatar`
- `@radix-ui/react-dialog` — no modal/dialog components found in source
- `@radix-ui/react-dropdown-menu` — no dropdown found in source
- `@radix-ui/react-progress` — no progress bar found in source
- `@radix-ui/react-separator` — no separator component found in source
- `@radix-ui/react-tooltip` — no tooltip found in source
- `lucide-react` — no Lucide icons found in source

Impact: Increased bundle size and installation time. `framer-motion` (`^12.6.3`) is used only in one component (`roll-hero-reveal.tsx`) but is a heavy dependency.
Fix approach: Audit and remove unused packages. Consider lazy-loading framer-motion for the roll reveal feature.

---

## Fragile Areas

### Captain View Uses Raid ID, Not Captain User ID — Potential Access Confusion

**Severity: MEDIUM**

The captain dashboard URL is `/captain/[id]` where `id` is the **raid ID**, not the captain's user ID. The "Captain View →" link in `app/raids/[id]/page.tsx:68` points to `/captain/${raid.id}`, not `/captain/${raid.captain_user_id}`.

- File: `app/raids/[id]/page.tsx:68`
- Impact: If the route is ever changed to be user-scoped (e.g., "captain profile"), all existing links break. The current structure conflates captain management of a specific raid with a captain's identity.
- Fix approach: Clarify intent. If the page is "captain's view of their raid", rename to `/raids/[id]/captain` for clarity.

---

### `description` Field Is Always Empty in Mock Data

**Severity: LOW**

All four MOCK_RAIDS objects have `description: ''`. The `Raid` type has `description: string` (required, not optional).

- File: `lib/mock-data.ts:9,21,34,47`
- Impact: If any component renders `raid.description`, it silently shows nothing. The field distinction between `mission` (shown in UI) and `description` (never used) is unclear.
- Fix approach: Either populate `description` in mocks, make it optional in `types/index.ts`, or remove it if `mission` serves the same purpose.

---

### `HexRadar` Receives `desired_soft_profile as any`

**Severity: MEDIUM**

The target overlay on `HexRadar` is passed with `as any` to work around the type mismatch between `Partial<SoftSkillProfile>` (from `RaidRole`) and `SoftSkillProfile` (expected by `HexRadar`).

- File: `components/features/raids/roll-hero-reveal.tsx:155`
- Code: `target={candidate.role.desired_soft_profile as any}`
- Impact: The `HexRadar` target prop will receive a partial object (missing axes default to `undefined`), causing `NaN` in SVG coordinate calculations when `profileToPoints` divides `undefined / 100`. This renders as invisible or broken polygon paths.
- Fix approach: Fix the root type duplication (see "Duplicate SoftSkillProfile" above), then update `HexRadar` to accept `Partial<SoftSkillProfile>` for `target` and handle missing keys with `?? 0`.

---

### Landing Page Stats Are Hardcoded

**Severity: LOW**

The landing page hero section shows "48 Active Raids", "230 Heroes Online", "12 Shipped · Last Month" as static strings.

- File: `app/page.tsx:11-14`
- Impact: These numbers never update and will become stale or misleading.
- Fix approach: Fetch from a public stats endpoint, or clearly label them as "illustrative" if they are marketing copy.

---

### Fit Score on Raid Board Is Hardcoded by Raid ID

**Severity: HIGH**

The `fitScore` prop passed to `RaidCard` components is determined by a hardcoded ID comparison, not by any actual matching algorithm.

- File: `app/raids/page.tsx:46`
- Code: `fitScore={raid.id === '1' ? 91 : raid.id === '4' ? 78 : undefined}`
- Impact: Fit scores are fake and tied to specific mock IDs. When real data is loaded, fit scores will all show as undefined (no badge displayed) unless this is replaced.
- Fix approach: Compute fit score server-side from the matching API, or fetch pre-computed scores alongside the raid list endpoint.

---

## Test Coverage Gaps

### No Tests Exist

**Severity: HIGH**

There are zero test files in the project. No unit tests, integration tests, or end-to-end tests.

- No `jest.config.*`, `vitest.config.*`, or `playwright.config.*` found
- No `.test.ts`, `.test.tsx`, `.spec.ts`, or `.spec.tsx` files anywhere in `app/`, `components/`, or `lib/`
- Impact: All logic (API client, auth store, type guards, UI components) is untested. Regressions will not be caught automatically.
- Priority: High — particularly critical for `lib/api.ts` (network layer) and `lib/auth-store.ts` (security-adjacent).
- Fix approach: Add Vitest for unit tests. Start with `lib/api.ts` response parsing and `lib/auth-store.ts` get/set/clear cycles. Add Playwright for E2E auth flows (login → protected page → logout).

---

*Concerns audit: 2026-04-01*
