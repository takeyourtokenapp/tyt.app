# Block 2.4 - Miner Registry Service Implementation Complete

## Overview

Synchronizes on-chain MinerNFT state with the database, providing a complete registry of all NFT miners with ownership tracking, upgrade history, and marketplace integration.

## Architecture

### Database Schema

**nft_collections**
Stores NFT collection/series metadata:
```sql
CREATE TABLE nft_collections (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  symbol text NOT NULL,
  description text,
  contract_address text UNIQUE,
  total_supply integer DEFAULT 0,
  minted_supply integer DEFAULT 0,
  base_hashrate numeric NOT NULL,
  base_efficiency numeric NOT NULL,
  base_maintenance_rate numeric DEFAULT 0,
  floor_price numeric,
  floor_price_currency text DEFAULT 'TYT',
  is_active boolean DEFAULT true,
  image_url text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);
```

**nft_miners**
Individual NFT miners owned by users:
```sql
CREATE TABLE nft_miners (
  id uuid PRIMARY KEY,
  token_id text UNIQUE NOT NULL,
  owner_id uuid REFERENCES profiles(id),
  collection_id uuid REFERENCES nft_collections(id),
  name text NOT NULL,
  hashrate numeric NOT NULL,                    -- Current TH/s
  efficiency numeric NOT NULL,                  -- Current W/TH
  power_level integer DEFAULT 1,                -- 1-20 upgrade levels
  maintenance_rate numeric DEFAULT 0,           -- Daily maintenance cost in USD
  farm_id text,                                 -- Data center identifier
  purchase_price numeric,
  purchase_currency text DEFAULT 'TYT',
  purchased_at timestamptz DEFAULT now(),
  last_reward_at timestamptz,
  last_maintenance_paid_at timestamptz,
  total_rewards_btc numeric DEFAULT 0,
  total_maintenance_paid numeric DEFAULT 0,
  status miner_status DEFAULT 'active',         -- active | inactive | maintenance | listed_for_sale
  is_listed boolean DEFAULT false,
  listed_price numeric,
  metadata_uri text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**miner_upgrades**
Upgrade history tracking:
```sql
CREATE TABLE miner_upgrades (
  id uuid PRIMARY KEY,
  miner_id uuid REFERENCES nft_miners(id),
  user_id uuid REFERENCES profiles(id),
  upgrade_type upgrade_type NOT NULL,           -- hashrate | efficiency | power_level
  from_value numeric NOT NULL,
  to_value numeric NOT NULL,
  cost numeric NOT NULL,
  cost_currency text DEFAULT 'TYT',
  transaction_id uuid REFERENCES wallet_transactions(id),
  created_at timestamptz DEFAULT now()
);
```

**user_blockchain_addresses (NEW)**
Maps blockchain addresses to user accounts:
```sql
CREATE TABLE user_blockchain_addresses (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES profiles(id),
  blockchain text NOT NULL,
  address text NOT NULL,
  address_type text,
  is_verified boolean DEFAULT false,
  is_primary boolean DEFAULT false,
  last_used_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(blockchain, address)
);
```

**data_centers**
Mining facility information:
```sql
CREATE TABLE data_centers (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  location text NOT NULL,
  country_code text,
  latitude numeric,
  longitude numeric,
  kwh_rate numeric NOT NULL,
  total_capacity_th numeric DEFAULT 0,
  used_capacity_th numeric DEFAULT 0,
  live_stream_url text,
  is_active boolean DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);
```

### Custom Types

```sql
CREATE TYPE upgrade_type AS ENUM ('hashrate', 'efficiency', 'power_level');
CREATE TYPE miner_status AS ENUM ('active', 'inactive', 'maintenance', 'listed_for_sale');
```

### Database Functions

**get_user_id_from_address()**
Lookup user by blockchain address:
```sql
SELECT get_user_id_from_address('0x123...', 'polygon');
```

**register_user_address()**
Link blockchain address to user:
```sql
SELECT register_user_address(
  'user-uuid',
  'polygon',
  '0x123...',
  'primary',
  true
);
```

**calculate_daily_btc_reward()**
Calculate BTC rewards for a miner:
```sql
SELECT calculate_daily_btc_reward(
  p_hashrate := 100,           -- 100 TH/s
  p_efficiency := 25,           -- 25 W/TH
  p_btc_network_hashrate := 400000000,
  p_btc_block_reward := 3.125,
  p_blocks_per_day := 144
);
```

**calculate_daily_maintenance()**
Calculate maintenance cost for a miner:
```sql
SELECT calculate_daily_maintenance(
  p_hashrate := 100,
  p_efficiency := 25,
  p_kwh_rate := 0.05,
  p_btc_price_usd := 40000
);
```

**update_user_total_hashrate() (Trigger)**
Automatically updates user's total hashrate when miners change:
```sql
-- Triggered automatically on INSERT/UPDATE/DELETE of nft_miners
UPDATE profiles
SET total_hashrate = (SELECT SUM(hashrate) FROM nft_miners WHERE owner_id = user_id AND status = 'active')
WHERE id = user_id;
```

## Edge Function: sync-miner-events

**Endpoint:** `POST /functions/v1/sync-miner-events`

**Purpose:** Syncs on-chain NFT events to database

**Authentication:** Requires `X-Webhook-Secret` header

### Event Types

**1. MinerMinted**
Triggered when a new miner NFT is minted:

```typescript
{
  "event_type": "MinerMinted",
  "event_data": {
    "tokenId": 123,
    "owner": "0x...",
    "collectionId": "0xContractAddress",
    "powerTH": 100000000,        // 100 TH/s in 1e6 units
    "efficiencyWTH": 25000000,   // 25 W/TH in 1e6 units
    "region": "USA",
    "timestamp": 1640000000,
    "transactionHash": "0x..."
  },
  "blockchain": "polygon"
}
```

**Process:**
1. Looks up user ID from owner address
2. Finds collection by contract address
3. Inserts new miner record
4. Increments collection's minted_supply
5. Triggers update_user_total_hashrate()

**2. MinerUpgraded**
Triggered when a miner is upgraded:

```typescript
{
  "event_type": "MinerUpgraded",
  "event_data": {
    "tokenId": 123,
    "upgradeType": "hashrate",   // hashrate | efficiency | power_level
    "oldValue": 100000000,       // 100 TH/s
    "newValue": 150000000,       // 150 TH/s
    "cost": 1000,
    "costCurrency": "TYT",
    "timestamp": 1640000000,
    "transactionHash": "0x..."
  }
}
```

**Process:**
1. Finds miner by token ID
2. Updates hashrate/efficiency/power_level
3. Logs upgrade in miner_upgrades table
4. Triggers update_user_total_hashrate()

**3. MinerTransferred**
Triggered when a miner is transferred (ERC-721 Transfer event):

```typescript
{
  "event_type": "MinerTransferred",
  "event_data": {
    "tokenId": 123,
    "from": "0x...",
    "to": "0x...",
    "timestamp": 1640000000,
    "transactionHash": "0x..."
  }
}
```

**Process:**
1. Looks up new owner's user ID
2. Updates miner's owner_id
3. Unlists miner if listed for sale
4. Triggers update_user_total_hashrate() for both users

**4. MinerStatusChanged**
Triggered when miner status changes:

```typescript
{
  "event_type": "MinerStatusChanged",
  "event_data": {
    "tokenId": 123,
    "oldStatus": "active",
    "newStatus": "maintenance",
    "timestamp": 1640000000,
    "transactionHash": "0x..."
  }
}
```

**Process:**
1. Finds miner by token ID
2. Updates status
3. May trigger update_user_total_hashrate() if status affects active count

### Error Handling

**User Not Found:**
If the blockchain address is not registered, the function throws:
```
Error: User not found for address 0x.... User must register blockchain address first.
```

**Solution:** User must call `minerService.registerBlockchainAddress()` first.

**Duplicate Miner:**
If miner with same token_id already exists:
```json
{
  "success": true,
  "message": "Miner already synced"
}
```

## Frontend Service: minerService

**Location:** `src/lib/minerService.ts`

### Usage Examples

**Get User's Miners:**
```typescript
import { minerService } from '@/lib/minerService';

const miners = await minerService.getUserMiners(userId, {
  status: 'active',
  includeCollection: true,
  limit: 50
});

console.log(miners);
// [
//   {
//     id: 'uuid',
//     token_id: '123',
//     name: 'Miner #123',
//     hashrate: 100,          // 100 TH/s
//     efficiency: 25,         // 25 W/TH
//     power_level: 5,
//     status: 'active',
//     collection: {
//       name: 'Genesis Miners',
//       symbol: 'TYTM',
//       ...
//     }
//   },
//   ...
// ]
```

**Get Single Miner:**
```typescript
const miner = await minerService.getMiner(minerId, true);
const minerByToken = await minerService.getMinerByTokenId('123', true);
```

**Get Marketplace Listings:**
```typescript
const listings = await minerService.getListedMiners({
  minHashrate: 50,
  maxHashrate: 200,
  maxPrice: 10000,
  collectionId: 'collection-uuid',
  limit: 20
});
```

**List Miner for Sale:**
```typescript
await minerService.listMinerForSale(minerId, 5000);
// Sets: is_listed = true, listed_price = 5000, status = 'listed_for_sale'
```

**Unlist Miner:**
```typescript
await minerService.unlistMiner(minerId);
// Sets: is_listed = false, listed_price = null, status = 'active'
```

**Update Miner Settings:**
```typescript
await minerService.updateMinerSettings(minerId, {
  status: 'maintenance',
  is_listed: false
});
```

**Get Upgrade History:**
```typescript
const upgrades = await minerService.getMinerUpgrades(minerId);
// [
//   {
//     upgrade_type: 'hashrate',
//     from_value: 100,
//     to_value: 150,
//     cost: 1000,
//     cost_currency: 'TYT',
//     created_at: '2024-01-01T00:00:00Z'
//   },
//   ...
// ]
```

**Register Blockchain Address:**
```typescript
// User must do this before their on-chain NFTs can sync
const addressId = await minerService.registerBlockchainAddress(
  'polygon',
  '0x123...',
  true  // is_primary
);
```

**Get User's Addresses:**
```typescript
const addresses = await minerService.getUserBlockchainAddresses(userId);
// [
//   {
//     blockchain: 'polygon',
//     address: '0x123...',
//     is_primary: true,
//     is_verified: true
//   },
//   ...
// ]
```

**Calculate Rewards & ROI:**
```typescript
// Daily BTC rewards
const dailyBTC = minerService.calculateDailyBTCReward(
  100,  // hashrate
  25    // efficiency
);

// Daily maintenance cost
const dailyMaintenance = minerService.calculateDailyMaintenance(
  100,   // hashrate
  25,    // efficiency
  0.05,  // kWh rate
  40000  // BTC price USD
);

// Full ROI analysis
const roi = minerService.calculateROI(
  5000,   // purchase price
  100,    // hashrate
  25,     // efficiency
  3,      // daily maintenance USD
  40000   // BTC price USD
);

console.log(roi);
// {
//   dailyRewardBTC: 0.00001,
//   dailyRewardUSD: 0.4,
//   dailyMaintenanceUSD: 3,
//   dailyNetUSD: -2.6,        // Negative! Not profitable at current BTC price
//   roiDays: Infinity,
//   roiMonths: Infinity,
//   annualReturnPercent: -18.98%
// }
```

**Real-time Subscriptions:**
```typescript
// Subscribe to user's miner updates
const unsubscribe = minerService.subscribeToUserMiners(userId, (miner) => {
  console.log('Miner updated:', miner);
  // Update UI
});

// Subscribe to marketplace listings
const unsubMarketplace = minerService.subscribeToMarketplace((miner) => {
  console.log('New listing:', miner);
  // Update marketplace UI
});

// Cleanup
unsubscribe();
unsubMarketplace();
```

## Integration Flow

### Step 1: User Connects Wallet

User connects MetaMask/Web3 wallet to TYT platform.

**Frontend:**
```typescript
import { useAccount } from 'wagmi';

const { address, isConnected } = useAccount();

// Register address with TYT
if (isConnected && address) {
  await minerService.registerBlockchainAddress('polygon', address, true);
}
```

### Step 2: User Mints NFT Miner

User mints NFT through smart contract (on-chain).

**Smart Contract emits:**
```solidity
event MinerMinted(
  uint256 indexed tokenId,
  address indexed owner,
  uint256 powerTH,
  uint256 efficiencyWTH,
  string region
);
```

### Step 3: Blockchain Event Listener

External service (e.g., Alchemy webhooks, The Graph, or custom indexer) listens for events and calls Edge Function.

**Webhook call:**
```bash
curl -X POST https://your-project.supabase.co/functions/v1/sync-miner-events \
  -H "X-Webhook-Secret: your-secret" \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "MinerMinted",
    "event_data": {
      "tokenId": 123,
      "owner": "0x123...",
      "collectionId": "0xContractAddress",
      "powerTH": 100000000,
      "efficiencyWTH": 25000000,
      "region": "USA",
      "timestamp": 1640000000,
      "transactionHash": "0x..."
    },
    "blockchain": "polygon"
  }'
```

### Step 4: Database Sync

Edge Function syncs miner to database:
1. Looks up user by address
2. Creates miner record
3. Updates collection stats
4. Updates user's total hashrate

### Step 5: Frontend Updates

User sees their new miner in dashboard (real-time via Supabase subscription).

## Blockchain Event Monitoring

### Option 1: Alchemy Webhooks

**Setup:**
1. Create Alchemy account
2. Add webhook for MinerNFT contract
3. Configure webhook URL: `https://your-project.supabase.co/functions/v1/sync-miner-events`
4. Add custom header: `X-Webhook-Secret: your-secret`

**Events to monitor:**
- `MinerMinted`
- `MinerUpgraded`
- `Transfer`
- `MinerStatusChanged`

### Option 2: The Graph

**Create subgraph:**
```graphql
type Miner @entity {
  id: ID!
  tokenId: BigInt!
  owner: Bytes!
  powerTH: BigInt!
  efficiencyWTH: BigInt!
  region: String!
  mintedAt: BigInt!
  transactionHash: Bytes!
}

type MinerUpgrade @entity {
  id: ID!
  tokenId: BigInt!
  upgradeType: String!
  oldValue: BigInt!
  newValue: BigInt!
  timestamp: BigInt!
  transactionHash: Bytes!
}
```

**Query events:**
```typescript
const { miners } = await graphClient.query({
  query: gql`
    query GetMiners($owner: Bytes!) {
      miners(where: { owner: $owner }) {
        tokenId
        powerTH
        efficiencyWTH
        region
      }
    }
  `,
  variables: { owner: address }
});

// Sync to database
for (const miner of miners) {
  await fetch('https://your-project.supabase.co/functions/v1/sync-miner-events', {
    method: 'POST',
    headers: {
      'X-Webhook-Secret': process.env.WEBHOOK_SECRET,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      event_type: 'MinerMinted',
      event_data: miner
    })
  });
}
```

### Option 3: Custom Indexer (ethers.js)

**Example:**
```typescript
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
const contract = new ethers.Contract(contractAddress, abi, provider);

// Listen for MinerMinted events
contract.on('MinerMinted', async (tokenId, owner, powerTH, efficiencyWTH, region, event) => {
  await fetch('https://your-project.supabase.co/functions/v1/sync-miner-events', {
    method: 'POST',
    headers: {
      'X-Webhook-Secret': process.env.WEBHOOK_SECRET,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      event_type: 'MinerMinted',
      event_data: {
        tokenId: tokenId.toNumber(),
        owner,
        powerTH: powerTH.toString(),
        efficiencyWTH: efficiencyWTH.toString(),
        region,
        timestamp: event.block.timestamp,
        transactionHash: event.transactionHash
      },
      blockchain: 'polygon'
    })
  });
});
```

## RLS (Row Level Security)

### nft_collections
```sql
-- Anyone can view active collections
CREATE POLICY "Anyone can view active collections"
  ON nft_collections FOR SELECT
  TO authenticated
  USING (is_active = true);
```

### nft_miners
```sql
-- Users can view own miners
CREATE POLICY "Users can view own miners"
  ON nft_miners FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

-- Users can view listed miners (marketplace)
CREATE POLICY "Users can view listed miners"
  ON nft_miners FOR SELECT
  TO authenticated
  USING (is_listed = true);

-- Users can update own miners
CREATE POLICY "Users can update own miners"
  ON nft_miners FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- Users can insert own miners (for manual sync)
CREATE POLICY "Users can insert own miners"
  ON nft_miners FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());
```

### miner_upgrades
```sql
-- Users can view own upgrades
CREATE POLICY "Users can view own upgrades"
  ON miner_upgrades FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can create own upgrades
CREATE POLICY "Users can create own upgrades"
  ON miner_upgrades FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());
```

### user_blockchain_addresses
```sql
-- Users can view own addresses
CREATE POLICY "Users can view own blockchain addresses"
  ON user_blockchain_addresses FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can register own addresses
CREATE POLICY "Users can register own blockchain addresses"
  ON user_blockchain_addresses FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Service role can manage all (for sync)
CREATE POLICY "Service role can manage all addresses"
  ON user_blockchain_addresses FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
```

### data_centers
```sql
-- Anyone can view active data centers
CREATE POLICY "Anyone can view active data centers"
  ON data_centers FOR SELECT
  TO authenticated
  USING (is_active = true);
```

## Testing

### 1. Register Blockchain Address

```typescript
const addressId = await minerService.registerBlockchainAddress(
  'polygon',
  '0x123...',
  true
);

console.log('Address registered:', addressId);
```

### 2. Simulate Mint Event

```bash
curl -X POST https://your-project.supabase.co/functions/v1/sync-miner-events \
  -H "X-Webhook-Secret: your-secret" \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "MinerMinted",
    "event_data": {
      "tokenId": 1,
      "owner": "0x123...",
      "collectionId": "0xContractAddress",
      "powerTH": 100000000,
      "efficiencyWTH": 25000000,
      "region": "USA",
      "timestamp": 1640000000,
      "transactionHash": "0xtest123"
    },
    "blockchain": "polygon"
  }'
```

### 3. Query Miner

```typescript
const miner = await minerService.getMinerByTokenId('1', true);
console.log(miner);
// {
//   token_id: '1',
//   hashrate: 100,
//   efficiency: 25,
//   power_level: 1,
//   status: 'active',
//   collection: { ... }
// }
```

### 4. Calculate ROI

```typescript
const roi = minerService.calculateROI(
  5000,   // purchase price
  100,    // hashrate
  25,     // efficiency
  3,      // daily maintenance
  40000   // BTC price
);

console.log('ROI:', roi.roiMonths, 'months');
console.log('Annual return:', roi.annualReturnPercent, '%');
```

### 5. List for Sale

```typescript
await minerService.listMinerForSale(miner.id, 6000);

const listings = await minerService.getListedMiners();
console.log('Marketplace listings:', listings.length);
```

## Monitoring

### Query Miner Sync Status

```sql
-- Recent sync events
SELECT *
FROM cron_job_logs
WHERE job_name = 'sync-miner-events'
ORDER BY started_at DESC
LIMIT 10;

-- Miner count by status
SELECT status, COUNT(*)
FROM nft_miners
GROUP BY status;

-- Collection stats
SELECT
  c.name,
  c.minted_supply,
  c.total_supply,
  c.floor_price,
  COUNT(m.id) as miners_listed
FROM nft_collections c
LEFT JOIN nft_miners m ON m.collection_id = c.id AND m.is_listed = true
GROUP BY c.id, c.name, c.minted_supply, c.total_supply, c.floor_price;

-- Top miners by hashrate
SELECT
  token_id,
  name,
  hashrate,
  efficiency,
  owner_id,
  status
FROM nft_miners
ORDER BY hashrate DESC
LIMIT 10;

-- User hashrate leaderboard
SELECT
  p.username,
  p.total_hashrate,
  COUNT(m.id) as miner_count
FROM profiles p
LEFT JOIN nft_miners m ON m.owner_id = p.id AND m.status = 'active'
GROUP BY p.id, p.username, p.total_hashrate
ORDER BY p.total_hashrate DESC
LIMIT 20;
```

## Files Created/Modified

**Created:**
- `supabase/functions/sync-miner-events/index.ts` - Blockchain event sync Edge Function
- `src/lib/minerService.ts` - Frontend miner service
- `docs/BLOCK2_4_MINER_REGISTRY_COMPLETE.md` - This documentation

**Database:**
- Applied migration: `create_blockchain_address_mapping_v2.sql`
- Created `user_blockchain_addresses` table
- Created `get_user_id_from_address()` function
- Created `register_user_address()` function
- Created `get_or_create_user_from_address()` function
- Created `v_active_blockchain_addresses` view

**Existing (Verified):**
- `supabase/migrations/20251210100451_create_nft_miners_schema.sql`
- Tables: `nft_collections`, `nft_miners`, `miner_upgrades`, `data_centers`
- Functions: `calculate_daily_btc_reward()`, `calculate_daily_maintenance()`, `update_user_total_hashrate()`

## Next Steps

### Block 2.5 - Rewards Engine
- Daily reward calculations
- Maintenance fee deductions
- Reinvest automation
- Merkle proof generation

## Summary

Block 2.4 Miner Registry Service is complete with:
- Full database schema for NFT miners, collections, upgrades, and data centers
- Blockchain address mapping system
- Edge Function for syncing on-chain events (mint, upgrade, transfer, status change)
- Comprehensive frontend service with CRUD operations
- Real-time subscriptions for miner updates
- ROI and reward calculation utilities
- Marketplace integration (list/unlist miners)
- Upgrade history tracking
- Data center management
- RLS policies for secure access control

All on-chain MinerNFT state can now be synced to the database and accessed through a type-safe, real-time API.
