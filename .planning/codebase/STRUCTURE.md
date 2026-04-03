# Codebase Structure

**Analysis Date:** 2026-04-01

## Directory Layout

```
devraid-front/
├── app/                        # Next.js App Router — routes and pages
│   ├── layout.tsx              # Root layout: fonts, bg layers, AppShell wrapper
│   ├── page.tsx                # Landing page (/)
│   ├── globals.css             # Design tokens (CSS vars), utility classes, animations
│   ├── captain/
│   │   ├── [id]/
│   │   │   └── page.tsx        # Captain dashboard (raid management, Roll Hero)
│   │   └── new/                # Create raid — directory only, no page yet
│   ├── hero/
│   │   ├── me/
│   │   │   ├── page.tsx        # My hero profile view
│   │   │   └── edit/           # Edit profile — directory only, no page yet
│   │   └── [id]/               # Public hero profile — directory only, no page yet
│   ├── login/
│   │   └── page.tsx            # Login form ('use client')
│   ├── raids/
│   │   ├── page.tsx            # Raid board list
│   │   └── [id]/
│   │       ├── page.tsx        # Raid detail + open roles
│   │       └── board/
│   │           └── page.tsx    # Quest board (Kanban)
│   └── register/
│       └── page.tsx            # Registration form ('use client')
│
├── components/
│   ├── features/               # Domain-scoped feature components
│   │   ├── captain/
│   │   │   └── captain-roll-section.tsx   # Roll Hero reveal toggle ('use client')
│   │   ├── hero/
│   │   │   └── hero-card.tsx              # Hero profile card (Server Component)
│   │   ├── landing/                       # Landing-specific components (empty dir)
│   │   ├── quest-board/                   # Quest board components (empty dir)
│   │   ├── quests/
│   │   │   └── quest-card.tsx             # Quest Kanban card
│   │   └── raids/
│   │       ├── raid-card.tsx              # Raid listing card (Server Component)
│   │       └── roll-hero-reveal.tsx       # Animated candidate list ('use client', Framer Motion)
│   ├── layout/
│   │   └── app-shell.tsx                  # Sidebar nav + main wrapper ('use client')
│   └── ui/
│       ├── card.tsx                       # Card anatomy + StatusBadge + RoleChip
│       └── hex-radar.tsx                  # SVG soft-skill hexagonal radar ('use client')
│
├── lib/
│   ├── api.ts                  # HTTP client — fetch wrapper, auth endpoints, ApiResponse<T> type
│   ├── auth-store.ts           # localStorage auth token/user cache (client-only)
│   ├── mock-data.ts            # Static mock: MOCK_RAIDS, MOCK_HERO, MOCK_QUESTS, MOCK_CANDIDATES
│   └── utils.ts                # cn() helper (clsx + tailwind-merge)
│
├── types/
│   └── index.ts                # All domain types: HeroProfile, Raid, RaidRole, Quest, RollCandidate, etc.
│
├── .planning/
│   └── codebase/               # Codebase analysis documents (this file)
│
├── next.config.ts              # Minimal Next.js config (outputFileTracingRoot only)
├── tsconfig.json               # TypeScript config — strict mode, @/* path alias
├── postcss.config.mjs          # PostCSS with @tailwindcss/postcss
└── package.json                # Dependencies and scripts
```

## Directory Purposes

**`app/`:**
- Next.js App Router. Every `page.tsx` is a route segment.
- `layout.tsx` wraps all routes with `AppShell` (sidebar + main area) and loads Google Fonts.
- `globals.css` contains all design tokens as CSS custom properties (`--color-dr-*`), reusable utility classes (`.dr-card`, `.dr-btn-primary`, `.dr-label`, `.dr-title-fantasy`, etc.), and CSS keyframe animations (`.dr-enter`, `.dr-aurora`).
- Pages are Server Components by default; add `'use client'` only when the page itself needs React hooks.

**`components/features/`:**
- Feature-scoped components. One directory per domain area.
- Components here accept typed props and render domain-specific UI.
- They may be Server Components (no hooks, no state) or Client Components (`'use client'`).
- Do NOT import from `app/` — dependency goes one way only: `app/` → `components/`.

**`components/layout/`:**
- Persistent shell components that wrap the entire app.
- `app-shell.tsx` is the only file. It is `'use client'` because it manages auth state from `localStorage`.

**`components/ui/`:**
- Reusable primitives with no domain knowledge.
- `card.tsx` exports: `Card`, `CardHeader`, `CardBody`, `CardFooter`, `StatusBadge`, `RoleChip`.
- `hex-radar.tsx` exports: `HexRadar` (SVG radar chart for soft-skill profiles).

**`lib/`:**
- Utilities and services with no React dependencies (except `auth-store.ts` which checks `typeof window`).
- `api.ts` is the single place all backend HTTP calls originate from.
- `mock-data.ts` is the current data source for all non-auth features.

**`types/`:**
- Single `index.ts` file. All domain types live here — no type declarations scattered across feature files.
- Types mirror the Laravel backend entity model.

## Key File Locations

**Entry Points:**
- `app/layout.tsx` — Root HTML structure, fonts, `AppShell` mount
- `app/page.tsx` — Landing page (/)

**Design System:**
- `app/globals.css` — All CSS custom properties (design tokens), component utility classes, animation keyframes

**API Integration:**
- `lib/api.ts` — All backend endpoints. Add new API calls here.
- `lib/auth-store.ts` — Auth persistence. Token key: `dr_token`, user key: `dr_user`.

**Mock Data:**
- `lib/mock-data.ts` — Replace individual exports with real `fetch()` calls as backend endpoints become available.

**Domain Types:**
- `types/index.ts` — Add new types here. Import as `import type { Foo } from '@/types'`.

**Shared Utility:**
- `lib/utils.ts` — `cn()` for className merging. Use everywhere instead of string concatenation.

## How Features Are Organized

Features map to route segments (`app/`) and a parallel feature component directory (`components/features/`):

| Feature | Route | Page File | Feature Components |
|---------|-------|-----------|-------------------|
| Landing | `/` | `app/page.tsx` | (inline in page) |
| Raid Board | `/raids` | `app/raids/page.tsx` | `components/features/raids/raid-card.tsx` |
| Raid Detail | `/raids/[id]` | `app/raids/[id]/page.tsx` | `components/ui/card.tsx` (StatusBadge, RoleChip) |
| Quest Board | `/raids/[id]/board` | `app/raids/[id]/board/page.tsx` | `components/features/quests/quest-card.tsx` |
| Captain Dashboard | `/captain/[id]` | `app/captain/[id]/page.tsx` | `components/features/captain/captain-roll-section.tsx`, `components/features/raids/roll-hero-reveal.tsx` |
| Hero Profile | `/hero/me` | `app/hero/me/page.tsx` | `components/ui/hex-radar.tsx` |
| Auth | `/login`, `/register` | inline in page | `lib/api.ts`, `lib/auth-store.ts` |

## Naming Conventions

**Files:**
- Pages: `page.tsx` (required by Next.js App Router)
- Components: `kebab-case.tsx` — e.g., `raid-card.tsx`, `captain-roll-section.tsx`, `roll-hero-reveal.tsx`
- Library modules: `kebab-case.ts` — e.g., `auth-store.ts`, `mock-data.ts`

**Directories:**
- Route segments: `kebab-case` matching URL path (e.g., `quest-board/`, `[id]/`)
- Feature directories: `kebab-case` matching domain noun (e.g., `raids/`, `captain/`, `quest-board/`)

**Components (exports):**
- PascalCase named exports — e.g., `export function RaidCard(...)`, `export function AppShell(...)`
- Pages: default exports — `export default function RaidBoardPage()`

**Types:**
- Interfaces: PascalCase — `HeroProfile`, `RaidRole`, `RollCandidate`
- Type aliases: PascalCase — `RaidStage`, `QuestStatus`, `MatchDirection`

**CSS classes (design system):**
- Prefix `dr-` for all custom utility classes — `dr-card`, `dr-btn-primary`, `dr-label`, `dr-title-fantasy`, `dr-text-gold`, `dr-enter`, `dr-aurora`
- CSS variables: `--color-dr-*` for colours, `--font-*` for font variables, `--radius-*` for border radii

## Where to Add New Code

**New page/route:**
- Create `app/[route-name]/page.tsx`
- Server Component by default; add `'use client'` only if the page itself needs hooks
- Import data from `lib/mock-data.ts` (temporary) or via `fetch()` + `lib/api.ts`

**New feature component:**
- Create `components/features/[domain]/[component-name].tsx`
- Add to the matching domain directory (e.g., raids, hero, captain, quests)
- Export as named function: `export function MyComponent(...)`
- Keep as Server Component unless interactivity requires `'use client'`

**New UI primitive:**
- Add to `components/ui/` only if genuinely reusable across multiple features
- Export from the same file (no barrel index in `ui/`)

**New API endpoint:**
- Add a method to the `api` object in `lib/api.ts`
- Follow the existing pattern: `req<ReturnType>('METHOD', '/api/path', body?, token?)`
- Define response types in `types/index.ts` if they introduce new entities

**New domain type:**
- Add to `types/index.ts`
- Use `export interface` for object shapes, `export type` for unions/aliases

**New mock data:**
- Add to `lib/mock-data.ts` with an `export const MOCK_*` naming convention

## Special Directories

**`.planning/codebase/`:**
- Purpose: Codebase analysis documents for AI-assisted planning
- Generated: By GSD mapping commands
- Committed: Yes

**`.next/`:**
- Purpose: Next.js build output and cache
- Generated: Yes
- Committed: No (in .gitignore)

**`node_modules/`:**
- Purpose: npm dependencies
- Generated: Yes
- Committed: No

---

*Structure analysis: 2026-04-01*
