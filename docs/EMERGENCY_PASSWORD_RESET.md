# ЭКСТРЕННЫЙ СБРОС ПАРОЛЯ (Emergency Password Reset)

## КРИТИЧЕСКАЯ СИТУАЦИЯ: Не могу войти в систему

Если вы не можете войти и восстановление пароля не работает, используйте этот метод для прямого сброса через Supabase Dashboard.

---

## Метод 1: Прямой сброс через Supabase Dashboard (РЕКОМЕНДУЕТСЯ)

### Шаг 1: Откройте Supabase Dashboard

1. Перейдите на: https://supabase.com/dashboard
2. Войдите в свой аккаунт Supabase
3. Выберите проект: **xyoaobelwkmrncvktrkv**

### Шаг 2: Откройте SQL Editor

1. В левом меню найдите **SQL Editor**
2. Нажмите на него
3. Откроется редактор SQL

### Шаг 3: Выполните SQL команду для сброса пароля

Скопируйте и вставьте этот SQL код:

```sql
-- СБРОС ПАРОЛЯ ДЛЯ olekfribel@hotmail.com
-- Новый пароль: TempPassword123!

UPDATE auth.users
SET
  encrypted_password = crypt('TempPassword123!', gen_salt('bf')),
  updated_at = now()
WHERE email = 'olekfribel@hotmail.com';
```

4. Нажмите **Run** или **Ctrl+Enter**
5. Должно появиться сообщение: "Success. No rows returned"

### Шаг 4: Войдите с новым паролем

Теперь вы можете войти используя:
- **Email**: olekfribel@hotmail.com
- **Пароль**: TempPassword123!

### Шаг 5: НЕМЕДЛЕННО смените пароль

После входа:
1. Перейдите в **Settings** или **Profile**
2. Смените пароль на безопасный
3. Используйте минимум 8 символов, заглавную букву, строчную букву, цифру

---

## Метод 2: Сброс через Email (если Метод 1 не работает)

### Опция A: Ручная отправка reset link

В SQL Editor выполните:

```sql
-- Генерация reset token
SELECT auth.email_update_request(
  'olekfribel@hotmail.com',
  'your-new-password-here'
);
```

### Опция B: Принудительная верификация email

Если email не подтвержден:

```sql
-- Подтверждение email
UPDATE auth.users
SET
  email_confirmed_at = now(),
  confirmed_at = now()
WHERE email = 'olekfribel@hotmail.com';
```

---

## Метод 3: Создание нового аккаунта администратора

Если все остальное не работает, создайте новый admin аккаунт:

### Шаг 1: Создайте нового пользователя в Auth

1. В Supabase Dashboard → **Authentication** → **Users**
2. Нажмите **Add user** → **Create new user**
3. Введите:
   - Email: `admin-emergency@yourdomain.com`
   - Password: создайте сильный пароль
4. Нажмите **Create user**

### Шаг 2: Дайте admin права через SQL

В SQL Editor выполните:

```sql
-- Получаем ID нового пользователя
SELECT id, email FROM auth.users WHERE email = 'admin-emergency@yourdomain.com';

-- Обновляем профиль (замените YOUR_USER_ID на реальный ID из предыдущего запроса)
UPDATE public.profiles
SET
  is_admin = true,
  role = 'admin'
WHERE id = 'YOUR_USER_ID';

-- Если профиль не существует, создайте его
INSERT INTO public.profiles (id, email, username, is_admin, role, created_at)
VALUES (
  'YOUR_USER_ID',
  'admin-emergency@yourdomain.com',
  'Emergency Admin',
  true,
  'admin',
  now()
)
ON CONFLICT (id) DO UPDATE
SET
  is_admin = true,
  role = 'admin';
```

---

## Проверка текущего состояния аккаунта

Выполните этот SQL чтобы проверить ваш аккаунт:

```sql
-- Проверка auth.users
SELECT
  id,
  email,
  email_confirmed_at,
  created_at,
  updated_at,
  banned_until,
  deleted_at
FROM auth.users
WHERE email = 'olekfribel@hotmail.com';

-- Проверка profiles
SELECT
  id,
  email,
  username,
  is_admin,
  role,
  created_at
FROM public.profiles
WHERE email = 'olekfribel@hotmail.com';
```

---

## Исправление DNS ошибки

Ваш скриншот показывает: `DNS_PROBE_FINISHED_NXDOMAIN`

Это означает что домен `github-awks5ehh.bolt.new` недоступен.

### Решение 1: Используйте правильный URL

1. Откройте Bolt.new dashboard
2. Найдите ваш проект
3. Скопируйте правильный URL проекта
4. URL должен выглядеть как: `https://something.bolt.new` (без "github-" префикса)

### Решение 2: Переопубликуйте проект

Если URL неправильный:

1. В Bolt.new нажмите **Share** или **Publish**
2. Получите новый URL
3. Обновите Supabase Site URL на новый URL

### Решение 3: Работайте локально

Пока DNS не работает:

1. Откройте проект в Bolt.new
2. Используйте Preview внутри Bolt.new
3. Или запустите локально:
   ```bash
   npm install
   npm run dev
   ```
4. Откройте http://localhost:5173
5. Войдите с паролем: `TempPassword123!`

---

## Критически важно: Обновите Supabase Configuration

После получения правильного URL:

### Шаг 1: Откройте Supabase Dashboard
https://supabase.com/dashboard/project/xyoaobelwkmrncvktrkv/auth/url-configuration

### Шаг 2: Обновите URLs

**Site URL:**
```
Замените: http://localhost:5173
На: https://your-correct-url.bolt.new
```

**Redirect URLs (добавьте все):**
```
https://your-correct-url.bolt.new/*
https://your-correct-url.bolt.new/reset-password
https://your-correct-url.bolt.new/login
http://localhost:5173/*
http://localhost:5173/reset-password
```

### Шаг 3: Сохраните изменения

Нажмите **Save** и подождите 1-2 минуты.

---

## Полная последовательность восстановления доступа

### 1. Сбросьте пароль через SQL (5 минут)
```sql
UPDATE auth.users
SET encrypted_password = crypt('TempPassword123!', gen_salt('bf'))
WHERE email = 'olekfribel@hotmail.com';
```

### 2. Найдите правильный URL проекта
- Откройте Bolt.new dashboard
- Найдите ваш проект
- Скопируйте URL

### 3. Обновите Supabase Site URL
- Dashboard → Authentication → URL Configuration
- Замените Site URL на правильный

### 4. Войдите в систему
- Email: olekfribel@hotmail.com
- Пароль: TempPassword123!

### 5. Смените пароль на безопасный
- Перейдите в Settings
- Обновите пароль

---

## Безопасность после восстановления

### Немедленные действия:

1. **Смените пароль** на надежный (16+ символов)
2. **Включите 2FA** если доступно
3. **Проверьте is_admin статус**:
   ```sql
   SELECT id, email, is_admin FROM profiles WHERE email = 'olekfribel@hotmail.com';
   ```
4. **Проверьте логи входов**:
   ```sql
   SELECT * FROM auth.audit_log_entries
   WHERE user_id = (SELECT id FROM auth.users WHERE email = 'olekfribel@hotmail.com')
   ORDER BY created_at DESC
   LIMIT 20;
   ```

### Рекомендуемая безопасность:

1. **Резервный admin аккаунт** - создайте второй admin на случай блокировки
2. **Backup Recovery Codes** - сохраните SQL команды для восстановления
3. **Document Access** - сохраните инструкции по доступу к Supabase Dashboard
4. **Email Verification** - убедитесь что email подтвержден

---

## Тестирование после восстановления

После восстановления доступа проверьте:

```bash
# 1. Вход работает
curl -X POST https://xyoaobelwkmrncvktrkv.supabase.co/auth/v1/token?grant_type=password \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"olekfribel@hotmail.com","password":"TempPassword123!"}'

# 2. Проверка admin статуса через API
curl https://xyoaobelwkmrncvktrkv.supabase.co/rest/v1/profiles?select=*&email=eq.olekfribel@hotmail.com \
  -H "apikey: YOUR_ANON_KEY"
```

---

## Контакты для помощи

Если ничего не работает:

1. **Supabase Support**: https://supabase.com/support
2. **Bolt.new Support**: Внутри Bolt.new dashboard
3. **Community Discord**: https://discord.supabase.com

---

## FAQ

**Q: Почему я не могу войти после сброса пароля?**
A: Подождите 1-2 минуты после SQL команды, очистите кэш браузера, попробуйте в режиме инкогнито.

**Q: SQL команда не работает**
A: Убедитесь что вы используете SQL Editor в Supabase Dashboard, не в psql терминале.

**Q: Восстановление через email не приходит**
A: Проверьте Site URL в Supabase Dashboard, проверьте папку Спам, подождите 5-10 минут.

**Q: Как узнать правильный URL проекта?**
A: Откройте Bolt.new, найдите проект, URL показан вверху или в Share/Publish.

**Q: Можно ли восстановить доступ без Supabase Dashboard?**
A: Нет, вам нужен доступ к Supabase Dashboard. Если у вас нет доступа к Supabase аккаунту - это критическая проблема.

---

## Превентивные меры на будущее

Чтобы избежать таких ситуаций:

1. **Сохраните credentials**:
   - Supabase Dashboard login
   - Project ID: xyoaobelwkmrncvktrkv
   - Admin email: olekfribel@hotmail.com

2. **Создайте backup admin**:
   - Второй admin аккаунт с другим email
   - Сохраните credentials в безопасном месте

3. **Документируйте URLs**:
   - Production URL
   - Supabase Dashboard URL
   - Bolt.new project URL

4. **Регулярные бэкапы**:
   - Экспортируйте базу данных раз в неделю
   - Сохраняйте резервные копии кода

5. **Тестируйте восстановление**:
   - Раз в месяц проверяйте что восстановление пароля работает
   - Убедитесь что все URLs актуальны
