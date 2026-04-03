# Testing Patterns

**Analysis Date:** 2026-04-01

## Test Framework

**Runner:** None installed.

No test runner (Jest, Vitest, Playwright, Cypress) is present in `package.json` — neither in `dependencies` nor `devDependencies`.

**Assertion Library:** None.

**Config files:** None (`jest.config.*`, `vitest.config.*`, `playwright.config.*` — not found).

**Run Commands:**
```bash
# No test commands configured
# package.json scripts: { "dev", "build", "start", "lint" }
```

## Current State: No Tests

The project has zero test files. The only test-like files in the repository are inside `node_modules/` (framework internals for `next`, `tsconfig-paths`, etc.) and are not project-authored.

**What this means for contributors:**
- There is no test suite to run or maintain at this time
- TypeScript strict mode (`"strict": true`) and `next lint` serve as the only automated quality gates
- The `lint` script runs `next lint` (ESLint with `eslint-config-next`) on every `npm run build` or explicit invocation

## What Would Need Testing (if introduced)

Based on the codebase structure, the highest-value test targets would be:

**Unit tests — pure logic:**
- `lib/utils.ts` — `cn()` function (clsx + tailwind-merge)
- `lib/auth-store.ts` — localStorage read/write/clear/isAuthenticated methods (requires jsdom)
- `lib/api.ts` — `req()` wrapper: error handling, header construction, JSON parsing (requires fetch mock)
- `types/index.ts` — no runtime logic, but type tests via `tsd` or `vitest` type assertions

**Integration / component tests:**
- `components/layout/app-shell.tsx` — auth state loading on mount, logout flow, active nav highlighting
- `app/login/page.tsx` — form submission, error display, redirect on success
- `app/register/page.tsx` — form validation, API call, redirect

**Visual / snapshot:**
- `components/ui/card.tsx` — Card, CardHeader, CardBody, CardFooter, StatusBadge, RoleChip
- `components/ui/hex-radar.tsx` — SVG output for given profile data
- `components/features/raids/raid-card.tsx` — renders correctly with/without `fitScore`, with/without captain

## Recommended Setup (if tests are introduced)

**Suggested stack for this codebase:**

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/user-event
```

**Suggested `vitest.config.ts`:**
```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
})
```

**Test file placement convention (recommended):**
- Co-locate with source: `components/ui/card.test.tsx` alongside `card.tsx`
- Or flat `__tests__/` directory per feature folder

**Naming convention (recommended):**
- `[name].test.tsx` for components
- `[name].test.ts` for utilities and stores

## Mock Strategies (when tests are added)

**Fetch / API calls:**
- Mock `global.fetch` with `vi.fn()` or use `msw` (Mock Service Worker) for integration tests
- The `req()` function in `lib/api.ts` wraps all fetch calls — mock at fetch level, not `api.*` level

**localStorage:**
- `jsdom` environment provides `localStorage` automatically
- Use `localStorage.clear()` in `beforeEach` to reset `authStore` state between tests

**Next.js routing:**
- Mock `useRouter`, `usePathname` from `next/navigation`:
  ```ts
  vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: vi.fn() }),
    usePathname: () => '/raids',
  }))
  ```

**`next/font/google`:**
- Must be mocked in test environment as it makes network calls:
  ```ts
  vi.mock('next/font/google', () => ({
    Cinzel: () => ({ variable: '--font-fantasy', className: '' }),
    JetBrains_Mono: () => ({ variable: '--font-mono', className: '' }),
    Sora: () => ({ variable: '--font-sans', className: '' }),
  }))
  ```

## Coverage

**Current targets:** None enforced (no test tooling configured).

**Suggested minimum when introduced:**
- Branches: 70%
- Functions: 80%
- Focus on `lib/` modules first — they contain all pure logic

## CI/CD Integration

**Current state:** No CI pipeline detected (no `.github/workflows/`, no `Dockerfile`, no CI config files found).

**Lint** is the only automated check:
```bash
npm run lint   # next lint
npm run build  # also runs type checking via next build
```

**Recommended CI steps when tests are added:**
```yaml
- run: npm run lint
- run: npm run build   # catches TypeScript errors
- run: npm test        # vitest run
```

---

*Testing analysis: 2026-04-01*
