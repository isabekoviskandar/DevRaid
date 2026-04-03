# DevRaid Frontend

## What This Is

DevRaid — фэнтезийная платформа для формирования IT-команд. Разработчики выступают как **Герои** с классами и навыками (Backend, Frontend, DevOps и т.д.), проекты/хакатоны — как **Рейды**. Капитан создаёт Рейд, указывает нужные роли, Герои откликаются. MVP ориентирован на хакатон-сценарии.

## Core Value

Герой находит Рейд под свои навыки и подаёт заявку за 3 клика — без лишнего трения.

## Requirements

### Validated

- ✓ Дизайн-система "Obsidian Citadel" (glassmorphism, dark #05070D, gold/neon glow) — Session 01-03
- ✓ Auth flow работает: register / login → token → Sanctum — Session 03
- ✓ Страницы: landing, /raids, /raids/[id], /raids/[id]/board, /captain/[id], /hero/me — Session 01-03
- ✓ App Shell с live auth (username / Sign in / logout) — Session 03

### Active

- [ ] Форма создания Рейда — /captain/new (title, mission, stage + динамические роли)
- [ ] /hero/me отображает реального залогиненного пользователя (GET /api/auth/user)
- [ ] Auth guard на /captain/* — редирект на /login если нет токена
- [ ] Apply кнопка в /raids/[id] — modal с выбором роли и текстом мотивации

### Out of Scope

- Реальные RAID CRUD endpoints (ждём Исканлара — POST /raids, GET /raids/{id}) — только mock на фронте
- Guilds, рейтинг, Roll Hero AI — v2
- Мобильная навигация — v2
- Toast-уведомления — v2
- Real-time (сокеты) — v2

## Context

**Стек:** Next.js 15 (App Router) + React 19 + Tailwind v4 + Framer Motion + TypeScript
**Бэкенд:** Laravel 11 + Sanctum, запущен на :8000. Текущие рабочие endpoints: POST /api/auth/register, POST /api/auth/login, GET /api/auth/user
**Локальная связка:** `php artisan serve --port=8000` + `npm run dev` → :3000
**База:** MySQL через Laragon

**Дизайн:** Fantasy + neon-dark (Obsidian Citadel). Палитра: #05070D фон, фиолетово-голубые неон-глоу акценты, Cinzel для fantasy-заголовков, Sora для текста.
**MVP контекст:** Хакатон. Скорость > полнота. Mock-данные в `lib/mock-data.ts` — норма пока нет бэк-endpoints.

## Constraints

- **Backend:** Только auth endpoints готовы. Рейды, герои, матчинг — заглушки на фронте
- **Timeline:** MVP для хакатона — скорость важнее
- **Tech:** Next.js 15 async params (`await params`), Tailwind v4 синтаксис (@theme, не tailwind.config)
- **SSR:** localStorage только в Client Components (auth-store.ts имеет SSR-guard)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Glassmorphism + #05070D | Fantasy/neon атмосфера DevRaid | ✓ Good |
| localStorage для токена | Простота для MVP, Sanctum не требует cookies | — Pending |
| Mock-data вместо API | Бэкенд не готов, разрабатываем параллельно | — Pending |
| Client Islands паттерн | Server Components default, клиент только где нужен интерактив | ✓ Good |

---
*Last updated: 2026-04-02 after project init (Session 04)*
