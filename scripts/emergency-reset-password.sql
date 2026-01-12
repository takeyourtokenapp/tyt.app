-- ============================================
-- EMERGENCY PASSWORD RESET SCRIPT
-- ============================================
-- Используйте этот скрипт в Supabase SQL Editor
-- если вы не можете войти в систему
-- ============================================

-- ШАГ 1: Проверка текущего состояния пользователя
-- Скопируйте и выполните этот блок первым

SELECT
  'USER INFO' as check_type,
  id,
  email,
  email_confirmed_at,
  created_at,
  updated_at,
  last_sign_in_at,
  CASE
    WHEN banned_until IS NOT NULL THEN 'BANNED'
    WHEN deleted_at IS NOT NULL THEN 'DELETED'
    WHEN email_confirmed_at IS NULL THEN 'NOT CONFIRMED'
    ELSE 'ACTIVE'
  END as status
FROM auth.users
WHERE email = 'olekfribel@hotmail.com';

-- ШАГ 2: Проверка профиля администратора

SELECT
  'PROFILE INFO' as check_type,
  id,
  email,
  username,
  is_admin,
  role,
  created_at
FROM public.profiles
WHERE email = 'olekfribel@hotmail.com';

-- ============================================
-- ШАГ 3: СБРОС ПАРОЛЯ
-- ============================================
-- ВНИМАНИЕ: Это установит пароль: TempPassword123!
-- После входа НЕМЕДЛЕННО смените пароль!

UPDATE auth.users
SET
  encrypted_password = crypt('TempPassword123!', gen_salt('bf')),
  updated_at = now(),
  email_confirmed_at = COALESCE(email_confirmed_at, now()),
  confirmed_at = COALESCE(confirmed_at, now())
WHERE email = 'olekfribel@hotmail.com';

-- Проверка что пароль обновлен
SELECT
  'PASSWORD UPDATED' as result,
  email,
  updated_at
FROM auth.users
WHERE email = 'olekfribel@hotmail.com';

-- ============================================
-- ШАГ 4: УБЕДИТЕСЬ ЧТО ВЫ АДМИНИСТРАТОР
-- ============================================

-- Обновление admin статуса (на всякий случай)
UPDATE public.profiles
SET
  is_admin = true,
  role = 'admin'
WHERE email = 'olekfribel@hotmail.com';

-- Если профиль не существует - создайте его
INSERT INTO public.profiles (
  id,
  email,
  username,
  is_admin,
  role,
  created_at,
  updated_at
)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'username', split_part(email, '@', 1)),
  true,
  'admin',
  now(),
  now()
FROM auth.users
WHERE email = 'olekfribel@hotmail.com'
ON CONFLICT (id) DO UPDATE
SET
  is_admin = true,
  role = 'admin',
  updated_at = now();

-- Финальная проверка
SELECT
  'FINAL CHECK' as status,
  u.id,
  u.email,
  u.email_confirmed_at,
  p.is_admin,
  p.role,
  CASE
    WHEN p.is_admin = true THEN '✓ Admin rights confirmed'
    ELSE '✗ NOT ADMIN - Contact support!'
  END as admin_status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'olekfribel@hotmail.com';

-- ============================================
-- ДОПОЛНИТЕЛЬНЫЕ КОМАНДЫ (если нужно)
-- ============================================

-- Снять бан если аккаунт заблокирован
UPDATE auth.users
SET
  banned_until = NULL
WHERE email = 'olekfribel@hotmail.com';

-- Восстановить удаленный аккаунт
UPDATE auth.users
SET
  deleted_at = NULL
WHERE email = 'olekfribel@hotmail.com';

-- ============================================
-- СОЗДАНИЕ РЕЗЕРВНОГО ADMIN АККАУНТА
-- ============================================
-- Используйте если основной аккаунт недоступен

-- ВАЖНО: Замените 'backup-admin@yourdomain.com' на ваш реальный email
-- ВАЖНО: Замените 'BackupPassword123!' на ваш надежный пароль

/*
-- Раскомментируйте этот блок если нужно создать резервный аккаунт

-- 1. Создайте пользователя через Dashboard:
--    Authentication → Users → Add user → Create new user
--    Email: backup-admin@yourdomain.com
--    Password: BackupPassword123!

-- 2. После создания выполните этот SQL (замените USER_ID на реальный):

-- Получаем ID нового пользователя
SELECT id, email FROM auth.users WHERE email = 'backup-admin@yourdomain.com';

-- Создаем профиль с admin правами
INSERT INTO public.profiles (
  id,
  email,
  username,
  is_admin,
  role,
  created_at,
  updated_at
)
VALUES (
  'PASTE_USER_ID_HERE',  -- Замените на ID из запроса выше
  'backup-admin@yourdomain.com',
  'Backup Admin',
  true,
  'admin',
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE
SET
  is_admin = true,
  role = 'admin';
*/

-- ============================================
-- ПРОВЕРКА ВСЕХ АДМИНОВ В СИСТЕМЕ
-- ============================================

SELECT
  'ALL ADMINS' as list_type,
  u.email,
  p.username,
  p.is_admin,
  p.role,
  u.last_sign_in_at,
  u.created_at
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.is_admin = true
ORDER BY u.created_at;

-- ============================================
-- ЛОГИ ПОСЛЕДНИХ ВХОДОВ
-- ============================================

SELECT
  'LOGIN HISTORY' as log_type,
  created_at,
  action,
  ip_address
FROM auth.audit_log_entries
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'olekfribel@hotmail.com')
ORDER BY created_at DESC
LIMIT 10;

-- ============================================
-- ИТОГОВАЯ ИНФОРМАЦИЯ
-- ============================================

SELECT
  '======================================' as line,
  'EMERGENCY RESET COMPLETE' as status,
  '======================================' as line2;

SELECT
  'Теперь вы можете войти используя:' as instruction,
  'Email: olekfribel@hotmail.com' as email,
  'Password: TempPassword123!' as password,
  'ВАЖНО: Смените пароль сразу после входа!' as warning;
