-- ============================================
-- SETUP ADMIN USERS FOR TAKEYOURTOKEN.APP
-- ============================================
-- Domain: https://takeyourtoken.app
-- Supabase Project: xyoaobelwkmrncvktrkv
-- ============================================

-- ВАЖНО: Сначала настройте Site URL в Supabase Dashboard!
-- https://supabase.com/dashboard/project/xyoaobelwkmrncvktrkv/auth/url-configuration
-- Site URL: https://takeyourtoken.app

-- ============================================
-- ШАГ 1: ПРОВЕРКА СУЩЕСТВУЮЩИХ ПОЛЬЗОВАТЕЛЕЙ
-- ============================================

SELECT
  '=== EXISTING USERS CHECK ===' as check_type,
  '======================================' as line;

SELECT
  email,
  email_confirmed_at IS NOT NULL as email_confirmed,
  created_at,
  last_sign_in_at
FROM auth.users
ORDER BY created_at DESC;

-- ============================================
-- ШАГ 2: СОЗДАНИЕ/ОБНОВЛЕНИЕ ADMIN 1
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
  updated_at,
  last_sign_in_at,
  is_super_admin,
  phone,
  phone_confirmed_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
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
  now(),
  NULL,
  false,
  NULL,
  NULL,
  '',
  '',
  '',
  ''
)
ON CONFLICT (email) DO UPDATE
SET
  encrypted_password = crypt('TakeYourToken2026!Admin', gen_salt('bf')),
  email_confirmed_at = now(),
  confirmed_at = now(),
  updated_at = now();

-- Профиль для admin 1
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

-- ============================================
-- ШАГ 3: СОЗДАНИЕ/ОБНОВЛЕНИЕ ADMIN 2
-- ============================================

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
  updated_at,
  last_sign_in_at,
  is_super_admin,
  phone,
  phone_confirmed_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
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
  now(),
  NULL,
  false,
  NULL,
  NULL,
  '',
  '',
  '',
  ''
)
ON CONFLICT (email) DO UPDATE
SET
  encrypted_password = crypt('TakeYourToken2026!', gen_salt('bf')),
  email_confirmed_at = now(),
  confirmed_at = now(),
  updated_at = now();

-- Профиль для admin 2
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
-- ШАГ 4: ОБНОВЛЕНИЕ СТАРОГО ADMIN (если есть)
-- ============================================

-- Обновляем olekfribel@hotmail.com если он существует
UPDATE auth.users
SET
  encrypted_password = crypt('TakeYourToken2026!Admin', gen_salt('bf')),
  email_confirmed_at = now(),
  confirmed_at = now(),
  updated_at = now()
WHERE email = 'olekfribel@hotmail.com';

UPDATE public.profiles
SET
  is_admin = true,
  role = 'admin',
  username = 'Olek Admin (old)',
  updated_at = now()
WHERE email = 'olekfribel@hotmail.com';

-- ============================================
-- ШАГ 5: ПРОВЕРКА СОЗДАННЫХ ПОЛЬЗОВАТЕЛЕЙ
-- ============================================

SELECT
  '✓ ADMIN ПОЛЬЗОВАТЕЛИ СОЗДАНЫ/ОБНОВЛЕНЫ' as status,
  '======================================' as line;

SELECT
  'Admin #' || ROW_NUMBER() OVER (ORDER BY u.created_at) as number,
  u.email,
  p.username,
  p.is_admin,
  p.role,
  u.email_confirmed_at IS NOT NULL as email_confirmed,
  CASE u.email
    WHEN 'olekfribel@icloud.com' THEN 'Password: TakeYourToken2026!Admin'
    WHEN 'dolbpinisrail@gmail.com' THEN 'Password: TakeYourToken2026!'
    WHEN 'olekfribel@hotmail.com' THEN 'Password: TakeYourToken2026!Admin'
  END as credentials
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email IN (
  'olekfribel@icloud.com',
  'dolbpinisrail@gmail.com',
  'olekfribel@hotmail.com'
)
ORDER BY u.created_at;

-- ============================================
-- ШАГ 6: ПРОВЕРКА БАЗЫ ДАННЫХ
-- ============================================

SELECT
  '✓ DATABASE CHECK' as check_type,
  '======================================' as line;

-- Количество таблиц
SELECT
  'Таблицы' as object_type,
  COUNT(*) as count,
  CASE
    WHEN COUNT(*) >= 50 THEN '✓ OK'
    WHEN COUNT(*) >= 20 THEN '⚠ Некоторые миграции не применены'
    ELSE '✗ Мало таблиц!'
  END as status
FROM pg_tables
WHERE schemaname = 'public';

-- Количество пользователей
SELECT
  'Пользователи' as object_type,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE email_confirmed_at IS NOT NULL) as confirmed,
  CASE
    WHEN COUNT(*) >= 1 THEN '✓ OK'
    ELSE '✗ Нет пользователей'
  END as status
FROM auth.users;

-- Количество админов
SELECT
  'Админы' as object_type,
  COUNT(*) as count,
  CASE
    WHEN COUNT(*) >= 2 THEN '✓ OK - 2+ админа'
    WHEN COUNT(*) = 1 THEN '⚠ Только 1 админ'
    ELSE '✗ Нет админов!'
  END as status
FROM public.profiles
WHERE is_admin = true;

-- RLS проверка
SELECT
  'RLS Политики' as object_type,
  COUNT(*) as count,
  CASE
    WHEN COUNT(*) >= 100 THEN '✓ OK'
    WHEN COUNT(*) >= 50 THEN '⚠ Некоторые отсутствуют'
    ELSE '✗ Мало политик'
  END as status
FROM pg_policies;

-- ============================================
-- ШАГ 7: СПИСОК ВСЕХ АДМИНОВ
-- ============================================

SELECT
  '✓ ALL ADMIN USERS' as check_type,
  '======================================' as line;

SELECT
  u.email,
  p.username,
  p.is_admin,
  p.role,
  u.created_at,
  u.last_sign_in_at,
  CASE
    WHEN u.last_sign_in_at IS NOT NULL THEN '✓ Входил'
    ELSE '⚠ Не входил'
  END as login_status
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.is_admin = true
ORDER BY u.created_at;

-- ============================================
-- ИТОГОВАЯ ИНФОРМАЦИЯ
-- ============================================

SELECT
  '======================================' as line,
  '✓ SETUP COMPLETE FOR TAKEYOURTOKEN.APP' as status,
  '======================================' as line2;

SELECT
  'Production Domain:' as info,
  'https://takeyourtoken.app' as value;

SELECT
  'Supabase Project:' as info,
  'xyoaobelwkmrncvktrkv' as value;

SELECT
  'Admin Credentials:' as info,
  '' as line;

SELECT
  'Admin 1:' as user,
  'olekfribel@icloud.com' as email,
  'TakeYourToken2026!Admin' as password;

SELECT
  'Admin 2:' as user,
  'dolbpinisrail@gmail.com' as email,
  'TakeYourToken2026!' as password;

SELECT
  '======================================' as line,
  'ВАЖНО: НАСТРОЙТЕ SITE URL!' as warning,
  '======================================' as line2;

SELECT
  'Dashboard → Authentication → URL Configuration' as where,
  'Site URL: https://takeyourtoken.app' as action,
  'Redirect URLs: https://takeyourtoken.app/*' as redirect;

-- ============================================
-- ДОПОЛНИТЕЛЬНЫЕ ПРОВЕРКИ БЕЗОПАСНОСТИ
-- ============================================

SELECT
  '✓ SECURITY CHECKS' as check_type,
  '======================================' as line;

-- Проверка что RLS включен на критичных таблицах
SELECT
  tablename,
  rowsecurity,
  CASE
    WHEN rowsecurity THEN '✓ RLS включен'
    ELSE '✗ RLS ВЫКЛЮЧЕН!'
  END as status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'miners', 'rewards', 'custodial_wallets', 'marketplace_listings')
ORDER BY tablename;

-- Проверка email confirmation
SELECT
  'Email Confirmation' as check_type,
  COUNT(*) FILTER (WHERE email_confirmed_at IS NOT NULL) as confirmed,
  COUNT(*) FILTER (WHERE email_confirmed_at IS NULL) as unconfirmed,
  CASE
    WHEN COUNT(*) FILTER (WHERE email_confirmed_at IS NULL) = 0 THEN '✓ Все подтверждены'
    ELSE '⚠ Есть неподтвержденные'
  END as status
FROM auth.users;

-- ============================================
-- СЛЕДУЮЩИЕ ШАГИ
-- ============================================

SELECT
  '======================================' as line,
  'СЛЕДУЮЩИЕ ШАГИ' as title,
  '======================================' as line2;

SELECT 1 as step, 'Настройте Site URL: https://takeyourtoken.app' as action;
SELECT 2 as step, 'Добавьте Redirect URLs: https://takeyourtoken.app/*' as action;
SELECT 3 as step, 'Войдите на https://takeyourtoken.app/login' as action;
SELECT 4 as step, 'Протестируйте все функции' as action;
SELECT 5 as step, 'Включите Email Confirmation для production' as action;
SELECT 6 as step, 'Настройте 2FA для admin аккаунтов' as action;
SELECT 7 as step, 'Настройте Rate Limits' as action;
SELECT 8 as step, 'НЕМЕДЛЕННО смените пароли на более безопасные!' as action;
