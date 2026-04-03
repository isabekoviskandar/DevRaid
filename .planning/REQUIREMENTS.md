# Requirements: DevRaid Frontend v1.1

**Milestone:** Emerald Guild — Fantasy UI Immersion  
**Version:** v1.1  
**Date:** 2026-04-03  
**Status:** Active

---

## Design System (DESIGN)

- [x] **DESIGN-01**: Разработчик может использовать shadow tokens (`--shadow-glow-sm/md/lg`, `--shadow-gold-*`, `--shadow-card`) из CSS custom properties вместо хардкода
- [x] **DESIGN-02**: Разработчик может использовать glass/layer tokens (`--glass-bg`, `--glass-panel`, `--glass-blur`, `--glass-border-glow`) для более светлых emerald/taupe поверхностей вместо глухого obsidian-only стиля
- [x] **DESIGN-03**: Разработчик может использовать animation/motion tokens (`--dur-*`, `--ease-spring`, `--ease-out`) для консистентных transition
- [x] **DESIGN-04**: Разработчик может использовать additive CSS utility classes (`.dr-card--glow-emerald`, `.dr-card--glow-gold`, `.dr-card--auth`, `.dr-card--elevated`) без изменения базового `.dr-card`
- [x] **DESIGN-05**: Пользователь видит `prefers-reduced-motion` поддержку — aurora animation отключается при соответствующей системной настройке
- [x] **DESIGN-06**: Пользователь видит `will-change: transform` на aurora blob элементах (GPU compositing)
- [x] **DESIGN-07**: Разработчик может использовать z-index ladder (CSS vars `--z-bg`, `--z-app`, `--z-modal`, `--z-toast`) без конфликтов слоёв
- [x] **DESIGN-08**: Пользователь видит все fantasy headings (h1/h2) в шрифте Cinzel через consistent `.dr-heading` / `font-display` utility

## Auth Pages (AUTH)

- [ ] **AUTH-01**: Пользователь видит иммерсивный Login экран в стиле Stitch/fantasy-taupe с aurora/particle backdrop, emerald glow и более светлой glass карточкой формы
- [ ] **AUTH-02**: Пользователь видит аналогичный Register экран с той же атмосферой что и Login
- [ ] **AUTH-03**: Пользователь видит Aurora background (CSS blob animation) изолированно на auth страницах (не в основном app shell)
- [ ] **AUTH-04**: Пользователь видит полноэкранный auth layout без sidebar (уже обеспечено `AppShell` — сохранить)

## Raid Board (RAIDS)

- [x] **RAIDS-01**: Пользователь видит Raid карточки с luminous glass hover эффектом — emerald border glow при наведении, но без ощущения «сплошной чёрной стены»
- [x] **RAIDS-02**: Пользователь видит cursor-following spotlight glow на Raid карточках (CSS custom properties `--glow-x`/`--glow-y` + radial-gradient)
- [x] **RAIDS-03**: Пользователь видит HexSlot indicators для доступных ролей в рейде (SVG hexagon иконки)
- [x] **RAIDS-04**: Пользователь видит FitScore badge с цветовой тиерной системой: gold (≥80%), emerald (60-79%), muted (<60%)
- [ ] **RAIDS-05**: Пользователь видит stagger-deal анимацию при загрузке списка рейдов (карточки появляются последовательно)

## Hero Profile (HERO)

- [x] **HERO-01**: Пользователь видит animated glow ring вокруг аватара на `/hero/me` и `/hero/[id]` страницах с более тёплой и читаемой panel composition
- [x] **HERO-02**: Пользователь видит animated SkillBar компоненты (прогресс-бары навыков, запускаются при попадании в viewport)
- [x] **HERO-03**: Пользователь видит HexRadar с draw-on анимацией при монтировании компонента (SVG pathLength animation)

## Captain Dashboard + Roll Hero (CAPTAIN)

- [ ] **CAPTAIN-01**: Пользователь слышит звуковой эффект при нажатии кнопки "Roll D20" (Howler.js, user-gesture-triggered, без autoplay)
- [x] **CAPTAIN-02**: Пользователь видит stagger-reveal анимацию появления кандидатов после D20 ролла
- [ ] **CAPTAIN-03**: Пользователь может управлять звуком — есть mute/unmute toggle (accessibility требование)

## Onboarding (ONBOARDING)

- [x] **ONBOARD-01**: Пользователь видит fantasy-styled step progress bar в onboarding (gold = completed, emerald pulse = active, muted = pending)
- [ ] **ONBOARD-02**: Пользователь видит live HexRadar preview на финальном шаге onboarding — radar обновляется в реальном времени по мере ответов

## Animations (ANIM)

- [ ] **ANIM-01**: Пользователь видит scroll-triggered entrance анимации на всех major sections (GSAP ScrollTrigger + `ScrollReveal` wrapper component)
- [ ] **ANIM-02**: Пользователь видит typewriter эффект на главных hero-heading на landing/auth страницах (1-2 heading max)
- [ ] **ANIM-03**: ScrollTrigger instances корректно cleanup при SPA навигации (не накапливаются между route переходами)

## Sound & FX (FX)

- [ ] **FX-01**: Пользователь видит particle background (custom Canvas implementation) на Login/Register страницах — lazy loaded с `dynamic(ssr: false)`
- [ ] **FX-02**: D20 sound не вызывает `AudioContext was not allowed to start` ошибку ни в одном браузере (lazy Howl init паттерн)

---

## Future Requirements (Defer to v1.2)

- D20 particle burst/shimmer при завершении ролла
- Loading/splash screen с DevRaid logo reveal
- Ambient hover SFX на карточках
- Active Heroes Sheet (ROADMAP 09-02)
- Backend integration — реальные API вместо mock data
- Мобильная навигация
- Toast-уведомления

## Out of Scope for v1.1

- Three.js / WebGL сцены — оverkill, CSS aurora достаточно
- Ambient background музыка — blocked by browser policy, плохой UX
- tsParticles (heavy) — custom Canvas solution вместо
- Новые backend features / API endpoints — только visual sprint

---

## Traceability

| REQ-ID | Description | Phase | Status |
|--------|-------------|-------|--------|
| DESIGN-01 | Shadow tokens (`--shadow-glow-*`, `--shadow-gold-*`, `--shadow-card`) | Phase 15 | Complete |
| DESIGN-02 | Glassmorphism tokens (`--glass-bg`, `--glass-blur`, `--glass-border-glow`) | Phase 15 | Complete |
| DESIGN-03 | Motion tokens (`--dur-*`, `--ease-spring`, `--ease-out`) | Phase 15 | Complete |
| DESIGN-04 | Additive CSS utility classes (`.dr-card--glow-*`, `.dr-card--auth`) | Phase 15 | Complete |
| DESIGN-05 | `prefers-reduced-motion` support — aurora animation disables | Phase 15 | Complete |
| DESIGN-06 | `will-change: transform` on aurora blob elements | Phase 15 | Complete |
| DESIGN-07 | Z-index ladder CSS vars (`--z-bg`, `--z-app`, `--z-modal`, `--z-toast`) | Phase 15 | Complete |
| DESIGN-08 | Fantasy headings (h1/h2) use Cinzel via `.dr-heading` consistently | Phase 15 | Complete |
| AUTH-01 | Login immersive redesign — particles, aurora backdrop, "Enter the Realm" | Phase 17 | Pending |
| AUTH-02 | Register screen — same atmosphere as Login | Phase 17 | Pending |
| AUTH-03 | Aurora background isolated on auth pages only | Phase 17 | Pending |
| AUTH-04 | Full-screen auth layout without sidebar (preserve existing) | Phase 17 | Pending |
| RAIDS-01 | Raid cards glassmorphism v2 hover — emerald border glow | Phase 16 | Complete |
| RAIDS-02 | Cursor-following spotlight glow on Raid cards (CSS `--glow-x`/`--glow-y`) | Phase 16 | Complete |
| RAIDS-03 | HexSlot indicators for available roles (SVG hexagon icons) | Phase 16 | Complete |
| RAIDS-04 | FitScore badge with gold/emerald/muted color tier system | Phase 16 | Complete |
| RAIDS-05 | Stagger-deal animation on Raid Board card list load | Phase 18 | Pending |
| HERO-01 | Animated glow ring around avatar on `/hero/me` and `/hero/[id]` | Phase 16 | Complete |
| HERO-02 | Animated SkillBar components — fill on viewport entry | Phase 16 | Complete |
| HERO-03 | HexRadar draw-on animation (Framer Motion `pathLength` on mount) | Phase 16 | Complete |
| CAPTAIN-01 | D20 roll sound FX (Howler.js, user-gesture-triggered) | Phase 18 | Pending |
| CAPTAIN-02 | Stagger-reveal animation of candidates after D20 roll | Phase 16 | Complete |
| CAPTAIN-03 | Mute/unmute sound toggle (accessibility) | Phase 18 | Pending |
| ONBOARD-01 | Fantasy-styled step progress bar in onboarding | Phase 16 | Complete |
| ONBOARD-02 | Live HexRadar preview on onboarding final step (real-time updates) | Phase 18 | Pending |
| ANIM-01 | GSAP ScrollTrigger entrance reveals on all major sections | Phase 18 | Pending |
| ANIM-02 | Typewriter effect on hero headings (landing/auth, 1–2 max) | Phase 18 | Pending |
| ANIM-03 | ScrollTrigger cleanup on SPA navigation (no instance accumulation) | Phase 18 | Pending |
| FX-01 | Particle background on Login/Register (Canvas, `dynamic(ssr: false)`) | Phase 18 | Pending |
| FX-02 | D20 sound — no `AudioContext was not allowed to start` error | Phase 18 | Pending |

**Coverage:** 30/30 v1.1 requirements mapped ✓
