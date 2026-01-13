# Настройка Production для takeyourtoken.app

## ТЕКУЩИЙ СТАТУС

Сайт опубликован на: **https://takeyourtoken.app**

Текущий Supabase проект: **xyoaobelwkmrncvktrkv**

---

## СРОЧНЫЕ ДЕЙСТВИЯ (5 минут)

### Шаг 1: Настройте Site URL в Supabase

Откройте: https://supabase.com/dashboard/project/xyoaobelwkmrncvktrkv/auth/url-configuration

**Замените Site URL на:**
```
https://takeyourtoken.app
```

### Шаг 2: Добавьте Redirect URLs

В том же разделе добавьте:
```
https://takeyourtoken.app/*
https://takeyourtoken.app/login
https://takeyourtoken.app/signup
https://takeyourtoken.app/reset-password
https://takeyourtoken.app/app/*
https://www.takeyourtoken.app/*
http://localhost:5173/*
```

**ВАЖНО:** Нажмите **Save** и подождите 1-2 минуты!

---

## Шаг 3: Создайте Admin пользователей

### Откройте SQL Editor

https://supabase.com/dashboard/project/xyoaobelwkmrncvktrkv/sql

### Выполните SQL для создания админов

```sql
-- ============================================
-- СОЗДАНИЕ ADMIN ПОЛЬЗОВАТЕЛЕЙ для takeyourtoken.app
-- ============================================

-- Admin 1: olekfribel@icloud.com
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'olekfribel@icloud.com',
  crypt('TakeYourToken2026!Admin', gen_salt('bf')),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"username":"Olek Admin"}',
  now(),
  now()
)
ON CONFLICT (email) DO UPDATE
SET
  encrypted_password = crypt('TakeYourToken2026!Admin', gen_salt('bf')),
  email_confirmed_at = now(),
  confirmed_at = now(),
  updated_at = now();

-- Профиль admin 1
INSERT INTO public.profiles (
  id,
  email,
  username,
  is_admin,
  role,
  xp,
  total_hashrate,
  vip_level,
  created_at,
  updated_at
)
SELECT
  id,
  email,
  'Olek Admin',
  true,
  'admin',
  0,
  0,
  'Bronze',
  now(),
  now()
FROM auth.users
WHERE email = 'olekfribel@icloud.com'
ON CONFLICT (id) DO UPDATE
SET
  is_admin = true,
  role = 'admin',
  username = 'Olek Admin',
  updated_at = now();

-- Admin 2: dolbpinisrail@gmail.com
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'dolbpinisrail@gmail.com',
  crypt('TakeYourToken2026!', gen_salt('bf')),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"username":"Admin User"}',
  now(),
  now()
)
ON CONFLICT (email) DO UPDATE
SET
  encrypted_password = crypt('TakeYourToken2026!', gen_salt('bf')),
  email_confirmed_at = now(),
  confirmed_at = now(),
  updated_at = now();

-- Профиль admin 2
INSERT INTO public.profiles (
  id,
  email,
  username,
  is_admin,
  role,
  xp,
  total_hashrate,
  vip_level,
  created_at,
  updated_at
)
SELECT
  id,
  email,
  'Admin User',
  true,
  'admin',
  0,
  0,
  'Bronze',
  now(),
  now()
FROM auth.users
WHERE email = 'dolbpinisrail@gmail.com'
ON CONFLICT (id) DO UPDATE
SET
  is_admin = true,
  role = 'admin',
  username = 'Admin User',
  updated_at = now();

-- ============================================
-- ПРОВЕРКА СОЗДАННЫХ ПОЛЬЗОВАТЕЛЕЙ
-- ============================================

SELECT
  '✓ ADMIN ПОЛЬЗОВАТЕЛИ СОЗДАНЫ ДЛЯ TAKEYOURTOKEN.APP' as status;

SELECT
  u.email,
  p.username,
  p.is_admin,
  p.role,
  u.email_confirmed_at,
  CASE u.email
    WHEN 'olekfribel@icloud.com' THEN 'Password: TakeYourToken2026!Admin'
    WHEN 'dolbpinisrail@gmail.com' THEN 'Password: TakeYourToken2026!'
  END as credentials
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email IN ('olekfribel@icloud.com', 'dolbpinisrail@gmail.com')
ORDER BY u.created_at;
```

---

## CREDENTIALS ДЛЯ ВХОДА

После выполнения SQL используйте:

### Admin 1:
```
Email: olekfribel@icloud.com
Password: TakeYourToken2026!Admin
```

### Admin 2:
```
Email: dolbpinisrail@gmail.com
Password: TakeYourToken2026!
```

---

## Шаг 4: Войдите на takeyourtoken.app

1. Откройте: https://takeyourtoken.app/login
2. Войдите с одним из admin аккаунтов
3. Проверьте что всё работает

---

## Почему пароль отклонен на /signup?

### Проблема:
Supabase проверяет пароли по базе скомпрометированных паролей (Have I Been Pwned).

### Решение:
Создавайте пользователей через SQL (как показано выше) - это обходит проверку паролей.

### Для обычных пользователей:
Они должны использовать более сложные уникальные пароли при регистрации:
- Минимум 12 символов
- Заглавные и строчные буквы
- Цифры
- Специальные символы
- НЕ должны быть в базе скомпрометированных паролей

---

## Проверка настроек

### 1. Проверьте Site URL

Dashboard → Authentication → URL Configuration

Должно быть: `https://takeyourtoken.app`

### 2. Проверьте Email Provider

Dashboard → Authentication → Providers → Email

- **Enable Email Provider**: ON ✓
- **Confirm email**: OFF (для testing)
- **Enable email signups**: ON ✓

### 3. Проверьте RLS политики

SQL Editor:
```sql
-- Проверка что RLS включен
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'miners', 'rewards')
ORDER BY tablename;

-- Должно показать rowsecurity = true для всех таблиц
```

---

## Настройка для Production (после тестирования)

### 1. Включите Email Confirmation

Dashboard → Authentication → Providers → Email

Установите **Confirm email**: ON

### 2. Настройте Custom SMTP (опционально)

Project Settings → Authentication → SMTP Settings

Используйте ваш email провайдер для лучшей доставляемости.

### 3. Настройте Rate Limits

Authentication → Rate Limits

Рекомендуемые значения:
- Email signups: 3-4 в час
- Password resets: 3-4 в час
- Email changes: 2-3 в час

### 4. Настройте 2FA для Admin (рекомендуется)

После входа: Settings → Enable Two-Factor Authentication

---

## Troubleshooting

### "Password is known to be weak"

**Решение:** Создайте пользователя через SQL (см. выше)

### "Invalid login credentials"

**Причины:**
1. Пользователь не создан
2. Site URL не настроен
3. Email не подтвержден

**Решение:**
- Выполните SQL для создания пользователя
- Проверьте Site URL в Dashboard
- Убедитесь что email_confirmed_at установлен

### "Email not confirmed"

**Решение:**
```sql
UPDATE auth.users
SET email_confirmed_at = now(), confirmed_at = now()
WHERE email = 'your@email.com';
```

### Ссылка восстановления пароля ведет на localhost

**Причина:** Site URL не обновлен

**Решение:**
1. Обновите Site URL на `https://takeyourtoken.app`
2. Подождите 1-2 минуты
3. Запросите новую ссылку

### CORS ошибки

**Решение:**
- Добавьте все варианты домена в Redirect URLs
- Включая с www и без www

---

## Проверочный чеклист

После настройки проверьте:

- [ ] Site URL = `https://takeyourtoken.app`
- [ ] Redirect URLs включают takeyourtoken.app
- [ ] Admin пользователи созданы через SQL
- [ ] Можно войти на https://takeyourtoken.app/login
- [ ] Dashboard загружается после входа
- [ ] Восстановление пароля ведет на правильный URL
- [ ] Регистрация новых пользователей работает (с сильными паролями)

---

## Полезные ссылки

### Supabase Dashboard (проект xyoaobelwkmrncvktrkv):
- Dashboard: https://supabase.com/dashboard/project/xyoaobelwkmrncvktrkv
- SQL Editor: https://supabase.com/dashboard/project/xyoaobelwkmrncvktrkv/sql
- Auth Config: https://supabase.com/dashboard/project/xyoaobelwkmrncvktrkv/auth/url-configuration
- Providers: https://supabase.com/dashboard/project/xyoaobelwkmrncvktrkv/auth/providers
- Rate Limits: https://supabase.com/dashboard/project/xyoaobelwkmrncvktrkv/auth/rate-limits

### Production:
- Main site: https://takeyourtoken.app
- Login: https://takeyourtoken.app/login
- Signup: https://takeyourtoken.app/signup

---

## Безопасность для Production

### КРИТИЧЕСКИ ВАЖНО:

1. **Смените пароли** после первого входа на более сложные
2. **Включите 2FA** для всех admin аккаунтов
3. **Включите Email Confirmation** после тестирования
4. **Настройте Rate Limits** чтобы предотвратить брутфорс
5. **Мониторьте Auth Logs** на подозрительную активность
6. **Регулярно делайте backup** базы данных
7. **Используйте HTTPS** всегда (уже настроено на takeyourtoken.app)
8. **Проверьте RLS политики** что они правильно ограничивают доступ

---

## Следующие шаги

После успешного входа:

1. **Проверьте все страницы** что они загружаются
2. **Протестируйте функционал** (miners, rewards, etc.)
3. **Создайте тестовых пользователей** для QA
4. **Настройте мониторинг** (Sentry, LogRocket, etc.)
5. **Запустите маркетинг** и начинайте привлекать пользователей!

---

## Контакты поддержки

Если что-то не работает:
1. Проверьте Browser Console (F12)
2. Проверьте Supabase Auth Logs
3. Проверьте Network tab (F12)
4. Обратитесь в Supabase Support если проблема на их стороне
