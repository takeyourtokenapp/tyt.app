# Тестовые учетные данные для входа

## Основная проблема
"Network error. Check your connection and Supabase configuration."

Это означает, что браузер не может подключиться к Supabase Auth API.

## Доступные тестовые пользователи

### Пользователь 1
```
Email: dolbpinisrail@gmail.com
Password: test123456
```

### Пользователь 2
```
Email: workingtest@example.com
Password: test123456
```

## Способы диагностики

### 1. Тестовая страница Auth
Откройте в браузере:
```
http://localhost:5173/test-auth
```

Эта страница покажет:
- Конфигурацию Supabase
- Результаты тестовых запросов
- Детальную информацию об ошибках

### 2. Тестовая страница Supabase
Откройте в браузере:
```
http://localhost:5173/test-supabase
```

## Возможные причины ошибки

### 1. Supabase проект приостановлен
Проверьте в Supabase Dashboard:
- https://supabase.com/dashboard
- Убедитесь что проект `xyvzpezqavqujpxodtre` активен и работает

### 2. CORS проблемы
В Supabase Dashboard → Settings → API:
- Убедитесь что `http://localhost:5173` добавлен в "Site URL"
- Проверьте "Additional Redirect URLs"

### 3. Auth настройки
В Supabase Dashboard → Authentication → Settings:
- ✅ Disable "Email confirmation"
- ✅ Enable "Enable sign ups"
- ✅ Проверьте что "Site URL" = `http://localhost:5173`

### 4. Проверка доступности API
Выполните в терминале:
```bash
curl https://xyvzpezqavqujpxodtre.supabase.co/auth/v1/health
```

Должен вернуть: `{"date":"...","description":"GoTrue operational"}`

## Что делать если Auth не работает

### Вариант 1: Проверить статус Supabase
```bash
# Проверить доступность
curl -I https://xyvzpezqavqujpxodtre.supabase.co/auth/v1/health
```

### Вариант 2: Проверить секреты
Убедитесь что в `.env` файле есть:
```
VITE_SUPABASE_URL=https://xyvzpezqavqujpxodtre.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Вариант 3: Перезапустить dev server
```bash
# Остановить текущий сервер (Ctrl+C)
# Запустить заново
npm run dev
```

## Следующие шаги

1. Откройте `/test-auth` в браузере
2. Нажмите "Test Auth Login"
3. Посмотрите результаты в разделе "Details"
4. Если увидите конкретную ошибку - дайте знать
