# TYT Email System - Полное руководство по настройке

## Обзор

Этот документ содержит пошаговое руководство по полной настройке email системы для проекта TYT с использованием домена **tyt.foundation**.

## Архитектура email системы TYT

```
┌─────────────────────────────────────────────────────────────┐
│                    TYT Email Ecosystem                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. Supabase Auth Emails (автоматические)                   │
│     - Регистрация / верификация email                        │
│     - Восстановление пароля                                  │
│     - Смена email                                             │
│     - Magic Link (опционально)                               │
│                                                               │
│  2. Transactional Emails (через Edge Functions)             │
│     - Подтверждения транзакций                               │
│     - Уведомления о депозитах/выводах                        │
│     - Дневные отчеты наград                                  │
│     - Счета за обслуживание                                  │
│     - Обновления KYC статуса                                 │
│     - Алерты безопасности                                    │
│                                                               │
│  3. Contact Form (форма связи)                               │
│     - Сообщения от пользователей → admin                     │
│     - Ответы admin → пользователям                           │
│                                                               │
│  4. Foundation Communications (фондовые коммуникации)        │
│     - Отчеты о донатах                                       │
│     - Новости фонда                                          │
│     - Impact reports                                         │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Текущая ситуация

### Что у вас уже есть:
- ✅ Домен tyt.foundation (куплен через marcaria.com)
- ✅ DNS настроены на bolt.new для веб-сайта
- ✅ Sender Identity создан в Supabase:
  - From Name: `TakeYourToken Support`
  - From Email: `noreply@tyt.foundation`
  - Reply To: `support@tyt.foundation`
  - Nickname: `TYT Foundation Notifications`

### Проблема:
- ❌ У вас нет реального email mailbox для `noreply@tyt.foundation` или `support@tyt.foundation`
- ❌ DNS не настроены для отправки email (нет SPF, DKIM, DMARC)
- ❌ Edge функции используют старый домен `takeyourtoken.app`

## Решение: Полная настройка email системы

---

## ЧАСТЬ 1: Выбор Email провайдера

У вас есть 3 варианта:

### Вариант A: SendGrid (Рекомендуется для TYT)

**Преимущества:**
- Уже интегрирован в код (функция `send-email`)
- 100 emails/день бесплатно
- Отличная доставляемость
- Простая настройка домена
- API для программной отправки

**Стоимость:**
- Free: 100 emails/day
- Essentials: $19.95/месяц - 50,000 emails/месяц
- Pro: $89.95/месяц - 100,000 emails/месяц

**Настройка:**
1. Зарегистрируйтесь на https://sendgrid.com
2. Создайте API Key
3. Добавьте и верифицируйте домен `tyt.foundation`
4. Добавьте DNS записи (SendGrid предоставит их)

### Вариант B: Supabase SMTP/SendGrid Integration

**Преимущества:**
- Встроено в Supabase
- Автоматические auth emails
- Единая платформа

**Настройка:**
1. Supabase Dashboard → Settings → Auth
2. SMTP Settings → Enable custom SMTP
3. Используйте SendGrid SMTP или другой провайдер

### Вариант C: Resend (Современная альтернатива)

**Преимущества:**
- Специально для developers
- Отличный DX (developer experience)
- React Email интеграция
- 3,000 emails/месяц бесплатно

**Стоимость:**
- Free: 3,000 emails/месяц
- Pro: $20/месяц - 50,000 emails/месяц

---

## ЧАСТЬ 2: Настройка DNS для tyt.foundation

### Шаг 1: Получить DNS записи от email провайдера

После добавления домена в SendGrid/Resend, вы получите DNS записи:

#### A. SPF Record (Sender Policy Framework)
Указывает, какие серверы могут отправлять email от вашего домена.

```
Type: TXT
Name: @
Value: v=spf1 include:sendgrid.net ~all
```

#### B. DKIM Records (DomainKeys Identified Mail)
Цифровая подпись для ваших emails.

```
Type: CNAME
Name: s1._domainkey
Value: s1.domainkey.u12345678.wl123.sendgrid.net

Type: CNAME
Name: s2._domainkey
Value: s2.domainkey.u12345678.wl123.sendgrid.net
```

#### C. DMARC Record (Domain-based Message Authentication)
Политика для недоставленных/поддельных emails.

```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc-reports@tyt.foundation
```

### Шаг 2: Добавить DNS записи в marcaria.com

1. Войдите в панель управления marcaria.com
2. Найдите управление DNS для домена tyt.foundation
3. Добавьте все записи (SPF, DKIM, DMARC)
4. Сохраните изменения

**⚠️ Важно:** DNS изменения могут занять 24-48 часов для полного распространения.

### Шаг 3: Верифицировать домен

1. В SendGrid/Resend нажмите "Verify Domain"
2. Подождите, пока все записи будут обнаружены (обычно 10-30 минут)
3. Получите подтверждение верификации

---

## ЧАСТЬ 3: Решение проблемы "нет реального mailbox"

### Проблема:
У вас нет email сервера для получения писем на `support@tyt.foundation`.

### Решение 1: Email Forwarding (Пересылка)

Настройте пересылку в marcaria.com:

```
support@tyt.foundation → ваш_реальный_email@gmail.com
hello@tyt.foundation → ваш_реальный_email@gmail.com
admin@tyt.foundation → ваш_реальный_email@gmail.com
```

**Как настроить:**
1. marcaria.com → Email Management
2. Create Email Forward
3. From: `support@tyt.foundation`
4. To: `ваш_реальный_email@gmail.com`

**Преимущества:**
- ✅ Бесплатно
- ✅ Простая настройка
- ✅ Получаете все письма на существующий email

**Недостатки:**
- ❌ Нельзя отвечать с адреса @tyt.foundation напрямую
- ❌ Нужно настроить "Send As" в Gmail (см. ниже)

### Решение 2: Gmail "Send As" (Отправка от имени)

Настройте Gmail для отправки с адреса support@tyt.foundation:

**Шаг 1: Настройка в Gmail**
1. Gmail → Settings → Accounts and Import
2. "Send mail as" → Add another email address
3. Name: `TYT Support`
4. Email: `support@tyt.foundation`
5. Treat as alias: ✅ Yes

**Шаг 2: SMTP настройки**
```
SMTP Server: smtp.sendgrid.net
Port: 587
Username: apikey
Password: <ваш SendGrid API Key>
TLS: Enabled
```

**Результат:**
- ✅ Получаете письма через forwarding
- ✅ Отвечаете с адреса support@tyt.foundation
- ✅ Все выглядит профессионально

### Решение 3: Google Workspace / Microsoft 365 (Профессиональный)

**Стоимость:**
- Google Workspace: $6/месяц за mailbox
- Microsoft 365: $6/месяц за mailbox

**Преимущества:**
- ✅ Полноценный email сервер
- ✅ Календарь, Drive, Meet
- ✅ Профессиональный вид
- ✅ Неограниченные алиасы

**Настройка:**
1. Зарегистрируйте Google Workspace
2. Добавьте домен tyt.foundation
3. Создайте mailboxes:
   - support@tyt.foundation
   - noreply@tyt.foundation (алиас)
   - admin@tyt.foundation
4. Добавьте DNS записи от Google

---

## ЧАСТЬ 4: Обновление Supabase Auth для tyt.foundation

### Шаг 1: Настройка Auth в Supabase Dashboard

1. **Перейдите в Supabase Dashboard**
   ```
   https://supabase.com/dashboard/project/xyoaobelwkmrncvktrkv
   ```

2. **Authentication → Settings → Email Templates**

3. **Настройте параметры:**
   ```
   Sender Name: TYT Foundation
   Sender Email: noreply@tyt.foundation

   ✅ Enable Email Confirmations
   ✅ Enable Email Change Confirmations

   Email Confirmation: 24 hours
   Password Recovery: 1 hour
   ```

4. **Если используете SendGrid:**
   - Settings → Auth → SMTP Settings
   - Enable Custom SMTP
   ```
   Host: smtp.sendgrid.net
   Port: 587
   Username: apikey
   Password: <ваш SendGrid API Key>
   Sender Email: noreply@tyt.foundation
   Sender Name: TYT Foundation
   ```

### Шаг 2: Кастомизация Email Templates

В Supabase Dashboard можно настроить HTML шаблоны:

**Confirm Signup Email:**
```html
<h2>Добро пожаловать в TYT Foundation!</h2>
<p>Подтвердите ваш email, нажав на кнопку ниже:</p>
<a href="{{ .ConfirmationURL }}">Подтвердить Email</a>
```

**Reset Password Email:**
```html
<h2>Восстановление пароля</h2>
<p>Нажмите на кнопку для сброса пароля:</p>
<a href="{{ .ConfirmationURL }}">Сбросить пароль</a>
```

---

## ЧАСТЬ 5: Обновление Edge Functions

Нужно обновить все email-функции для использования домена `tyt.foundation`.

### Файлы для обновления:

1. `/supabase/functions/send-email/index.ts`
2. `/supabase/functions/send-notification-email/index.ts`
3. `/supabase/functions/resend-verification-email/index.ts`

### Изменения:

```typescript
// Старый код:
const FROM_EMAIL = 'noreply@takeyourtoken.app';
const FROM_NAME = 'TakeYourToken';

// Новый код:
const FROM_EMAIL = 'noreply@tyt.foundation';
const FROM_NAME = 'TYT Foundation';
```

Также обновите все ссылки в email шаблонах:
- `takeyourtoken.app` → `tyt.foundation`
- `support@takeyourtoken.app` → `support@tyt.foundation`

---

## ЧАСТЬ 6: Настройка формы контакта

### Текущая реализация:

У вас уже есть:
- ✅ Таблица `contact_messages`
- ✅ Admin интерфейс `/app/admin-messages`
- ✅ RLS policies
- ✅ Rate limiting

### Что нужно добавить:

**1. Публичная форма контакта на tyt.foundation**

Создайте страницу `/src/pages/Contact.tsx`:

```typescript
// Форма отправляет данные в таблицу contact_messages
// Пользователи могут писать вам напрямую
// Вы получаете уведомление на email через trigger
```

**2. Email уведомление при новом сообщении**

Создайте триггер в базе данных:

```sql
-- Автоматически отправляет email админу при новом сообщении
CREATE OR REPLACE FUNCTION notify_admin_new_contact()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO email_queue (
    email,
    template,
    data,
    scheduled_at
  ) VALUES (
    'ваш_email@gmail.com',
    'newContactMessage',
    jsonb_build_object(
      'name', NEW.name,
      'email', NEW.email,
      'subject', NEW.subject,
      'message', NEW.message
    ),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_contact_message_created
  AFTER INSERT ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_admin_new_contact();
```

**3. Auto-reply пользователю**

```sql
-- Автоматически отправляет подтверждение пользователю
CREATE OR REPLACE FUNCTION send_contact_confirmation()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO email_queue (
    email,
    template,
    data,
    scheduled_at
  ) VALUES (
    NEW.email,
    'contactConfirmation',
    jsonb_build_object(
      'name', NEW.name,
      'subject', NEW.subject
    ),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_contact_confirmation
  AFTER INSERT ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION send_contact_confirmation();
```

---

## ЧАСТЬ 7: Тестирование email системы

### Шаг 1: Test Email Deliverability

Используйте https://www.mail-tester.com:

1. Отправьте тестовый email на адрес, предоставленный сайтом
2. Проверьте score (должен быть 9-10/10)
3. Исправьте все предупреждения

### Шаг 2: Test Auth Emails

```typescript
// Зарегистрируйте нового пользователя
const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'testpassword123'
});

// Проверьте inbox - должен прийти email верификации
```

### Шаг 3: Test Transactional Emails

```typescript
// Вызовите edge function напрямую
const response = await fetch(
  'https://xyoaobelwkmrncvktrkv.supabase.co/functions/v1/send-email',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer <anon-key>',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      to: 'ваш_email@gmail.com',
      template: 'welcome',
      data: { name: 'Test User' }
    })
  }
);
```

### Шаг 4: Monitor Deliverability

SendGrid Dashboard покажет:
- ✅ Delivered
- ❌ Bounced
- ⚠️ Spam Reports
- 📊 Open Rates
- 🔗 Click Rates

---

## ЧАСТЬ 8: Production Checklist

### Email Infrastructure:
- [ ] DNS записи добавлены (SPF, DKIM, DMARC)
- [ ] Домен верифицирован в SendGrid/Resend
- [ ] Email forwarding настроен на support@tyt.foundation
- [ ] Gmail "Send As" настроен для ответов
- [ ] Supabase Auth SMTP настроен
- [ ] Email templates кастомизированы

### Code Updates:
- [ ] Edge functions обновлены на tyt.foundation
- [ ] Email шаблоны обновлены (ссылки, бренд)
- [ ] Contact form создана
- [ ] Email triggers настроены
- [ ] Rate limiting включен

### Testing:
- [ ] Mail-tester score > 9/10
- [ ] Auth emails доставляются
- [ ] Transactional emails доставляются
- [ ] Contact form работает
- [ ] Admin notifications приходят
- [ ] Replies работают

### Legal & Compliance:
- [ ] Unsubscribe ссылки в каждом email
- [ ] Privacy policy упоминает email usage
- [ ] GDPR compliance (если EU users)
- [ ] Terms of Service обновлены

---

## ЧАСТЬ 9: Рекомендуемый план действий

### Фаза 1: Базовая настройка (1-2 дня)
1. ✅ Зарегистрироваться на SendGrid
2. ✅ Создать API Key
3. ✅ Добавить домен tyt.foundation
4. ✅ Добавить DNS записи в marcaria.com
5. ✅ Верифицировать домен
6. ⏳ Подождать распространения DNS (24-48ч)

### Фаза 2: Email Forwarding (30 минут)
1. ✅ Настроить forwarding в marcaria.com
2. ✅ Настроить Gmail "Send As"
3. ✅ Тестировать получение/отправку

### Фаза 3: Обновление кода (2-3 часа)
1. ✅ Обновить edge functions
2. ✅ Обновить email templates
3. ✅ Deploy functions
4. ✅ Тестировать отправку

### Фаза 4: Supabase Auth (1 час)
1. ✅ Настроить SMTP в Supabase
2. ✅ Кастомизировать templates
3. ✅ Тестировать регистрацию/восстановление

### Фаза 5: Contact Form (2-3 часа)
1. ✅ Создать публичную страницу
2. ✅ Настроить triggers
3. ✅ Тестировать flow
4. ✅ Проверить admin notifications

### Фаза 6: Monitoring & Optimization (ongoing)
1. ✅ Настроить SendGrid alerts
2. ✅ Мониторить deliverability
3. ✅ Оптимизировать templates
4. ✅ A/B тестирование subject lines

---

## ЧАСТЬ 10: Стоимость и масштабирование

### Текущие потребности (MVP):
- ~500 emails/день (регистрации, транзакции)
- **SendGrid Free Tier: $0/месяц** ✅

### Рост (1000 пользователей):
- ~2,000 emails/день
- **SendGrid Essentials: $19.95/месяц**

### Масштаб (10,000+ пользователей):
- ~20,000 emails/день
- **SendGrid Pro: $89.95/месяц**

### Рекомендация для email:
```
Начните с:
- SendGrid Free (100 emails/day для тестирования)
- Email Forwarding (бесплатно)
- Gmail Send As (бесплатно)

Апгрейдите позже:
- SendGrid Essentials ($19.95) когда > 100 emails/day
- Google Workspace ($6/месяц) когда нужен профессиональный mailbox
```

---

## ЧАСТЬ 11: Troubleshooting

### Проблема: Emails не доставляются

**Проверьте:**
1. DNS records propagated: https://mxtoolbox.com/SuperTool.aspx
2. SPF record: `v=spf1 include:sendgrid.net ~all`
3. DKIM records verified in SendGrid
4. Domain verification status: ✅ Verified
5. SendGrid API key правильный в .env

### Проблема: Emails в SPAM

**Решение:**
1. Добавьте DMARC record
2. Warm up domain (начните с малого объема)
3. Проверьте content (избегайте spam слов)
4. Добавьте unsubscribe ссылку
5. Используйте text + HTML версии

### Проблема: Can't reply to noreply@

**Решение:**
Используйте Reply-To header:
```typescript
headers: {
  'Reply-To': 'support@tyt.foundation'
}
```

### Проблема: DNS changes not working

**Решение:**
1. Подождите 24-48 часов
2. Проверьте через https://dnschecker.org
3. Очистите DNS cache: `ipconfig /flushdns` (Windows)
4. Свяжитесь с support marcaria.com

---

## Контакты для помощи

**SendGrid Support:** https://support.sendgrid.com

**Marcaria.com Support:** support@marcaria.com

**Supabase Support:** https://supabase.com/support

**DNS Tools:**
- https://mxtoolbox.com
- https://dnschecker.org
- https://www.mail-tester.com

---

## Следующие шаги

После того как вы решите, какой вариант хотите использовать, я могу:

1. ✅ Обновить все edge functions для tyt.foundation
2. ✅ Создать новые email templates
3. ✅ Создать публичную форму контакта
4. ✅ Настроить database triggers
5. ✅ Создать admin notification system
6. ✅ Добавить unsubscribe механизм
7. ✅ Написать миграции для недостающих таблиц

**Скажите мне, какой вариант вы выбираете, и я начну имплементацию!**
