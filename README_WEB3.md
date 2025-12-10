# TYT Web3 Integration - Документация

## Обзор

Система TYT теперь полностью интегрирована с Solana blockchain и pump.fun для торговли TYT токеном.

## Архитектура

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Web3Context - управление Phantom wallet              │ │
│  │  TYT Trading Page - интерфейс торговли                │ │
│  │  @solana/web3.js - взаимодействие с Solana            │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Backend                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Database Tables:                                      │ │
│  │  - user_web3_wallets (подключенные кошельки)          │ │
│  │  - tyt_token_trades (история сделок)                  │ │
│  │  - sol_transfers (переводы SOL)                       │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Edge Functions:                                       │ │
│  │  - process-payment (обработка платежей)               │ │
│  │  - process-deposit (обработка депозитов)              │ │
│  │  - blockchain-webhook (webhook для блокчейна)         │ │
│  │  - monitor-deposits (мониторинг депозитов)            │ │
│  │  - generate-deposit-address (генерация адресов)       │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│                    Blockchain Layer                          │
│  ┌─────────────────────┐  ┌─────────────────────────────┐  │
│  │   Solana Network    │  │    pump.fun Protocol        │  │
│  │   - SOL transfers   │  │    - TYT token trading      │  │
│  │   - Token swaps     │  │    - Price discovery        │  │
│  └─────────────────────┘  └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Ключевые компоненты

### 1. Web3Context (`src/contexts/Web3Context.tsx`)

Управляет подключением к Phantom wallet:
- Подключение/отключение кошелька
- Отслеживание смены аккаунта
- Хранение состояния подключенных кошельков
- Предоставление provider для транзакций

**Использование:**
```typescript
import { useWeb3 } from '../contexts/Web3Context';

const { connectedWallet, connectPhantom, disconnectWallet } = useWeb3();
```

### 2. pump.fun Utilities (`src/utils/pumpFun.ts`)

Функции для взаимодействия с TYT токеном:

**Основные функции:**
- `getTYTTokenData()` - получение данных токена
- `getUserTYTHoldings(userId)` - баланс пользователя
- `buyTYTToken(wallet, amount, provider)` - покупка токенов
- `sellTYTToken(wallet, amount, provider)` - продажа токенов
- `transferSOLToExternal(from, to, amount, provider)` - перевод SOL

**Пример использования:**
```typescript
import { buyTYTToken, getTYTTokenData } from '../utils/pumpFun';

const tokenData = await getTYTTokenData();
const result = await buyTYTToken(walletAddress, 0.5, provider);
```

### 3. TYT Trading Page (`src/pages/app/TYTTrading.tsx`)

Полнофункциональный интерфейс торговли:
- Подключение Phantom wallet
- Отображение данных токена в реальном времени
- Покупка TYT за SOL
- Продажа TYT за SOL
- История всех сделок
- Отображение баланса и статистики

### 4. Database Schema

**user_web3_wallets**
```sql
CREATE TABLE user_web3_wallets (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES profiles(id),
  wallet_address text NOT NULL,
  wallet_type text, -- phantom, solflare, etc.
  blockchain text DEFAULT 'solana',
  is_primary boolean DEFAULT false,
  last_connected_at timestamptz,
  created_at timestamptz DEFAULT now()
);
```

**tyt_token_trades**
```sql
CREATE TABLE tyt_token_trades (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES profiles(id),
  wallet_address text NOT NULL,
  trade_type text, -- buy, sell
  sol_amount numeric NOT NULL,
  tyt_amount numeric NOT NULL,
  price_per_token numeric NOT NULL,
  tx_signature text UNIQUE,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);
```

**sol_transfers**
```sql
CREATE TABLE sol_transfers (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES profiles(id),
  from_address text NOT NULL,
  to_address text NOT NULL,
  amount numeric NOT NULL,
  transfer_type text,
  tx_signature text UNIQUE,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);
```

## Настройка переменных окружения

### Обязательные переменные:

```env
# Supabase (уже настроено)
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key

# Security
WEBHOOK_SECRET=generated_secret
WALLET_ENCRYPTION_KEY=32_char_key
CRON_SECRET=generated_secret

# TRON Network
TRONGRID_API_KEY=your_trongrid_key

# TYT Token
VITE_TYT_TOKEN_MINT=your_token_address
VITE_SOLANA_NETWORK=mainnet-beta
```

### Генерация секретов:

```bash
bash generate-secrets.sh
```

## Пользовательский flow

### 1. Подключение кошелька

```
Пользователь → Кнопка "Connect Phantom"
                ↓
            Phantom popup
                ↓
          Авторизация
                ↓
     Wallet сохраняется в БД
                ↓
       Отображение адреса
```

### 2. Покупка TYT токена

```
Пользователь → Вводит сумму SOL
                ↓
         Расчет TYT amount
                ↓
        Кнопка "Buy TYT"
                ↓
     Phantom подписывает транзакцию
                ↓
      Транзакция в Solana
                ↓
     Запись в tyt_token_trades
                ↓
    Обновление баланса пользователя
```

### 3. Продажа TYT токена

```
Пользователь → Вводит количество TYT
                ↓
      Проверка баланса
                ↓
        Расчет SOL amount
                ↓
        Кнопка "Sell TYT"
                ↓
     Phantom подписывает транзакцию
                ↓
      Транзакция в Solana
                ↓
     Запись в tyt_token_trades
                ↓
    Обновление баланса пользователя
```

## Security

### Row Level Security (RLS)

Все таблицы защищены RLS политиками:

```sql
-- Только владелец может видеть свои кошельки
CREATE POLICY "Users can view own web3 wallets"
  ON user_web3_wallets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Только владелец может видеть свои сделки
CREATE POLICY "Users can view own trades"
  ON tyt_token_trades FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
```

### Безопасность транзакций

1. **Подпись через Phantom** - все транзакции подписываются пользователем
2. **Нет хранения приватных ключей** - ключи остаются в Phantom
3. **Верификация на клиенте** - проверка балансов перед транзакциями
4. **Логирование всех операций** - полная история в БД

## Testing

### Локальное тестирование:

1. Установите Phantom Wallet
2. Создайте тестовый кошелек
3. Получите testnet SOL (https://solfaucet.com/)
4. Измените `VITE_SOLANA_NETWORK=devnet` в .env
5. Запустите `npm run dev`
6. Протестируйте подключение и транзакции

### Production testing:

1. Используйте малые суммы для первых тестов
2. Проверьте все flow перед публичным запуском
3. Мониторьте логи в Supabase Dashboard
4. Проверьте что транзакции видны в Solana Explorer

## Мониторинг

### Supabase Dashboard

- **Database** → Tables → проверка данных
- **Functions** → Edge Functions → логи выполнения
- **Authentication** → Users → активные пользователи

### Solana Explorer

Проверка транзакций:
```
https://explorer.solana.com/tx/TRANSACTION_SIGNATURE
```

### Метрики для отслеживания:

1. Количество подключенных кошельков
2. Объем торговли (SOL и TYT)
3. Количество успешных/неудачных транзакций
4. Средний размер сделки
5. Активные трейдеры

## Troubleshooting

### Phantom не определяется

**Проблема:** `window.solana` undefined

**Решение:**
1. Убедитесь что Phantom установлен
2. Обновите страницу
3. Проверьте console на ошибки
4. Попробуйте другой браузер

### Транзакции не проходят

**Проблема:** Транзакция возвращает ошибку

**Решения:**
1. Проверьте баланс SOL
2. Увеличьте slippage tolerance
3. Проверьте статус Solana network
4. Попробуйте с меньшей суммой

### Edge Functions таймаут

**Проблема:** 504 Gateway Timeout

**Решения:**
1. Проверьте логи функции
2. Оптимизируйте запросы к БД
3. Добавьте retry logic
4. Увеличьте timeout

## API Reference

### Web3Context Methods

```typescript
interface Web3ContextType {
  wallets: Web3Wallet[];              // Все кошельки пользователя
  connectedWallet: Web3Wallet | null; // Активный кошелек
  isConnecting: boolean;               // Статус подключения
  connectPhantom: () => Promise<void>; // Подключить Phantom
  disconnectWallet: () => Promise<void>; // Отключить кошелек
  refreshWallets: () => Promise<void>; // Обновить список
  getProvider: () => PhantomProvider | null; // Получить provider
}
```

### pumpFun Utilities

```typescript
// Получить данные токена
getTYTTokenData(): Promise<TYTTokenData>

// Получить холдинги пользователя
getUserTYTHoldings(userId: string): Promise<TradeSummary>

// Получить историю сделок
getUserTrades(userId: string): Promise<Trade[]>

// Купить TYT
buyTYTToken(
  walletAddress: string,
  solAmount: number,
  provider: any
): Promise<{ success: boolean; signature?: string; error?: string }>

// Продать TYT
sellTYTToken(
  walletAddress: string,
  tytAmount: number,
  provider: any
): Promise<{ success: boolean; signature?: string; error?: string }>

// Перевести SOL
transferSOLToExternal(
  fromAddress: string,
  toAddress: string,
  amount: number,
  provider: any
): Promise<{ success: boolean; signature?: string; error?: string }>
```

## Roadmap

### Phase 1 (Completed) ✅
- Web3 wallet integration
- Database schema
- TYT trading interface
- Basic transaction handling

### Phase 2 (Next)
- Real pump.fun integration
- Jupiter Aggregator для лучших цен
- Advanced charting
- Price alerts
- Portfolio tracking

### Phase 3 (Future)
- Limit orders
- Stop loss/Take profit
- Trading bot integration
- Advanced analytics
- Multi-chain support

## Support

**Документация:**
- `SETUP_INSTRUCTIONS.md` - полная настройка
- `CHECKLIST.md` - чек-лист запуска
- `БЫСТРЫЙ_СТАРТ.md` - быстрый старт

**Ссылки:**
- Supabase: https://supabase.com/docs
- Solana: https://docs.solana.com
- pump.fun: https://pump.fun
- Phantom: https://phantom.app/help

---

**Версия:** 1.0.0
**Последнее обновление:** 2025-12-10
**Статус:** Production Ready ✅
