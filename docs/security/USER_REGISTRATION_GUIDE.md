# Руководство по регистрации пользователей

## Текущая ситуация

### Проблема с регистрацией

Supabase по умолчанию блокирует "слабые" пароли через интеграцию с базой данных скомпрометированных паролей (Have I Been Pwned).

**Пример отклоненного пароля:**
- `Tyt@12345` - отклонен как "known to be weak"

### Почему это происходит

Supabase Auth имеет встроенную защиту:
1. Проверяет пароли по базе скомпрометированных паролей
2. Требует минимум 6-8 символов (настраивается)
3. Может требовать специальные символы

---

## РЕШЕНИЕ 1: Создание Admin пользователя через SQL

Для создания admin пользователя с любым паролем:

### Шаг 1: Откройте Supabase SQL Editor

https://supabase.com/dashboard/project/xyoaobelwkmrncvktrkv/sql

### Шаг 2: Выполните SQL скрипт

Используйте файл `scripts/create-admin-user.sql` или скопируйте:

```sql
-- Создание admin пользователя
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
SET encrypted_password = crypt('Tyt@12345', gen_salt('bf'));

-- Создание профиля с admin правами
INSERT INTO public.profiles (id, email, username, is_admin, role, created_at)
SELECT id, email, 'Admin User', true, 'admin', now()
FROM auth.users WHERE email = 'dolbpinisrail@gmail.com'
ON CONFLICT (id) DO UPDATE SET is_admin = true, role = 'admin';
```

### Шаг 3: Войдите в систему

- Email: `dolbpinisrail@gmail.com`
- Password: `Tyt@12345`
- Role: admin

---

## РЕШЕНИЕ 2: Настройка Supabase для тестирования

### Отключение проверки слабых паролей (для тестирования)

1. Откройте Supabase Dashboard
2. **Authentication** → **Policies** (или Settings)
3. Найдите **Password requirements**
4. Снизьте минимальную длину до 6 символов
5. Опционально: отключите проверку Have I Been Pwned

⚠️ **ВНИМАНИЕ:** Это снижает безопасность! Используйте только для development/testing.

### Альтернатива: Используйте сильные пароли

Вместо `Tyt@12345` используйте:
- `TakeYourToken2026!Admin` ✓
- `SecurePassword123!@#` ✓
- `MyStr0ng!P@ssw0rd` ✓

---

## РЕШЕНИЕ 3: Разрешение регистрации для всех пользователей

Для набора базы пользователей нужно:

### 1. Убедитесь что регистрация включена в Supabase

**Dashboard → Authentication → Providers:**
- Email Provider: **Enabled** ✓
- Confirm Email: **Disabled** (для тестирования)

**Dashboard → Authentication → Settings:**
- Enable email signup: **Enabled** ✓
- Enable phone signup: **Disabled** (если не нужно)

### 2. Настройте Site URL и Redirect URLs

**Dashboard → Authentication → URL Configuration:**

**Site URL:**
```
https://your-project-url.bolt.new
```

**Redirect URLs (добавьте все):**
```
https://your-project-url.bolt.new/*
https://your-project-url.bolt.new/login
https://your-project-url.bolt.new/signup
https://your-project-url.bolt.new/dashboard
http://localhost:5173/*
http://localhost:5173/login
```

### 3. Отключите email подтверждение (для тестирования)

**Dashboard → Authentication → Email Templates:**
- Confirm signup: **Disabled** (временно для тестирования)

Или в SQL:
```sql
-- Автоматическое подтверждение email при регистрации
UPDATE auth.config
SET value = '{"email_confirmation":false}'
WHERE key = 'email_confirmation';
```

### 4. Проверьте RLS политики

Убедитесь что у таблицы `profiles` есть политика INSERT для новых пользователей:

```sql
-- Проверка существующих политик
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'profiles';

-- Если нет INSERT политики, добавьте:
CREATE POLICY "Users can insert own profile on signup"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
```

---

## РЕШЕНИЕ 4: Улучшение процесса регистрации

### Обход проверки слабых паролей

Если хотите, чтобы пользователи могли регистрироваться с любыми паролями:

#### Вариант A: Edge Function для регистрации

Создайте Supabase Edge Function, которая создает пользователей напрямую в БД (минуя Supabase Auth проверки):

```typescript
// supabase/functions/custom-signup/index.ts
import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const { email, password } = await req.json()

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Создание пользователя через admin API (без проверки пароля)
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { username: email.split('@')[0] }
  })

  return new Response(JSON.stringify({ data, error }))
})
```

#### Вариант B: Использовать Service Role Key на frontend

⚠️ **НЕ БЕЗОПАСНО** для production, только для тестирования:

```typescript
// ТОЛЬКО ДЛЯ ТЕСТИРОВАНИЯ!
const supabaseAdmin = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  'SERVICE_ROLE_KEY_HERE' // Никогда не делайте так в production!
)

// Регистрация без проверок
const { data, error } = await supabaseAdmin.auth.admin.createUser({
  email,
  password,
  email_confirm: true
})
```

---

## РЕКОМЕНДУЕМЫЙ ПОДХОД ДЛЯ PRODUCTION

### Для администраторов:
1. Создавайте через SQL (как показано выше)
2. Используйте сильные пароли
3. Включите 2FA

### Для обычных пользователей:
1. Требуйте сильные пароли (минимум 12 символов)
2. Включите email подтверждение
3. Добавьте rate limiting
4. Логируйте регистрации

### Для тестирования:
1. Временно снизьте требования к паролям
2. Отключите email подтверждение
3. Создайте test аккаунты через SQL
4. Используйте отдельную staging базу

---

## ТЕКУЩИЕ ADMIN ПОЛЬЗОВАТЕЛИ

После выполнения SQL у вас будет 2 admin:

1. **olekfribel@hotmail.com**
   - Password: `TempPassword123!` (или ваш новый пароль)
   - Role: admin
   - Status: active

2. **dolbpinisrail@gmail.com**
   - Password: `Tyt@12345`
   - Role: admin
   - Status: active

---

## ПРОВЕРКА РЕГИСТРАЦИИ

### Тест 1: Через UI

1. Откройте `/signup`
2. Введите email: `test@example.com`
3. Введите сильный пароль: `TestPassword123!`
4. Нажмите Sign Up
5. Проверьте что пользователь создан

### Тест 2: Через SQL

```sql
-- Проверка последних регистраций
SELECT
  email,
  created_at,
  email_confirmed_at,
  last_sign_in_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- Проверка профилей
SELECT
  p.email,
  p.username,
  p.is_admin,
  p.role,
  p.created_at
FROM public.profiles p
ORDER BY p.created_at DESC
LIMIT 10;
```

### Тест 3: Через API

```bash
# Регистрация через API
curl -X POST \
  'https://xyoaobelwkmrncvktrkv.supabase.co/auth/v1/signup' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'
```

---

## БЕЗОПАСНОСТЬ

### Что НЕ ДЕЛАТЬ в production:

❌ Не используйте слабые пароли для admin
❌ Не отключайте email подтверждение
❌ Не храните Service Role Key на frontend
❌ Не отключайте RLS политики
❌ Не разрешайте регистрацию без rate limiting

### Что ДЕЛАТЬ:

✓ Используйте сильные пароли (16+ символов)
✓ Включите email подтверждение
✓ Включите 2FA для admin
✓ Используйте rate limiting
✓ Логируйте все регистрации
✓ Регулярно проверяйте логи
✓ Используйте Captcha
✓ Блокируйте disposable emails

---

## FAQ

**Q: Почему мой пароль отклонен как слабый?**

A: Supabase проверяет пароли по базе Have I Been Pwned. Используйте уникальный пароль, который не был скомпрометирован.

**Q: Могу ли я отключить проверку слабых паролей?**

A: Да, но только для development. В production это небезопасно.

**Q: Как создать много тестовых пользователей?**

A: Используйте SQL скрипт с циклом или Edge Function.

**Q: Как сделать пользователя admin после регистрации?**

A: Выполните SQL:
```sql
UPDATE public.profiles
SET is_admin = true, role = 'admin'
WHERE email = 'user@example.com';
```

**Q: Можно ли регистрироваться без email подтверждения?**

A: Да, отключите в Dashboard → Authentication → Email Templates.

---

## Контакты поддержки

Если что-то не работает:

1. Проверьте Supabase Auth logs:
   Dashboard → Authentication → Logs

2. Проверьте Browser Console (F12) на ошибки

3. Проверьте RLS политики:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'profiles';
   ```

4. Обратитесь в Supabase Support:
   https://supabase.com/support
