# Block 2.3 - Blockchain Gateway Service Implementation Complete

## Overview

Multi-chain blockchain integration layer supporting deposits, withdrawals, and monitoring across 7+ blockchains with automated monitoring and proper fee handling (1% deposit fee, 60/30/10 split).

## Supported Blockchains

### 1. Bitcoin (BTC)
- **Mainnet:** Blockstream API
- **Address Types:** Legacy (P2PKH), SegWit (P2SH-P2WPKH), Native SegWit (Bech32), Taproot
- **Confirmations Required:** 3
- **Features:**
  - UTXO management
  - Fee estimation (mempool-based)
  - Replace-by-Fee (RBF) support
  - Coin selection algorithms

### 2. Lightning Network
- **Protocol:** Bitcoin Layer 2
- **Features:**
  - Instant payments
  - Low fees
  - Invoice generation
  - Channel management

### 3. Liquid Network
- **Protocol:** Bitcoin sidechain
- **Features:**
  - Confidential transactions
  - Asset issuance
  - Fast settlement (2 min blocks)

### 4. Ethereum (ETH)
- **Mainnet:** Alchemy/Infura RPC
- **Chain ID:** 1
- **Confirmations Required:** 12
- **Features:**
  - ERC-20 token support
  - Smart contract interactions
  - Gas estimation

### 5. Polygon (MATIC)
- **Mainnet:** Alchemy RPC
- **Chain ID:** 137
- **Confirmations Required:** 128
- **Features:**
  - ERC-20 compatible
  - Low gas fees
  - Fast finality

### 6. Solana (SOL)
- **Mainnet:** mainnet-beta
- **RPC:** Official Solana RPC
- **Confirmations Required:** 31
- **Features:**
  - SPL token support
  - Sub-second finality
  - Low transaction costs

### 7. TRON (TRX)
- **Mainnet:** TronGrid API
- **Confirmations Required:** 19
- **Features:**
  - TRC-20 token support
  - Energy/Bandwidth model
  - High TPS

### 8. XRP Ledger (XRP)
- **Mainnet:** Ripple S1
- **Confirmations Required:** 1
- **Features:**
  - Fast settlement (3-5 sec)
  - Destination tags
  - Low fees

### 9. TON
- **Mainnet:** TonCenter API
- **Confirmations Required:** 1
- **Features:**
  - Sharded architecture
  - Jetton (token) support
  - Telegram integration

## Architecture

### Edge Functions

**1. generate-deposit-address**
- **Endpoint:** `POST /functions/v1/generate-deposit-address`
- **Purpose:** Generate custodial deposit addresses
- **Supported Networks:** All 9+ chains
- **Features:**
  - HD wallet derivation
  - QR code generation
  - Address validation
  - Encrypted private key storage

**Request:**
```json
{
  "network_code": "BTC"
}
```

**Response:**
```json
{
  "success": true,
  "address": "bc1q...",
  "network_name": "Bitcoin",
  "explorer_url": "https://mempool.space",
  "qr_code": "data:image/svg+xml;base64,...",
  "derivation_path": "m/84'/0'/0'/0/0"
}
```

**2. monitor-deposits**
- **Endpoint:** `POST /functions/v1/monitor-deposits`
- **Purpose:** Watch for incoming deposits
- **Schedule:** Every 5 minutes (via cron)
- **Process:**
  1. Fetch all monitored addresses
  2. Check each network's API for new transactions
  3. Detect deposits to user addresses
  4. Call `blockchain-webhook` to process

**Authentication:** Requires `X-Cron-Secret` header

**Response:**
```json
{
  "success": true,
  "checked_addresses": 150,
  "new_deposits": 3,
  "processed_deposits": 3,
  "errors": []
}
```

**3. blockchain-webhook**
- **Endpoint:** `POST /functions/v1/blockchain-webhook`
- **Purpose:** Process detected deposits
- **Authentication:** Requires `X-Webhook-Secret` header

**Request:**
```json
{
  "network": "TRON",
  "transaction_id": "0x...",
  "block_number": 12345678,
  "block_timestamp": 1640000000,
  "from_address": "T...",
  "to_address": "T...",
  "amount": "1000000000",
  "token_symbol": "USDT",
  "confirmations": 20
}
```

**Process:**
1. Validate webhook signature
2. Check for duplicate processing (tx_hash unique)
3. Verify address belongs to user
4. Wait for minimum confirmations
5. Calculate fees (1% with 60/30/10 split)
6. Credit user account via double-entry ledger
7. Distribute fees to protocol/charity/academy

**Response:**
```json
{
  "success": true,
  "deposit_id": "uuid",
  "amount_credited": 990
}
```

**4. process-withdrawal**
- **Endpoint:** `POST /functions/v1/process-withdrawal`
- **Purpose:** Execute blockchain withdrawals
- **Validations:**
  - KYC verification
  - Daily/monthly limits
  - Minimum/maximum amounts
  - Available balance
  - Address validation

**Request:**
```json
{
  "asset": "USDT",
  "amount": 500,
  "destination_address": "T...",
  "network_code": "TRON"
}
```

**Response:**
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

## Utility Libraries

### blockchainGateway.ts

**Location:** `src/utils/api/blockchainGateway.ts`

```typescript
import * as blockchainGateway from '@/utils/api/blockchainGateway';

// Get active networks
const networks = await blockchainGateway.getActiveNetworks();

// Get user deposit address
const address = await blockchainGateway.getUserDepositAddress(
  userId,
  'solana'
);

// Get transaction status
const status = await blockchainGateway.getTransactionStatus(
  txHash,
  'polygon'
);

// Get deposit history
const deposits = await blockchainGateway.getUserDeposits(userId, {
  network: 'tron',
  status: 'confirmed',
  limit: 50
});

// Request withdrawal
const result = await blockchainGateway.requestWithdrawal({
  userId,
  toAddress: '0x...',
  network: 'ethereum',
  asset: 'ETH',
  amount: 0.5
});

// Validate address
const isValid = blockchainGateway.validateAddress('bc1q...', 'bitcoin');

// Get explorer URLs
const txUrl = blockchainGateway.getExplorerTxUrl('solana', txHash);
const addrUrl = blockchainGateway.getExplorerAddressUrl('tron', address);
```

### bitcoinService.ts

**Location:** `src/utils/api/bitcoinService.ts`

```typescript
import { bitcoinService } from '@/utils/api/bitcoinService';

// Generate Bitcoin address
const addr = await bitcoinService.generateDepositAddress(
  userId,
  'native_segwit',
  'My Wallet'
);

// Get user balance
const balance = await bitcoinService.getUserBalance(userId);
// Returns: { confirmedSats, unconfirmedSats, confirmedBtc, etc. }

// Get fee estimates
const fees = await bitcoinService.getFeeEstimates();
// Returns: { fastestFee, halfHourFee, hourFee, economyFee, minimumFee }

// Get spendable UTXOs
const utxos = await bitcoinService.getSpendableUTXOs(userId, 3);

// Create transaction
const tx = await bitcoinService.createTransaction({
  userId,
  toAddress: 'bc1q...',
  amountSats: 100000,
  feePriority: 'normal'
});

// Broadcast transaction
const result = await bitcoinService.broadcastTransaction(userId, signedPSBT);

// Get transaction history
const history = await bitcoinService.getTransactionHistory(userId, 50);

// Monitor transaction confirmations
const status = await bitcoinService.monitorTransaction(txid);

// Utility functions
const btc = bitcoinService.satsToBTC(100000000); // "1.00000000"
const sats = bitcoinService.btcToSats(0.001); // 100000
const formatted = bitcoinService.formatBitcoinAddress(longAddress);
```

### blockchainProviders.ts

**Location:** `src/config/blockchainProviders.ts`

```typescript
import {
  BLOCKCHAIN_CONFIGS,
  getRpcUrl,
  getExplorerTxUrl,
  validateAddress,
  formatAmount,
  toBaseUnits
} from '@/config/blockchainProviders';

// Get network config
const btcConfig = BLOCKCHAIN_CONFIGS.BTC;
// { id, name, symbol, decimals, rpcUrl, explorerUrl, testnet }

// Get RPC URL with API key
const rpcUrl = getRpcUrl('ETH', false); // mainnet
const testnetRpc = getRpcUrl('MATIC', true); // testnet

// Explorer URLs
const txUrl = getExplorerTxUrl('TRX', txHash);
const addrUrl = getExplorerAddressUrl('SOL', address);

// Format amounts
const formatted = formatAmount(1500000000, 'SOL'); // "1.5000"
const baseUnits = toBaseUnits(1.5, 'SOL'); // "1500000000"

// Validate addresses
const isValidBTC = validateAddress('bc1q...', 'BTC');
const isValidETH = validateAddress('0x...', 'ETH');
```

## Unified Service (NEW)

### blockchainService.ts

**Location:** `src/lib/blockchainService.ts`

Central service combining all blockchain operations:

```typescript
import { blockchainService } from '@/lib/blockchainService';

// Get active networks
const networks = await blockchainService.getActiveNetworks();

// Generate deposit address
const address = await blockchainService.generateDepositAddress('BTC');

// Get user deposit address
const existing = await blockchainService.getUserDepositAddress(userId, 'BTC');

// Get deposits
const deposits = await blockchainService.getUserDeposits(userId, {
  network: 'TRON',
  status: 'confirmed',
  limit: 20
});

// Get transaction status
const status = await blockchainService.getTransactionStatus(txHash, 'POLYGON');

// Get withdrawal limits
const limits = await blockchainService.getWithdrawalLimits(userId, 'USDT');
// Returns: { min_amount, max_amount, daily_limit, monthly_limit, requires_approval, kyc_tier_required }

// Request withdrawal
const withdrawal = await blockchainService.requestWithdrawal({
  asset: 'USDT',
  amount: 1000,
  destinationAddress: 'T...',
  networkCode: 'TRON'
});

// Get withdrawals
const withdrawals = await blockchainService.getUserWithdrawals(userId, {
  status: 'completed',
  limit: 20
});

// Validate address
const isValid = blockchainService.validateAddress('bc1q...', 'BTC');

// Get explorer URLs
const txUrl = blockchainService.getExplorerTxUrl('SOL', txHash);
const addrUrl = blockchainService.getExplorerAddressUrl('ETH', address);

// Bitcoin-specific
const btcAddresses = await blockchainService.getBitcoinAddresses(userId);
const btcBalance = await blockchainService.getBitcoinBalance(userId);
const btcFees = await blockchainService.getBitcoinFeeEstimates();

// Real-time subscriptions
const unsubDeposits = blockchainService.subscribeToDeposits(userId, (deposit) => {
  console.log('New deposit:', deposit);
});

const unsubWithdrawals = blockchainService.subscribeToWithdrawals(userId, (withdrawal) => {
  console.log('Withdrawal update:', withdrawal);
});

// Cleanup
unsubDeposits();
unsubWithdrawals();
```

## Database Schema

### blockchain_networks
Stores configuration for each supported network:
```sql
CREATE TABLE blockchain_networks (
  network_code text PRIMARY KEY,
  network_name text NOT NULL,
  chain_id text,
  native_symbol text NOT NULL,
  rpc_endpoint text NOT NULL,
  explorer_url text NOT NULL,
  min_confirmations integer DEFAULT 1,
  supports_tokens boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
```

### user_deposit_addresses
Custodial addresses for each user/network:
```sql
CREATE TABLE user_deposit_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  network_code text REFERENCES blockchain_networks(network_code),
  address text NOT NULL,
  private_key_encrypted text,
  derivation_path text,
  is_verified boolean DEFAULT false,
  last_checked_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, network_code)
);
```

### blockchain_deposits
Tracks all incoming deposits:
```sql
CREATE TABLE blockchain_deposits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  deposit_address_id uuid REFERENCES user_deposit_addresses(id),
  network_code text REFERENCES blockchain_networks(network_code),
  tx_hash text NOT NULL,
  from_address text,
  to_address text,
  asset text NOT NULL,
  amount numeric NOT NULL,
  amount_usd numeric,
  confirmations integer DEFAULT 0,
  required_confirmations integer DEFAULT 1,
  status text DEFAULT 'pending',
  block_number bigint,
  block_timestamp timestamptz,
  detected_at timestamptz DEFAULT now(),
  confirmed_at timestamptz,
  credited_at timestamptz,
  fee_charged numeric DEFAULT 0,
  amount_credited numeric,
  wallet_transaction_id uuid,
  UNIQUE(network_code, tx_hash)
);
```

### cron_job_logs (NEW)
Monitors automated job execution:
```sql
CREATE TABLE cron_job_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name text NOT NULL,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  status text DEFAULT 'running',
  result jsonb DEFAULT '{}'::jsonb,
  error_message text,
  execution_time_ms integer,
  created_at timestamptz DEFAULT now()
);
```

## Automated Monitoring

### Cron Jobs

TYT requires the following cron jobs to be configured:

**1. Monitor Deposits (Every 5 minutes)**
```bash
*/5 * * * * curl -X POST \
  https://your-project.supabase.co/functions/v1/monitor-deposits \
  -H "X-Cron-Secret: your-secret" \
  -H "Content-Type: application/json"
```

**2. Sync Balances (Every 10 minutes)**
```bash
*/10 * * * * curl -X POST \
  https://your-project.supabase.co/functions/v1/sync-real-balances \
  -H "X-Cron-Secret: your-secret" \
  -H "Content-Type: application/json"
```

**3. Check Pending Confirmations (Every 2 minutes)**
```sql
-- Via Supabase pg_cron or external scheduler
UPDATE blockchain_deposits
SET confirmations = confirmations + 1
WHERE status = 'pending'
  AND confirmations < required_confirmations
  AND detected_at > now() - interval '24 hours';
```

### GitHub Actions Alternative

If Supabase pg_cron is not available, use GitHub Actions:

```yaml
name: Monitor Blockchain Deposits

on:
  schedule:
    - cron: '*/5 * * * *'  # Every 5 minutes

jobs:
  monitor:
    runs-on: ubuntu-latest
    steps:
      - name: Call Monitor Function
        run: |
          curl -X POST \
            ${{ secrets.SUPABASE_URL }}/functions/v1/monitor-deposits \
            -H "X-Cron-Secret: ${{ secrets.CRON_SECRET }}" \
            -H "Content-Type: application/json"
```

## Deposit Flow (End-to-End)

### Step 1: User Requests Deposit Address

**Frontend:**
```typescript
const address = await blockchainService.generateDepositAddress('TRON');
// Display QR code and address to user
```

**Backend (Edge Function):**
1. Checks for existing address
2. If none exists, generates new address:
   - Creates cryptographic keypair
   - Derives address using network standards
   - Encrypts private key
   - Stores in `user_deposit_addresses`
3. Returns address + QR code

### Step 2: User Sends Funds

User sends USDT/TRX/BTC to the provided address from external wallet.

### Step 3: Automated Detection

**monitor-deposits** (runs every 5 min):
1. Fetches all monitored addresses
2. Queries blockchain API (e.g., TronGrid for TRON)
3. Detects new transactions
4. Calls `blockchain-webhook` for each new deposit

### Step 4: Webhook Processing

**blockchain-webhook**:
1. Validates webhook authentication
2. Checks for duplicate (unique tx_hash)
3. Verifies confirmations >= required
4. Records in `blockchain_deposits` table
5. If confirmed:
   - Calculates fees: 1% total (100 bps)
   - Splits: 60% protocol, 30% charity, 10% academy
   - Credits user via double-entry ledger
   - Distributes fees to respective accounts
   - Updates deposit status to 'credited'

### Step 5: User Sees Balance

User's balance updates in real-time via Supabase subscriptions.

## Withdrawal Flow (End-to-End)

### Step 1: User Requests Withdrawal

**Frontend:**
```typescript
const limits = await blockchainService.getWithdrawalLimits(userId, 'USDT');
// Show limits to user

const withdrawal = await blockchainService.requestWithdrawal({
  asset: 'USDT',
  amount: 500,
  destinationAddress: 'T...',
  networkCode: 'TRON'
});
```

### Step 2: Validation

**process-withdrawal** Edge Function:
1. Authenticates user
2. Checks KYC status (required for withdrawals)
3. Validates withdrawal limits:
   - Minimum amount
   - Maximum amount
   - Daily limit
   - Monthly limit
4. Checks available balance
5. Validates destination address format

### Step 3: Approval (if required)

- Auto-approved: amounts < limit for KYC tier
- Manual approval: large amounts or low KYC tier

### Step 4: Execution

For auto-approved withdrawals:
1. Deducts balance from user account
2. Creates withdrawal transaction record
3. Broadcasts to blockchain
4. Returns tx_hash to user

### Step 5: Confirmation

User can track withdrawal status:
```typescript
const withdrawals = await blockchainService.getUserWithdrawals(userId);
// Shows: pending, processing, completed, failed
```

## Security Considerations

### Private Key Management

**Encryption:**
- All private keys encrypted with `WALLET_ENCRYPTION_KEY`
- Stored as base64-encoded strings
- Never exposed in API responses

**Best Practice:**
- Use HSM (Hardware Security Module) for production
- Implement multi-sig for high-value wallets
- Regular key rotation policy

### Webhook Authentication

**Required Headers:**
- `X-Webhook-Secret`: Validates webhook source
- `X-Cron-Secret`: Validates cron job source

**Validation:**
```typescript
const providedSecret = req.headers.get('X-Webhook-Secret');
const expectedSecret = Deno.env.get('WEBHOOK_SECRET');

if (providedSecret !== expectedSecret) {
  return new Response('Unauthorized', { status: 401 });
}
```

### Duplicate Prevention

**Unique Constraint:**
```sql
UNIQUE(network_code, tx_hash)
```

Prevents double-crediting of deposits.

### Rate Limiting

Implement rate limits on Edge Functions:
- generate-deposit-address: 10/min per user
- process-withdrawal: 5/min per user
- blockchain-webhook: 1000/min global

## Testing

### Manual Testing

**1. Generate Deposit Address:**
```bash
curl -X POST https://your-project.supabase.co/functions/v1/generate-deposit-address \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{"network_code": "BTC"}'
```

**2. Simulate Webhook:**
```bash
curl -X POST https://your-project.supabase.co/functions/v1/blockchain-webhook \
  -H "X-Webhook-Secret: your-secret" \
  -H "Content-Type: application/json" \
  -d '{
    "network": "TRON",
    "transaction_id": "test-tx-123",
    "from_address": "T...",
    "to_address": "T...",
    "amount": "1000000",
    "token_symbol": "USDT",
    "confirmations": 20
  }'
```

**3. Request Withdrawal:**
```bash
curl -X POST https://your-project.supabase.co/functions/v1/process-withdrawal \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "asset": "USDT",
    "amount": 100,
    "destination_address": "T...",
    "network_code": "TRON"
  }'
```

## Monitoring & Observability

### Cron Job Logs

Query recent job executions:
```sql
SELECT * FROM cron_job_logs
WHERE job_name = 'monitor-blockchain-deposits'
ORDER BY started_at DESC
LIMIT 10;
```

View stats:
```sql
SELECT * FROM cron_job_stats;
```

### Deposit Metrics

```sql
-- Deposits in last 24 hours
SELECT
  network_code,
  COUNT(*) as deposit_count,
  SUM(amount) as total_amount,
  AVG(amount) as avg_amount
FROM blockchain_deposits
WHERE detected_at > now() - interval '24 hours'
GROUP BY network_code;

-- Pending deposits
SELECT COUNT(*), network_code
FROM blockchain_deposits
WHERE status = 'pending'
GROUP BY network_code;
```

### Withdrawal Metrics

```sql
-- Withdrawals by status
SELECT
  status,
  COUNT(*) as count,
  SUM(amount) as total_amount
FROM withdrawal_requests
WHERE created_at > now() - interval '24 hours'
GROUP BY status;
```

## Environment Variables Required

```env
# Blockchain RPC Endpoints
VITE_BITCOIN_RPC_URL=https://blockstream.info/api
VITE_POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
VITE_TRONGRID_API_KEY=your-api-key
VITE_ALCHEMY_API_KEY=your-alchemy-key

# Security Secrets
WALLET_ENCRYPTION_KEY=your-256-bit-encryption-key
WEBHOOK_SECRET=your-webhook-secret
CRON_SECRET=your-cron-secret

# Supabase (auto-populated)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Next Steps

### Block 2.4 - Miners Service
- NFT miner CRUD operations
- Hashrate allocation
- Upgrade functionality

## Files Created/Modified

**Created:**
- `src/lib/blockchainService.ts` - Unified blockchain service
- `docs/BLOCK2_3_BLOCKCHAIN_GATEWAY_COMPLETE.md` - This documentation

**Database:**
- Applied migration: `create_blockchain_monitoring_cron_tables.sql`
- Created `cron_job_logs` table
- Created `app_settings` table
- Created helper functions

**Existing (Verified):**
- `supabase/functions/generate-deposit-address/index.ts`
- `supabase/functions/monitor-deposits/index.ts`
- `supabase/functions/blockchain-webhook/index.ts`
- `supabase/functions/process-withdrawal/index.ts`
- `src/utils/api/blockchainGateway.ts`
- `src/utils/api/bitcoinService.ts`
- `src/config/blockchainProviders.ts`

## Summary

Block 2.3 Blockchain Gateway Service is complete with:
- 9+ blockchain integrations (Bitcoin, Lightning, Liquid, Ethereum, Polygon, Solana, TRON, XRP, TON)
- Automated deposit monitoring via cron jobs
- Custodial address generation with HD wallets
- Webhook-based deposit processing
- KYC-gated withdrawal system
- 1% platform fee with 60/30/10 split
- Real-time balance updates
- Comprehensive logging and monitoring

All blockchain operations in TYT now flow through this unified, secure, and auditable gateway.
