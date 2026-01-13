-- ============================================
-- EMERGENCY ADMIN SETUP FOR TAKEYOURTOKEN.APP
-- ============================================
-- Используйте этот скрипт если не можете войти в систему
-- Project: xyoaobelwkmrncvktrkv
-- Domain: https://takeyourtoken.app
-- ============================================

-- ВАЖНО: Сначала настройте Site URL и Redirect URLs в Supabase Dashboard!

-- ============================================
-- ШАГ 1: ПРОВЕРКА ТЕКУЩИХ ПОЛЬЗОВАТЕЛЕЙ
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '===========================================';
  RAISE NOTICE 'EMERGENCY ADMIN SETUP - STARTING';
  RAISE NOTICE '===========================================';
END $$;

-- Показать всех существующих пользователей
SELECT
  'Существующие пользователи:' as info;

SELECT
  email,
  email_confirmed_at IS NOT NULL as email_confirmed,
  created_at,
  last_sign_in_at,
  CASE
    WHEN last_sign_in_at IS NOT NULL THEN 'Входил'
    ELSE 'Никогда не входил'
  END as login_status
FROM auth.users
ORDER BY created_at DESC;

-- ============================================
-- ШАГ 2: УДАЛЕНИЕ СТАРЫХ ТЕСТОВЫХ ПОЛЬЗОВАТЕЛЕЙ (ОПЦИОНАЛЬНО)
-- ============================================

-- РАСКОММЕНТИРУЙТЕ ЕСЛИ НУЖНО ОЧИСТИТЬ СТАРЫХ ПОЛЬЗОВАТЕЛЕЙ
-- DELETE FROM auth.users WHERE email LIKE '%test%';
-- DELETE FROM auth.users WHERE created_at < NOW() - INTERVAL '7 days' AND last_sign_in_at IS NULL;

-- ============================================
-- ШАГ 3: СОЗДАНИЕ/ОБНОВЛЕНИЕ ADMIN 1
-- ============================================

-- Удалить старого пользователя если есть
DELETE FROM public.profiles WHERE email = 'olekfribel@icloud.com';
DELETE FROM auth.users WHERE email = 'olekfribel@icloud.com';

-- Создать нового admin 1
DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Создать пользователя
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
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
    crypt('TYT2026!SecureAdmin', gen_salt('bf')),
    now(),
    now(),
    NULL,
    NULL,
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"username":"Olek Admin"}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    ''
  )
  RETURNING id INTO new_user_id;

  -- Создать профиль
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
  VALUES (
    new_user_id,
    'olekfribel@icloud.com',
    'Olek Admin',
    true,
    'admin',
    0,
    0,
    'Bronze',
    now(),
    now()
  );

  RAISE NOTICE '✓ Admin 1 создан: olekfribel@icloud.com';
END $$;

-- ============================================
-- ШАГ 4: СОЗДАНИЕ/ОБНОВЛЕНИЕ ADMIN 2
-- ============================================

-- Удалить старого пользователя если есть
DELETE FROM public.profiles WHERE email = 'dolbpinisrail@gmail.com';
DELETE FROM auth.users WHERE email = 'dolbpinisrail@gmail.com';

-- Создать нового admin 2
DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Создать пользователя
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
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
    crypt('TYT2026!SecureAdmin', gen_salt('bf')),
    now(),
    now(),
    NULL,
    NULL,
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"username":"Admin User"}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    ''
  )
  RETURNING id INTO new_user_id;

  -- Создать профиль
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
  VALUES (
    new_user_id,
    'dolbpinisrail@gmail.com',
    'Admin User',
    true,
    'admin',
    0,
    0,
    'Bronze',
    now(),
    now()
  );

  RAISE NOTICE '✓ Admin 2 создан: dolbpinisrail@gmail.com';
END $$;

-- ============================================
-- ШАГ 5: ПРОВЕРКА СОЗДАННЫХ ПОЛЬЗОВАТЕЛЕЙ
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '===========================================';
  RAISE NOTICE 'ADMIN ПОЛЬЗОВАТЕЛИ СОЗДАНЫ';
  RAISE NOTICE '===========================================';
END $$;

SELECT
  '✓ ADMIN CREDENTIALS' as info,
  '' as line;

SELECT
  ROW_NUMBER() OVER (ORDER BY u.created_at) as "#",
  u.email,
  p.username,
  p.is_admin,
  p.role,
  u.email_confirmed_at IS NOT NULL as confirmed,
  'TYT2026!SecureAdmin' as password
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email IN ('olekfribel@icloud.com', 'dolbpinisrail@gmail.com')
ORDER BY u.created_at;

-- ============================================
-- ШАГ 6: ПРОВЕРКА БЕЗОПАСНОСТИ
-- ============================================

SELECT
  '✓ SECURITY CHECK' as info,
  '' as line;

-- RLS включен?
SELECT
  'RLS Status' as check_type,
  tablename,
  rowsecurity,
  CASE
    WHEN rowsecurity THEN '✓ Включен'
    ELSE '✗ ВЫКЛЮЧЕН - ОПАСНО!'
  END as status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'miners', 'rewards', 'custodial_wallets')
ORDER BY tablename;

-- Количество политик
SELECT
  'RLS Policies' as check_type,
  COUNT(*) as total_policies,
  CASE
    WHEN COUNT(*) >= 100 THEN '✓ Хорошо'
    WHEN COUNT(*) >= 50 THEN '⚠ Недостаточно'
    ELSE '✗ Мало политик!'
  END as status
FROM pg_policies;

-- ============================================
-- ШАГ 7: БЫСТРАЯ ДИАГНОСТИКА
-- ============================================

SELECT
  '✓ QUICK DIAGNOSTICS' as info,
  '' as line;

-- Количество таблиц
SELECT
  'Таблицы' as metric,
  COUNT(*) as value,
  CASE
    WHEN COUNT(*) >= 50 THEN '✓ Полная база'
    WHEN COUNT(*) >= 20 THEN '⚠ Частичная'
    ELSE '✗ Мало таблиц'
  END as status
FROM pg_tables
WHERE schemaname = 'public';

-- Количество пользователей
SELECT
  'Пользователи' as metric,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE email_confirmed_at IS NOT NULL) as confirmed,
  COUNT(*) FILTER (WHERE last_sign_in_at IS NOT NULL) as active,
  CASE
    WHEN COUNT(*) >= 2 THEN '✓ OK'
    WHEN COUNT(*) = 1 THEN '⚠ Только 1'
    ELSE '✗ Нет пользователей'
  END as status
FROM auth.users;

-- Количество админов
SELECT
  'Админы' as metric,
  COUNT(*) as total,
  CASE
    WHEN COUNT(*) >= 2 THEN '✓ OK'
    WHEN COUNT(*) = 1 THEN '⚠ Только 1'
    ELSE '✗ Нет админов'
  END as status
FROM public.profiles
WHERE is_admin = true;

-- ============================================
-- ИТОГОВАЯ ИНФОРМАЦИЯ
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '===========================================';
  RAISE NOTICE '✓ SETUP COMPLETE';
  RAISE NOTICE '===========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Теперь войдите на: https://takeyourtoken.app/login';
  RAISE NOTICE '';
  RAISE NOTICE 'Email: olekfribel@icloud.com';
  RAISE NOTICE 'Password: TYT2026!SecureAdmin';
  RAISE NOTICE '';
  RAISE NOTICE 'ИЛИ';
  RAISE NOTICE '';
  RAISE NOTICE 'Email: dolbpinisrail@gmail.com';
  RAISE NOTICE 'Password: TYT2026!SecureAdmin';
  RAISE NOTICE '';
  RAISE NOTICE '===========================================';
  RAISE NOTICE 'ВАЖНО: СМЕНИТЕ ПАРОЛИ ПОСЛЕ ПЕРВОГО ВХОДА!';
  RAISE NOTICE '===========================================';
END $$;

-- ============================================
-- ДОПОЛНИТЕЛЬНО: СБРОС ПАРОЛЯ ДЛЯ ЛЮБОГО ПОЛЬЗОВАТЕЛЯ
-- ============================================

-- Используйте эту команду если нужно сбросить пароль для конкретного пользователя:

-- UPDATE auth.users
-- SET encrypted_password = crypt('NewPassword123!', gen_salt('bf')),
--     updated_at = now()
-- WHERE email = 'user@example.com';

-- ============================================
-- ДОПОЛНИТЕЛЬНО: СДЕЛАТЬ ЛЮБОГО ПОЛЬЗОВАТЕЛЯ АДМИНОМ
-- ============================================

-- Используйте эту команду если нужно дать права админа существующему пользователю:

-- UPDATE public.profiles
-- SET is_admin = true,
--     role = 'admin',
--     updated_at = now()
-- WHERE email = 'user@example.com';
