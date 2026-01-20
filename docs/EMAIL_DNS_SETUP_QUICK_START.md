# Быстрая настройка DNS для email (tyt.foundation)

## ШАГ 1: Регистрация в SendGrid (5 минут)

1. **Перейдите на** https://signup.sendgrid.com
2. **Заполните форму:**
   - Email: ваш email
   - Password: создайте пароль
   - Company: TYT Foundation
3. **Подтвердите email**
4. **Войдите в Dashboard**

---

## ШАГ 2: Создание API Key (2 минуты)

1. **SendGrid Dashboard** → Settings → API Keys
2. **Create API Key**
   - Name: `TYT Production`
   - Permissions: Full Access
3. **Скопируйте ключ** (показывается только один раз!)
   ```
   SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
4. **Сохраните** в безопасное место

---

## ШАГ 3: Добавление домена в SendGrid (5 минут)

1. **SendGrid Dashboard** → Settings → Sender Authentication
2. **Authenticate Your Domain** → Get Started
3. **From Domain:** `tyt.foundation`
4. **Advanced Settings:**
   - ✅ Use automated security
   - ✅ Brand your links with your domain
5. **Next** → SendGrid покажет DNS записи

---

## ШАГ 4: DNS записи (КРИТИЧЕСКИ ВАЖНО!)

SendGrid покажет вам что-то вроде этого:

### Записи для добавления в marcaria.com:

#### 1. CNAME Record #1 (DKIM)
```
Type: CNAME
Host: s1._domainkey.tyt.foundation
Value: s1.domainkey.u12345678.wl123.sendgrid.net
TTL: 3600
```

#### 2. CNAME Record #2 (DKIM)
```
Type: CNAME
Host: s2._domainkey.tyt.foundation
Value: s2.domainkey.u12345678.wl123.sendgrid.net
TTL: 3600
```

#### 3. CNAME Record #3 (Link Branding)
```
Type: CNAME
Host: em1234.tyt.foundation
Value: u12345678.wl123.sendgrid.net
TTL: 3600
```

#### 4. TXT Record (SPF)
```
Type: TXT
Host: @
Value: v=spf1 include:sendgrid.net ~all
TTL: 3600
```

#### 5. TXT Record (DMARC) - ДОБАВЬТЕ САМИ
```
Type: TXT
Host: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@tyt.foundation
TTL: 3600
```

⚠️ **ВАЖНО:** Точные значения будут в вашем SendGrid Dashboard!

---

## ШАГ 5: Добавление DNS в marcaria.com (10-15 минут)

### Вход в marcaria.com:

1. **Перейдите** на https://marcaria.com
2. **Войдите** в аккаунт
3. **Найдите** домен `tyt.foundation`
4. **Откройте** DNS Management / DNS Zone Editor

### Добавление каждой записи:

#### Для CNAME записей:
```
Шаг 1: Нажмите "Add Record" или "Add CNAME"
Шаг 2: Type/Тип: CNAME
Шаг 3: Name/Host: скопируйте из SendGrid (например, s1._domainkey)
Шаг 4: Value/Points to: скопируйте из SendGrid
Шаг 5: TTL: 3600
Шаг 6: Save
```

#### Для TXT записей:
```
Шаг 1: Нажмите "Add Record" или "Add TXT"
Шаг 2: Type/Тип: TXT
Шаг 3: Name/Host: @ (для SPF) или _dmarc (для DMARC)
Шаг 4: Value: скопируйте значение полностью
Шаг 5: TTL: 3600
Шаг 6: Save
```

### Что должно получиться (пример):

```
tyt.foundation DNS Records:

1. s1._domainkey.tyt.foundation    CNAME    s1.domainkey.u12345678.wl123.sendgrid.net
2. s2._domainkey.tyt.foundation    CNAME    s2.domainkey.u12345678.wl123.sendgrid.net
3. em1234.tyt.foundation           CNAME    u12345678.wl123.sendgrid.net
4. tyt.foundation                  TXT      v=spf1 include:sendgrid.net ~all
5. _dmarc.tyt.foundation           TXT      v=DMARC1; p=quarantine; rua=mailto:dmarc@tyt.foundation
```

---

## ШАГ 6: Верификация домена в SendGrid (24-48 часов)

### Сразу после добавления DNS:
1. **SendGrid** → Settings → Sender Authentication
2. **Verify** рядом с tyt.foundation
3. Статус будет: **⏳ Pending Verification**

### Через несколько часов:
1. **Проверьте снова** (может занять до 48 часов)
2. Статус должен стать: **✅ Verified**

### Проверка DNS вручную:
```bash
# Проверить SPF
nslookup -type=TXT tyt.foundation

# Проверить DKIM
nslookup -type=CNAME s1._domainkey.tyt.foundation

# Проверить DMARC
nslookup -type=TXT _dmarc.tyt.foundation
```

**Online инструмент:** https://mxtoolbox.com/SuperTool.aspx
- Введите `tyt.foundation`
- Проверьте SPF, DKIM, DMARC

---

## ШАГ 7: Настройка Email Forwarding в marcaria.com (5 минут)

Чтобы получать письма на support@tyt.foundation:

1. **marcaria.com** → Email Services → Email Forwarding
2. **Add Email Forward**
   ```
   From: support@tyt.foundation
   To: ваш_реальный_email@gmail.com
   ```
3. **Add Email Forward** (дополнительные)
   ```
   From: hello@tyt.foundation
   To: ваш_реальный_email@gmail.com

   From: admin@tyt.foundation
   To: ваш_реальный_email@gmail.com

   From: contact@tyt.foundation
   To: ваш_реальный_email@gmail.com
   ```
4. **Save**

**Результат:** Все письма на support@tyt.foundation будут пересылаться на ваш Gmail.

---

## ШАГ 8: Настройка Gmail "Send As" (10 минут)

Чтобы отвечать с адреса support@tyt.foundation:

### В Gmail:

1. **Settings** ⚙️ → **See all settings**
2. **Accounts and Import** tab
3. **Send mail as** → **Add another email address**

### Popup окно:

**Step 1: Email Address**
```
Name: TYT Support Team
Email address: support@tyt.foundation
☑ Treat as an alias
```
**Next**

**Step 2: SMTP Server**
```
SMTP Server: smtp.sendgrid.net
Port: 587
Username: apikey
Password: <ваш SendGrid API Key>
☑ Secured connection using TLS
```
**Add Account**

**Step 3: Verification**
- Gmail отправит verification email на support@tyt.foundation
- Вы получите его через forwarding на ваш Gmail
- Нажмите ссылку подтверждения или введите код

**Step 4: Default**
```
☑ Make default (опционально)
```

**Готово!** Теперь вы можете отправлять письма с адреса support@tyt.foundation прямо из Gmail.

---

## ШАГ 9: Тестирование системы (10 минут)

### Test 1: Отправка с SendGrid

**Метод 1: SendGrid Dashboard**
1. Settings → Sender Authentication → Verified Senders
2. Create New Sender
   ```
   From Name: TYT Support
   From Email: noreply@tyt.foundation
   Reply To: support@tyt.foundation
   ```
3. Dashboard → Email API → Dynamic Templates
4. Create Template → Send Test Email
5. Проверьте inbox

**Метод 2: API Test**
```bash
curl -X POST https://api.sendgrid.com/v3/mail/send \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "personalizations": [{
      "to": [{"email": "ваш_email@gmail.com"}]
    }],
    "from": {
      "email": "noreply@tyt.foundation",
      "name": "TYT Foundation"
    },
    "subject": "Test Email",
    "content": [{
      "type": "text/plain",
      "value": "This is a test email from tyt.foundation"
    }]
  }'
```

### Test 2: Email Forwarding
1. Попросите друга отправить email на support@tyt.foundation
2. Проверьте, что получили его на ваш Gmail
3. Verify: от кого пришло (должно быть через marcaria forward)

### Test 3: Send As
1. В Gmail нажмите **Compose**
2. **From:** выберите `support@tyt.foundation`
3. **To:** ваш тестовый email
4. **Subject:** Test Send As
5. Send
6. Проверьте inbox - должно прийти с адреса support@tyt.foundation

### Test 4: Mail Tester
1. Перейдите на https://www.mail-tester.com
2. Скопируйте email адрес, который они дают (например: test-xyz@mail-tester.com)
3. Отправьте email с noreply@tyt.foundation на этот адрес
4. Нажмите "Then check your score"
5. **Цель: 9-10/10**

---

## ШАГ 10: Добавление API Key в Supabase (5 минут)

### В Supabase Dashboard:

1. **Project:** https://supabase.com/dashboard/project/xyoaobelwkmrncvktrkv
2. **Settings** → **Secrets**
3. **New secret**
   ```
   Name: SENDGRID_API_KEY
   Value: SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
4. **Add secret**

### Проверка:
```bash
# В edge function теперь доступно:
const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
```

---

## ШАГ 11: Настройка Supabase Auth Email (10 минут)

### В Supabase Dashboard:

1. **Authentication** → **Settings** → **Email Templates**

2. **Site URL:** `https://tyt.foundation`

3. **Redirect URLs:** Add:
   ```
   https://tyt.foundation/*
   https://takeyourtoken.app/*
   ```

4. **Email Auth Settings:**
   ```
   ☑ Enable Email Confirmations
   ☑ Enable Email Change Confirmations
   ☑ Secure Email Change

   Email Confirmation: 24 hours
   Password Recovery: 1 hour
   ```

5. **SMTP Settings** (опционально, если не используете Supabase Email):
   ```
   Host: smtp.sendgrid.net
   Port number: 587
   Username: apikey
   Password: <ваш SendGrid API Key>
   Sender email: noreply@tyt.foundation
   Sender name: TYT Foundation
   ☑ Enable SMTP
   ```

6. **Customize Templates:**

**Confirm Signup:**
```html
<h2>Добро пожаловать в TYT Foundation!</h2>
<p>Привет {{ .Email }}!</p>
<p>Спасибо за регистрацию. Пожалуйста, подтвердите ваш email:</p>
<p><a href="{{ .ConfirmationURL }}">Подтвердить Email</a></p>
<p>Эта ссылка действительна 24 часа.</p>
```

**Reset Password:**
```html
<h2>Сброс пароля</h2>
<p>Привет {{ .Email }}!</p>
<p>Вы запросили сброс пароля. Нажмите на кнопку ниже:</p>
<p><a href="{{ .ConfirmationURL }}">Сбросить пароль</a></p>
<p>Если вы не запрашивали сброс пароля, проигнорируйте это письмо.</p>
```

**Change Email:**
```html
<h2>Подтверждение смены email</h2>
<p>Привет!</p>
<p>Вы запросили смену email на {{ .Email }}. Подтвердите:</p>
<p><a href="{{ .ConfirmationURL }}">Подтвердить новый email</a></p>
```

7. **Save**

---

## Чеклист финальной проверки

После выполнения всех шагов, проверьте:

### DNS & Domain:
- [ ] SPF record добавлен и проверен
- [ ] DKIM records (s1, s2) добавлены и проверены
- [ ] DMARC record добавлен
- [ ] Link branding CNAME добавлен
- [ ] Домен verified в SendGrid (✅ зеленая галочка)
- [ ] DNS propagation завершена (проверьте на mxtoolbox.com)

### Email Forwarding:
- [ ] support@tyt.foundation → ваш Gmail
- [ ] Тестовое письмо получено
- [ ] Gmail Send As настроен
- [ ] Тестовая отправка с support@tyt.foundation успешна

### SendGrid:
- [ ] API Key создан
- [ ] API Key добавлен в Supabase Secrets
- [ ] Verified Sender создан (noreply@tyt.foundation)
- [ ] Test email отправлен и получен
- [ ] Mail-tester score > 9/10

### Supabase Auth:
- [ ] SMTP settings настроены (если используете custom SMTP)
- [ ] Email templates кастомизированы
- [ ] Site URL и Redirect URLs добавлены
- [ ] Email confirmations включены
- [ ] Тестовая регистрация - email получен

### Code:
- [ ] Edge functions обновлены (см. следующий документ)
- [ ] Email templates обновлены на tyt.foundation
- [ ] Contact form создана
- [ ] Database triggers настроены

---

## Типичные проблемы и решения

### Проблема: DNS не верифицируется в SendGrid

**Причина:** DNS изменения еще не распространились.

**Решение:**
1. Подождите 24-48 часов
2. Проверьте на https://dnschecker.org
3. Убедитесь, что записи добавлены БЕЗ кавычек
4. Проверьте правильность Host names (точки в конце или нет)

### Проблема: Email forwarding не работает

**Причина:** MX records не настроены или forwarding не активирован.

**Решение:**
1. Убедитесь, что forwarding активен в marcaria.com
2. Добавьте MX records, если требуется
3. Проверьте spam folder
4. Подождите несколько минут (может быть задержка)

### Проблема: Gmail Send As не может подключиться к SMTP

**Причина:** Неправильный API Key или настройки SMTP.

**Решение:**
1. Username ДОЛЖЕН быть: `apikey` (буквально слово "apikey")
2. Password - ваш SendGrid API Key
3. Port: 587 (НЕ 465)
4. TLS enabled
5. Убедитесь, что нет пробелов в API Key

### Проблема: Emails попадают в SPAM

**Причина:** DMARC policy слишком строгая или content флаг.

**Решение:**
1. Измените DMARC на `p=none` вместо `p=quarantine`
2. Добавьте unsubscribe ссылку
3. Warm up domain - начните с малого объема
4. Избегайте spam слов (FREE, URGENT, CLICK HERE)
5. Используйте HTML + TEXT версии

---

## Следующие шаги

Теперь, когда DNS настроены и email система работает, нужно:

1. **Обновить код** - все edge functions и templates
2. **Создать contact form** - публичную страницу
3. **Настроить triggers** - автоматические уведомления
4. **Deploy и test** - production тестирование

**Готовы перейти к обновлению кода? Скажите, и я начну! 🚀**
