# Исправление Auth после Publish

## ПРОБЛЕМА
Dev работает → Production не работает после Publish

## ПРИЧИНА
Вы переключились на НОВЫЙ Supabase проект: `0ec90b57d6e95fcbda19832f`

Старый проект: `xyoaobelwkmrncvktrkv` (там были ваши пользователи)

---

## РЕШЕНИЕ (10 минут)

### 1. Откройте SQL Editor
https://supabase.com/dashboard/project/0ec90b57d6e95fcbda19832f/sql

### 2. Выполните SQL для создания админов

```sql
-- Admin 1
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'olekfribel@hotmail.com', crypt('TempPassword123!', gen_salt('bf')), now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now())
ON CONFLICT (email) DO UPDATE SET encrypted_password = crypt('TempPassword123!', gen_salt('bf')), email_confirmed_at = now();

INSERT INTO public.profiles (id, email, username, is_admin, role, created_at)
SELECT id, email, 'Olek Admin', true, 'admin', now() FROM auth.users WHERE email = 'olekfribel@hotmail.com'
ON CONFLICT (id) DO UPDATE SET is_admin = true, role = 'admin';

-- Admin 2
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'dolbpinisrail@gmail.com', crypt('Tyt@12345', gen_salt('bf')), now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now())
ON CONFLICT (email) DO UPDATE SET encrypted_password = crypt('Tyt@12345', gen_salt('bf')), email_confirmed_at = now();

INSERT INTO public.profiles (id, email, username, is_admin, role, created_at)
SELECT id, email, 'Admin User', true, 'admin', now() FROM auth.users WHERE email = 'dolbpinisrail@gmail.com'
ON CONFLICT (id) DO UPDATE SET is_admin = true, role = 'admin';
```

### 3. Найдите production URL
- Bolt.new → Publish → скопируйте URL

### 4. Настройте Site URL
https://supabase.com/dashboard/project/0ec90b57d6e95fcbda19832f/auth/url-configuration

Site URL: `https://your-url.bolt.new`

Redirect URLs:
```
https://your-url.bolt.new/*
http://localhost:5173/*
```

### 5. Войдите
- Email: `olekfribel@hotmail.com`
- Password: `TempPassword123!`

---

Полная инструкция: `scripts/setup-new-supabase-project.sql`
