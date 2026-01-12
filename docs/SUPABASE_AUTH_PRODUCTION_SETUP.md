# Supabase Authentication Production Setup Guide

## Критически важно для работы восстановления пароля!

## Проблема

После публикации приложения из bolt.new, ссылки восстановления пароля ведут на `localhost:5173` вместо вашего реального домена.

## Решение

### Шаг 1: Настройка Site URL в Supabase Dashboard

1. Откройте [Supabase Dashboard](https://supabase.com/dashboard)
2. Выберите ваш проект
3. Перейдите в **Authentication** → **URL Configuration**
4. Найдите поле **Site URL**
5. Измените с `http://localhost:5173` на ваш production URL:
   - Например: `https://your-app.bolt.new`
   - Или ваш custom domain: `https://yourdomain.com`

### Шаг 2: Настройка Redirect URLs

В том же разделе **URL Configuration**:

1. Найдите **Redirect URLs**
2. Добавьте следующие URLs (нажмите "Add URL" для каждого):
   ```
   https://your-app.bolt.new/*
   https://your-app.bolt.new/reset-password
   https://your-app.bolt.new/login
   http://localhost:5173/*
   http://localhost:5173/reset-password
   ```

Замените `your-app.bolt.new` на ваш реальный домен!

### Шаг 3: Настройка Email Templates (опционально, но рекомендуется)

1. Перейдите в **Authentication** → **Email Templates**
2. Выберите **Reset Password**
3. Убедитесь, что в шаблоне используется `{{ .SiteURL }}` или `{{ .ConfirmationURL }}`
4. Пример правильного шаблона:

```html
<h2>Reset Password</h2>
<p>Follow this link to reset the password for your account:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
<p>Or copy and paste this URL into your browser:</p>
<p>{{ .ConfirmationURL }}</p>
```

### Шаг 4: Проверка настроек SMTP (если используется)

Если вы используете custom SMTP:

1. Перейдите в **Project Settings** → **Authentication**
2. Найдите **SMTP Settings**
3. Убедитесь, что:
   - SMTP сервер настроен корректно
   - Email подтвержден
   - Rate limits не превышены

## Тестирование

После настройки:

1. Откройте ваше приложение на production URL
2. Перейдите на страницу логина
3. Нажмите "Forgot password?"
4. Введите email
5. Проверьте почту
6. Ссылка должна теперь вести на `https://your-domain.com/reset-password`

## Типичные ошибки

### Ошибка: `otp_expired`

**Причина:** Ссылка устарела (истекла через 1 час)

**Решение:** Запросите новую ссылку через "Forgot password?"

### Ошибка: `access_denied`

**Причина:** Неправильный URL в Redirect URLs или Site URL

**Решение:**
1. Проверьте Site URL в Supabase Dashboard
2. Добавьте ваш домен в Redirect URLs
3. Подождите 1-2 минуты для применения изменений

### Ссылка ведет на localhost

**Причина:** Site URL не обновлен в Supabase Dashboard

**Решение:**
1. Обновите Site URL на production domain
2. Очистите кэш браузера
3. Запросите новую ссылку восстановления

## Безопасность

### Рекомендации:

1. **Rate Limiting**: Ограничьте количество запросов восстановления пароля
   - Supabase автоматически ограничивает: 4 запроса в час на email

2. **Email Verification**: Убедитесь что Email Rate Limits не слишком низкие
   - Authentication → Rate Limits
   - Рекомендуется: 3-4 emails в час на пользователя

3. **Password Requirements**: Используйте сильные требования к паролям
   - Минимум 8 символов
   - Заглавные и строчные буквы
   - Цифры
   - Специальные символы (опционально)

4. **Token Expiration**: Ссылки восстановления истекают через 1 час
   - Это нормально и безопасно
   - Пользователь может запросить новую ссылку

## Мониторинг

Следите за:

1. **Failed Authentication Attempts**
   - Authentication → Logs

2. **Email Delivery**
   - Project Settings → SMTP logs

3. **Rate Limit Hits**
   - Может указывать на атаку или проблему

## Дополнительные настройки для production

### 1. Custom Email Domain

Настройте отправку с вашего домена:
- Project Settings → Authentication → Email Settings
- Используйте ваш SMTP или SendGrid/Mailgun

### 2. Email Confirmations

Если нужна подтверждение email при регистрации:
- Authentication → Providers → Email
- Включите "Confirm email"

### 3. Password History

Для корпоративных приложений:
- Рассмотрите хранение истории паролей
- Не позволяйте повторное использование последних N паролей

## Troubleshooting Commands

Проверка текущей сессии в консоли браузера:

```javascript
// Получить текущую сессию
const { data, error } = await supabase.auth.getSession();
console.log('Session:', data);

// Получить текущего пользователя
const { data: { user } } = await supabase.auth.getUser();
console.log('User:', user);
```

## Поддержка

Если проблемы остаются:

1. Проверьте Browser Console (F12) для JavaScript ошибок
2. Проверьте Network tab для failed requests
3. Проверьте Supabase Dashboard → Authentication → Logs
4. Проверьте что все миграции применены
5. Свяжитесь с Supabase Support если проблема на их стороне

## Чек-лист для production

- [ ] Site URL обновлен на production domain
- [ ] Redirect URLs включают production domain
- [ ] Email templates проверены и работают
- [ ] SMTP настроен (если используется custom)
- [ ] Rate limits проверены и адекватны
- [ ] Password policies настроены
- [ ] Тестирование на production завершено
- [ ] Мониторинг настроен

## Контакты для помощи

- Supabase Docs: https://supabase.com/docs/guides/auth
- Supabase Support: https://supabase.com/support
- Community Discord: https://discord.supabase.com
