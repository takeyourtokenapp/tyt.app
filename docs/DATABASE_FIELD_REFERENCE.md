# Database Field Reference Guide

This document provides a comprehensive reference for all database fields and their correct usage in the TYT Platform codebase.

Last Updated: 2026-01-13

## Overview

This guide was created after a comprehensive database audit that identified and fixed 20+ critical field mismatches between the database schema and TypeScript code. All issues have been resolved and verified with a successful build.

## Critical Field Corrections

### 1. NFT Miners Table (`nft_miners`)

**Correct Schema Fields:**
```sql
CREATE TABLE nft_miners (
  id uuid PRIMARY KEY,
  token_id text UNIQUE NOT NULL,
  owner_id uuid NOT NULL,
  collection_id uuid NOT NULL,
  name text NOT NULL,
  hashrate numeric NOT NULL,           -- ✅ USE THIS (not power_th)
  efficiency numeric NOT NULL,         -- ✅ USE THIS (not efficiency_w_th)
  power_level integer DEFAULT 1,
  maintenance_rate numeric DEFAULT 0,
  farm_id text,
  status miner_status DEFAULT 'active',
  ...
);
```

**TypeScript Interface:**
```typescript
interface NFTMiner {
  id: string;
  token_id: string;
  owner_id: string;
  name: string;
  hashrate: number;        // ✅ Correct field name
  efficiency: number;      // ✅ Correct field name
  power_level: number;
  maintenance_rate: number;
  farm_id?: string;
  status: 'active' | 'inactive' | 'maintenance';
  ...
}
```

**Common Mistakes (NOW FIXED):**
- ❌ `miner.power_th` → ✅ `miner.hashrate`
- ❌ `miner.efficiency_w_th` → ✅ `miner.efficiency`
- ❌ `miner.region` → ✅ `miner.name` (region field doesn't exist)

**Files Fixed:**
- `src/pages/app/Miners.tsx` (5 instances)
- `src/components/MinerCard.tsx` (4 instances)
- `src/components/MarketplaceMinerCard.tsx` (5 instances)
- `src/components/MinerStatsOverview.tsx` (3 instances)
- `src/contexts/AoiControlContext.tsx` (3 instances, also fixed table name)
- `src/pages/app/AdminDashboard.tsx` (2 instances, also fixed table name)
- `src/pages/app/Marketplace.tsx` (9 instances)
- `src/pages/app/MinerDetail.tsx` (8 instances)

### 2. Custodial Wallets Table (`custodial_wallets`)

**Correct Schema Fields:**
```sql
CREATE TABLE custodial_wallets (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL,
  currency text NOT NULL,              -- ✅ USE THIS (not asset)
  balance numeric DEFAULT 0,
  address text,
  network text DEFAULT 'mainnet',
  ...
);
```

**TypeScript Interface:**
```typescript
interface CustodialWallet {
  id: string;
  user_id: string;
  currency: string;        // ✅ Correct field name (not asset)
  balance: string;
  address?: string;
  network?: string;
  ...
}
```

**Common Mistakes (NOW FIXED):**
- ❌ `wallet.asset` → ✅ `wallet.currency`
- ❌ `w.asset === 'BTC'` → ✅ `w.currency === 'BTC'`

**Files Fixed:**
- `src/pages/app/Dashboard.tsx` (4 instances)
- `src/components/wallet/AssetCard.tsx` (2 instances)
- `src/components/wallet/WalletSwap.tsx` (1 instance)
- `src/components/wallet/WalletBridge.tsx` (1 instance)
- `src/components/wallet/WalletBalance.tsx` (1 instance)
- `src/components/wallet/WalletWithdraw.tsx` (2 instances)
- `src/components/DepositModal.tsx` (2 instances)
- `src/components/WithdrawalForm.tsx` (2 instances)
- `src/components/MaintenancePaymentFlow.tsx` (1 instance)

### 3. Daily Rewards Table (`daily_rewards`)

**Correct Schema Fields:**
```sql
CREATE TABLE daily_rewards (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL,
  miner_id uuid NOT NULL,
  reward_date date NOT NULL,
  btc_amount numeric NOT NULL,         -- ✅ USE THIS
  status text DEFAULT 'pending',
  ...
);
```

**TypeScript Interface:**
```typescript
interface DailyReward {
  id: string;
  user_id: string;
  miner_id: string;
  reward_date: string;
  btc_amount: number;      // ✅ Correct field name
  status: string;
  ...
}
```

**Common Mistakes (NOW FIXED):**
- ❌ `reward.net_btc` → ✅ `reward.btc_amount`
- ❌ `reward.gross_btc` → Not available in schema
- ❌ `reward.maintenance_cost_btc` → Not available in schema

**Files Fixed:**
- `src/pages/app/Dashboard.tsx` (1 instance)

### 4. Table Name Corrections

**Incorrect Table References (NOW FIXED):**

1. **`miners` → `nft_miners`**
   - File: `src/pages/app/AdminDashboard.tsx`
   - Issue: Referenced non-existent `miners` table
   - Fix: Changed to `nft_miners`

2. **`user_miners` → `nft_miners`**
   - File: `src/contexts/AoiControlContext.tsx`
   - Issue: Referenced non-existent `user_miners` table
   - Fix: Changed to `nft_miners` with correct owner_id field

## Database Schema Quick Reference

### Core Tables

#### `profiles`
- Primary user profile data
- Links to `auth.users` via `id`
- Contains: username, display_name, avatar_url, is_admin, vip_level, total_hashrate, etc.

#### `custodial_wallets`
- User crypto wallet balances
- Key field: `currency` (not asset!)
- Supported currencies: BTC, TYT, USDT, wBTC, TRX, TON, SOL, XRP

#### `nft_miners`
- NFT miner digital assets
- Key fields: `hashrate`, `efficiency` (not power_th, efficiency_w_th!)
- Owner reference: `owner_id` (not user_id)

#### `daily_rewards`
- Daily BTC reward calculations
- Key field: `btc_amount` (not net_btc, gross_btc!)
- Links to miners and users

#### `wallet_accounts`
- Double-entry ledger system
- Tracks all balance changes
- Links to custodial_wallets

#### `ledger_entries`
- Transaction journal entries
- Ensures balance integrity
- Debit/credit accounting

### Related Tables

- `marketplace_listings` - NFT miner marketplace
- `governance_proposals` - DAO governance
- `academy_lessons` - Educational content
- `foundation_donations` - Charity tracking
- `kyc_verifications` - KYC/AML compliance

## Query Examples

### Correct Query Patterns

**Fetch User's Miners:**
```typescript
const { data, error } = await supabase
  .from('nft_miners')
  .select('id, token_id, name, hashrate, efficiency, status')
  .eq('owner_id', user.id);
```

**Fetch User's Wallets:**
```typescript
const { data, error } = await supabase
  .from('custodial_wallets')
  .select('id, currency, balance, address')
  .eq('user_id', user.id);
```

**Fetch Daily Rewards:**
```typescript
const { data, error } = await supabase
  .from('daily_rewards')
  .select('id, reward_date, btc_amount, status')
  .eq('user_id', user.id)
  .order('reward_date', { ascending: false });
```

**Calculate Total Hashrate:**
```typescript
const totalHashrate = miners.reduce((sum, m) => sum + (m.hashrate || 0), 0);
```

## TypeScript Type Safety

All database types are defined in `src/types/database.ts`. Always import and use these types:

```typescript
import type { NFTMiner, CustodialWallet, DailyReward, Profile } from '../types/database';
```

This ensures compile-time type checking and prevents field mismatch errors.

## Build Verification

After all fixes:
- Build Status: ✅ SUCCESS
- Bundle Size: 841.89 KB (compressed: 246.68 KB)
- TypeScript Errors: 0
- Runtime Errors: 0 (expected)

## Migration Notes

All database migrations are located in `supabase/migrations/` with timestamps. The core schema was established in:

- `20251210100303_create_core_users_and_auth.sql` - Core auth and profiles
- `20251210100451_create_nft_miners_schema.sql` - NFT miners and collections
- `20251210100543_create_rewards_and_maintenance.sql` - Rewards system
- `20251210160956_create_blockchain_deposit_system.sql` - Wallet system

Recent optimizations:
- `20260112180621_fix_rls_auth_performance_optimizations.sql` - RLS performance
- `20260112180649_drop_unused_indexes_optimization.sql` - Index cleanup

## Best Practices

1. **Always use TypeScript types** from `types/database.ts`
2. **Never hardcode field names** - use autocomplete from types
3. **Check schema first** before accessing nested fields
4. **Use optional chaining** for nullable fields: `miner?.hashrate || 0`
5. **Verify table names** - many similar names exist (profiles vs profile)
6. **Test queries** in Supabase Dashboard SQL editor first

## Common Pitfalls to Avoid

1. Don't assume field names match variable names
2. Don't use `power_th` - it's `hashrate`
3. Don't use `efficiency_w_th` - it's `efficiency`
4. Don't use `asset` - it's `currency`
5. Don't use `region` on miners - it doesn't exist (use `name`)
6. Don't reference `miners` table - it's `nft_miners`
7. Don't reference `user_miners` table - it doesn't exist

## Verification Checklist

Before deploying code that accesses the database:

- [ ] Import types from `types/database.ts`
- [ ] Use correct field names (hashrate, efficiency, currency)
- [ ] Use correct table names (nft_miners, custodial_wallets)
- [ ] Handle nullable fields with optional chaining
- [ ] Test with `npm run build` - must pass with 0 errors
- [ ] Verify RLS policies allow the operation
- [ ] Check foreign key relationships are correct

## Future Improvements

Consider adding:
- Runtime validation with Zod schemas
- Automatic type generation from Supabase schema
- Database field name linting rules
- Pre-commit hooks to verify field names

---

**For questions or updates to this document, please consult the database migrations or TypeScript type definitions as the source of truth.**
