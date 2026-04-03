# Technology Stack

**Analysis Date:** 2026-04-01

## Languages

**Primary:**
- TypeScript ^5 — all source files (`.ts`, `.tsx`)
- CSS — global styles via `app/globals.css` using Tailwind v4 `@theme` directive

**Secondary:**
- JavaScript — config files (`postcss.config.mjs`, `next.config.ts`)

## Runtime

**Environment:**
- Node.js ^22 (inferred from `@types/node: ^22`)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js ^15.2.4 — App Router, SSR/CSR hybrid, file-based routing
- React ^19.0.0 — UI rendering, hooks
- React DOM ^19.0.0 — DOM bindings

**Build/Dev:**
- Next.js built-in bundler (Turbopack/Webpack via `next dev` / `next build`)
- PostCSS ^8 — CSS processing via `postcss.config.mjs`
- `@tailwindcss/postcss` ^4 — PostCSS plugin for Tailwind v4

## Key Dependencies

**UI Primitives (Radix UI):**
- `@radix-ui/react-avatar` ^1.1.4 — accessible avatar component
- `@radix-ui/react-dialog` ^1.1.6 — modal dialogs
- `@radix-ui/react-dropdown-menu` ^2.1.6 — dropdown menus
- `@radix-ui/react-progress` ^1.1.2 — progress bars
- `@radix-ui/react-separator` ^1.1.2 — visual separators
- `@radix-ui/react-slot` ^1.1.2 — polymorphic slot pattern
- `@radix-ui/react-tooltip` ^1.1.8 — tooltip overlays

**Styling:**
- Tailwind CSS ^4 — utility-first CSS, configured via `@theme` in CSS (no `tailwind.config.js`)
- `class-variance-authority` ^0.7.1 — variant-based component class generation (cva)
- `clsx` ^2.1.1 — conditional className merging
- `tailwind-merge` ^3.0.2 — Tailwind class conflict resolution

**Animation:**
- `framer-motion` ^12.6.3 — declarative animations, used in `components/features/raids/roll-hero-reveal.tsx`

**Icons:**
- `lucide-react` ^0.487.0 — SVG icon library (declared in package.json; no source imports found yet)

**Fonts (Google Fonts via next/font):**
- Cinzel — fantasy/display font, CSS var `--font-fantasy`
- JetBrains Mono — monospace, CSS var `--font-mono`
- Sora — primary sans-serif, CSS var `--font-sans`

**Experimental:**
- `@chenglou/pretext` ^0.0.3 — purpose unclear, no source usage found; likely an experimental/test dependency

**Utilities:**
- `lucide-react` ^0.487.0 — icon set

## TypeScript Configuration

- Target: `ES2017`
- Module resolution: `bundler`
- Strict mode: enabled
- Path alias: `@/*` → `./*` (project root)
- JSX: `preserve` (handled by Next.js)

## Configuration

**Environment:**
- `.env.local` present (contents not read)
- Single public env var in source: `NEXT_PUBLIC_API_URL` — backend base URL
- Fallback: `http://localhost:8000` (Laravel backend on local)

**Build:**
- `next.config.ts` — minimal config; sets `outputFileTracingRoot` for deployment tracing
- `postcss.config.mjs` — single plugin: `@tailwindcss/postcss`
- `tsconfig.json` — strict TypeScript, incremental builds

## Platform Requirements

**Development:**
- Node.js ^22
- npm (lockfile committed)
- Laravel backend running on port 8000 (`http://localhost:8000`)

**Production:**
- Deployment target: not explicitly configured (default Next.js Node.js server)
- `NEXT_PUBLIC_API_URL` must be set to production backend URL

---

*Stack analysis: 2026-04-01*
