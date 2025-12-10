# Blockchain API Integration Guide

Полное руководство по интеграции реальных блокчейн API в экосистему TYT.

## Обзор

Платформа TYT теперь интегрирована с реальными блокчейнами через прямые API вызовы. Это обеспечивает:

- **Реальные балансы** из блокчейн сетей
- **Мониторинг транзакций** в реальном времени
- **Проверку статуса** транзакций
- **Историю операций** с блокчейн данными
- **Мультичейн поддержку** для 7 основных сетей

## Поддерживаемые Блокчейны

### 1. Bitcoin (BTC)
- **RPC Provider**: Blockstream API
- **Mainnet**: `https://blockstream.info/api`
- **Testnet**: `https://blockstream.info/testnet/api`
- **Decimals**: 8 (satoshi)
- **Функции**:
  - Получение баланса
  - Проверка UTXO
  - Мониторинг транзакций
  - Статус подтверждений
  - Оценка комиссии

### 2. Ethereum (ETH)
- **RPC Provider**: Alchemy
- **Mainnet**: `https://eth-mainnet.g.alchemy.com/v2/{API_KEY}`
- **Testnet**: Sepolia
- **Decimals**: 18 (wei)
- **Функции**:
  - Получение ETH баланса
  - ERC-20 токены
  - Gas price estimation
  - Transaction receipts
  - Contract interactions

### 3. Solana (SOL)
- **RPC Provider**: Solana Public RPC
- **Mainnet**: `https://api.mainnet-beta.solana.com`
- **Devnet**: `https://api.devnet.solana.com`
- **Decimals**: 9 (lamports)
- **Функции**:
  - Получение SOL баланса
  - SPL токены
  - Transaction status
  - Account history
  - Recent prioritization fees

### 4. TRON (TRX)
- **RPC Provider**: TronGrid
- **Mainnet**: `https://api.trongrid.io`
- **Testnet**: Shasta
- **Decimals**: 6 (SUN)
- **Функции**:
  - Получение TRX баланса
  - TRC-20 токены (USDT-TRC20)
  - Energy & bandwidth
  - Transaction info
  - Account resources

### 5. XRP Ledger (XRP)
- **RPC Provider**: Ripple Public Node
- **Mainnet**: `https://s1.ripple.com:51234`
- **Testnet**: Altnet
- **Decimals**: 6 (drops)
- **Функции**:
  - Получение XRP баланса
  - Transaction validation
  - Account info
  - Trust lines
  - Network fees

### 6. Polygon (MATIC)
- **RPC Provider**: Alchemy
- **Mainnet**: `https://polygon-mainnet.g.alchemy.com/v2/{API_KEY}`
- **Testnet**: Mumbai
- **Decimals**: 18
- **Примечание**: Используется тот же API что и Ethereum

### 7. TON
- **RPC Provider**: TON Center
- **Mainnet**: `https://toncenter.com/api/v2`
- **Testnet**: `https://testnet.toncenter.com/api/v2`
- **Decimals**: 9

## Архитектура

### Frontend API (`src/utils/api/`)

```
src/utils/api/
├── bitcoinApi.ts         # Bitcoin implementation
├── ethereumApi.ts        # Ethereum + ERC-20
├── solanaApi.ts          # Solana + SPL tokens
├── tronApi.ts            # TRON + TRC-20
├── xrpApi.ts             # XRP Ledger
├── blockchainMonitor.ts  # Transaction monitoring
└── index.ts              # Unified exports
```

### Configuration (`src/config/`)

```typescript
// blockchainProviders.ts
export const BLOCKCHAIN_CONFIGS: Record<ChainId, ChainConfig> = {
  BTC: { /* config */ },
  ETH: { /* config */ },
  SOL: { /* config */ },
  TRX: { /* config */ },
  XRP: { /* config */ },
  // ...
}
```

### Edge Functions (`supabase/functions/`)

```
supabase/functions/
├── check-balance/        # Real-time balance checking
├── monitor-deposits/     # Deposit monitoring
├── sync-real-balances/   # Balance synchronization
└── process-withdrawal/   # Withdrawal processing
```

## Использование

### 1. Получение Баланса

```typescript
import { getBalance } from '@/utils/api';

// Универсальный метод для любого блокчейна
const balance = await getBalance('BTC', 'bc1q...address');
console.log(balance); // "0.05000000"

// Или используйте конкретный API
import { bitcoinMainnet } from '@/utils/api';
const btcBalance = await bitcoinMainnet.getBalanceFormatted('bc1q...');
```

### 2. Проверка Транзакции

```typescript
import { isTransactionConfirmed } from '@/utils/api';

const isConfirmed = await isTransactionConfirmed(
  'BTC',
  'txhash...',
  6 // требуемые подтверждения
);
```

### 3. Мониторинг Адреса

```typescript
import { blockchainMonitor } from '@/utils/api';

// Добавить адрес для мониторинга
blockchainMonitor.addAddress(
  'bc1q...address',
  'BTC',
  'user-id'
);

// Подписаться на новые транзакции
blockchainMonitor.onTransaction((tx, address) => {
  console.log('Новая транзакция:', tx);
  console.log('На адрес:', address);

  // Обработка входящего депозита
  if (tx.confirmed) {
    processDep osit(tx);
  }
});

// Запустить мониторинг
blockchainMonitor.start(30000); // проверка каждые 30 сек
```

### 4. История Транзакций

```typescript
import { getTransactionHistory } from '@/utils/api';

const history = await getTransactionHistory(
  'SOL',
  'address...',
  20 // limit
);
```

## API Ключи

Требуемые переменные окружения в `.env`:

```env
# Alchemy (Ethereum, Polygon)
VITE_ALCHEMY_API_KEY=your_alchemy_key

# TronGrid (TRON)
VITE_TRONGRID_API_KEY=your_trongrid_key

# TON Center
VITE_TONCENTER_API_KEY=your_toncenter_key

# Опционально
VITE_INFURA_API_KEY=your_infura_key
VITE_BLOCKSTREAM_API_KEY=your_blockstream_key
```

### Получение API Ключей

1. **Alchemy** (ETH, MATIC)
   - https://www.alchemy.com/
   - Бесплатный план: 300M compute units/месяц

2. **TronGrid** (TRX)
   - https://www.trongrid.io/
   - Бесплатный plan: 30K requests/день

3. **TON Center**
   - https://toncenter.com/
   - Регистрация через Telegram bot

## Edge Functions

### check-balance

Проверяет реальный баланс на блокчейне:

```typescript
const response = await supabase.functions.invoke('check-balance', {
  body: {
    blockchain: 'btc',
    address: 'bc1q...'
  }
});

// Response:
// {
//   success: true,
//   balance: 0.05,
//   blockchain: 'btc',
//   address: 'bc1q...',
//   checked_at: '2024-01-01T00:00:00.000Z'
// }
```

### monitor-deposits

Мониторит входящие депозиты:

```typescript
// Автоматически запускается edge-функцией
// Проверяет все активные адреса каждые 30 секунд
// Записывает обнаруженные транзакции в detected_transactions
```

### sync-real-balances

Синхронизирует балансы из блокчейнов в базу данных:

```typescript
const response = await supabase.functions.invoke('sync-real-balances', {
  body: {
    user_id: 'uuid',
    chain_ids: ['BTC', 'ETH', 'SOL']
  }
});
```

## База Данных

### Таблицы

#### `blockchain_networks`

Конфигурация поддерживаемых сетей:

```sql
SELECT * FROM blockchain_networks WHERE is_active = true;
```

#### `blockchain_transactions_monitor`

Отслеживаемые адреса:

```sql
INSERT INTO blockchain_transactions_monitor
  (user_id, chain_id, address, wallet_id)
VALUES
  ('user-uuid', 'BTC', 'bc1q...', 'wallet-uuid');
```

#### `detected_transactions`

Обнаруженные входящие транзакции:

```sql
SELECT * FROM detected_transactions
WHERE user_id = 'user-uuid'
  AND processed = false
ORDER BY detected_at DESC;
```

## Лучшие Практики

### 1. Обработка Ошибок

```typescript
try {
  const balance = await bitcoinMainnet.getBalance(address);
} catch (error) {
  if (error.message.includes('Invalid address')) {
    // Неверный формат адреса
  } else if (error.message.includes('HTTP error')) {
    // Проблемы с сетью/API
  } else {
    // Другие ошибки
  }
}
```

### 2. Rate Limiting

Публичные RPC endpoints имеют лимиты:

- **Bitcoin (Blockstream)**: ~1 req/sec
- **Solana Public**: ~100 req/sec
- **Ethereum (Alchemy Free)**: 5 req/sec
- **TRON (TronGrid Free)**: ~20 req/sec

Используйте кеширование и batch запросы где возможно.

### 3. Confirmations

Рекомендуемое количество подтверждений:

- **Bitcoin**: 6 confirmations (~60 min)
- **Ethereum**: 12-20 confirmations (~3-5 min)
- **Solana**: 32 confirmations (finalized)
- **TRON**: 19 confirmations (~1 min)
- **XRP**: 1 validation (~4 sec)

### 4. Адресная Валидация

```typescript
import { validateAddress } from '@/config/blockchainProviders';

if (!validateAddress(address, 'BTC')) {
  throw new Error('Invalid Bitcoin address');
}
```

### 5. Форматирование Сумм

```typescript
import { formatAmount, toBaseUnits } from '@/config/blockchainProviders';

// Из базовых единиц в читаемый формат
const btc = formatAmount(100000000, 'BTC'); // "1.00000000"

// Из читаемого формата в базовые единицы
const satoshi = toBaseUnits(1, 'BTC'); // "100000000"
```

## Тестирование

### Unit Tests

```typescript
import { bitcoinMainnet } from '@/utils/api';

describe('Bitcoin API', () => {
  it('should get balance', async () => {
    const balance = await bitcoinMainnet.getBalance('testaddress');
    expect(typeof balance).toBe('number');
  });
});
```

### Integration Tests

Используйте testnet endpoints для интеграционных тестов:

```typescript
import { BitcoinAPI } from '@/utils/api';

const testnetApi = new BitcoinAPI(true); // testnet = true
```

## Roadmap

### Phase 1 (Completed)
- ✅ Bitcoin API integration
- ✅ Ethereum API integration
- ✅ Solana API integration
- ✅ TRON API integration
- ✅ XRP Ledger integration
- ✅ Transaction monitoring system
- ✅ Edge functions for real-time checks

### Phase 2 (In Progress)
- 🔄 Webhook support for instant notifications
- 🔄 Advanced caching strategies
- 🔄 Transaction broadcasting
- 🔄 Multi-signature support

### Phase 3 (Planned)
- 📋 Lightning Network integration
- 📋 Layer 2 solutions (Arbitrum, Optimism)
- 📋 Additional chains (Avalanche, BSC)
- 📋 NFT support across chains

## Troubleshooting

### "Invalid address" ошибка

Проверьте формат адреса для конкретного блокчейна:
- Bitcoin: начинается с `1`, `3`, или `bc1`
- Ethereum: начинается с `0x` + 40 hex символов
- Solana: Base58, 32-44 символа
- TRON: начинается с `T` + 33 символа
- XRP: начинается с `r` + 25-34 символа

### Rate Limit ошибки

Используйте собственные API ключи вместо публичных endpoints или реализуйте retry logic с exponential backoff.

### Transaction не найдена

Транзакции могут занять время для появления в блокчейне. Подождите несколько блоков перед повторной проверкой.

## Поддержка

Для вопросов и проблем:
- GitHub Issues
- Discord сервер TYT
- Email: support@takeyourtoken.com

---

**Версия**: 1.0.0
**Последнее обновление**: 2024-12-10
**Автор**: TYT Development Team
