# Block 2.2 - Wallet Service (Double-Entry Ledger) Implementation Complete

## Overview

Double-entry ledger accounting system implemented with proper fee splitting (60% protocol / 30% charity / 10% academy) and 1% total platform fee.

## Database Schema

### Core Tables

**1. wallet_accounts**
- Individual account identifiers for each user/currency combination
- Account types: `user_main`, `user_locked`, `user_staking`, `protocol_fees`, `charity_fund`, `academy_fund`, `burn_pool`, `treasury`, `escrow`
- Tracks balance, locked_balance, and pending_balance
- Unique constraint on (user_id, account_type, currency, network)

**2. ledger_entries** (Immutable)
- Double-entry ledger records
- Every entry has either debit OR credit (never both)
- Links to wallet_accounts via account_id
- Groups related entries via entry_batch_id
- Stores balance_after for audit trail
- No updates or deletes allowed (append-only)

**3. onchain_events**
- Raw blockchain event log from chain observers
- Links to ledger entries after processing
- Prevents duplicate processing via unique (network, tx_hash, log_index)

**4. fee_distribution_config**
- Configures fee split percentages
- Default: 60% protocol / 30% charity / 10% academy / 0% burn
- Total must always equal 10000 bps (100%)

**5. fee_configurations**
- Stores fee rates per transaction type
- Default: 100 bps (1% total fee)
- Split applied: 60/30/10 results in 0.6%/0.3%/0.1% effective

## Fee Model (v3 Canonical)

### Basis Points
```
1%   = 100 bps
0.1% = 10 bps
0.01% = 1 bps
```

### Default Configuration
```
Total deposit fee: 100 bps (1%)

Split:
- Protocol: 60% = 60 bps (0.6% of gross)
- Charity:  30% = 30 bps (0.3% of gross)
- Academy:  10% = 10 bps (0.1% of gross)
```

### Fee Calculation Example
```
User deposits: 1000 USDT

fee_total = 1000 * 100 / 10000 = 10 USDT (1%)
amount_user = 1000 - 10 = 990 USDT

fee_protocol = 10 * 60 / 100 = 6 USDT (0.6%)
fee_charity  = 10 * 30 / 100 = 3 USDT (0.3%)
fee_academy  = 10 * 10 / 100 = 1 USDT (0.1%)

Total: 6 + 3 + 1 = 10 ✓
```

## SQL Functions

### 1. get_or_create_wallet_account()
Creates or retrieves a wallet account for a user/currency/network combination.

```sql
SELECT get_or_create_wallet_account(
  p_user_id := 'uuid',
  p_account_type := 'user_main',
  p_currency := 'BTC',
  p_network := NULL
);
```

### 2. credit_account()
Credits an account (for external deposits, rewards).

```sql
SELECT credit_account(
  p_account_id := 'account-uuid',
  p_amount := 100.5,
  p_entry_type := 'deposit',
  p_ref_type := 'blockchain_deposit',
  p_ref_id := 'transaction-uuid',
  p_description := 'Deposit from blockchain',
  p_metadata := '{"tx_hash": "0x..."}'::jsonb
);
```

### 3. create_ledger_entry()
Creates balanced debit/credit entries for internal transfers.

```sql
SELECT create_ledger_entry(
  p_from_account_id := 'from-account-uuid',
  p_to_account_id := 'to-account-uuid',
  p_amount := 50.0,
  p_entry_type := 'internal_transfer',
  p_ref_type := 'user_transfer',
  p_ref_id := 'transfer-uuid',
  p_description := 'Transfer between accounts',
  p_metadata := '{}'::jsonb
);
```

### 4. calculate_deposit_fees_v3()
Calculates fee breakdown for deposits.

```sql
SELECT * FROM calculate_deposit_fees_v3(
  p_amount := 1000.0,
  p_asset := 'USDT'
);

Returns:
- fee_bps: 100
- fee_total: 10.0
- amount_user: 990.0
- fee_protocol: 6.0
- fee_charity: 3.0
- fee_academy: 1.0
- fee_burn: 0.0
- protocol_pct: 60
- charity_pct: 30
- academy_pct: 10
```

## Edge Functions

### process-deposit

**Endpoint:** `POST /functions/v1/process-deposit`

**Request:**
```json
{
  "asset": "USDT",
  "amount": "1000",
  "txHash": "0x...",
  "network": "polygon"
}
```

**Flow:**
1. Authenticate user via JWT
2. Calculate fees using `calculate_deposit_fees_v3()`
3. Get or create user wallet account
4. Get or create protocol/charity/academy accounts
5. Credit user account with net amount (990 USDT)
6. Credit protocol account with fee (6 USDT)
7. Credit charity account with fee (3 USDT)
8. Credit academy account with fee (1 USDT)
9. Record in charity_flows and protocol_revenue tables
10. Update legacy custodial_wallets for backward compatibility

**Response:**
```json
{
  "success": true,
  "transaction_id": "uuid",
  "ledger_batch_id": "uuid",
  "amount_deposited": 1000,
  "amount_credited": 990,
  "fee_rate_bps": 100,
  "fee_breakdown": {
    "total": 10,
    "total_percent": 1,
    "protocol": 6,
    "protocol_percent": 0.6,
    "charity": 3,
    "charity_percent": 0.3,
    "academy": 1,
    "academy_percent": 0.1
  },
  "new_balance": 990
}
```

### process-withdrawal

**Endpoint:** `POST /functions/v1/process-withdrawal`

**Request:**
```json
{
  "asset": "USDT",
  "amount": 500,
  "destination_address": "0x...",
  "network_code": "polygon"
}
```

**Validations:**
- KYC verification required
- Checks daily withdrawal limits based on KYC tier
- Validates minimum and maximum amounts
- Verifies sufficient balance

**Response (Auto-approved):**
```json
{
  "success": true,
  "withdrawal_id": "uuid",
  "status": "completed",
  "tx_hash": "0x...",
  "amount": 500,
  "fee": 5,
  "net_amount": 495,
  "message": "Withdrawal processed successfully"
}
```

**Response (Requires Approval):**
```json
{
  "success": true,
  "withdrawal_id": "uuid",
  "status": "pending",
  "amount": 5000,
  "fee": 50,
  "net_amount": 4950,
  "message": "Withdrawal request submitted for admin approval"
}
```

## Frontend Integration

### Wallet Service

**Location:** `src/lib/walletService.ts`

```typescript
import { walletService } from '@/lib/walletService';

// Get all wallet accounts
const accounts = await walletService.getWalletAccounts(userId, 'BTC');

// Get main wallet balance
const balance = await walletService.getBalance(userId, 'BTC');

// Get available balance (total - locked)
const available = await walletService.getAvailableBalance(userId, 'BTC');

// Get ledger history
const history = await walletService.getLedgerHistory(userId, {
  currency: 'BTC',
  entryType: 'deposit',
  limit: 50
});

// Calculate deposit fees
const fees = await walletService.calculateDepositFees(1000, 'USDT');

// Process deposit
const result = await walletService.processDeposit(1000, 'USDT', {
  txHash: '0x...',
  network: 'polygon'
});

// Process withdrawal
const withdrawal = await walletService.processWithdrawal(
  'USDT',
  500,
  '0x...',
  'polygon'
);

// Subscribe to real-time balance changes
const unsubscribe = await walletService.subscribeToWalletChanges(
  userId,
  (account) => {
    console.log('Balance updated:', account);
  }
);
```

### useWalletLedger Hook

**Location:** `src/hooks/useWalletLedger.ts`

```typescript
import { useWalletLedger } from '@/hooks/useWalletLedger';

function WalletPage() {
  const {
    accounts,
    ledgerHistory,
    loading,
    error,
    getBalance,
    getAvailableBalance,
    getLockedBalance,
    getTotalDeposits,
    getTotalWithdrawals,
    getTotalRewards,
    refresh
  } = useWalletLedger('BTC');

  const btcBalance = getBalance('BTC');
  const availableBTC = getAvailableBalance('BTC');
  const totalDeposits = getTotalDeposits('BTC');

  return (
    <div>
      <h1>BTC Balance: {btcBalance}</h1>
      <h2>Available: {availableBTC}</h2>
      <h3>Total Deposits: {totalDeposits}</h3>

      <button onClick={refresh}>Refresh</button>

      <ul>
        {ledgerHistory.map(entry => (
          <li key={entry.id}>
            {entry.entry_type}: {entry.credit || entry.debit} {entry.currency}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Key Features

### 1. Double-Entry Accounting
Every transaction creates balanced debit and credit entries:
```
Deposit 1000 USDT:
  DEBIT:  External (off-ledger) -1000
  CREDIT: User account +990
  CREDIT: Protocol account +6
  CREDIT: Charity account +3
  CREDIT: Academy account +1
```

### 2. Immutable Ledger
- Ledger entries are append-only
- No updates or deletes allowed
- Corrections use adjustment entries

### 3. Balance Verification
View `account_balance_verification`:
```sql
SELECT * FROM account_balance_verification WHERE user_id = 'uuid';
```

Shows:
- stored_balance (from wallet_accounts)
- computed_balance (sum of ledger entries)
- discrepancy (should always be 0)

### 4. Real-time Updates
Subscribe to wallet changes via Supabase realtime:
```typescript
const unsubscribe = await walletService.subscribeToWalletChanges(
  userId,
  (account) => {
    // Handle balance update
  }
);
```

### 5. Multi-Network Support
Each wallet account can specify a network:
- BTC (Bitcoin)
- Polygon (EVM)
- Solana
- TRON
- XRP

## Security

### Row Level Security (RLS)

**wallet_accounts:**
- Users can view own accounts
- Service role can manage all accounts

**ledger_entries:**
- Users can view own entries
- Service role can insert entries (append-only)

**onchain_events:**
- Service role only

**fee_distribution_config:**
- Anyone can view
- Service role can manage

### Validation

All fee operations validate:
- `protocol_pct + charity_pct + academy_pct = 100`
- `fee_bps_total <= 2000` (20% max)
- Balance checks before debits
- Positive amounts only

## Migration Applied

**Filename:** `fix_fee_to_1_percent_canonical.sql`

Updated all fee configurations from 10% (1000 bps) to 1% (100 bps) with 60/30/10 split maintained.

## Testing

### Manual Testing

```typescript
// Test deposit fee calculation
const fees = await walletService.calculateDepositFees(1000, 'USDT');
console.assert(fees.fee_total === 10);
console.assert(fees.fee_protocol === 6);
console.assert(fees.fee_charity === 3);
console.assert(fees.fee_academy === 1);

// Test deposit processing
const result = await walletService.processDeposit(1000, 'USDT');
console.assert(result.amount_credited === 990);
console.assert(result.fee_breakdown.total === 10);
```

### SQL Testing

```sql
-- Test fee calculation
SELECT * FROM calculate_deposit_fees_v3(1000, 'USDT');

-- Test balance verification
SELECT * FROM account_balance_verification WHERE discrepancy != 0;

-- Should return no rows if ledger is consistent
```

## Next Steps

### Block 2.3 - Miners Service
- NFT miner CRUD operations
- Miner stats calculation
- Upgrade functionality

### Block 2.4 - Rewards Engine
- Daily BTC distribution
- Maintenance fee calculation
- Discount application

## Files Created/Modified

**Created:**
- `src/lib/walletService.ts` - Wallet operations service
- `src/hooks/useWalletLedger.ts` - Wallet React hook

**Database:**
- Applied migration: `fix_fee_to_1_percent_canonical.sql`
- Updated fee_configurations to 100 bps (1%)
- Updated fee_distribution_config to 60/30/10

**Existing Edge Functions:**
- Verified: `process-deposit/index.ts`
- Verified: `process-withdrawal/index.ts`

## Summary

Block 2.2 Wallet Service is complete with:
- Double-entry ledger system
- 1% platform fee (100 bps)
- 60/30/10 fee split (protocol/charity/academy)
- Immutable accounting
- Real-time balance updates
- Multi-network support
- Comprehensive frontend utilities

All financial transactions in TYT now flow through this auditable, transparent ledger system.
