# Инструкции по настройке экосистемы TYT

## 1. Установка Solana Web3 зависимостей

Попробуйте установить Solana пакеты по одному:

```bash
npm install @solana/web3.js@1.87.6
```

Если возникают проблемы с памятью, используйте:

```bash
npm install @solana/web3.js@1.87.6 --legacy-peer-deps
```

## 2. Настройка переменных окружения (.env)

### Критические секреты для работы системы:

```env
# Supabase (уже настроено)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Blockchain и кошельки
WEBHOOK_SECRET=your_webhook_secret_key_here
WALLET_ENCRYPTION_KEY=your_32_character_encryption_key
CRON_SECRET=your_cron_secret_key_here

# TRON сеть (для TRC20 депозитов)
TRONGRID_API_KEY=your_trongrid_api_key

# TYT токен на pump.fun
VITE_TYT_TOKEN_MINT=ваш_адрес_TYT_токена_на_Solana
VITE_SOLANA_NETWORK=mainnet-beta
```

### Как получить каждый секрет:

#### WEBHOOK_SECRET
Генерируется случайным образом для безопасности webhook endpoints:
```bash
openssl rand -base64 32
```

#### WALLET_ENCRYPTION_KEY
Ключ для шифрования приватных ключей кошельков (32 символа):
```bash
openssl rand -hex 16
```

#### CRON_SECRET
Защита cron задач от несанкционированного доступа:
```bash
openssl rand -base64 32
```

#### TRONGRID_API_KEY
1. Перейдите на https://www.trongrid.io/
2. Зарегистрируйтесь
3. Создайте API ключ в личном кабинете
4. Используйте для мониторинга TRON транзакций

#### VITE_TYT_TOKEN_MINT
Адрес вашего TYT токена на Solana (из pump.fun):
- Зайдите на pump.fun где вы создали токен
- Скопируйте Contract Address токена TYT
- Вставьте в .env файл

## 3. Настройка Edge Functions в Supabase

Edge Functions уже созданы в проекте. Для их деплоя:

### Через CLI (если установлен):
```bash
supabase functions deploy process-payment
supabase functions deploy process-deposit
supabase functions deploy blockchain-webhook
supabase functions deploy monitor-deposits
supabase functions deploy generate-deposit-address
```

### Через MCP (рекомендуется):
Edge Functions будут автоматически задеплоены при первом обращении или можно попросить меня их задеплоить.

## 4. Настройка Phantom Wallet (для пользователей)

Пользователи должны:

1. **Установить Phantom Wallet:**
   - Chrome: https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa
   - Firefox: https://addons.mozilla.org/en-US/firefox/addon/phantom-app/
   - Mobile: Скачать приложение Phantom

2. **Создать кошелек:**
   - Следовать инструкциям в расширении
   - Сохранить seed phrase в безопасном месте

3. **Пополнить SOL:**
   - Купить SOL на бирже (Binance, Coinbase, etc.)
   - Отправить на адрес Phantom кошелька
   - Минимум 0.1 SOL для начала торговли

## 5. Интеграция с pump.fun

### Получение данных токена TYT:

Обновите файл `src/utils/pumpFun.ts`:

```typescript
export const TYT_TOKEN_MINT = 'ВАШ_АДРЕС_ТОКЕНА_TYT';
```

### API pump.fun:

pump.fun не имеет официального публичного API, поэтому в текущей реализации используется:

1. **Mock данные** (для разработки) - уже реализовано
2. **Прямые транзакции через Solana** - нужно добавить реальный swap
3. **Jupiter Aggregator** (рекомендуется) - для лучших цен

### Опционально: Интеграция Jupiter для реальной торговли

```bash
npm install @jup-ag/core
```

Затем обновите `buyTYTToken` и `sellTYTToken` функции для использования Jupiter API.

## 6. Настройка CORS для Edge Functions

Edge Functions уже настроены с правильными CORS headers. Убедитесь, что в каждой функции есть:

```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};
```

## 7. Настройка Row Level Security (RLS)

RLS политики уже созданы для всех таблиц. Проверьте, что миграции применены:

```bash
# Список всех миграций
supabase migration list

# Если есть неприменённые миграции
supabase db push
```

## 8. Тестирование системы

### Проверка Web3 подключения:

1. Откройте DevTools (F12)
2. В консоли проверьте:
   ```javascript
   console.log(window.solana)
   ```
3. Должен вывести объект Phantom provider

### Проверка базы данных:

```sql
-- Проверка таблиц
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Проверка RLS
SELECT tablename, policyname FROM pg_policies
WHERE schemaname = 'public';
```

### Проверка Edge Functions:

```bash
curl -X POST https://YOUR_SUPABASE_URL/functions/v1/process-payment \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

## 9. Запуск в production

### Hostinger деплой:

1. **Build проекта:**
   ```bash
   npm run build
   ```

2. **Загрузить dist/ на Hostinger:**
   - Через FTP/SFTP
   - Загрузить содержимое папки dist/ в public_html/

3. **Настроить .htaccess** (уже создан в public/)
   - Обеспечивает SPA роутинг
   - Редиректит на HTTPS

4. **Переменные окружения:**
   - На Hostinger переменные VITE_ должны быть встроены при build
   - Пересоберите проект с правильными значениями в .env

## 10. Мониторинг и логирование

### Supabase Dashboard:
- Мониторинг Edge Functions
- Логи выполнения
- Database queries

### Sentry (опционально):
```bash
npm install @sentry/react
```

Добавьте в `src/main.tsx`:
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production"
});
```

## 11. Безопасность

### Важные правила:

1. **НИКОГДА не коммитить .env файл**
2. **Использовать только HTTPS** в production
3. **Регулярно ротировать секретные ключи**
4. **Не хранить приватные ключи кошельков в открытом виде**
5. **Использовать Rate Limiting** для API endpoints
6. **Включить 2FA** для Supabase аккаунта

## 12. Поддержка и отладка

### Частые проблемы:

**Phantom не подключается:**
- Проверьте что расширение установлено
- Обновите страницу
- Проверьте разрешения сайта в Phantom

**Транзакции не проходят:**
- Проверьте баланс SOL
- Убедитесь что сеть Solana не перегружена
- Проверьте лимиты gas

**Edge Functions не работают:**
- Проверьте CORS headers
- Убедитесь что функции задеплоены
- Проверьте логи в Supabase Dashboard

### Контакты для помощи:

- Supabase Support: https://supabase.com/support
- Solana Discord: https://discord.gg/solana
- pump.fun Community: https://t.me/pumpdotfun

## 13. Следующие шаги

1. ✅ Установить @solana/web3.js
2. ✅ Настроить все переменные окружения
3. ✅ Задеплоить Edge Functions
4. ✅ Получить адрес TYT токена с pump.fun
5. ✅ Протестировать подключение Phantom
6. ✅ Протестировать покупку/продажу TYT
7. ✅ Настроить мониторинг транзакций
8. ✅ Запустить на production

---

## Быстрый старт (минимальная конфигурация)

Для быстрого запуска нужны только:

```env
# .env
VITE_SUPABASE_URL=ваш_url
VITE_SUPABASE_ANON_KEY=ваш_ключ
VITE_TYT_TOKEN_MINT=адрес_токена_с_pumpfun
WEBHOOK_SECRET=$(openssl rand -base64 32)
WALLET_ENCRYPTION_KEY=$(openssl rand -hex 16)
```

После этого:
```bash
npm install
npm run build
```

И система готова к работе!
