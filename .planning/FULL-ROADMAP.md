# DevRaid — Полная дорожная карта

**Обновлено:** 2026-04-02
**Контекст:** Next.js 15 + React 19 + Tailwind v4 + Framer Motion + TypeScript + Laravel 11

---

## Общий прогресс

| Фаза | Название | Статус |
|------|----------|--------|
| 1 | Auth Hardening & Hero Profile | ✅ Done |
| 2 | Raid Actions | ✅ Done |
| 3 | Hero Profile Edit | ✅ Done |
| 4 | Design System Refresh | ⬜ Planned |
| 5 | Onboarding & Soft Skill Generation | ⬜ Planned |
| 6 | Hexagon Radar Chart | ⬜ Planned |
| 7 | Roll Hero — Matching & Invite | ⬜ Planned |
| 8 | Raid Board — Discovery & Filters | ⬜ Planned |
| 9 | Captain Board — Review & Decisions | ⬜ Planned |

---

## ✅ Phase 1 — Auth Hardening & Hero Profile
**Цель:** Залогиненный пользователь видит свои реальные данные. /captain/* защищены.
**Закрыто:** AUTH-03, HERO-01
**Результат:** Auth guard работает, /hero/me показывает реальные данные из API.

---

## ✅ Phase 2 — Raid Actions
**Цель:** Капитан создаёт рейд. Герой подаёт заявку.
**Закрыто:** CAPTAIN-01..04, RAID-01..03
**Результат:** /captain/new с динамическими ролями, Apply Modal с Framer Motion.

---

## ✅ Phase 3 — Hero Profile Edit
**Цель:** Герой видит навыки и может редактировать профиль без перезагрузки.
**Закрыто:** HERO-02, HERO-03, HERO-04
**Результат:** Skills chips, inline edit panel (bio, GitHub, LinkedIn, hard_skills), localStorage persistence.

---

## ⬜ Phase 4 — Design System Refresh
**Цель:** Обновить визуальную идентичность — с холодного cyberpunk к fantasy dark с живым характером.
**Зависит от:** Phase 3

### Что меняем

#### 4.1 — Цветовые токены
- Заменить синий акцент `#5B87FF` → изумрудный `#00D97E` (основной glow)
- Добавить `--color-dr-emerald`, `--color-dr-emerald-dim`, `--color-dr-emerald-mid`
- Синий переводим в secondary/info роль (`--color-dr-info`)
- Фон остаётся тёмным — добавить `--color-dr-surface` для карточек (чуть теплее текущего)

#### 4.2 — Типографика
- Cinzel уже подключён — активировать для всех `h1`, `h2` на публичных страницах
- Убедиться что Sora работает как body font
- Добавить utility class `.dr-heading` (Cinzel, letter-spacing, текущий emerald)

#### 4.3 — Texture в фоне
- Добавить subtle noise/grain в `body` через SVG фильтр или PNG с opacity 3-4%
- Эффект "живого пергамента" — не бросается в глаза, но убирает стерильность

#### 4.4 — Иллюстративные детали (Empty States)
- Пустой Quest Board → SVG свиток с надписью "No raids found"
- Пустой раздел навыков → минималистичный дракончик или кристалл
- Страница 404 → тёмный замок в тумане
- Все иллюстрации — монохромные SVG в стиле линогравюры (не цветные картинки из коллажа)

#### 4.5 — Micro-details
- Разделители между секциями → тонкая линия с центральным ромбом/рунным символом
- Кнопки → добавить subtle inner glow при hover (CSS box-shadow)
- dr-card border → анимированный gradient border при focus/hover на интерактивных элементах

### Файлы
- `app/globals.css` — токены, texture, utility classes
- `components/ui/empty-state.tsx` — новый компонент
- `app/not-found.tsx` — обновить 404

### Критерий готовности
Все существующие страницы выглядят как единая fantasy-система. Синий glow нигде не мелькает как primary.

---

## ⬜ Phase 5 — Onboarding & Soft Skill Generation
**Цель:** После регистрации герой проходит опросник → система генерирует его Soft Skill Profile.
**Зависит от:** Phase 4

### Флоу
```
Sign Up → /onboarding (20 вопросов) → Generate Stats → /hero/me
```

### Что строим

#### 5.1 — Onboarding страница `/onboarding`
- Многошаговая форма: 20 ситуационных вопросов
- Формат: карточка с вопросом + 4 варианта ответа (radio) или слайдер интенсивности
- Progress bar с анимацией (Framer Motion)
- Каждый вопрос за один экран — не скролл, а переход между шагами
- Skip невозможен (блокируем переход на /hero/me без completed onboarding)

#### 5.2 — Вопросы (примеры по 5 осям)
| Ось | Вопрос-пример |
|-----|--------------|
| Инициативность | "Команда застряла. Ты..." (4 варианта от пассивного к лидерскому) |
| Глубина/Экспертиза | "Перед дедлайном узнаёшь о баге. Ты..." |
| Скорость исполнения | "Предпочитаешь сдать черновик сейчас или идеал потом?" |
| Коммуникация | "Разногласие с тиммейтом — как решаешь?" |
| Гибкость/Адаптивность | "Требования изменились на 70%. Реакция?" |

4 вопроса на каждую ось = 20 итого.

#### 5.3 — Алгоритм генерации
```typescript
// Каждый ответ (A/B/C/D) → вес 1-4
// Среднее по 4 вопросам оси = значение 1-4 → нормализуем в 0-100
function generateHexagon(answers: Record<string, 1|2|3|4>): SoftSkillHexagon {
  return {
    initiative:   avg(answers, INITIATIVE_QUESTIONS)   * 25,
    expertise:    avg(answers, EXPERTISE_QUESTIONS)    * 25,
    speed:        avg(answers, SPEED_QUESTIONS)        * 25,
    communication:avg(answers, COMMUNICATION_QUESTIONS)* 25,
    flexibility:  avg(answers, FLEXIBILITY_QUESTIONS)  * 25,
  }
}
```

#### 5.4 — Расширение ApiUser
```typescript
interface SoftSkillHexagon {
  initiative:    number  // 0-100
  expertise:     number
  speed:         number
  communication: number
  flexibility:   number
}

// Добавить в ApiUser:
soft_skills?: SoftSkillHexagon
onboarding_completed?: boolean
```

### Файлы
- `app/onboarding/page.tsx` — мультишаговая форма
- `lib/onboarding-questions.ts` — вопросы и веса
- `lib/skill-calculator.ts` — алгоритм генерации hexagon
- `lib/api.ts` — расширение ApiUser, stub для POST /onboarding
- `middleware.ts` — редирект на /onboarding если !onboarding_completed

### Критерий готовности
После регистрации → опросник → профиль содержит `soft_skills` объект с 5 значениями.

---

## ⬜ Phase 6 — Hexagon Radar Chart
**Цель:** Визуализировать Soft Skill Profile героя как интерактивный radar chart.
**Зависит от:** Phase 5

### Что строим

#### 6.1 — RadarChart компонент
- SVG-based (не Chart.js — слишком тяжёлый, кастомный SVG контролируем полностью)
- 5 осей, подписи: Инициативность, Глубина, Скорость, Коммуникация, Гибкость
- Draw-on анимация при монтировании (stroke-dasharray animation)
- Цвет заливки: `--color-dr-emerald-dim` (полупрозрачный изумрудный)
- Hover → tooltip с точным значением оси
- Subtle glow по контуру (filter: drop-shadow)

#### 6.2 — Интеграция в /hero/me
- Radar chart в отдельной dr-card между header и skills section
- Рядом — легенда с 5 осями и числовыми значениями
- Если `soft_skills` нет → блок с CTA "Complete onboarding to unlock your stats"

#### 6.3 — Просмотр чужого профиля
- `/hero/[id]` — публичный профиль с тем же radar chart (readonly)
- Капитан видит hexagon кандидата при Roll Hero

### Файлы
- `components/ui/radar-chart.tsx` — переиспользуемый SVG компонент
- `app/hero/me/page.tsx` — интеграция
- `app/hero/[id]/page.tsx` — публичный профиль героя

### Критерий готовности
Radar chart рендерится с анимацией. При нулевых данных — graceful fallback.

---

## ⬜ Phase 7 — Roll Hero: Matching & Invite
**Цель:** Raid-Owner находит лучших кандидатов через Roll Hero механику с D20 анимацией.
**Зависит от:** Phase 6

### Флоу
```
/raids/[id]/board → Roll Hero кнопка → D20 анимация → 5 кандидатов →
Review Profile → Good Fit? → SEND invite / RE-ROLL
```

### Что строим

#### 7.1 — Matching алгоритм
```typescript
function scoreHero(hero: ApiUser, openRole: RaidRole): number {
  const hardSkillMatch = hero.hard_skills
    ?.filter(s => openRole.required_skills.includes(s)).length ?? 0

  const softSkillScore = hero.soft_skills
    ? weightedAverage(hero.soft_skills, openRole.preferred_soft_weights)
    : 0

  return hardSkillMatch * 60 + softSkillScore * 40  // hard skills важнее
}
```

#### 7.2 — D20 Roll анимация
- SVG D20 иконка (уже задизайнена в схеме)
- При клике: 3D CSS rotation + случайные грани мелькают (keyframes)
- Длительность: 1.2s → reveal 5 карточек с stagger animation

#### 7.3 — Candidate Cards
- Мини-карточка героя: аватар, username, hard skills chips, micro radar chart (50px)
- Match score: "87% match" с цветовым индикатором
- Кнопки: "View Profile" → открывает drawer с полным профилем, "Send Invite"

#### 7.4 — RE-ROLL
- Кнопка RE-ROLL запускает анимацию снова, показывает следующих 5 (shuffle)
- Если открытых позиций < 5 — показывает только нужное количество кандидатов

#### 7.5 — SEND Invite
- Mock: создаёт invite объект, герой видит уведомление в своём профиле
- Реальный endpoint: POST /invites когда бэкенд готов

### Файлы
- `lib/matching.ts` — scoring алгоритм
- `components/features/raids/roll-hero.tsx` — D20 + reveal
- `components/features/raids/candidate-card.tsx` — карточка кандидата
- `app/raids/[id]/board/page.tsx` — интеграция

### Критерий готовности
Roll Hero показывает 5 релевантных кандидатов. D20 анимация работает. Send Invite сохраняет mock-состояние.

---

## ⬜ Phase 8 — Raid Board: Discovery & Filters
**Цель:** /raids показывает реальные (или mock) рейды с фильтрацией и поиском.
**Зависит от:** Phase 3

### Что строим

#### 8.1 — Данные
- Подключить GET /raids когда готов бэкенд
- До готовности: расширить MOCK_RAIDS до 8-10 разнообразных рейдов

#### 8.2 — Фильтры
- По stage: Planning / Active / Completed (pill-toggle группа)
- По роли: Frontend / Backend / DevOps / Design (multi-select chips)
- Поиск по title: debounced input, client-side

#### 8.3 — Состояния
- Loading: skeleton cards (3 штуки, пульсирующий градиент)
- Empty: SVG иллюстрация + "No raids match your filters"
- Error: retry кнопка

### Файлы
- `app/raids/page.tsx` — server fetch + client filter island
- `components/features/raids/raid-filters.tsx`
- `components/ui/skeleton-card.tsx`

---

## ⬜ Phase 9 — Captain Board: Review & Decisions
**Цель:** Капитан видит все заявки, одобряет или отклоняет кандидатов.
**Зависит от:** Phase 8

### Что строим

#### 9.1 — Applications List
- `/raids/[id]/board` — список заявок сгруппированных по роли
- Карточка заявки: аватар героя, роль, мотивация (truncated), статус, micro radar chart
- Загрузка: GET /applications?raid_id={id} (mock до бэкенда)

#### 9.2 — Approve / Reject
- Approve → статус "accepted", герой добавляется в Active Heroes Sheet
- Reject → статус "rejected", слот остаётся открытым
- Оба действия: optimistic update + mock

#### 9.3 — Active Heroes Sheet
- Секция внизу board: принятые герои сгруппированы по ролям
- Raid Status автоматически меняется на "In Progress" когда все слоты закрыты

### Файлы
- `app/raids/[id]/board/page.tsx` — полная реализация
- `components/features/raids/application-card.tsx`
- `components/features/raids/active-heroes-sheet.tsx`

---

## Зависимости между фазами

```
Phase 1 ✅
    └─► Phase 2 ✅
            └─► Phase 3 ✅
                    └─► Phase 4 (Design)
                            └─► Phase 5 (Onboarding)
                                    └─► Phase 6 (Hexagon)
                                            └─► Phase 7 (Roll Hero)

Phase 3 ✅
    └─► Phase 8 (Raid Board)
            └─► Phase 9 (Captain Board)
```

Фазы 7 и 8 можно вести параллельно после Phase 6 и Phase 3 соответственно.

---

## Backend зависимости (ждём от Исканлара)

| Endpoint | Нужен для | Фаза |
|----------|-----------|------|
| POST /onboarding | Сохранение soft skills | Phase 5 |
| GET /heroes | Список героев для matching | Phase 7 |
| POST /invites | Send Invite | Phase 7 |
| GET /raids | Список рейдов | Phase 8 |
| POST /raids | Создание рейда (сейчас mock) | Phase 8 |
| GET /applications | Заявки на рейд | Phase 9 |
| PATCH /applications/{id} | Approve/Reject | Phase 9 |
| PATCH /api/auth/user | Сохранение профиля (сейчас mock) | Phase 3 |

---

## Demo Checklist (хакатон)

Минимальный набор для впечатляющего демо:

- [x] Регистрация + логин
- [x] Создание рейда (/captain/new)
- [x] Apply на рейд (modal)
- [x] Редактирование профиля (skills, links)
- [ ] **Обновлённый дизайн** (Phase 4) — визуальное первое впечатление
- [ ] **Onboarding опросник** (Phase 5) — уникальная механика
- [ ] **Hexagon на профиле** (Phase 6) — WOW визуал
- [ ] **Roll Hero с D20** (Phase 7) — главная demo-фича

Phases 8-9 — желательно, но не блокеры для демо.

---

*Создано: 2026-04-02*
*Следующий шаг: `/gsd:plan-phase 4` — Design System Refresh*
