-- ============================================
-- СОЗДАНИЕ ПОЛЬЗОВАТЕЛЯ ЧЕРЕЗ SQL (ОБХОД HIBP ПРОВЕРКИ)
-- ============================================
-- Используйте этот скрипт для создания пользователей
-- без проверки пароля по базе Have I Been Pwned
-- ============================================

-- ============================================
-- ИНСТРУКЦИИ
-- ============================================
-- 1. Замените 'your@email.com' на нужный email
-- 2. Замените 'YourPassword123!' на нужный пароль (ЛЮБОЙ!)
-- 3. Замените 'Your Username' на нужное имя пользователя
-- 4. Установите is_admin = true для админов, false для пользователей
-- 5. Выполните скрипт в SQL Editor
-- ============================================

DO $$
DECLARE
  user_email TEXT := 'your@email.com';  -- ← ИЗМЕНИТЕ ЭТО
  user_password TEXT := 'YourPassword123!';  -- ← ИЗМЕНИТЕ ЭТО
  user_username TEXT := 'Your Username';  -- ← ИЗМЕНИТЕ ЭТО
  is_user_admin BOOLEAN := false;  -- ← true для admin, false для обычного пользователя
  new_user_id uuid;
BEGIN
  RAISE NOTICE '===========================================';
  RAISE NOTICE 'СОЗДАНИЕ ПОЛЬЗОВАТЕЛЯ';
  RAISE NOTICE '===========================================';

  -- Проверка: пользователь уже существует?
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = user_email) THEN
    RAISE NOTICE '⚠ Пользователь уже существует: %', user_email;
    RAISE NOTICE 'Обновление пароля...';

    -- Обновить существующего пользователя
    UPDATE auth.users
    SET
      encrypted_password = crypt(user_password, gen_salt('bf')),
      email_confirmed_at = now(),
      confirmed_at = now(),
      updated_at = now()
    WHERE email = user_email
    RETURNING id INTO new_user_id;

    -- Обновить профиль
    UPDATE public.profiles
    SET
      username = user_username,
      is_admin = is_user_admin,
      role = CASE WHEN is_user_admin THEN 'admin' ELSE 'user' END,
      updated_at = now()
    WHERE id = new_user_id;

    RAISE NOTICE '✓ Пользователь обновлен: %', user_email;
  ELSE
    RAISE NOTICE 'Создание нового пользователя: %', user_email;

    -- Создать нового пользователя
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
      user_email,
      crypt(user_password, gen_salt('bf')),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('username', user_username),
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
      user_email,
      user_username,
      is_user_admin,
      CASE WHEN is_user_admin THEN 'admin' ELSE 'user' END,
      0,
      0,
      'Bronze',
      now(),
      now()
    );

    RAISE NOTICE '✓ Пользователь создан: %', user_email;
  END IF;

  RAISE NOTICE '===========================================';
  RAISE NOTICE 'Email: %', user_email;
  RAISE NOTICE 'Password: %', user_password;
  RAISE NOTICE 'Username: %', user_username;
  RAISE NOTICE 'Admin: %', is_user_admin;
  RAISE NOTICE '===========================================';
END $$;

-- ============================================
-- ПРОВЕРКА СОЗДАННОГО ПОЛЬЗОВАТЕЛЯ
-- ============================================

SELECT
  u.email,
  p.username,
  p.is_admin,
  p.role,
  u.email_confirmed_at IS NOT NULL as email_confirmed,
  u.created_at,
  'Теперь можете войти!' as status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'your@email.com'  -- ← ИЗМЕНИТЕ на тот же email что выше
ORDER BY u.created_at DESC
LIMIT 1;

-- ============================================
-- ДОПОЛНИТЕЛЬНЫЕ ПОЛЕЗНЫЕ КОМАНДЫ
-- ============================================

-- Показать всех пользователей
-- SELECT u.email, p.username, p.is_admin, u.created_at
-- FROM auth.users u
-- LEFT JOIN public.profiles p ON u.id = p.id
-- ORDER BY u.created_at DESC;

-- Удалить пользователя (если нужно)
-- DELETE FROM public.profiles WHERE email = 'user@example.com';
-- DELETE FROM auth.users WHERE email = 'user@example.com';

-- Изменить пароль существующего пользователя
-- UPDATE auth.users
-- SET encrypted_password = crypt('NewPassword!', gen_salt('bf'))
-- WHERE email = 'user@example.com';

-- Сделать пользователя админом
-- UPDATE public.profiles
-- SET is_admin = true, role = 'admin'
-- WHERE email = 'user@example.com';

-- Снять права админа
-- UPDATE public.profiles
-- SET is_admin = false, role = 'user'
-- WHERE email = 'user@example.com';

-- Подтвердить email пользователя
-- UPDATE auth.users
-- SET email_confirmed_at = now(), confirmed_at = now()
-- WHERE email = 'user@example.com';
