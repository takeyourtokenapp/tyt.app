# ПОЛНОЕ РУКОВОДСТВО ПО ПУБЛИКАЦИИ TYT PLATFORM

Это комплексное руководство для публикации платформы TYT из bolt.new в production без потери данных и функциональности.

---

## СТАТУС ПРОЕКТА

### ✅ ЧТО УЖЕ ИСПРАВЛЕНО:

1. **Визуальные Проблемы**
   - Landing page: заменены отсутствующие изображения aOi на профессиональные gradient карточки
   - Все визуальные элементы теперь отображаются корректно
   - Orbital crypto coins анимации работают

2. **Локализация**
   - Исправлены битые JSON файлы (en/ru)
   - Все языковые файлы теперь валидны

3. **UX Улучшения**
   - Добавлены подсказки для создания уникальных паролей
   - Signup форма теперь помогает пользователям пройти HIBP валидацию

4. **Build**
   - Проект успешно собирается
   - Нет критических ошибок
   - Bundle size оптимизирован

### 🔍 ЧТО ПРОВЕРЕНО:

1. **База Данных**
   - 186+ миграций применены
   - RLS политики оптимизированы (12 января 2026)
   - Индексы для внешних ключей добавлены
   - Производительность улучшена с `(SELECT auth.uid())`

2. **API Соединения**
   - Supabase client настроен правильно
   - PKCE flow включен
   - Auto-refresh токенов работает
   - Session persistence активна

3. **Файловая Структура**
   - Все файлы на месте
   - Нет битых импортов
   - TypeScript компилируется без ошибок

---

## КРИТИЧЕСКИ ВАЖНЫЕ ШАГИ ПЕРЕД ПУБЛИКАЦИЕЙ

### ШАГ 1: НАСТРОЙКА SUPABASE DASHBOARD (15 минут)

#### 1.1 Authentication URL Configuration

**Откройте:** https://supabase.com/dashboard/project/xyoaobelwkmrncvktrkv/auth/url-configuration

**Измените:**

1. **Site URL** (критично!)
   ```
   Старое: http://localhost:5173
   Новое: https://takeyourtoken.app
   ```

2. **Redirect URLs** (добавьте все эти URL):
   ```
   https://takeyourtoken.app/*
   https://takeyourtoken.app/login
   https://takeyourtoken.app/signup
   https://takeyourtoken.app/reset-password
   https://takeyourtoken.app/app/*
   https://takeyourtoken.app/app/dashboard
   https://www.takeyourtoken.app/*
   http://localhost:5173/*
   ```

3. **Нажмите "Save"** и подождите 2-3 минуты для применения изменений

#### 1.2 Email Templates Verification

**Откройте:** https://supabase.com/dashboard/project/xyoaobelwkmrncvktrkv/auth/templates

**Проверьте каждый шаблон:**

1. **Confirm Signup**
   - URL должен быть: `{{ .ConfirmationURL }}`
   - НЕ должно быть hardcoded localhost

2. **Reset Password**
   - URL должен быть: `{{ .ConfirmationURL }}`
   - НЕ должно быть hardcoded localhost

3. **Magic Link**
   - URL должен быть: `{{ .TokenHash }}`
   - НЕ должно быть hardcoded localhost

#### 1.3 Password Policy (опционально)

**Откройте:** https://supabase.com/dashboard/project/xyoaobelwkmrncvktrkv/settings/auth

**Опция A (Рекомендуется для Production):**
- ✅ Оставьте "Password strength (Hibp)" ВКЛЮЧЕННОЙ
- Пользователи увидят подсказки на странице регистрации
- Это защитит от взломов по базам паролей

**Опция B (Только для тестирования):**
- ❌ Снимите галочку "Password strength (Hibp)"
- Используйте ТОЛЬКО для разработки/тестирования
- ⚠️ ВЕРНИТЕ ОБРАТНО перед публичным запуском!

#### 1.4 CORS Settings

**Откройте:** https://supabase.com/dashboard/project/xyoaobelwkmrncvktrkv/settings/api

**Проверьте CORS Allowed Origins:**
```
https://takeyourtoken.app
https://www.takeyourtoken.app
http://localhost:5173
```

---

### ШАГ 2: ПРОВЕРКА ENVIRONMENT VARIABLES (5 минут)

#### 2.1 Откройте `.env` файл

Убедитесь что файл содержит:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://xyoaobelwkmrncvktrkv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ВАЖНО: НЕ ДОБАВЛЯЙТЕ ДРУГИЕ КЛЮЧИ БЕЗ ПРЕФИКСА VITE_
# Vite делает доступными только переменные с префиксом VITE_
```

#### 2.2 Проверьте что ключи валидны

1. Откройте Supabase Dashboard → Settings → API
2. Сравните ключи:
   - `VITE_SUPABASE_URL` должен совпадать с "Project URL"
   - `VITE_SUPABASE_ANON_KEY` должен совпадать с "anon/public" ключом

#### 2.3 НИКОГДА не добавляйте в .env:

```env
# ❌ НИКОГДА НЕ ДОБАВЛЯЙТЕ:
VITE_SUPABASE_SERVICE_ROLE_KEY=xxx  # Слишком опасно для frontend!
```

Service role ключ должен быть ТОЛЬКО на backend (Edge Functions).

---

### ШАГ 3: ТЕСТИРОВАНИЕ В DEV РЕЖИМЕ (10 минут)

Перед сборкой для production, протестируйте локально:

```bash
# 1. Запустите dev server
npm run dev

# 2. Откройте http://localhost:5173

# 3. Протестируйте критические пути:
```

#### 3.1 Test Checklist - Landing Page
- [ ] Страница загружается без ошибок
- [ ] Все изображения отображаются (aOi сова)
- [ ] Orbital coins анимируются
- [ ] Stats карточки видны
- [ ] Кнопка "Start Mining" работает
- [ ] Footer links корректны
- [ ] Theme toggle работает
- [ ] Language selector работает

#### 3.2 Test Checklist - Authentication
- [ ] Нажмите "Sign Up"
- [ ] Введите email: `test@example.com`
- [ ] Введите пароль: `TestTYT!2026#Secure` (уникальный!)
- [ ] Password validation показывает зеленые галочки
- [ ] Password tips отображаются
- [ ] Кнопка "Sign Up" активна
- [ ] Submission работает (или показывает валидную ошибку)

#### 3.3 Test Checklist - Login
- [ ] Вернитесь на /login
- [ ] Введите существующие credentials
- [ ] Login работает
- [ ] Перенаправляет на /app/dashboard
- [ ] Dashboard загружается
- [ ] Profile данные отображаются

#### 3.4 Test Checklist - Database Connection
Откройте Browser Console (F12) и проверьте:
- [ ] Нет ошибок "Failed to fetch"
- [ ] Нет ошибок "CORS"
- [ ] Нет ошибок "RLS policy violation"
- [ ] Supabase client инициализируется

#### 3.5 Test Checklist - Browser Console
Проверьте что НЕТ следующих ошибок:
```
❌ Failed to parse JSON
❌ Module not found
❌ Cannot read properties of undefined
❌ Network request failed
❌ RLS policy violation
```

Допустимые warnings (можно игнорировать):
```
✓ [HMR] connected
✓ Download the React DevTools...
✓ Webpack compiled with X warnings
```

---

### ШАГ 4: СБОРКА ДЛЯ PRODUCTION (5 минут)

#### 4.1 Очистка кеша

```bash
# Удалите старые build файлы
rm -rf dist
rm -rf node_modules/.vite

# Опционально: переустановите зависимости
# rm -rf node_modules
# npm install
```

#### 4.2 Production Build

```bash
npm run build
```

**Ожидаемый результат:**
```
vite v7.3.0 building client environment for production...
✓ 3503 modules transformed.
✓ built in 18-25s

dist/index.html                    3.92 kB
dist/assets/index-[hash].css     199.81 kB │ gzip:  25.70 kB
dist/assets/index-[hash].js      841.90 kB │ gzip: 246.67 kB
```

#### 4.3 Проверьте размеры

✅ **Хорошие размеры:**
- CSS: < 200 KB (сжато < 30 KB)
- JS main bundle: < 900 KB (сжато < 300 KB)
- Total: < 1.2 MB (сжато < 350 KB)

⚠️ **Если размеры больше:**
- Проверьте что нет дублирующихся зависимостей
- Используйте `npm run build -- --analyze` (если настроено)

#### 4.4 Проверьте dist/ folder

```bash
ls -la dist/

# Должны быть:
dist/
├── index.html               # Главный HTML файл
├── assets/                  # JS и CSS chunks
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [other chunks]
├── favicon.png              # Favicon
├── logo.png                 # Logo
└── public files...          # Другие статические файлы
```

#### 4.5 Preview Build Locally

```bash
npm run preview

# Откройте http://localhost:4173
# Протестируйте все функции как в Шаге 3
```

---

### ШАГ 5: ДЕПЛОЙ НА ХОСТИНГ (зависит от провайдера)

#### Опция A: Vercel (Рекомендуется)

**Через GitHub:**
```bash
# 1. Создайте репозиторий на GitHub
git init
git add .
git commit -m "Initial commit - TYT Platform ready for production"
git branch -M main
git remote add origin https://github.com/yourusername/tyt-platform.git
git push -u origin main

# 2. Подключите Vercel
# - Перейдите на vercel.com
# - Import Project → GitHub
# - Выберите ваш репозиторий
# - Framework Preset: Vite
# - Build Command: npm run build
# - Output Directory: dist
# - Environment Variables: Добавьте VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY

# 3. Deploy
# Vercel автоматически задеплоит при каждом push
```

**Напрямую:**
```bash
# Установите Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Следуйте инструкциям CLI
```

#### Опция B: Netlify

**Через UI:**
1. Откройте https://app.netlify.com/drop
2. Drag & drop папку `dist/`
3. Настройте custom domain: `takeyourtoken.app`
4. Добавьте Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

**Через CLI:**
```bash
# Установите Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist

# Настройте domain через dashboard
```

#### Опция C: Custom Server (VPS/Dedicated)

**Nginx Configuration:**
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name takeyourtoken.app www.takeyourtoken.app;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name takeyourtoken.app www.takeyourtoken.app;

    # SSL Certificates (получите через Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/takeyourtoken.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/takeyourtoken.app/privkey.pem;

    # Root directory
    root /var/www/takeyourtoken/dist;
    index index.html;

    # SPA routing - все запросы направляем на index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

**Deploy Steps:**
```bash
# 1. Build locally
npm run build

# 2. Upload to server
scp -r dist/* user@your-server:/var/www/takeyourtoken/dist/

# 3. Restart Nginx
ssh user@your-server "sudo systemctl restart nginx"

# 4. Test
curl -I https://takeyourtoken.app
```

---

### ШАГ 6: DNS CONFIGURATION (15-30 минут)

#### 6.1 Настройте DNS записи

В вашем DNS провайдере (Cloudflare, Namecheap, GoDaddy и т.д.):

**A Records:**
```
A    @    [Your-Server-IP]    (для takeyourtoken.app)
A    www  [Your-Server-IP]    (для www.takeyourtoken.app)
```

**Для Vercel/Netlify используйте их CNAME:**
```
CNAME    @      cname.vercel-dns.com
CNAME    www    cname.vercel-dns.com
```

#### 6.2 SSL Certificate

**Let's Encrypt (для custom server):**
```bash
# Установите certbot
sudo apt-get install certbot python3-certbot-nginx

# Получите сертификат
sudo certbot --nginx -d takeyourtoken.app -d www.takeyourtoken.app

# Auto-renewal уже настроен через cron
```

**Cloudflare (рекомендуется):**
- Включите "Proxied" для DNS записей
- SSL/TLS → Full (strict)
- Automatic HTTPS Rewrites → On
- Always Use HTTPS → On

#### 6.3 Verify DNS Propagation

```bash
# Check DNS
dig takeyourtoken.app
dig www.takeyourtoken.app

# Check HTTPS
curl -I https://takeyourtoken.app
```

Обычно DNS обновляется за 5-30 минут, но может занять до 48 часов.

---

### ШАГ 7: POST-DEPLOYMENT VERIFICATION (20 минут)

После того как сайт опубликован, протестируйте все:

#### 7.1 Functional Tests

**Landing Page:**
- [ ] https://takeyourtoken.app загружается
- [ ] Все изображения видны
- [ ] Анимации работают
- [ ] Нет 404 ошибок
- [ ] Footer links работают
- [ ] Theme toggle работает

**Authentication:**
- [ ] Signup форма открывается
- [ ] Можно создать новый аккаунт
- [ ] Email confirmation работает (если включено)
- [ ] Login работает
- [ ] Dashboard загружается после login
- [ ] Logout работает

**Database:**
- [ ] Profile данные загружаются
- [ ] Можно обновить profile
- [ ] Dashboard stats отображаются
- [ ] Нет RLS ошибок в консоли

#### 7.2 Performance Tests

**Lighthouse Audit:**
```bash
# Chrome DevTools → Lighthouse
# Run audit в режиме "Navigation"
```

**Целевые метрики:**
- Performance: > 85
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

**Web Vitals:**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

#### 7.3 Cross-Browser Tests

Протестируйте в:
- [ ] Chrome (Desktop + Mobile)
- [ ] Firefox
- [ ] Safari (Desktop + iOS)
- [ ] Edge

#### 7.4 Mobile Responsiveness

Протестируйте на:
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] Tablet (iPad/Android)

---

### ШАГ 8: MONITORING SETUP (30 минут)

#### 8.1 Uptime Monitoring

**UptimeRobot (бесплатно):**
1. Зарегистрируйтесь на uptimerobot.com
2. Add Monitor:
   - Type: HTTPS
   - URL: https://takeyourtoken.app
   - Interval: 5 minutes
3. Add alert contacts (email, SMS, Telegram)

#### 8.2 Error Tracking

**Sentry (рекомендуется):**
```bash
# Установите Sentry SDK
npm install --save @sentry/react

# Добавьте в src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
});
```

#### 8.3 Analytics

**Google Analytics 4:**
```html
<!-- Добавьте в index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Или используйте Plausible (privacy-friendly):**
```html
<script defer data-domain="takeyourtoken.app" src="https://plausible.io/js/script.js"></script>
```

#### 8.4 Database Monitoring

**Supabase Dashboard:**
1. Откройте: https://supabase.com/dashboard/project/xyoaobelwkmrncvktrkv/reports
2. Настройте alerts для:
   - CPU usage > 80%
   - Memory usage > 80%
   - Slow queries (> 1s)
   - Connection pool exhaustion

---

### ШАГ 9: SECURITY HARDENING (15 минут)

#### 9.1 Security Headers

**Добавьте в Nginx/Vercel/Netlify:**
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.supabase.co; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co;
```

**Для Vercel (vercel.json):**
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}
```

#### 9.2 Supabase RLS Audit

**Проверьте что ВСЕ таблицы имеют RLS:**
```sql
-- Запустите в Supabase SQL Editor:
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Если rowsecurity = FALSE для какой-либо таблицы:
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

#### 9.3 API Rate Limiting

**Supabase автоматически:**
- 60 запросов/минуту для anon key
- Включите CAPTCHA для signup/login если нужно

#### 9.4 Secrets Audit

```bash
# Проверьте что секреты НЕ в коде:
grep -r "service_role" src/
grep -r "secret" src/
grep -r "private" src/

# Не должно быть никаких результатов!
```

---

### ШАГ 10: BACKUP STRATEGY (10 минут)

#### 10.1 Database Backups

**Supabase автоматически:**
- Point-in-time recovery (PITR) на 7 дней (Pro plan)
- Daily backups хранятся 7 дней (Free plan)

**Дополнительно (опционально):**
```bash
# Экспорт базы данных вручную
pg_dump -h db.xyoaobelwkmrncvktrkv.supabase.co \
        -U postgres \
        -d postgres \
        > backup_$(date +%Y%m%d).sql
```

#### 10.2 Code Backups

**Git - обязательно:**
```bash
# Регулярно push в GitHub/GitLab
git add .
git commit -m "Production release $(date +%Y-%m-%d)"
git push origin main

# Create release tag
git tag -a v1.0.0 -m "Production release"
git push origin v1.0.0
```

#### 10.3 Environment Variables Backup

Храните копию `.env` файла в безопасном месте:
- Password manager (1Password, LastPass)
- Encrypted file на локальном диске
- НЕ в Git!

---

## ROLLBACK PLAN (на случай проблем)

### Если что-то пошло не так:

#### Immediate Rollback (< 5 минут)

**Vercel:**
```bash
# Откройте Deployments
# Нажмите "..." на предыдущем деплое
# Нажмите "Promote to Production"
```

**Netlify:**
```bash
# Откройте Deploys
# Нажмите на предыдущий deploy
# Нажмите "Publish deploy"
```

**Custom Server:**
```bash
# Restore предыдущую версию
ssh user@server
cd /var/www/takeyourtoken
cp -r dist.backup dist
sudo systemctl restart nginx
```

#### Database Rollback (если нужно)

**Откройте Supabase Dashboard:**
1. Database → Backups
2. Выберите нужный backup
3. Click "Restore"
4. ⚠️ Это перезапишет текущие данные!

#### Supabase Config Rollback

1. Откройте Auth → URL Configuration
2. Верните Site URL на localhost
3. Удалите production redirect URLs
4. Save

---

## TROUBLESHOOTING

### Проблема: "Failed to fetch" errors

**Решение:**
1. Проверьте CORS в Supabase Dashboard
2. Проверьте что Supabase URL правильный в `.env`
3. Убедитесь что anon key валиден
4. Проверьте что нет блокировки на DNS уровне

### Проблема: "RLS policy violation"

**Решение:**
1. Откройте Supabase SQL Editor
2. Проверьте RLS политики:
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```
3. Убедитесь что есть политика для authenticated role
4. Проверьте что `auth.uid()` работает:
```sql
SELECT auth.uid(); -- Должен вернуть ваш UUID когда залогинены
```

### Проблема: "Password is known to be weak"

**Решение:**
См. `docs/PASSWORD_ISSUE_SOLUTION.md`

Краткая версия:
- Используйте уникальный пароль: `MyTYT!Secure#2026@Personal`
- Или временно отключите HIBP в Supabase (только для теста!)

### Проблема: Email links point to localhost

**Решение:**
1. Обновите Site URL в Supabase Dashboard (Шаг 1.1)
2. Подождите 2-3 минуты
3. Попробуйте password reset заново

### Проблема: 404 errors on refresh

**Решение - SPA routing:**

**Nginx:**
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

**Vercel - создайте `vercel.json`:**
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Netlify - создайте `public/_redirects`:**
```
/* /index.html 200
```

---

## SUCCESS CRITERIA

Ваш deployment успешен если:

- ✅ https://takeyourtoken.app загружается < 3s
- ✅ Lighthouse score > 85
- ✅ Пользователи могут регистрироваться
- ✅ Login работает
- ✅ Dashboard загружается
- ✅ Нет ошибок в консоли
- ✅ Работает на mobile и desktop
- ✅ SSL сертификат валиден
- ✅ Emails отправляются с правильными ссылками
- ✅ Database queries выполняются < 200ms
- ✅ Uptime monitoring настроен
- ✅ Error tracking активен

---

## MAINTENANCE PLAN

### Ежедневно:
- [ ] Проверить uptime monitoring
- [ ] Проверить error logs в Sentry
- [ ] Проверить user signups в Supabase Dashboard

### Еженедельно:
- [ ] Review Lighthouse scores
- [ ] Check database performance metrics
- [ ] Review analytics data
- [ ] Update dependencies (`npm outdated`)

### Ежемесячно:
- [ ] Security audit (npm audit)
- [ ] Database backup verification
- [ ] Performance optimization review
- [ ] User feedback review

---

## SUPPORT RESOURCES

### Documentation:
- TYT Project Docs: `/docs/` folder
- Supabase Docs: https://supabase.com/docs
- Vite Docs: https://vitejs.dev/guide/
- React Router: https://reactrouter.com/

### Support Channels:
- Supabase Support: https://supabase.com/dashboard/support
- Supabase Community: https://github.com/supabase/supabase/discussions

### Emergency Contacts:
- Database Issues: Supabase Support Ticket
- Hosting Issues: Vercel/Netlify Support
- DNS Issues: Your DNS Provider Support

---

## NEXT STEPS AFTER LAUNCH

### Week 1:
1. Monitor closely for any issues
2. Gather initial user feedback
3. Fix any critical bugs immediately
4. Optimize performance based on real data

### Month 1:
1. Analyze user behavior with analytics
2. Identify most-used features
3. Plan feature roadmap
4. Scale infrastructure if needed

### Month 3:
1. Major feature releases
2. Marketing campaigns
3. Community building
4. Partnership discussions

---

**ГОТОВО! ВАШ ПРОЕКТ ГОТОВ К ПУБЛИКАЦИИ!**

Следуйте этому руководству шаг за шагом, и ваша платформа TYT будет успешно опубликована.

Удачи с запуском! 🚀
