-- ============================================
-- СОЗДАНИЕ НОВОГО ADMIN ПОЛЬЗОВАТЕЛЯ
-- ============================================
-- Email: dolbpinisrail@gmail.com
-- Password: Tyt@12345
-- Role: admin
-- ============================================

-- ШАГ 1: Создание пользователя в auth.users
-- ВНИМАНИЕ: Это создаст пользователя напрямую, минуя проверку сложности пароля

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

-- ШАГ 2: Создание профиля с admin правами
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

-- ШАГ 3: Проверка созданного пользователя
SELECT
  '✓ ПОЛЬЗОВАТЕЛЬ СОЗДАН' as status,
  u.id,
  u.email,
  u.email_confirmed_at as email_confirmed,
  p.is_admin,
  p.role,
  p.username,
  'Password: Tyt@12345' as credentials
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'dolbpinisrail@gmail.com';

-- ============================================
-- ТАКЖЕ ПРОВЕРИМ ПЕРВОГО ADMIN
-- ============================================

SELECT
  '✓ ПЕРВЫЙ ADMIN' as status,
  u.id,
  u.email,
  u.email_confirmed_at as email_confirmed,
  p.is_admin,
  p.role,
  p.username
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'olekfribel@hotmail.com';

-- ============================================
-- СПИСОК ВСЕХ АДМИНОВ
-- ============================================

SELECT
  'СПИСОК ВСЕХ АДМИНОВ' as title,
  u.email,
  p.username,
  p.is_admin,
  p.role,
  u.created_at,
  u.last_sign_in_at
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.is_admin = true
ORDER BY u.created_at;

-- ============================================
-- ИТОГОВАЯ ИНФОРМАЦИЯ
-- ============================================

SELECT
  '======================================' as line,
  'ADMIN ПОЛЬЗОВАТЕЛЬ СОЗДАН' as status,
  '======================================' as line2;

SELECT
  'Теперь можете войти используя:' as instruction,
  'Email: dolbpinisrail@gmail.com' as email,
  'Password: Tyt@12345' as password,
  'Role: admin' as role;
