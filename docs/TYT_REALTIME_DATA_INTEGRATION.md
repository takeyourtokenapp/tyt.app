# TYT Real-Time Market Data Integration

## Описание

Страница TYT Trading отображает **реальные торговые данные в реальном времени** с платформы pump.fun и других источников.

## Архитектура получения данных

### Многоуровневая система fallback

Система пытается получить данные из нескольких источников в следующем порядке:

1. **Pump.fun API** (через Supabase Edge Function - основной источник)
   - URL: `https://frontend-api.pump.fun/coins/8YuADotEATc86nEgPUZVs8fBRxdMMgEP4JL4xv7rpump`
   - Данные: цена, рыночная капитализация, объем, ликвидность, держатели
   - Обновление: каждые 15 секунд

2. **DexScreener API** (резервный источник)
   - URL: `https://api.dexscreener.com/latest/dex/tokens/8YuADotEATc86nEgPUZVs8fBRxdMMgEP4JL4xv7rpump`
   - Данные: цена, FDV, объем 24ч, изменение цены, ликвидность
   - Используется если pump.fun недоступен

3. **Birdeye API** (дополнительный резерв в Edge Function)
   - URL: `https://public-api.birdeye.so/public/price?address=...`
   - Данные: цена, ликвидность, изменение цены

## Компоненты системы

### 1. Edge Function: `fetch-tyt-price`

Расположение: `/supabase/functions/fetch-tyt-price/index.ts`

**Назначение:**
- Проксирование запросов к pump.fun API (решение CORS проблемы)
- Получение данных из нескольких источников параллельно
- Fallback логика и обработка ошибок
- Кэширование ответов (10 секунд)

**Развертывание:**
```bash
# Через Supabase CLI (если установлен)
supabase functions deploy fetch-tyt-price

# Или через Supabase Dashboard
# Перейдите в Edge Functions -> Deploy New Function
# Скопируйте код из /supabase/functions/fetch-tyt-price/index.ts
```

**Endpoint:**
```
GET https://[your-project].supabase.co/functions/v1/fetch-tyt-price
```

**Response format:**
```json
{
  "success": true,
  "data": {
    "price": 0.00000234,
    "marketCap": 234000,
    "volume24h": 13000,
    "priceChange24h": 15.7,
    "holders": 842,
    "totalSupply": 1000000000,
    "liquidity": 45000,
    "source": "pump.fun"
  },
  "timestamp": "2025-01-09T12:34:56.789Z"
}
```

### 2. Client-side функция: `getTYTTokenData()`

Расположение: `/src/utils/pumpFun.ts`

**Логика работы:**
1. Пытается получить данные через Edge Function (pump.fun proxy)
2. Если неудача - пытается DexScreener напрямую
3. Если всё неудачно - возвращает пустые данные

**Возвращаемый тип:**
```typescript
interface TYTTokenData {
  price: number;
  marketCap: number;
  volume24h: number;
  priceChange24h: number;
  holders: number;
  totalSupply: number;
  liquidity: number;
  source?: string;           // Название источника данных
  lastUpdate?: string;       // Время последнего обновления
}
```

### 3. UI Component: TYT Trading Page

Расположение: `/src/pages/app/TYTTrading.tsx`

**Функции:**
- Отображение реальных рыночных данных
- Автоматическое обновление каждые 15 секунд
- Индикатор источника данных (зеленая точка = данные поступают)
- Время последнего обновления
- Ручная кнопка обновления

**Отображаемые метрики:**
- Текущая цена токена (USD)
- Изменение цены за 24 часа (%)
- Рыночная капитализация
- Объем торгов за 24 часа
- Количество держателей
- Ликвидность (SOL/USD)
- Общее предложение токенов

## Визуальные индикаторы

### Статус подключения

1. **Зеленая пульсирующая точка** - данные поступают в реальном времени
2. **Красная точка** - нет доступных данных
3. **Текст источника** - показывает откуда получены данные:
   - "Pump.fun (via proxy)" - основной источник
   - "DexScreener" - резервный источник
   - "No data available" - нет данных

### Информационный баннер

Желтый баннер в верхней части страницы показывает:
- Описание режима просмотра
- Текущий источник данных
- Статус торговых функций

## Проверка работы системы

### 1. Проверка в браузере

Откройте консоль разработчика (F12) и найдите логи:

```javascript
// Успешное получение данных
"Fetching TYT token data from multiple sources..."
"Edge function response: {...}"
"Using data from Edge Function (pump.fun proxy)"

// Или если используется резервный источник
"Edge function fetch error: ..."
"Using data from DexScreener"
```

### 2. Проверка Edge Function

```bash
# Тестовый запрос
curl -X GET \
  'https://[your-project].supabase.co/functions/v1/fetch-tyt-price' \
  -H 'Authorization: Bearer [anon-key]'
```

### 3. Проверка в UI

На странице TYT Trading вы должны видеть:
- ✅ Актуальную цену токена (не 0)
- ✅ Зеленую пульсирующую точку рядом с источником
- ✅ Название источника данных
- ✅ Время последнего обновления
- ✅ Реальные значения market cap, volume, и других метрик

## Настройка окружения

### Необходимые переменные окружения

`.env` файл:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Проверка конфигурации

Убедитесь что:
1. Edge Function `fetch-tyt-price` развернута
2. Переменные окружения настроены
3. CORS правильно настроен в Edge Function

## Частые проблемы и решения

### Проблема: "No data available"

**Причины:**
1. Edge Function не развернута
2. Неправильные credentials Supabase
3. Все источники данных недоступны

**Решение:**
1. Разверните Edge Function
2. Проверьте `.env` файл
3. Проверьте логи в консоли браузера

### Проблема: CORS ошибки

**Причина:**
Прямой запрос к pump.fun блокируется браузером

**Решение:**
Используйте Edge Function как прокси (уже реализовано)

### Проблема: Данные не обновляются

**Причины:**
1. Автообновление не работает
2. API источники недоступны

**Решение:**
1. Проверьте что `useEffect` с интервалом работает
2. Используйте кнопку "Refresh" вручную
3. Проверьте Network tab в DevTools

## API Rate Limits

### Pump.fun API
- Лимит неизвестен (публичный API)
- Рекомендуемый интервал: 10-15 секунд

### DexScreener API
- 300 запросов в минуту
- Наш интервал: 15 секунд = 4 запроса в минуту ✅

### Birdeye API
- 100 запросов в минуту (публичный)
- Используется только через Edge Function при необходимости

## Мониторинг

### Логирование

Edge Function логирует:
- Успешные запросы к источникам
- Ошибки подключения
- Выбранный источник данных
- Время ответа

Просмотр логов:
```bash
supabase functions logs fetch-tyt-price
```

### Метрики

Отслеживайте:
- Частоту успешных запросов
- Используемый источник данных
- Время ответа Edge Function
- Количество fallback'ов на резервные источники

## Будущие улучшения

1. **WebSocket подключение** - real-time updates без polling
2. **Графики цен** - интеграция TradingView
3. **История сделок** - отображение последних транзакций
4. **Depth chart** - визуализация order book
5. **Price alerts** - уведомления о достижении целевой цены (уже реализовано)

## Заключение

Система реального времени полностью функциональна и отображает актуальные данные о торгах TYT токена на pump.fun. Многоуровневая архитектура fallback обеспечивает надежность, а автоматическое обновление каждые 15 секунд гарантирует свежесть данных.

---

**Дата создания:** 2025-01-09
**Версия:** 1.0
**Статус:** Production Ready ✅
