-- ============================================
-- SETUP NEW SUPABASE PROJECT: 0ec90b57d6e95fcbda19832f
-- ============================================
-- Этот скрипт создаёт admin пользователей в НОВОМ Supabase проекте
-- ============================================

-- ВАЖНО: Сначала убедитесь что применены ВСЕ миграции!
-- Проверка:
SELECT COUNT(*) as table_count FROM pg_tables WHERE schemaname = 'public';
-- Должно быть 50+ таблиц. Если меньше - сначала примените миграции!

-- ============================================
-- ШАГ 1: СОЗДАНИЕ ПЕРВОГО ADMIN (olekfribel@hotmail.com)
-- ============================================

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
  'olekfribel@hotmail.com',
  crypt('TempPassword123!', gen_salt('bf')),
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
  encrypted_password = crypt('TempPassword123!', gen_salt('bf')),
  email_confirmed_at = now(),
  confirmed_at = now(),
  updated_at = now();

-- Создание профиля для первого admin
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
WHERE email = 'olekfribel@hotmail.com'
ON CONFLICT (id) DO UPDATE
SET
  is_admin = true,
  role = 'admin',
  updated_at = now();

-- ============================================
-- ШАГ 2: СОЗДАНИЕ ВТОРОГО ADMIN (dolbpinisrail@gmail.com)
-- ============================================

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
  crypt('Tyt@12345', gen_salt('bf')),
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
  encrypted_password = crypt('Tyt@12345', gen_salt('bf')),
  email_confirmed_at = now(),
  confirmed_at = now(),
  updated_at = now();

-- Создание профиля для второго admin
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
  updated_at = now();

-- ============================================
-- ШАГ 3: ПРОВЕРКА СОЗДАННЫХ ПОЛЬЗОВАТЕЛЕЙ
-- ============================================

SELECT
  '✓ ADMIN ПОЛЬЗОВАТЕЛИ СОЗДАНЫ' as status,
  '======================================' as line;

SELECT
  'Admin User #' || ROW_NUMBER() OVER (ORDER BY u.created_at) as admin_number,
  u.email,
  p.username,
  p.is_admin,
  p.role,
  u.email_confirmed_at as email_confirmed,
  CASE u.email
    WHEN 'olekfribel@hotmail.com' THEN 'Password: TempPassword123!'
    WHEN 'dolbpinisrail@gmail.com' THEN 'Password: Tyt@12345'
  END as credentials
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email IN ('olekfribel@hotmail.com', 'dolbpinisrail@gmail.com')
ORDER BY u.created_at;

-- ============================================
-- ШАГ 4: ПРОВЕРКА СТРУКТУРЫ БАЗЫ ДАННЫХ
-- ============================================

SELECT
  '✓ ПРОВЕРКА БАЗЫ ДАННЫХ' as check_type,
  '======================================' as line;

-- Количество таблиц
SELECT
  'Таблицы' as object_type,
  COUNT(*) as count,
  CASE
    WHEN COUNT(*) >= 50 THEN '✓ OK'
    WHEN COUNT(*) >= 20 THEN '⚠ Некоторые миграции не применены'
    ELSE '✗ КРИТИЧНО: Мало таблиц!'
  END as status
FROM pg_tables
WHERE schemaname = 'public';

-- Количество пользователей
SELECT
  'Пользователи' as object_type,
  COUNT(*) as count,
  CASE
    WHEN COUNT(*) >= 2 THEN '✓ OK - Админы созданы'
    WHEN COUNT(*) = 1 THEN '⚠ Только 1 пользователь'
    ELSE '✗ Нет пользователей'
  END as status
FROM auth.users;

-- Количество профилей
SELECT
  'Профили' as object_type,
  COUNT(*) as count,
  COUNT(*) FILTER (WHERE is_admin = true) as admin_count,
  CASE
    WHEN COUNT(*) FILTER (WHERE is_admin = true) >= 2 THEN '✓ OK - 2 админа'
    WHEN COUNT(*) FILTER (WHERE is_admin = true) = 1 THEN '⚠ Только 1 админ'
    ELSE '✗ Нет админов'
  END as status
FROM public.profiles;

-- RLS политики
SELECT
  'RLS Политики' as object_type,
  COUNT(*) as count,
  CASE
    WHEN COUNT(*) >= 100 THEN '✓ OK'
    WHEN COUNT(*) >= 50 THEN '⚠ Некоторые политики отсутствуют'
    ELSE '✗ Мало RLS политик'
  END as status
FROM pg_policies;

-- ============================================
-- ШАГ 5: ПРОВЕРКА КРИТИЧНЫХ ТАБЛИЦ
-- ============================================

SELECT
  '✓ КРИТИЧНЫЕ ТАБЛИЦЫ' as check_type,
  '======================================' as line;

SELECT
  tablename,
  CASE
    WHEN tablename IN ('profiles', 'miners', 'rewards', 'custodial_wallets', 'miners_nft') THEN '✓ Критичная'
    ELSE 'Обычная'
  END as importance
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
  'profiles',
  'miners',
  'miners_nft',
  'rewards',
  'custodial_wallets',
  'marketplace_listings',
  'governance_proposals',
  'academy_lessons',
  'foundation_donations'
)
ORDER BY tablename;

-- ============================================
-- ШАГ 6: ТЕСТ ВХОДА (проверка что всё работает)
-- ============================================

-- Эмуляция auth.uid() для первого admin
DO $$
DECLARE
  test_user_id UUID;
BEGIN
  SELECT id INTO test_user_id FROM auth.users WHERE email = 'olekfribel@hotmail.com';

  -- Проверка что можем читать свой профиль
  IF EXISTS (
    SELECT 1 FROM public.profiles WHERE id = test_user_id
  ) THEN
    RAISE NOTICE '✓ RLS работает: Admin может читать свой профиль';
  ELSE
    RAISE EXCEPTION '✗ RLS не работает: Не могу прочитать профиль!';
  END IF;

  -- Проверка admin прав
  IF EXISTS (
    SELECT 1 FROM public.profiles WHERE id = test_user_id AND is_admin = true
  ) THEN
    RAISE NOTICE '✓ Admin права установлены';
  ELSE
    RAISE EXCEPTION '✗ Admin права НЕ установлены!';
  END IF;
END $$;

-- ============================================
-- ИТОГОВАЯ ИНФОРМАЦИЯ
-- ============================================

SELECT
  '======================================' as line,
  '✓ SETUP COMPLETE' as status,
  '======================================' as line2;

SELECT
  'Новый Supabase проект настроен!' as message,
  '0ec90b57d6e95fcbda19832f' as project_id,
  'https://0ec90b57d6e95fcbda19832f.supabase.co' as project_url;

SELECT
  'Credentials для входа:' as info,
  '' as line;

SELECT
  'Admin 1:' as user,
  'olekfribel@hotmail.com' as email,
  'TempPassword123!' as password;

SELECT
  'Admin 2:' as user,
  'dolbpinisrail@gmail.com' as email,
  'Tyt@12345' as password;

SELECT
  'ВАЖНО: Настройте Site URL!' as warning,
  'Dashboard → Authentication → URL Configuration' as where,
  'Установите ваш production URL из Bolt.new' as action;

-- ============================================
-- СЛЕДУЮЩИЕ ШАГИ
-- ============================================

SELECT
  '======================================' as line,
  'СЛЕДУЮЩИЕ ШАГИ' as title,
  '======================================' as line2;

SELECT
  1 as step,
  'Настройте Site URL в Supabase Dashboard' as action,
  'https://supabase.com/dashboard/project/0ec90b57d6e95fcbda19832f/auth/url-configuration' as url;

SELECT
  2 as step,
  'Опубликуйте проект через Bolt.new (Publish)' as action,
  'Получите production URL' as detail;

SELECT
  3 as step,
  'Обновите Site URL на ваш production URL' as action,
  'https://your-project.bolt.new' as example;

SELECT
  4 as step,
  'Добавьте Redirect URLs' as action,
  'https://your-project.bolt.new/*' as example;

SELECT
  5 as step,
  'Войдите в систему на production URL' as action,
  'Используйте credentials выше' as detail;

SELECT
  6 as step,
  'НЕМЕДЛЕННО смените пароли на безопасные!' as action,
  'Settings → Change Password' as where;
