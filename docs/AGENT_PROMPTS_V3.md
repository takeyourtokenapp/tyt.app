# TYT V3.0 AGENT PROMPTS
**Date**: 13 December 2024
**Architecture**: Supabase + Edge Functions + Foundry Contracts
**Status**: Adapted for current tech stack

---

## 🎯 OVERVIEW

TYT v3.0 moves from "demo with mocks" to "production with real blockchain contracts". Current stack uses:
- **Database**: Supabase (Postgres)
- **Backend**: Supabase Edge Functions (Deno)
- **Contracts**: Foundry (Solidity)
- **Frontend**: React + Vite + TypeScript

---

## 📋 AGENT 1: CONTRACTS-AGENT

### Role
Senior Solidity Engineer with Foundry expertise

### Goal
Deploy production-ready EVM contracts to Polygon Amoy (testnet) and prepare for Polygon mainnet.

### Canon (Non-Negotiable)
```
DEPOSIT_FEE_TOTAL = 10% (1000 basis points)
FEE SPLIT within that 10%:
- Protocol: 60% (6% of deposit)
- Charity: 30% (3% of deposit)
- Academy: 10% (1% of deposit)
```

### Deliverables

#### 1. FeeConfig.sol
```solidity
// Stores fee profiles by key
// Each profile: totalBps, recipients[], splitBps[]
contract FeeConfig {
    struct FeeProfile {
        uint16 totalBps;      // 0-10000 (0-100%)
        address[] recipients;  // [protocol, charity, academy]
        uint16[] splitBps;    // [6000, 3000, 1000] = 100%
    }

    mapping(bytes32 => FeeProfile) public profiles;

    function setFeeProfile(
        bytes32 key,
        uint16 totalBps,
        address[] calldata recipients,
        uint16[] calldata splitBps
    ) external onlyRole(FEE_SETTER_ROLE);

    function calculateFees(bytes32 key, uint256 amount)
        external view returns (
            uint256 totalFee,
            address[] memory recipients,
            uint256[] memory amounts
        );
}
```

**Keys to create**:
- `deposit.default` - 10% total, split 60/30/10
- `marketplace.default` - 3% total, split 60/30/10
- `upgrade.default` - 5% total, split 60/30/10

#### 2. CharityVault.sol
```solidity
contract CharityVault {
    mapping(address => uint256) public balances; // token -> amount
    mapping(bytes32 => uint256) public sourceTracking; // source -> amount

    address public treasuryMultisig;

    function depositFrom(
        address token,
        address from,
        uint256 amount,
        bytes32 source
    ) external;

    function withdraw(
        address token,
        address to,
        uint256 amount,
        string calldata reason
    ) external onlyRole(TREASURY_ROLE);

    event DonationReceived(address token, address from, uint256 amount, bytes32 source);
    event DonationWithdrawn(address token, address to, uint256 amount, string reason);
}
```

#### 3. MinerNFT.sol
```solidity
contract MinerNFT is ERC721Enumerable {
    struct Miner {
        uint32 minerTypeId;
        uint128 powerHashrate; // TH/s * 100
        uint16 level;
        bool isActive;
        uint64 lastRewardClaim;
    }

    mapping(uint256 => Miner) public miners;

    function mint(address to, uint32 minerTypeId, uint128 initialPower)
        external onlyRole(MINTER_ROLE) returns (uint256);

    function upgrade(uint256 tokenId, uint16 newLevel, uint128 newPower)
        external;

    event MinerMinted(uint256 indexed tokenId, address owner, uint32 minerTypeId, uint128 power);
    event MinerUpgraded(uint256 indexed tokenId, uint16 newLevel, uint128 newPower);
}
```

#### 4. RewardsMerkleRegistry.sol
```solidity
contract RewardsMerkleRegistry {
    mapping(uint32 => bytes32) public dailyRoots; // YYYYMMDD -> merkle root
    mapping(uint32 => string) public proofURIs; // YYYYMMDD -> IPFS/URL

    function publishRoot(
        uint32 dateKey,
        bytes32 root,
        string calldata proofURI
    ) external onlyRole(REWARDS_PUBLISHER_ROLE);

    function verifyProof(
        uint32 dateKey,
        bytes32 leaf,
        bytes32[] calldata proof
    ) external view returns (bool);

    event RootPublished(uint32 indexed dateKey, bytes32 root, string proofURI);
}
```

#### 5. MinerMarketplace.sol
```solidity
contract MinerMarketplace {
    struct Listing {
        uint256 tokenId;
        address seller;
        uint256 price;
        uint256 expiresAt;
        bool active;
    }

    FeeConfig public feeConfig;
    MinerNFT public minerNFT;

    function createListing(uint256 tokenId, uint256 price, uint256 duration) external;
    function cancelListing(uint256 listingId) external;
    function buyListing(uint256 listingId) external payable;

    // Internal: calculate and distribute fees using FeeConfig
    function _processFees(uint256 amount) internal returns (uint256 sellerAmount);

    event ListingCreated(uint256 indexed listingId, uint256 tokenId, address seller, uint256 price);
    event ListingFilled(uint256 indexed listingId, address buyer, uint256 price, uint256 fees);
}
```

### Technical Requirements
- Solidity 0.8.24+
- OpenZeppelin Contracts 5.0
- Foundry framework
- Natspec documentation
- Full test coverage (>90%)

### Repository Structure
```
contracts/evm/
├── foundry.toml
├── src/
│   ├── FeeConfig.sol
│   ├── CharityVault.sol
│   ├── MinerNFT.sol
│   ├── RewardsMerkleRegistry.sol
│   └── MinerMarketplace.sol
├── test/
│   ├── FeeConfig.t.sol
│   ├── CharityVault.t.sol
│   ├── MinerNFT.t.sol
│   ├── RewardsMerkleRegistry.t.sol
│   └── MinerMarketplace.t.sol
├── script/
│   ├── DeployAmoy.s.sol
│   └── DeployPolygon.s.sol
└── deployments/
    ├── amoy.json
    └── polygon.json (prepared, not executed)
```

### Environment Variables
```bash
# contracts/evm/.env.example
PRIVATE_KEY=
RPC_URL_AMOY=https://rpc-amoy.polygon.technology
RPC_URL_POLYGON=https://polygon-rpc.com
POLYGONSCAN_API_KEY=

# Deployment addresses
TREASURY_MULTISIG=0x...
PROTOCOL_TREASURY=0x...
CHARITY_TREASURY=0x...
ACADEMY_TREASURY=0x...
```

### Deployment Sequence
1. Deploy FeeConfig
2. Deploy CharityVault (set treasury)
3. Deploy MinerNFT
4. Deploy RewardsMerkleRegistry
5. Deploy MinerMarketplace (wire dependencies)
6. Configure fee profiles in FeeConfig
7. Grant roles
8. Verify on Polygonscan

### Commands
```bash
# Install dependencies
forge install

# Run tests
forge test -vvv

# Deploy to Amoy
forge script script/DeployAmoy.s.sol --rpc-url $RPC_URL_AMOY --broadcast --verify

# Save addresses
forge script script/DeployAmoy.s.sol --rpc-url $RPC_URL_AMOY --broadcast | tee deployments/amoy.json
```

### Definition of Done
- [ ] All contracts compile without warnings
- [ ] Test coverage >90%
- [ ] Deploy script works on Amoy
- [ ] Addresses saved to deployments/amoy.json
- [ ] All contracts verified on Polygonscan
- [ ] Fee calculations match exactly: 10% total, split 60/30/10
- [ ] Merkle roots immutable (no overwrite possible)
- [ ] README_CONTRACTS.md created with usage guide

---

## 📋 AGENT 2: BACKEND-AGENT

### Role
Senior TypeScript/Deno Engineer (Supabase Edge Functions)

### Goal
Replace mock data with real blockchain integration, rewards calculation, and automated workflows.

### Current Architecture
- **Runtime**: Deno (Supabase Edge Functions)
- **Database**: Supabase Postgres (already has 120+ tables)
- **Existing Functions**: 18 edge functions (partially implemented)

### Canon (Non-Negotiable)
```
DEPOSIT_FEE = 10% total
FEE SPLIT: protocol 60%, charity 30%, academy 10%
ALL money movements must use double-entry ledger
```

### Deliverables

#### 1. Enhanced Edge Functions

**A. process-deposit (UPDATED)**
```typescript
// Current: supabase/functions/process-deposit/index.ts
// Add: Real fee calculation and distribution

import { createClient } from "npm:@supabase/supabase-js@2";

async function processDeposit(depositId: string) {
  // 1. Get deposit details
  const { data: deposit } = await supabase
    .from('blockchain_deposits')
    .select('*')
    .eq('id', depositId)
    .single();

  // 2. Calculate fees (10% total)
  const amount = parseFloat(deposit.amount);
  const feeTotal = amount * 0.10;
  const protocolFee = feeTotal * 0.60; // 6% of original
  const charityFee = feeTotal * 0.30;  // 3% of original
  const academyFee = feeTotal * 0.10;  // 1% of original
  const userNet = amount - feeTotal;   // 90% of original

  // 3. Create journal entry (double-entry ledger)
  const { data: entry } = await supabase
    .from('journal_entries')
    .insert({
      reference: `deposit_${depositId}`,
      type: 'deposit',
      status: 'completed'
    })
    .select()
    .single();

  // 4. Create journal lines
  await supabase.from('journal_lines').insert([
    // Credit user wallet
    { entry_id: entry.id, account_type: 'user', user_id: deposit.user_id,
      asset: deposit.asset, credit: userNet, debit: 0 },
    // Credit protocol
    { entry_id: entry.id, account_type: 'protocol',
      asset: deposit.asset, credit: protocolFee, debit: 0 },
    // Credit charity
    { entry_id: entry.id, account_type: 'charity',
      asset: deposit.asset, credit: charityFee, debit: 0 },
    // Credit academy
    { entry_id: entry.id, account_type: 'academy',
      asset: deposit.asset, credit: academyFee, debit: 0 }
  ]);

  // 5. Update custodial wallet balances
  await updateWalletBalance(deposit.user_id, deposit.asset, userNet);

  // 6. Send email notification
  await sendEmail(deposit.user_id, 'depositConfirmed', {
    amount: deposit.amount,
    net: userNet,
    fees: feeTotal
  });
}
```

**B. cron-daily-rewards (ENHANCED)**
```typescript
// Current: Already exists, enhance with real merkle generation

async function distributeDailyRewards() {
  // 1. Get all active miners from blockchain
  const miners = await getActiveMinersFromChain();

  // 2. Calculate rewards for each
  const rewards = miners.map(miner => ({
    userId: miner.owner,
    minerId: miner.tokenId,
    amount: calculateReward(miner),
    date: getCurrentDate()
  }));

  // 3. Build merkle tree
  const tree = buildMerkleTree(rewards);
  const root = tree.root;

  // 4. Store proofs in database
  await storeProofs(rewards, tree);

  // 5. Publish root on-chain via RewardsMerkleRegistry
  await publishRootOnChain(getCurrentDateKey(), root);

  // 6. Credit wallets via journal entries
  for (const reward of rewards) {
    await creditReward(reward);
  }
}
```

**C. blockchain-indexer (NEW)**
```typescript
// supabase/functions/blockchain-indexer/index.ts
// Indexes contract events

import { ethers } from "npm:ethers@6";

async function indexEvents(fromBlock: number, toBlock: number) {
  const provider = new ethers.JsonRpcProvider(RPC_URL);

  // Index MinerNFT events
  const minerNFT = new ethers.Contract(MINER_NFT_ADDRESS, ABI, provider);
  const mintEvents = await minerNFT.queryFilter(
    minerNFT.filters.MinerMinted(),
    fromBlock,
    toBlock
  );

  for (const event of mintEvents) {
    await supabase.from('digital_miners').upsert({
      token_id: event.args.tokenId.toString(),
      owner_id: await getUserIdByAddress(event.args.owner),
      miner_type_id: event.args.minerTypeId,
      power_th: event.args.power / 100,
      status: 'active',
      block_number: event.blockNumber
    });
  }

  // Index Marketplace events
  // Index Rewards events
  // ...
}
```

**D. merkle-proof-api (NEW)**
```typescript
// supabase/functions/merkle-proof-api/index.ts
// Returns merkle proof for user/date

Deno.serve(async (req: Request) => {
  const { userId, dateKey } = await req.json();

  const { data: proof } = await supabase
    .from('reward_proofs')
    .select('*')
    .eq('user_id', userId)
    .eq('date_key', dateKey)
    .single();

  if (!proof) {
    return new Response(JSON.stringify({ error: 'No proof found' }), {
      status: 404
    });
  }

  return new Response(JSON.stringify({
    leaf: proof.leaf,
    proof: proof.proof_path,
    root: proof.root,
    amount: proof.amount,
    dateKey
  }));
});
```

#### 2. Database Enhancements

**New Tables**:
```sql
-- Journal entries (double-entry ledger)
CREATE TABLE journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text UNIQUE NOT NULL,
  type text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE journal_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id uuid REFERENCES journal_entries(id),
  account_type text NOT NULL, -- 'user', 'protocol', 'charity', 'academy'
  user_id uuid REFERENCES profiles(id), -- null for system accounts
  asset text NOT NULL,
  debit numeric DEFAULT 0,
  credit numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  CHECK (debit >= 0 AND credit >= 0),
  CHECK (debit = 0 OR credit = 0) -- one must be zero
);

-- Reward proofs
CREATE TABLE reward_proofs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  date_key integer NOT NULL, -- YYYYMMDD
  leaf bytea NOT NULL,
  proof_path jsonb NOT NULL, -- array of bytes32
  root bytea NOT NULL,
  amount numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date_key)
);

-- Fee tracking
CREATE TABLE fee_distributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type text NOT NULL, -- 'deposit', 'marketplace', 'upgrade'
  source_id uuid NOT NULL,
  total_fee numeric NOT NULL,
  protocol_fee numeric NOT NULL,
  charity_fee numeric NOT NULL,
  academy_fee numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

### Environment Variables
```bash
# Already exists in .env, add:
POLYGON_RPC_URL_AMOY=
POLYGON_RPC_URL_MAINNET=
MINER_NFT_ADDRESS=
MARKETPLACE_ADDRESS=
REWARDS_REGISTRY_ADDRESS=
FEE_CONFIG_ADDRESS=
CHARITY_VAULT_ADDRESS=
INDEXER_START_BLOCK=
REWARDS_PUBLISHER_PRIVATE_KEY= # for publishing roots
```

### Commands
```bash
# Deploy new functions
supabase functions deploy process-deposit
supabase functions deploy blockchain-indexer
supabase functions deploy merkle-proof-api

# Run migrations
supabase db push

# Test locally
supabase functions serve process-deposit --env-file .env.local
```

### Definition of Done
- [ ] process-deposit applies 10% fee with 60/30/10 split
- [ ] Journal entries balance (sum of debits = sum of credits)
- [ ] cron-daily-rewards generates valid merkle tree
- [ ] Merkle root published on-chain
- [ ] blockchain-indexer syncs MinerNFT events
- [ ] merkle-proof-api returns valid proofs
- [ ] All functions have error handling
- [ ] Integration tests pass

---

## 📋 AGENT 3: FRONTEND-AGENT

### Role
Senior React/TypeScript Engineer

### Goal
Connect frontend to real backend APIs and blockchain contracts. Remove all mock data.

### Current State
- React + Vite + TypeScript
- 60+ components
- 36 pages
- Uses mock data in many places

### Canon
Display fee breakdowns clearly: "10% deposit fee (6% protocol, 3% charity, 1% academy)"

### Deliverables

#### 1. API Client Layer

**Create: src/lib/api/client.ts**
```typescript
const API_BASE = import.meta.env.VITE_SUPABASE_URL;

export const apiClient = {
  wallet: {
    getBalance: async () => {
      const { data } = await supabase
        .from('custodial_wallets')
        .select('*')
        .eq('user_id', userId);
      return data;
    },

    getHistory: async (asset?: string) => {
      let query = supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (asset) query = query.eq('asset', asset);
      return query;
    },

    withdraw: async (params) => {
      return supabase.functions.invoke('process-withdrawal', {
        body: params
      });
    }
  },

  miners: {
    list: async () => {
      const { data } = await supabase
        .from('digital_miners')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active');
      return data;
    }
  },

  rewards: {
    getHistory: async () => {
      const { data } = await supabase
        .from('reward_distributions')
        .select('*')
        .eq('user_id', userId)
        .order('distribution_date', { ascending: false });
      return data;
    },

    getProof: async (dateKey: number) => {
      return supabase.functions.invoke('merkle-proof-api', {
        body: { userId, dateKey }
      });
    }
  },

  marketplace: {
    list: async () => {
      const { data } = await supabase
        .from('marketplace_listings')
        .select('*, digital_miners(*)')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      return data;
    }
  }
};
```

#### 2. Contract Interaction Layer

**Create: src/lib/contracts/index.ts**
```typescript
import { ethers } from 'ethers';
import MinerMarketplaceABI from './abis/MinerMarketplace.json';

const provider = new ethers.BrowserProvider(window.ethereum);

export const contracts = {
  marketplace: {
    buy: async (listingId: number) => {
      const signer = await provider.getSigner();
      const marketplace = new ethers.Contract(
        MARKETPLACE_ADDRESS,
        MinerMarketplaceABI,
        signer
      );

      const tx = await marketplace.buyListing(listingId);
      await tx.wait();
      return tx.hash;
    },

    list: async (tokenId: number, price: string) => {
      // Similar implementation
    }
  },

  rewards: {
    verify: async (proof: any) => {
      // Client-side merkle verification
      const leaf = ethers.solidityPackedKeccak256(
        ['address', 'uint256', 'uint256'],
        [proof.user, proof.amount, proof.dateKey]
      );

      return verifyMerkleProof(proof.proof, leaf, proof.root);
    }
  }
};
```

#### 3. Pages to Update

**Priority Order**:

1. **src/pages/app/Wallet.tsx**
   - Replace mock balance with `apiClient.wallet.getBalance()`
   - Show fee breakdown on deposit history
   - Wire withdraw form to `apiClient.wallet.withdraw()`

2. **src/pages/app/Miners.tsx**
   - Load from `apiClient.miners.list()`
   - Show real on-chain data

3. **src/pages/app/Rewards.tsx**
   - Load history from `apiClient.rewards.getHistory()`
   - Add "Verify" button that:
     - Fetches proof
     - Verifies locally
     - Shows ✅ if valid

4. **src/pages/app/Marketplace.tsx**
   - Load listings from `apiClient.marketplace.list()`
   - Buy button calls `contracts.marketplace.buy()`
   - Show fee breakdown

5. **src/pages/app/Foundation.tsx**
   - Show real charity balances
   - Display recent donations from journal

### Feature Flags

**Create: src/lib/config.ts**
```typescript
export const config = {
  useMocks: import.meta.env.VITE_USE_MOCKS === 'true',
  chainId: parseInt(import.meta.env.VITE_CHAIN_ID || '80002'), // Amoy
  contracts: {
    minerNFT: import.meta.env.VITE_MINER_NFT_ADDRESS,
    marketplace: import.meta.env.VITE_MARKETPLACE_ADDRESS,
    rewardsRegistry: import.meta.env.VITE_REWARDS_REGISTRY_ADDRESS
  }
};
```

### Environment Variables
```bash
# .env.example
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_USE_MOCKS=false
VITE_CHAIN_ID=80002
VITE_MINER_NFT_ADDRESS=
VITE_MARKETPLACE_ADDRESS=
VITE_REWARDS_REGISTRY_ADDRESS=
```

### Commands
```bash
# Install
npm install

# Dev
npm run dev

# Build
npm run build

# Type check
npm run typecheck
```

### Definition of Done
- [ ] Wallet page loads real balances
- [ ] Deposit history shows fee breakdown
- [ ] Rewards page verifies merkle proofs
- [ ] Marketplace loads from indexer
- [ ] All pages have loading states
- [ ] All pages have error states
- [ ] No console errors
- [ ] Build passes
- [ ] TypeScript strict mode

---

## 📋 AGENT 4: INFRA-AGENT

### Role
Senior DevOps Engineer

### Goal
Ensure reproducible local development, staging deployment, and CI/CD.

### Current State
- Project builds successfully
- Supabase project configured
- Some edge functions deployed
- Need: CI/CD + Docker + Staging automation

### Deliverables

#### 1. Local Development

**Create: docker-compose.yml**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: tyt_local
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  supabase-studio:
    image: supabase/studio:latest
    ports:
      - "3000:3000"
    environment:
      SUPABASE_URL: http://localhost:54321
      SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY}

volumes:
  postgres_data:
```

**Create: Makefile**
```makefile
.PHONY: install dev build test clean

install:
	npm install
	cd contracts/evm && forge install

dev:
	npm run dev

dev-backend:
	supabase functions serve

build:
	npm run build

test:
	npm run test
	cd contracts/evm && forge test

contracts-test:
	cd contracts/evm && forge test -vvv

contracts-deploy-amoy:
	cd contracts/evm && forge script script/DeployAmoy.s.sol --rpc-url $$RPC_URL_AMOY --broadcast

db-reset:
	supabase db reset

clean:
	rm -rf dist node_modules
```

#### 2. CI/CD Pipeline

**Create: .github/workflows/ci.yml**
```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main, staging]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run typecheck

      - name: Build
        run: npm run build

      - name: Setup Foundry
        uses: foundry-rs/foundry-toolchain@v1

      - name: Test contracts
        run: |
          cd contracts/evm
          forge test
```

**Create: .github/workflows/deploy-staging.yml**
```yaml
name: Deploy Staging

on:
  push:
    branches: [staging]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy Supabase Functions
        run: |
          supabase functions deploy --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}

      - name: Run migrations
        run: supabase db push --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}

      - name: Deploy frontend
        # Add your hosting deployment here
```

#### 3. Staging Environment

**Create: docs/STAGING_SETUP.md**
```markdown
# Staging Environment Setup

## Prerequisites
- Supabase project created
- Polygon Amoy RPC access
- Testnet MATIC for gas

## Steps

1. Deploy contracts to Amoy:
   ```bash
   cd contracts/evm
   forge script script/DeployAmoy.s.sol --rpc-url $RPC_URL_AMOY --broadcast --verify
   ```

2. Save contract addresses to `.env`:
   ```bash
   VITE_MINER_NFT_ADDRESS=0x...
   VITE_MARKETPLACE_ADDRESS=0x...
   VITE_REWARDS_REGISTRY_ADDRESS=0x...
   ```

3. Deploy edge functions:
   ```bash
   supabase functions deploy
   ```

4. Run database migrations:
   ```bash
   supabase db push
   ```

5. Deploy frontend:
   ```bash
   npm run build
   # Upload dist/ to hosting
   ```

6. Test E2E flows
```

#### 4. Monitoring

**Create: scripts/health-check.ts**
```typescript
const checks = [
  { name: 'Database', url: SUPABASE_URL + '/rest/v1/' },
  { name: 'Edge Functions', url: SUPABASE_URL + '/functions/v1/health' },
  { name: 'Frontend', url: 'https://staging.takeyourtoken.app' }
];

for (const check of checks) {
  const response = await fetch(check.url);
  console.log(`${check.name}: ${response.ok ? '✅' : '❌'}`);
}
```

### Environment Variables

**Create: infra/env/staging.env.example**
```bash
# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Polygon
RPC_URL_AMOY=
PRIVATE_KEY_STAGING=

# Contracts (filled after deployment)
MINER_NFT_ADDRESS=
MARKETPLACE_ADDRESS=
REWARDS_REGISTRY_ADDRESS=
FEE_CONFIG_ADDRESS=
CHARITY_VAULT_ADDRESS=

# Other
JWT_SECRET=
REWARDS_PUBLISHER_KEY=
```

### Commands
```bash
# Local development
make install
make dev

# Run tests
make test

# Deploy contracts to Amoy
make contracts-deploy-amoy

# Health check
node scripts/health-check.ts
```

### Definition of Done
- [ ] `make install` works on fresh clone
- [ ] `make dev` starts local environment
- [ ] `make test` passes all tests
- [ ] CI pipeline runs on every PR
- [ ] Staging deploys automatically on merge to staging
- [ ] Health check script works
- [ ] All secrets in GitHub Secrets (not repo)
- [ ] Documentation complete

---

## 📋 INTEGRATOR / RELEASE MANAGER

### Role
You are the final coordinator ensuring all pieces work together.

### Goal
Merge all agent outputs into a working staging environment and verify E2E flows.

### Inputs
- feat/v3-contracts-core (from contracts-agent)
- feat/v3-backend-rails (from backend-agent)
- feat/v3-frontend-real-api (from frontend-agent)
- feat/v3-infra-rails (from infra-agent)

### Workflow

#### Step 1: Merge Order
```bash
git checkout staging
git merge feat/v3-infra-rails        # First: infrastructure
git merge feat/v3-contracts-core     # Second: contracts
git merge feat/v3-backend-rails      # Third: backend
git merge feat/v3-frontend-real-api  # Fourth: frontend
```

After each merge, run:
```bash
npm run build
npm run test
```

#### Step 2: Deploy Contracts to Amoy
```bash
cd contracts/evm
forge script script/DeployAmoy.s.sol --rpc-url $RPC_URL_AMOY --broadcast --verify

# Save addresses
echo "VITE_MINER_NFT_ADDRESS=0x..." >> .env.staging
echo "VITE_MARKETPLACE_ADDRESS=0x..." >> .env.staging
# ... etc
```

#### Step 3: Configure Environment
Copy `infra/env/staging.env.example` to `.env.staging` and fill in all values.

#### Step 4: Deploy Backend
```bash
supabase link --project-ref $STAGING_PROJECT_REF
supabase db push
supabase functions deploy
```

#### Step 5: Deploy Frontend
```bash
npm run build
# Upload dist/ to hosting provider
```

### E2E Verification Checklist

**E2E-1: Login Works**
- [ ] User can register
- [ ] User can login
- [ ] JWT persists after refresh

**E2E-2: Deposit Fee Split (6/3/1)**
```bash
# Simulate deposit of 1000 USDT
# Expected results:
User balance: +900
Protocol balance: +60
Charity balance: +30
Academy balance: +10
```
- [ ] User credited 90%
- [ ] Protocol credited 6%
- [ ] Charity credited 3%
- [ ] Academy credited 1%
- [ ] Journal entry balances

**E2E-3: Miner Appears On-Chain**
- [ ] Mint MinerNFT on Amoy
- [ ] Indexer syncs event
- [ ] Miners page shows it

**E2E-4: Rewards Merkle**
- [ ] Run rewards cron manually
- [ ] Root published on-chain
- [ ] Proof API returns valid proof
- [ ] Frontend verifies proof ✅

**E2E-5: Marketplace**
- [ ] Create listing on-chain
- [ ] Indexer syncs it
- [ ] Marketplace page shows it
- [ ] Fee breakdown displays correctly

### Outputs

**Create: docs/STAGING_RUNBOOK.md**
Document all steps above with:
- Environment setup
- Deployment commands
- E2E test procedures
- Expected results
- Troubleshooting tips

**Create: docs/RELEASE_CHECKLIST_V3.md**
- [ ] All contracts deployed
- [ ] All addresses saved
- [ ] All functions deployed
- [ ] All migrations run
- [ ] E2E tests pass
- [ ] Documentation complete
- [ ] Team notified

**Create: docs/FIX_TASKS.md**
If any E2E test fails, document:
- Test name
- Expected result
- Actual result
- Owner agent (contracts/backend/frontend/infra)
- Files to check
- Steps to reproduce

### Definition of Done
- [ ] staging branch builds
- [ ] Contracts deployed to Amoy
- [ ] E2E-1 through E2E-5 pass
- [ ] Runbook created
- [ ] Checklist created
- [ ] No critical bugs

---

## 📝 NOTES

### Differences from Original Prompt

The original prompts requested NestJS backend, but **current implementation uses Supabase Edge Functions (Deno)**. This is actually better for:
- Serverless scaling
- Lower costs
- Faster deployment
- Built-in auth

### What's Already Done

Current project already has:
- ✅ 120+ database tables
- ✅ 18 edge functions (some need enhancement)
- ✅ Complete frontend (needs API wiring)
- ✅ Foundry setup (needs contract implementation)
- ✅ 98% feature complete

### What's Needed

1. **Contracts** - Implement 5 core contracts
2. **Backend** - Enhance edge functions with real logic
3. **Frontend** - Wire to real APIs
4. **Infra** - CI/CD + staging automation

### Timeline Estimate

- Contracts: 2 weeks
- Backend: 2 weeks
- Frontend: 1 week
- Infra: 1 week
- Integration: 1 week
**Total: ~7 weeks to production-ready v3.0**

---

*Created*: 13 December 2024
*Adapted for*: Supabase + Edge Functions + Foundry stack
*Status*: Ready for agent execution
