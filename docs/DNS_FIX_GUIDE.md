# Исправление DNS ошибки и доступа к приложению

## Проблема на скриншоте

```
Не удается получить доступ к сайту
Проверьте, нет ли опечаток в имени хоста github-awks5ehh.bolt.new
DNS_PROBE_FINISHED_NXDOMAIN
```

Это означает что домен не существует или недоступен.

---

## БЫСТРОЕ РЕШЕНИЕ

### Вариант 1: Найдите правильный URL проекта

1. Откройте https://bolt.new
2. Войдите в ваш аккаунт
3. Найдите ваш проект в списке
4. Правильный URL будет показан в карточке проекта
5. URL должен выглядеть как: `https://something.bolt.new` (БЕЗ "github-" префикса)

### Вариант 2: Откройте проект в редакторе Bolt.new

1. Перейдите на https://bolt.new
2. Откройте ваш проект
3. Используйте Preview внутри Bolt.new (не нужен отдельный URL)
4. В Preview вы можете тестировать приложение

### Вариант 3: Запустите локально

```bash
# Клонируйте или откройте проект
cd /path/to/project

# Установите зависимости (если нужно)
npm install

# Запустите dev сервер
npm run dev

# Откройте в браузере
# http://localhost:5173
```

---

## ПОДРОБНОЕ РЕШЕНИЕ

### Шаг 1: Проверка текущего URL проекта

#### В Bolt.new Dashboard:

1. Откройте https://bolt.new/dashboard (или главную страницу)
2. Найдите ваш проект "TYT Mining Platform" или похожий
3. Нажмите на проект чтобы открыть
4. В верхней части экрана будет показан URL
5. Скопируйте этот URL

#### Возможные форматы URL:

- ✅ Правильный: `https://unique-id.bolt.new`
- ✅ Правильный: `https://project-name-abc123.bolt.new`
- ❌ Неправильный: `https://github-awks5ehh.bolt.new` (это ошибка)

### Шаг 2: Обновите Supabase Site URL

Это **КРИТИЧЕСКИ ВАЖНО** для работы аутентификации!

1. Откройте Supabase Dashboard: https://supabase.com/dashboard
2. Выберите проект: **xyoaobelwkmrncvktrkv**
3. Перейдите в: **Authentication** → **URL Configuration**
4. Найдите поле **Site URL**
5. Обновите на правильный URL:
   ```
   Было: http://localhost:5173
   Стало: https://your-correct-url.bolt.new
   ```
6. Нажмите **Save**

### Шаг 3: Обновите Redirect URLs

В том же разделе **URL Configuration**:

1. Найдите **Redirect URLs**
2. Удалите старые неправильные URLs
3. Добавьте правильные URLs (каждый на новой строке):
   ```
   https://your-correct-url.bolt.new/*
   https://your-correct-url.bolt.new/reset-password
   https://your-correct-url.bolt.new/login
   http://localhost:5173/*
   ```
4. Нажмите **Save**

### Шаг 4: Очистите кэш браузера

После обновления URLs:

1. Откройте Chrome DevTools (F12)
2. Правый клик на кнопке перезагрузки
3. Выберите "Empty Cache and Hard Reload"
4. Или используйте режим Инкогнито

### Шаг 5: Попробуйте войти

1. Откройте правильный URL проекта
2. Перейдите на страницу логина
3. Используйте:
   - Email: `olekfribel@hotmail.com`
   - Password: `TempPassword123!` (после emergency reset)

---

## Альтернативные способы доступа

### Способ 1: Прямой доступ через Bolt.new

Не нужен публичный URL:

1. Откройте https://bolt.new
2. Войдите в аккаунт
3. Откройте ваш проект
4. Нажмите "Preview" или "Open in Editor"
5. Используйте встроенный preview

### Способ 2: Локальная разработка

Полный контроль и отладка:

```bash
# 1. Клонируйте проект (если еще не сделано)
git clone YOUR_REPO_URL
cd tyt-platform

# 2. Установите зависимости
npm install

# 3. Убедитесь что .env файл существует
cat .env
# Должен содержать:
# VITE_SUPABASE_ANON_KEY=...
# VITE_SUPABASE_URL=...

# 4. Запустите dev сервер
npm run dev

# 5. Откройте в браузере
# http://localhost:5173
```

### Способ 3: Развертывание на другом хостинге

Если Bolt.new URL не работает:

#### Vercel:
```bash
npm install -g vercel
vercel login
vercel --prod
```

#### Netlify:
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

#### GitHub Pages:
```bash
npm run build
# Загрузите dist/ в gh-pages branch
```

---

## Проверка DNS и сети

### Проверка 1: Ping домена

```bash
ping github-awks5ehh.bolt.new
# Если не работает - домен не существует

ping your-correct-url.bolt.new
# Должен отвечать
```

### Проверка 2: DNS lookup

```bash
nslookup github-awks5ehh.bolt.new
# Если "server can't find" - домен недействителен

nslookup your-correct-url.bolt.new
# Должен вернуть IP адрес
```

### Проверка 3: Curl запрос

```bash
curl -I https://your-correct-url.bolt.new
# Должен вернуть HTTP 200 или 301/302
```

---

## Настройка Custom Domain (опционально)

Если хотите использовать собственный домен:

### Шаг 1: Купите домен

- Namecheap, GoDaddy, Google Domains и т.д.
- Например: `tytmining.com`

### Шаг 2: Настройте DNS записи

В панели управления доменом добавьте:

```
Type: CNAME
Name: www
Value: your-bolt-project.bolt.new
TTL: 3600
```

```
Type: A
Name: @
Value: [IP адрес Bolt.new - уточните в поддержке]
TTL: 3600
```

### Шаг 3: Обновите Bolt.new настройки

В Bolt.new project settings:
- Добавьте custom domain
- Подтвердите владение доменом
- Подождите DNS propagation (до 48 часов)

### Шаг 4: Обновите Supabase URLs

В Supabase Dashboard:
- Site URL: `https://yourdomain.com`
- Redirect URLs: добавьте все варианты с вашим доменом

---

## Устранение распространенных проблем

### Проблема: "Site can't be reached"

**Причины:**
- Неправильный URL
- Проект не опубликован
- DNS не настроен

**Решение:**
1. Проверьте URL в Bolt.new dashboard
2. Убедитесь что проект опубликован (deployed)
3. Попробуйте другой браузер
4. Используйте режим инкогнито

### Проблема: "Connection timed out"

**Причины:**
- Проблемы с сетью
- Firewall блокирует доступ
- Bolt.new временно недоступен

**Решение:**
1. Проверьте интернет соединение
2. Попробуйте другую сеть (мобильный интернет)
3. Отключите VPN/Proxy
4. Проверьте статус Bolt.new: https://status.bolt.new

### Проблема: Страница загружается, но не работает auth

**Причины:**
- Неправильный Site URL в Supabase
- CORS ошибки
- Неправильные Redirect URLs

**Решение:**
1. Откройте DevTools (F12) → Console
2. Проверьте ошибки
3. Обновите Supabase URL Configuration
4. Убедитесь что Redirect URLs правильные

---

## Тестирование после исправления

### Чеклист:

- [ ] URL проекта правильный и доступен
- [ ] Supabase Site URL обновлен
- [ ] Supabase Redirect URLs добавлены
- [ ] Страница логина загружается
- [ ] Можно войти в систему
- [ ] Восстановление пароля работает
- [ ] Email приходят на правильный домен

### Команды для проверки:

```bash
# 1. Проверка доступности
curl -I https://your-url.bolt.new

# 2. Проверка API
curl https://xyoaobelwkmrncvktrkv.supabase.co/rest/v1/ \
  -H "apikey: YOUR_ANON_KEY"

# 3. Проверка auth
curl -X POST https://xyoaobelwkmrncvktrkv.supabase.co/auth/v1/token?grant_type=password \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"olekfribel@hotmail.com","password":"TempPassword123!"}'
```

---

## Получение помощи

### Bolt.new Support:

1. В Bolt.new нажмите на иконку помощи
2. Или напишите на support@stackblitz.com
3. Опишите проблему с URL

### Supabase Support:

1. https://supabase.com/support
2. Community Discord: https://discord.supabase.com
3. GitHub Issues: https://github.com/supabase/supabase/issues

### Информация для поддержки:

При обращении в поддержку предоставьте:

```
Project Details:
- Bolt.new Project Name: [Your project name]
- URL с ошибкой: github-awks5ehh.bolt.new
- Ошибка: DNS_PROBE_FINISHED_NXDOMAIN
- Supabase Project ID: xyoaobelwkmrncvktrkv

What I tried:
- [Опишите что вы пробовали]

Screenshots:
- [Приложите скриншоты ошибок]
```

---

## Превентивные меры

Чтобы избежать таких проблем в будущем:

1. **Сохраните правильный URL**
   - Добавьте в закладки
   - Запишите в документацию
   - Создайте shortlink (bit.ly и т.д.)

2. **Документируйте все URLs**
   - Production URL
   - Staging URL (если есть)
   - Local dev URL
   - Supabase Dashboard URL

3. **Регулярно проверяйте доступность**
   - Настройте uptime monitoring (UptimeRobot, Pingdom)
   - Проверяйте раз в неделю

4. **Backup план**
   - Имейте готовый deploy на другом хостинге
   - Сохраните инструкции для быстрого redeploy
   - Настройте CI/CD для автоматического деплоя

5. **Custom domain**
   - Используйте собственный домен
   - Тогда вы контролируете DNS
   - Можете переключить на другой хостинг без изменения URL
