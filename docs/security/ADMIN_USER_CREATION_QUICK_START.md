# Создание Admin пользователя - Quick Start

## СРОЧНО: Создать второго admin

Email: `dolbpinisrail@gmail.com`
Password: `Tyt@12345`

---

## Метод 1: SQL в Supabase Dashboard (РЕКОМЕНДУЕТСЯ)

### Шаг 1: Откройте SQL Editor

https://supabase.com/dashboard/project/xyoaobelwkmrncvktrkv/sql

### Шаг 2: Скопируйте и выполните этот SQL

```sql
-- Создание admin пользователя dolbpinisrail@gmail.com
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
  crypt('Tyt@12345', gen_salt('bf')),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"username":"Admin User"}',
  now(),
  now()
)
ON CONFLICT (email) DO UPDATE
SET
  encrypted_password = crypt('Tyt@12345', gen_salt('bf')),
  email_confirmed_at = now(),
  confirmed_at = now();

-- Создание профиля с admin правами
INSERT INTO public.profiles (id, email, username, is_admin, role, xp, total_hashrate, vip_level, created_at, updated_at)
SELECT id, email, 'Admin User', true, 'admin', 0, 0, 'Bronze', now(), now()
FROM auth.users WHERE email = 'dolbpinisrail@gmail.com'
ON CONFLICT (id) DO UPDATE
SET is_admin = true, role = 'admin', updated_at = now();

-- Проверка
SELECT
  u.email,
  p.is_admin,
  p.role,
  u.email_confirmed_at,
  'Password: Tyt@12345' as credentials
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'dolbpinisrail@gmail.com';
```

### Шаг 3: Войдите в систему

- Email: `dolbpinisrail@gmail.com`
- Password: `Tyt@12345`

---

## Метод 2: Если нужен более сильный пароль

Замените `Tyt@12345` на более сложный пароль:

```sql
-- С более сильным паролем
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
  crypt('TakeYourToken2026!Admin', gen_salt('bf')),  -- Более сильный пароль
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"username":"Admin User"}',
  now(),
  now()
)
ON CONFLICT (email) DO UPDATE
SET encrypted_password = crypt('TakeYourToken2026!Admin', gen_salt('bf'));

-- Профиль
INSERT INTO public.profiles (id, email, username, is_admin, role, created_at)
SELECT id, email, 'Admin User', true, 'admin', now()
FROM auth.users WHERE email = 'dolbpinisrail@gmail.com'
ON CONFLICT (id) DO UPDATE SET is_admin = true, role = 'admin';
```

---

## Почему регистрация не работает?

### Проблема: "Password is known to be weak"

Supabase проверяет пароли по базе скомпрометированных паролей (Have I Been Pwned).

**Пароль `Tyt@12345` отклонен потому что:**
- Он слишком простой
- Возможно был скомпрометирован в утечках

### Решение для обычных пользователей

#### Вариант A: Используйте сильные пароли

Примеры хороших паролей:
- `TakeYourToken2026!`
- `MySecurePassword123!@#`
- `Str0ng!P@ssw0rd2026`

#### Вариант B: Настройте Supabase для тестирования

1. **Dashboard → Authentication → Policies**
2. Найдите **Password settings**
3. Временно снизьте требования (только для dev/testing!)

---

## Разрешение регистрации для всех пользователей

### Шаг 1: Проверьте настройки Auth

**Dashboard → Authentication → Providers:**
- Email Provider: **Enabled** ✓

**Dashboard → Authentication → Settings:**
- Enable email signup: **Enabled** ✓

### Шаг 2: Отключите email подтверждение (для тестирования)

**Dashboard → Authentication → Email:**
- Confirm email: **Disabled** (временно для тестирования)

### Шаг 3: Настройте Site URL

**Dashboard → Authentication → URL Configuration:**

**Site URL:**
```
https://your-correct-url.bolt.new
```

**Redirect URLs:**
```
https://your-correct-url.bolt.new/*
http://localhost:5173/*
```

### Шаг 4: Проверьте RLS политики

Убедитесь что есть INSERT политика для profiles:

```sql
-- Проверка политик
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- Должна быть политика типа:
-- "Users can insert own profile on signup" FOR INSERT
```

---

## Создание тестовых пользователей

### Массовое создание через SQL

```sql
-- Создание 10 тестовых пользователей
DO $$
DECLARE
  i INTEGER;
  test_email TEXT;
  test_user_id UUID;
BEGIN
  FOR i IN 1..10 LOOP
    test_email := 'testuser' || i || '@tyt.test';

    -- Создание пользователя
    INSERT INTO auth.users (
      instance_id, id, aud, role, email,
      encrypted_password, email_confirmed_at, confirmed_at,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated', 'authenticated',
      test_email,
      crypt('TestPassword123!', gen_salt('bf')),
      now(), now(),
      '{"provider":"email","providers":["email"]}',
      '{"username":"Test User ' || i || '"}',
      now(), now()
    )
    ON CONFLICT (email) DO NOTHING
    RETURNING id INTO test_user_id;

    -- Создание профиля
    INSERT INTO public.profiles (
      id, email, username, is_admin, role,
      xp, total_hashrate, vip_level,
      created_at, updated_at
    )
    VALUES (
      test_user_id,
      test_email,
      'Test User ' || i,
      false, 'user',
      0, 0, 'Bronze',
      now(), now()
    )
    ON CONFLICT (id) DO NOTHING;

    RAISE NOTICE 'Created user: % with password: TestPassword123!', test_email;
  END LOOP;
END $$;
```

---

## Проверка созданных пользователей

```sql
-- Список всех пользователей
SELECT
  u.email,
  p.username,
  p.is_admin,
  p.role,
  u.email_confirmed_at,
  u.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- Только админы
SELECT
  u.email,
  p.username,
  p.role,
  u.last_sign_in_at
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.is_admin = true;
```

---

## Безопасность

### ДЛЯ PRODUCTION:

⚠️ **НИКОГДА НЕ ИСПОЛЬЗУЙТЕ** слабые пароли!

✓ **ИСПОЛЬЗУЙТЕ:**
- Минимум 12 символов
- Заглавные и строчные буквы
- Цифры и специальные символы
- Уникальные пароли
- 2FA для админов

### ДЛЯ TESTING/DEVELOPMENT:

✓ Можно создавать через SQL
✓ Можно временно отключить email подтверждение
✓ Используйте отдельную staging базу
✓ Не храните реальные данные

---

## Troubleshooting

### "User already exists"

Если пользователь уже существует, обновите пароль:

```sql
UPDATE auth.users
SET encrypted_password = crypt('NewPassword123!', gen_salt('bf'))
WHERE email = 'dolbpinisrail@gmail.com';
```

### "Profile not created"

Создайте профиль вручную:

```sql
INSERT INTO public.profiles (id, email, username, is_admin, role, created_at)
SELECT id, email, 'Admin User', true, 'admin', now()
FROM auth.users WHERE email = 'dolbpinisrail@gmail.com'
ON CONFLICT (id) DO UPDATE SET is_admin = true, role = 'admin';
```

### "Cannot sign in"

Проверьте email подтвержден:

```sql
UPDATE auth.users
SET email_confirmed_at = now(), confirmed_at = now()
WHERE email = 'dolbpinisrail@gmail.com';
```

---

## Быстрая проверка всего

Выполните этот SQL для полной проверки:

```sql
-- Проверка Auth настроек
SELECT
  'Auth Settings' as check_type,
  bool_or(email_confirmed_at IS NOT NULL) as emails_confirmed,
  count(*) as total_users,
  count(*) FILTER (WHERE last_sign_in_at IS NOT NULL) as users_signed_in
FROM auth.users;

-- Проверка профилей
SELECT
  'Profiles' as check_type,
  count(*) as total_profiles,
  count(*) FILTER (WHERE is_admin = true) as admin_count,
  count(*) FILTER (WHERE role = 'user') as user_count
FROM public.profiles;

-- Проверка RLS
SELECT
  'RLS Policies' as check_type,
  tablename,
  count(*) as policy_count
FROM pg_policies
WHERE tablename IN ('profiles', 'miners', 'rewards')
GROUP BY tablename;

-- Админы
SELECT
  'Admin Users' as type,
  u.email,
  p.username,
  u.last_sign_in_at
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.is_admin = true;
```

---

## Контакты

Если нужна помощь:
- Проверьте Browser Console (F12) на ошибки
- Проверьте Supabase Auth Logs
- Полная документация: `docs/security/USER_REGISTRATION_GUIDE.md`
