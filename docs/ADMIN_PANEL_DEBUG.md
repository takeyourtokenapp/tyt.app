# Отладка админ-панели

## Что было сделано

### 1. Исправлена RLS политика на profiles

**Проблема:** Политика проверяла `id = auth.uid()`, но у пользователя ID в `profiles` и `auth.users` не совпадают:
- `profiles.id` = `111a98da-f202-4f72-907e-4a84187ce0cc`
- `auth.users.id` = другой ID

**Решение:** Изменена политика для поиска по email:

```sql
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    -- Можно просматривать свой профиль по email
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
    OR
    -- Можно просматривать профили рефералов
    id IN (...)
  );
```

### 2. Добавлено логирование для отладки

#### В useAdminCheck.ts:
```typescript
console.log('[useAdminCheck] Checking admin status for:', user.email);
console.log('[useAdminCheck] Profile result:', { profile, error });
console.log('[useAdminCheck] Setting isAdmin to:', adminStatus);
```

#### В AppLayout.tsx:
```typescript
console.log('[AppLayout] Admin status:', { isAdmin, adminLoading, userEmail: user?.email });
```

## Как проверить что работает

### 1. Откройте консоль браузера (F12)

### 2. Перезагрузите страницу (Ctrl+Shift+R)

### 3. Найдите логи:

**Ожидаемые логи при успехе:**
```
[useAdminCheck] Checking admin status for: olekfribel@hotmail.com
[useAdminCheck] Profile result: {
  profile: {
    is_admin: true,
    email: "olekfribel@hotmail.com",
    username: "olekfribel"
  },
  error: null
}
[useAdminCheck] Setting isAdmin to: true
[AppLayout] Admin status: { isAdmin: true, adminLoading: false, userEmail: "olekfribel@hotmail.com" }
```

**Логи при проблеме с RLS:**
```
[useAdminCheck] Checking admin status for: olekfribel@hotmail.com
[useAdminCheck] Profile result: { profile: null, error: null }
[useAdminCheck] Setting isAdmin to: false
[AppLayout] Admin status: { isAdmin: false, adminLoading: false, userEmail: "olekfribel@hotmail.com" }
```

**Логи при ошибке запроса:**
```
[useAdminCheck] Checking admin status for: olekfribel@hotmail.com
[useAdminCheck] Error fetching profile: { ... }
[useAdminCheck] Setting isAdmin to: false
```

### 4. Проверьте боковое меню

Если `isAdmin = true`, должна появиться группа **"Administration"** с красным значком Shield вверху меню, содержащая:
- Admin Dashboard
- Messages
- User Management
- Withdrawals
- Smart Contracts

## Если админ-панель всё ещё не появляется

### Проверка 1: Статус is_admin в БД

```sql
SELECT email, is_admin, kyc_level, vip_tier
FROM profiles
WHERE email = 'olekfribel@hotmail.com';

-- Ожидаемый результат:
-- email: olekfribel@hotmail.com
-- is_admin: true
-- kyc_level: 3
-- vip_tier: Diamond
```

### Проверка 2: RLS политика работает

```sql
-- Выполнить от имени пользователя (в Supabase SQL Editor с auth context)
SELECT is_admin, email
FROM profiles
WHERE email = 'olekfribel@hotmail.com';

-- Если возвращает результат - RLS работает
-- Если пусто - RLS блокирует
```

### Проверка 3: useAdminCheck вызывается

В коде `AppLayout.tsx` на строке 72:
```typescript
const { isAdmin, loading: adminLoading } = useAdminCheck();
```

Если хук не вызывается, проверьте:
- Импорт `useAdminCheck` есть
- `user` не null (пользователь авторизован)

### Проверка 4: Сеть

Откройте DevTools → Network → фильтр "profiles":
- Должен быть запрос к `/rest/v1/profiles?email=eq.olekfribel@hotmail.com`
- Status должен быть 200
- Response должен содержать `{ is_admin: true }`

Если Status 401/403 - проблема с RLS или auth token.

## Возможные проблемы и решения

### Проблема: profile: null, error: null

**Причина:** RLS блокирует чтение

**Решение:**
```sql
-- Проверить что миграция применена
SELECT * FROM supabase_migrations.schema_migrations
WHERE name = 'fix_profiles_rls_for_admin_check';

-- Если нет, применить вручную:
DROP POLICY IF EXISTS "Users can view profiles" ON profiles;

CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );
```

### Проблема: isAdmin всегда false

**Причина:** Поле is_admin не true в БД

**Решение:**
```sql
UPDATE profiles
SET is_admin = true
WHERE email = 'olekfribel@hotmail.com';
```

### Проблема: adminGroup не добавляется в navGroups

**Причина:** Условие `...(isAdmin ? [adminGroup] : [])` не срабатывает

**Отладка:**
```typescript
// В AppLayout.tsx добавить:
console.log('[AppLayout] Creating navGroups, isAdmin:', isAdmin);
console.log('[AppLayout] adminGroup will be added:', isAdmin ? 'YES' : 'NO');

const navGroups: NavGroup[] = [
  ...(isAdmin ? [adminGroup] : []),
  // ...
];

console.log('[AppLayout] Final navGroups count:', navGroups.length);
```

### Проблема: React не ре-рендерит меню

**Причина:** isAdmin меняется, но компонент не обновляется

**Решение:**
```typescript
// В AppLayout.tsx добавить useEffect:
useEffect(() => {
  console.log('[AppLayout] isAdmin changed to:', isAdmin);
}, [isAdmin]);
```

## Временное решение для тестирования

Если нужно срочно проверить админ-панель:

```typescript
// В AppLayout.tsx временно:
const { isAdmin: realIsAdmin } = useAdminCheck();
const isAdmin = true; // ← форсируем true для теста

console.log('[AppLayout] Real admin status:', realIsAdmin);
console.log('[AppLayout] Forced admin status:', isAdmin);
```

**ВАЖНО:** Удалить это после тестирования!

## Контакты для поддержки

Если проблема не решается:
1. Скопируйте все логи из консоли
2. Сделайте скриншот Network tab
3. Выполните SQL проверки выше
4. Опишите что видите в логах

---

**Дата:** 2026-01-11
**Версия:** 1.0
**Статус:** Debug Guide
