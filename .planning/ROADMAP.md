# Roadmap: DevRaid Frontend MVP

## Overview

MVP для хакатона: Auth Guard + реальные данные пользователя → форма создания Рейда + Apply Modal. Дизайн-система "Obsidian Citadel" уже готова. Цель — закрыть 4 ключевых функции для демо.

**Update 2026-04-03:** Added post-MVP **Phase 13** for auth guard consistency (localStorage + middleware cookie sync) and auth-page shell cleanup.

## Phases

- [x] **Phase 1: Auth Hardening & Hero Profile** — Done
- [x] **Phase 2: Raid Actions** — Done
- [x] **Phase 3: Hero Profile Edit** — Done
- [x] **Phase 4: Design System Refresh** — Done (see phase 04 summaries)
- [x] **Phase 5: Onboarding & Soft Skill Generation** — Done; gap closure 2026-04-03 (build green)
- [x] **Phase 6: Hexagon Radar Chart** — Done (`06-01-SUMMARY`, `06-02-SUMMARY`, `06-VERIFICATION.md`)
- [x] **Phase 7: Roll Hero** — Done mock (`07-EXECUTION-SUMMARY.md`)
- [x] **Phase 8: Raid Board** — Done mock — filters + live search (`08-EXECUTION-SUMMARY.md`)
- [x] **Phase 9: Captain Board** — Partial mock — заявки на `/captain/[id]`; **09-02** не сделан (`09-EXECUTION-SUMMARY.md`)
- [x] **Phase 10: Onboarding Metrics API Migration** — Done (`10-01-PLAN.md`, `10-01-SUMMARY.md`)
- [x] **Phase 11: Hydration + Favicon Stability** — Done (`11-01-PLAN.md`, `11-01-SUMMARY.md`)
- [x] **Phase 12: Local API Endpoint Alignment** — Done (`12-01-PLAN.md`, `12-01-SUMMARY.md`)
- [x] **Phase 13: Auth Guard Consistency** — Done (`13-01-PLAN.md`, `13-01-SUMMARY.md`)
- [x] **Phase 14: Demo Day Visual Overhaul** — Done ✅ (`14-CONTEXT.md`, `14-01-PLAN.md`, `14-01-SUMMARY.md`)

---

## Milestone v1.1 — Emerald Guild: Fantasy UI Immersion

- [x] **Phase 15: Design System 2.0** — CSS tokens, glassmorphism v2, motion tokens, z-index ladder (completed 2026-04-03)
- [x] **Phase 16: Component Library** — New + modified UI/feature components (completed 2026-04-03)
- [ ] **Phase 17: Page Redesigns** — All major pages assembled from Phase 16 components
- [ ] **Phase 18: Animations + FX** — GSAP ScrollTrigger, typewriter, Howler.js sound, particles

## Phase Details

### Phase 1: Auth Hardening & Hero Profile
**Goal**: Залогиненный пользователь видит свои реальные данные. Незалогиненный не может попасть в /captain/*.
**Depends on**: Nothing (first phase)
**Requirements**: AUTH-03, HERO-01
**Success Criteria** (what must be TRUE):
  1. Открыть /captain/new без токена → автоматический редирект на /login
  2. Войти → зайти на /hero/me → видно реальное имя и email из API
  3. Выйти → /hero/me не крашится (graceful fallback)
**Plans**: TBD

Plans:
- [ ] 01-01: Auth guard для /captain/* + /hero/me real user data

### Phase 2: Raid Actions
**Goal**: Капитан создаёт рейд. Герой подаёт заявку. Оба флоу работают с premium Obsidian Citadel дизайном.
**Depends on**: Phase 1
**Requirements**: CAPTAIN-01, CAPTAIN-02, CAPTAIN-03, CAPTAIN-04, RAID-01, RAID-02, RAID-03
**Success Criteria** (what must be TRUE):
  1. /captain/new рендерится с glass-дизайном и premium UX
  2. Можно добавить несколько ролей и удалить любую динамически
  3. Apply кнопка в /raids/[id] открывает modal с анимацией Framer Motion
  4. Submit в modal показывает success-state пользователю
**Plans**: TBD

Plans:
- [x] 02-01: Страница /captain/new — форма создания рейда
- [x] 02-02: Apply Modal в /raids/[id]

### Phase 3: Hero Profile
**Goal**: Герой видит реальные навыки и может редактировать свой профиль — bio, hard skills, GitHub/LinkedIn. Секция "coming soon" заменяется живыми данными и inline-формой редактирования.
**Depends on**: Phase 2
**Requirements**: HERO-02, HERO-03, HERO-04
**Success Criteria** (what must be TRUE):
  1. /hero/me отображает секцию навыков с реальными данными (или пустым состоянием)
  2. Кнопка "Edit Profile" открывает inline-форму с полями bio, GitHub, LinkedIn, hard_skills
  3. Save сохраняет изменения (mock PATCH пока нет endpoint)
  4. GitHub/LinkedIn отображаются как кликабельные ссылки в профиле
**Plans**: TBD

Plans:
- [x] 03-01: Hero Profile — real skills data + edit form

### Phase 4: Design System Refresh
**Goal**: Обновить визуальную идентичность — с холодного cyberpunk к fantasy dark с живым характером. Изумрудный акцент, texture в фоне, Cinzel в заголовках, иллюстрационные empty states.
**Depends on**: Phase 3
**Requirements**: (design, no functional requirements)
**Success Criteria** (what must be TRUE):
  1. Синий glow #5B87FF заменён на изумрудный #00D97E как primary accent
  2. Фон body имеет subtle noise texture (opacity 3-4%)
  3. h1/h2 используют Cinzel через .dr-heading utility
  4. Пустые состояния (empty states) имеют SVG иллюстрацию вместо текста
  5. Все существующие страницы выглядят единой системой
**Plans**: TBD

Plans:
- [x] 04-01: Color tokens + typography + texture
- [x] 04-02: Empty states SVG illustrations

### Phase 5: Onboarding & Soft Skill Generation
**Goal**: После регистрации герой проходит 20 ситуационных вопросов → система генерирует его Soft Skill Profile (5 осей hexagon).
**Depends on**: Phase 4
**Requirements**: ONBOARDING-01, ONBOARDING-02, ONBOARDING-03, ONBOARDING-04, ONBOARDING-05, ONBOARDING-06
**Success Criteria** (what must be TRUE):
  1. /onboarding рендерится как пошаговая форма (один вопрос за шаг, 20 вопросов всего)
  2. 20 вопросов покрывают 5 осей (initiative, expertise, speed, communication, flexibility) по 4 вопроса на каждую
  3. После завершения генерируется объект SoftSkillHexagon с 5 значениями 0-100
  4. Незавершённый onboarding → редирект с /hero/me на /onboarding (middleware)
  5. Прогресс-бар заполняется гладко от 0% до 100%
  6. Результаты показываются сразу после step 20 (расчёт client-side, без API delay)
**Plans**: 2 plans (Wave 1 + Wave 2)

Plans:
- [x] 05-01: Question bank + calculation algorithm + type extensions (Wave 1)
- [x] 05-02: Onboarding form component + results page + middleware (Wave 2)

### Phase 6: Hexagon Radar Chart
**Goal**: Визуализировать Soft Skill Profile как интерактивный radar chart с draw-on анимацией.
**Depends on**: Phase 5
**Requirements**: HERO-05, HERO-06
**Success Criteria** (what must be TRUE):
  1. SVG radar chart рендерится на /hero/me с draw-on анимацией при монтировании
  2. 5 осей подписаны, hover показывает точное значение
  3. Публичный /hero/[id] тоже показывает radar chart (readonly)
  4. Если soft_skills нет → CTA "Complete your profile"
**Plans**: TBD

Plans:
- [x] 06-01: RadarChart SVG component
- [x] 06-02: Integration into hero/me and hero/[id]

### Phase 7: Roll Hero — Matching & Invite
**Goal**: Raid-Owner находит лучших кандидатов через Roll Hero механику с D20 анимацией и может отправить инвайт.
**Depends on**: Phase 6
**Requirements**: MATCH-01, MATCH-02, MATCH-03
**Success Criteria** (what must be TRUE):
  1. Кнопка "Roll Hero" запускает D20 анимацию (1.2s)
  2. Показываются 5 кандидатов с match score (hard skills 60% + soft skills 40%)
  3. RE-ROLL показывает следующих кандидатов
  4. SEND invite сохраняет mock-состояние приглашения
**Plans**: TBD

Plans:
- [x] 07-01: Matching algorithm + D20 animation *(mock list + UX; алгоритм — данные из MOCK_CANDIDATES)*
- [x] 07-02: Candidate cards + Send Invite flow *(mock remove row)*

### Phase 8: Raid Board — Discovery & Filters
**Goal**: /raids показывает реальные рейды из API с фильтрацией по stage/роли и поиском. Список заменяет статичные mock данные.
**Depends on**: Phase 3
**Requirements**: RAID-04, RAID-05, RAID-06
**Success Criteria** (what must be TRUE):
  1. /raids загружает список рейдов из GET /raids (mock до готовности бэка)
  2. Фильтры по stage и по роли сужают отображаемый список
  3. Поиск по title работает в реальном времени (client-side)
  4. Loading state и empty state корректно отображаются
**Plans**: TBD

Plans:
- [x] 08-01: Raids list — real data, filters, search *(mock data; фильтр по **семейству роли**, не по stage; empty state есть)*

### Phase 9: Captain Board — Review & Decisions
**Goal**: /raids/[id]/board — капитан видит все заявки на свой рейд, может одобрить или отклонить кандидата.
**Depends on**: Phase 8
**Requirements**: CAPTAIN-05, CAPTAIN-06, CAPTAIN-07
**Success Criteria** (what must be TRUE):
  1. /raids/[id]/board загружает список заявок (mock)
  2. Каждая карточка заявки: герой, роль, мотивация, статус, micro radar chart
  3. Кнопки Approve/Reject меняют статус (mock)
  4. Active Heroes Sheet обновляется при approve
**Plans**: TBD

Plans:
- [x] 09-01: Applications list + approve/reject *(реализовано на **`/captain/[id]`**, mock)*
- [ ] 09-02: Active Heroes Sheet

### Phase 10: Onboarding Metrics API Migration
**Goal**: Перевести onboarding на серверный банк 18 вопросов и серверный скоринг soft-profile (6 осей) вместо локального 20-question/5-axis калькулятора.
**Depends on**: Phase 5, backend metrics endpoints
**Requirements**: ONBOARDING-01, ONBOARDING-03, ONBOARDING-04
**Success Criteria** (what must be TRUE):
  1. `/onboarding` загружает вопросы из `GET /api/metrics/questions`
  2. Финиш формы отправляет ответы в `POST /api/metrics/score` и получает `soft_profile` (6 осей)
  3. Результаты на UI показывают новый 6-axis профиль, и профиль кэшируется локально
  4. `npm run build` проходит после миграции
**Plans**: 2 plans

Plans:
- [x] 10-01: Migrate onboarding page + API typing + profile fallback
- [x] 10-02: Local FE/BE contract smoke (auth, metrics, matching)

### Phase 11: Hydration + Favicon Stability
**Goal**: Убрать шумные фронтенд-ошибки в dev/runtime: hydration mismatch warning от extension-инжекта и `favicon.ico` 404.
**Depends on**: None
**Requirements**: QA stability / developer UX
**Success Criteria** (what must be TRUE):
  1. `favicon.ico` endpoint отдаёт `200`, нет 404 в консоли браузера
  2. Layout tolerates extra body/html attrs injected by browser extensions without hydration warning spam
  3. `npm run build` проходит после фиксов
**Plans**: 1 plan

Plans:
- [x] 11-01: Layout hydration suppression + favicon route

### Phase 12: Local API Endpoint Alignment
**Goal**: Устранить ложный network fail на регистрации/логине из-за старого порта `8000` в локальном frontend env.
**Depends on**: Phase 10
**Requirements**: local FE/BE runtime stability
**Success Criteria** (what must be TRUE):
  1. `.env.local` указывает на локальный backend URL (`127.0.0.1:8087`)
  2. Текст network-error больше не хардкодит порт `8000`
  3. `npm run build` проходит после изменений
**Plans**: 1 plan

Plans:
- [x] 12-01: Align env base URL + dynamic network error message

### Phase 13: Auth Guard Consistency
**Goal**: Устранить расхождение между клиентским auth-хранилищем и SSR middleware, которое ломало доступность защищённых страниц.
**Depends on**: Phase 1, Phase 12
**Requirements**: AUTH-03, HERO-01 runtime consistency
**Success Criteria** (what must be TRUE):
  1. После login/register middleware видит токен и не редиректит ошибочно на `/login`
  2. Токен синхронизируется между `localStorage` и cookie `auth_token`
  3. На `/login` и `/register` не отображается левый sidebar shell
  4. `npm run build` проходит
**Plans**: 1 plan

Plans:
- [x] 13-01: Sync auth cookie + hide shell on auth pages

---

### Phase 15: Design System 2.0
**Goal**: Extend `globals.css` with a complete token layer — shadow, glassmorphism, motion, typography, and z-index variables — so all v1.1 components can use consistent CSS custom properties without hardcoding values.
**Depends on**: Phase 14
**Requirements**: DESIGN-01, DESIGN-02, DESIGN-03, DESIGN-04, DESIGN-05, DESIGN-06, DESIGN-07, DESIGN-08
**Success Criteria** (what must be TRUE):
  1. Developer can use `--shadow-glow-sm/md/lg`, `--shadow-gold-sm/md`, `--shadow-card` CSS variables in any component without hardcoding box-shadow values
  2. Developer can use `--glass-bg`, `--glass-blur`, `--glass-border-glow` tokens for glassmorphism cards without repeating `rgba()` values
  3. Developer can use `--dur-fast/normal/slow`, `--ease-spring`, `--ease-out` motion tokens for all transitions; `--z-bg/app/modal/toast` z-index ladder is documented as CSS vars
  4. Aurora animation pauses when `prefers-reduced-motion: reduce` is set — verified in browser accessibility settings; `will-change: transform` is present on aurora blob elements
  5. `npm run build` passes — no existing pages broken; all existing `.dr-card`, `.dr-btn-*`, `.dr-heading` classes work unchanged
**Plans**: 1 plan (Wave 1)
**Key files**: `app/globals.css` (only file touched in this phase)

Plans:
- [x] 15-01-PLAN.md — Normalize token ownership and preserve additive `.dr-*` compatibility in `app/globals.css`

### Phase 16: Component Library
**Goal**: Build all new UI components and apply additive visual updates to existing components so that pages in Phase 17 can assemble the full Emerald Guild visual language using ready-made building blocks.
**Depends on**: Phase 15
**Requirements**: RAIDS-01, RAIDS-02, RAIDS-03, RAIDS-04, HERO-01, HERO-02, HERO-03, CAPTAIN-02, ONBOARD-01
**Success Criteria** (what must be TRUE):
  1. `RaidCard` shows emerald border glow on hover and a cursor-following radial spotlight that tracks mouse position via CSS `--glow-x`/`--glow-y` custom properties
  2. `HexSlotIndicator` renders SVG hexagon icons for available roles; `FitScoreBadge` displays gold (≥80%), emerald (60–79%), or muted (<60%) tiers based on fit score
  3. `SkillBar` fills from 0% to target width via CSS transition triggered on first viewport entry (IntersectionObserver)
  4. `HexRadar` polygon draws itself from 0 to full shape using Framer Motion `pathLength` animation on component mount
  5. `StepProgress` renders gold/emerald/muted nodes per step state; `AvatarGlow` wraps an avatar image with a pulsing glow ring; D20 stagger-reveal shows candidates sequentially after roll completes
**Plans**: 2 plans (Wave 1 + Wave 2)
**Key files**:
- New: `components/ui/skill-bar.tsx`, `components/ui/fit-score-badge.tsx`, `components/ui/hex-slot-indicator.tsx`, `components/ui/avatar-glow.tsx`, `components/ui/step-progress.tsx`
- Modified: `components/features/raids/raid-card.tsx`, `components/features/hero/hero-card.tsx`, `components/ui/hex-radar.tsx`, `components/features/captain/d20-roll-animation.tsx`, `components/layout/app-shell.tsx`
**UI hint**: yes

Plans:
- [x] `16-01-PLAN.md` — Raid discovery atoms + `RaidCard` spotlight hover + onboarding `StepProgress`
- [x] `16-02-PLAN.md` — Hero avatar/skill primitives + `HexRadar` draw-on + Roll Hero polish

### Phase 17: Page Redesigns
**Goal**: Assemble all major pages using Phase 16 components to deliver the complete Emerald Guild visual language — auth pages become fully immersive, and every other page reflects the new design system end-to-end.
**Depends on**: Phase 16
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04
**Success Criteria** (what must be TRUE):
  1. Login page renders full-screen without sidebar, aurora CSS blob backdrop visible, "Enter the Realm" Cinzel heading present, form inside heavy glassmorphism card (`.dr-card--auth`)
  2. Register page matches Login in atmosphere and layout — same aurora treatment, same heavy glass card
  3. Aurora backdrop is isolated to auth pages only — not visible in the main app shell or other routes
  4. All 9 major pages (landing, login, register, raids, raid detail, raid board, hero me, hero public, captain, onboarding) are updated and `npm run build` passes with zero SSR crashes or hydration errors
**Plans**: TBD
**Key files**:
- `app/login/page.tsx`, `app/register/page.tsx`, `app/raids/page.tsx`, `app/raids/[id]/page.tsx`
- `app/raids/[id]/board/page.tsx`, `app/hero/me/page.tsx`, `app/hero/[id]/page.tsx`
- `app/captain/[id]/page.tsx`, `app/onboarding/page.tsx`, `app/page.tsx`
**UI hint**: yes

### Phase 18: Animations + FX
**Goal**: Layer GSAP ScrollTrigger entrance animations, typewriter headings, Howler.js D20 sound, and a Canvas particle backdrop to complete the full motion and sensory immersion of Emerald Guild.
**Depends on**: Phase 17
**Requirements**: RAIDS-05, ANIM-01, ANIM-02, ANIM-03, CAPTAIN-01, CAPTAIN-03, ONBOARD-02, FX-01, FX-02
**Success Criteria** (what must be TRUE):
  1. Scrolling any major page triggers stagger entrance animations (cards/sections fade-up from `y: 24`); navigating away and back correctly replays animations (no stale ScrollTrigger instances accumulate across route changes)
  2. One hero heading on Landing and one on an auth page shows typewriter effect (GSAP TextPlugin, letter-by-letter) — effect is skipped instantly when `prefers-reduced-motion: reduce` is set
  3. Clicking "Roll D20" plays `d20-roll.mp3` via Howler.js without `AudioContext was not allowed to start` in Chrome, Safari, or Firefox; a mute/unmute toggle is visible and functional
  4. Login and Register pages show Canvas particle background (40–60 particles, emerald/gold palette) loaded via `dynamic(ssr: false)` — no SSR crash, no RAF memory leak after navigation away
  5. Onboarding final step shows a live HexRadar preview that updates its shape in real-time as the user answers questions
**Plans**: TBD
**Key files**:
- New: `lib/gsap-config.ts`, `lib/sound-manager.ts`, `components/animations/scroll-reveal.tsx`, `components/animations/typewriter.tsx`, `components/animations/particles-bg.tsx`
- Modified: `components/features/captain/d20-roll-animation.tsx` (Howler integration), `components/layout/app-shell.tsx` (ScrollTrigger cleanup hook)
- Install: `@gsap/react`, `howler`, `@types/howler`
**UI hint**: yes

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Auth Hardening & Hero Profile | 1/1 | Complete | 2026-04-02 |
| 2. Raid Actions | 2/2 | Complete | 2026-04-02 |
| 3. Hero Profile Edit | 1/1 | Complete | 2026-04-02 |
| 4. Design System Refresh | 2/2 | Complete | 2026-04-02 |
| 5. Onboarding & Soft Skill Generation | 2/2 | Complete | 2026-04-02 |
| 6. Hexagon Radar Chart | 2/2 | Complete | 2026-04-03 |
| 7. Roll Hero | 2/2 | Complete (mock) | 2026-04-03 |
| 8. Raid Board | 1/1 | Complete (mock) | 2026-04-03 |
| 9. Captain Board | 1/2 | Partial (09-02 open) | 2026-04-03 |
| 10. Onboarding Metrics API Migration | 2/2 | Complete | 2026-04-03 |
| 11. Hydration + Favicon Stability | 1/1 | Complete | 2026-04-03 |
| 12. Local API Endpoint Alignment | 1/1 | Complete | 2026-04-03 |
| 13. Auth Guard Consistency | 1/1 | Complete | 2026-04-03 |
| 14. Demo Day Visual Overhaul | 0/1 | In Progress | 2026-04-03 |
| 15. Design System 2.0 | 1/1 | Complete   | 2026-04-03 |
| 16. Component Library | 2/2 | Complete   | 2026-04-03 |
| 17. Page Redesigns | 0/2 | Not started | - |
| 18. Animations + FX | 0/2 | Not started | - |
