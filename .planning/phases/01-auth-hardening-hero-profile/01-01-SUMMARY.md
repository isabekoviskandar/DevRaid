---
phase: 01-auth-hardening-hero-profile
plan: 01
status: complete
---

# Summary: Auth Hardening & Hero Profile

## Delivered

- `app/captain/new/page.tsx` — новая страница с auth guard: `useEffect` проверяет `authStore.isAuthenticated()`, при отсутствии токена вызывает `router.replace('/login')`, возвращает `null` пока проверка не завершена (no flash of content)
- `app/hero/me/page.tsx` — полностью переписана: убран `MOCK_HERO` и `HeroProfile`, добавлена загрузка реального пользователя через `api.auth.getUser(token)` с 3 состояниями (loading / authenticated / unauthenticated)

## Files Changed

- `app/captain/new/page.tsx` (создан): Client Component с auth guard → redirect to /login
- `app/hero/me/page.tsx` (переписан): Client Component с реальными данными из `ApiUser`

## Must-Have Verification

- [x] Unauthenticated → /captain/new → redirects to /login (router.replace, не push)
- [x] Authenticated → /hero/me → показывает реальные username/email из API
- [x] Logged-out → /hero/me → graceful fallback "Sign in to view your profile.", не крашится
- [x] No hydration mismatch — localStorage доступен только в useEffect, не в теле рендера

## Notes

- `router.replace` вместо `router.push` — Back кнопка не возвращает на защищённую страницу
- Оптимистичное отображение: cached user из `authStore.getUser()` показывается немедленно, затем перевалидируется через API
- Поля `display_name`, `hard_skills`, `soft_profile`, `reputation` удалены — их нет в `ApiUser`
- HexRadar удалён из /hero/me — зависел от несуществующих данных
- Секции навыков заменены на честный placeholder "coming in a future update"
- TypeScript: `tsc --noEmit` — чисто, 0 ошибок
