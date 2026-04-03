# Coding Conventions

**Analysis Date:** 2026-04-01

## Naming Patterns

**Files:**
- React components: kebab-case, `.tsx` — `raid-card.tsx`, `hero-card.tsx`, `app-shell.tsx`
- Library/utility modules: kebab-case, `.ts` — `auth-store.ts`, `mock-data.ts`
- Page files: `page.tsx`, layout: `layout.tsx` (Next.js App Router convention)
- UI primitives: short descriptive name — `card.tsx`, `hex-radar.tsx`

**Components (React):**
- PascalCase named exports — `RaidCard`, `HeroCard`, `AppShell`, `HexRadar`
- Default exports reserved for Next.js pages/layouts — `LoginPage`, `RaidBoardPage`, `RootLayout`
- Internal helper sub-components: PascalCase, defined above the main export — `HexMark` inside `app-shell.tsx`

**Functions:**
- camelCase for all non-component functions — `handleSubmit`, `handleLogout`, `hexPoint`, `profileToPoints`
- Event handlers prefixed with `handle` — `handleSubmit`, `handleLogout`

**Variables and Constants:**
- SCREAMING_SNAKE_CASE for module-level static data — `MOCK_RAIDS`, `NAV`, `AXES`, `STATS`, `ROLE_COLOR`, `STAGE_LABELS`, `STATUS_STYLES`, `AVAILABILITY_STATUS`
- camelCase for all other variables — `openRoles`, `openNames`, `primaryRole`, `accentColor`
- Single-letter names avoided; `_key` prefix used for intentionally unused variables (`{ key: _key }`)

**Types and Interfaces:**
- PascalCase for all types and interfaces — `RaidCardProps`, `HeroCardProps`, `SoftSkillProfile`, `ApiResponse`
- Props interfaces named `[ComponentName]Props` — `CardRootProps`, `RaidCardProps`
- Type aliases for union strings — `RaidStage`, `RaidStatus`, `MatchDirection`, `StatusVariant`
- Discriminated union helpers via `type Ok<T>` / `type Err` pattern in `lib/api.ts`

**CSS Custom Properties:**
- All design tokens prefixed with `--color-dr-`, `--font-`, `--radius-`
- Semantic naming: `--color-dr-role-frontend`, `--color-dr-status-recruiting`
- Utility classes prefixed with `dr-` — `.dr-card`, `.dr-btn-primary`, `.dr-label`, `.dr-title-fantasy`

## Code Style

**Formatting:**
- No Prettier config present — formatting is enforced by developer convention
- Single quotes for JS/TS string literals — `'use client'`, `'@/lib/utils'`
- Single quotes also in CSS values where applicable
- Trailing commas on multi-line objects and arrays (observed throughout)
- Semicolons omitted — project is semicolon-free
- 2-space indentation

**Linting:**
- ESLint via `eslint-config-next` (Next.js default rule set)
- No custom `.eslintrc` or `eslint.config.*` at project root — relies entirely on Next.js defaults
- Run via: `npm run lint` → `next lint`

**Vertical alignment style:**
- Object properties aligned with extra spaces for readability, especially in constant maps:
  ```ts
  const TOKEN_KEY = 'dr_token'
  const USER_KEY  = 'dr_user'
  // vs
  { id: number; username: string; email: string; bio?: string }
  ```
- Section separators use `// ── Description ───` comment style throughout

## TypeScript Usage

**Strictness:**
- `"strict": true` in `tsconfig.json` — all strict checks enabled
- `noEmit: true` — TypeScript only for type-checking, not compilation
- Target: `ES2017`, module resolution: `bundler`

**Patterns:**
- `interface` for object shapes (component props, API responses, domain entities)
- `type` for union types, aliases, and conditional types — `RaidStage`, `ApiResponse<T>`, `Ok<T>`
- `Pick<T, K>` used to express partial entity references — `Pick<HeroProfile, 'id' | 'display_name' | 'avatar_url'>`
- `Partial<T>` for optional profile overlays — `Partial<SoftSkillProfile>`
- `Record<K, V>` for lookup tables — `Record<StatusVariant, string>`, `Record<string, string>`
- Generic functions typed explicitly — `req<T>(method, path, body?, token?): Promise<ApiResponse<T>>`
- `type` imports used consistently — `import type { Metadata } from 'next'`, `import type { RollCandidate } from '@/types'`
- `as const` used on tuple/array literals — `] as const` in `hex-radar.tsx` for `AXES`
- Optional chaining used liberally — `user.username?.[0]`, `hero.avatar_url`, `json.message ?? 'fallback'`
- Nullish coalescing preferred over `||` — `authStore.getUser() ?? null`

**Avoidance:**
- No `any` types observed
- No non-null assertions (`!`) observed
- `unknown` used in generic API wrapper body param — `body?: unknown`

## Import Organization

**Order (observed pattern):**
1. React/Next.js framework imports — `'use client'` directive first, then `import { useState } from 'react'`, `import Link from 'next/link'`
2. Internal `@/` aliased imports — `import { cn } from '@/lib/utils'`, `import { authStore } from '@/lib/auth-store'`
3. Type imports separated when possible — `import type { ApiUser } from './api'`

**Path Aliases:**
- `@/*` maps to project root `./*` — configured in `tsconfig.json`
- Use `@/components/...`, `@/lib/...`, `@/types` consistently
- Relative imports (`./api`) used only within the same `lib/` directory

**No barrel files** — each module imported directly by path. No `index.ts` re-exports detected.

## Component Structure Patterns

**Named exports for all reusable components:**
```tsx
// Correct pattern
export function RaidCard({ raid, fitScore, onClick }: RaidCardProps) { ... }
export function Card({ children, className, onClick, glowing }: CardRootProps) { ... }
```

**Default exports only for Next.js route files:**
```tsx
// app/raids/page.tsx
export default function RaidBoardPage() { ... }
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) { ... }
```

**Props interface always declared immediately above the component:**
```tsx
interface RaidCardProps {
  raid: Raid
  fitScore?: number
  onClick?: () => void
}

export function RaidCard({ raid, fitScore, onClick }: RaidCardProps) { ... }
```

**'use client' directive:**
- Placed at the very top of the file, before imports, when client-side hooks are needed
- Pages using `useState`, `useRouter`, `usePathname`, `useEffect` are marked `'use client'`
- Server Components (pages without interactivity) have no directive — `raids/page.tsx`, `app/page.tsx`

**Constant lookup tables** defined at module scope, above the component, in SCREAMING_SNAKE_CASE:
```tsx
const STAGE_LABELS: Record<Raid['stage'], string> = { idea: 'Idea', planning: 'Planning', ... }
```

**Internal sub-components** defined as plain functions above the main export when small and file-scoped:
```tsx
function HexMark() { return <svg>...</svg> }
export function AppShell(...) { ... }
```

## CSS / Styling Approach

**Stack:** Tailwind CSS v4 + custom CSS design system, with inline `style` for dynamic values.

**Three layers of styling in use:**

1. **Global CSS utility classes** (`app/globals.css`) — project-specific design system:
   - `.dr-card` — glassmorphism card base
   - `.dr-btn-primary` / `.dr-btn-secondary` — button variants
   - `.dr-label` — JetBrains Mono uppercase label typography
   - `.dr-title-fantasy` — Cinzel serif heading
   - `.dr-text-gold` / `.dr-text-glow` — gradient text effects
   - `.dr-enter`, `.dr-enter-2` ... — staggered CSS animation entrance classes
   - `.dr-divider`, `.dr-aurora`, `.dr-noise`, `.dr-app` — layout/atmosphere layers

2. **Tailwind utility classes** — for spacing, layout, sizing, flex/grid:
   ```tsx
   className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm transition-all"
   ```
   - Tailwind v4 `@theme` block used in `globals.css` to register design tokens as CSS variables

3. **Inline `style` prop** — for dynamic or token-based values not expressible in Tailwind:
   ```tsx
   style={{ color: 'var(--color-dr-gold)', background: `color-mix(in srgb, ${colorVar} 12%, transparent)` }}
   ```

**`cn()` utility** from `lib/utils.ts` used for conditional class merging:
```tsx
import { cn } from '@/lib/utils'
// clsx + tailwind-merge
className={cn('base-classes', condition && 'conditional-class', className)}
```

**Color system:**
- All colors defined as CSS custom properties with `--color-dr-*` prefix in `@theme` block
- Never hardcode hex values except in `globals.css` where tokens are defined
- Use `color-mix(in srgb, var(--color-dr-role-frontend) 12%, transparent)` for alpha variants

**Arbitrary values** used for Tailwind when CSS variable needed inline:
```tsx
className="text-[var(--color-dr-text)] border-[var(--color-dr-edge)]"
```

**No CSS Modules, no styled-components, no Emotion** — styling is entirely Tailwind + global CSS classes + inline style.

---

*Convention analysis: 2026-04-01*
