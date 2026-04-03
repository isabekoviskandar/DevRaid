# External Integrations

**Analysis Date:** 2026-04-01

## APIs & External Services

**Custom Backend (Primary):**
- Laravel 11 REST API — all application data (auth, raids, heroes, quests, matches)
  - SDK/Client: custom `fetch`-based wrapper at `lib/api.ts`
  - Auth: Bearer token (Laravel Sanctum)
  - Local URL: `http://localhost:8000`
  - Production URL: `process.env.NEXT_PUBLIC_API_URL`
  - Endpoints used:
    - `POST /api/auth/login`
    - `POST /api/auth/register`
    - `POST /api/auth/logout`
    - `GET  /api/auth/user`

**Google Fonts (via Next.js font subsystem):**
- Fonts fetched at build time via `next/font/google`; no runtime dependency
- Fonts: Cinzel, JetBrains Mono, Sora
- No API key required

## Data Storage

**Databases:**
- None directly — all data accessed through Laravel backend API

**File Storage:**
- Not applicable — no direct storage integration in the frontend

**Caching:**
- None — no client-side caching layer beyond React state and localStorage

## Authentication & Identity

**Auth Provider:**
- Custom (Laravel Sanctum token-based auth)
  - Implementation: `lib/api.ts` + `lib/auth-store.ts`
  - Token storage: `localStorage` under key `dr_token`
  - User cache: `localStorage` under key `dr_user`
  - Flow: POST credentials → receive `{ user, token }` → store in localStorage → attach `Authorization: Bearer <token>` to subsequent requests
  - Session verification: `GET /api/auth/user` called on every navigation (in `AppShell` via `useEffect`)
  - Logout: `POST /api/auth/logout` + `localStorage.clear()`
  - Upgrade path noted in code: move to httpOnly cookie via Next.js route handler

**No third-party auth provider** (no Clerk, NextAuth, Auth0, Supabase Auth, etc.)

## Monitoring & Observability

**Error Tracking:**
- None — no Sentry, Datadog, or similar SDK found

**Analytics:**
- None — no Google Analytics, Plausible, PostHog, or similar found

**Logs:**
- No structured logging library; errors surfaced as `ApiResponse<T>` error strings from `lib/api.ts`

## Payment Processors

- None — no payment integration found

## CDN & Storage

- None — no S3, Cloudinary, Cloudflare R2, or similar

## Email Services

- None — no email SDK (Resend, SendGrid, Nodemailer, etc.) found

## CI/CD & Deployment

**Hosting:**
- Not configured — no `Dockerfile`, `vercel.json`, `.github/workflows/`, or platform config found

**CI Pipeline:**
- None detected

## Environment Configuration

**Required env vars:**
- `NEXT_PUBLIC_API_URL` — Base URL of the Laravel backend (e.g., `https://api.devraid.uz`)

**Secrets location:**
- `.env.local` file present at project root (contents not read)
- Only one public env var in source code; no server-side secrets expected in frontend

## Webhooks & Callbacks

**Incoming:**
- None — no `/api/` route handlers found in `app/`

**Outgoing:**
- None

## Mock / Stub Data

- `lib/mock-data.ts` — static mock data for Raids, HeroProfile, Quests, RollCandidates
- Used directly in feature components during development before real API endpoints are wired up
- No feature flag system controlling mock vs. real data — switching is done manually in component imports

---

*Integration audit: 2026-04-01*
