# 🚀 TYT Platform - Deployment Instructions

**Your Wallet**: `0xE7ca1b6407aFA6232760E2eD81075a3274515806`
**Network**: Polygon Amoy Testnet (Chain ID: 80002)
**Date**: December 31, 2025

---

## ✅ Pre-Deployment Checklist

### 1. Wallet Status
- ✅ **Address**: `0xE7ca1b6407aFA6232760E2eD81075a3274515806`
- ✅ **Testnet MATIC**: Available (confirmed)
- ✅ **WALLET_ENCRYPTION_KEY**: Updated in secrets

### 2. Smart Contracts Status

#### ✅ Completed & Ready for Deployment:
1. **MockTYT.sol** - Test TYT token (ERC20)
2. **VotingEscrowTYT.sol** - Governance & veTYT
3. **MinerNFT.sol** - Digital miners (ERC721)
4. **FeeConfig.sol** - Fee management
5. **CharityVault.sol** - Foundation funds
6. **AcademyVault.sol** - Education funds
7. **MinerMarketplace.sol** - NFT marketplace
8. **RewardsMerkleRegistry.sol** - BTC rewards
9. **DiscountCurve.sol** - VIP discounts
10. **FeeConfigGovernance.sol** - DAO governance

### 3. Frontend Integration
- ✅ **Web3 Wallet Support**: Wagmi v3
- ✅ **Network Config**: Polygon Amoy ready
- ✅ **Contract ABIs**: Available in `src/lib/contracts/abis/`
- ✅ **Multi-language**: EN/RU/HE
- ✅ **Responsive Design**: Mobile ready

### 4. Backend Infrastructure
- ✅ **Supabase**: PostgreSQL + Edge Functions
- ✅ **Database Migrations**: 200+ migrations
- ✅ **RLS Policies**: Security enabled
- ✅ **Multi-chain Support**: BTC/ETH/SOL/TRX/XRP/TON

---

## 📋 Step-by-Step Deployment Guide

### PART 1: Environment Setup (15 minutes)

#### Step 1.1: Install Foundry
```bash
# Install Foundry (Forge + Cast)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Verify installation
forge --version
cast --version
```

#### Step 1.2: Install Node Dependencies
```bash
cd /tmp/cc-agent/61475162/project/contracts/evm

# Install OpenZeppelin contracts
forge install OpenZeppelin/openzeppelin-contracts@v5.0.0
forge install OpenZeppelin/openzeppelin-contracts-upgradeable@v5.0.0

# Verify installation
forge build
```

#### Step 1.3: Configure Environment
```bash
cd /tmp/cc-agent/61475162/project/contracts/evm

# Create .env file
cat > .env << 'EOF'
# Wallet Configuration
PRIVATE_KEY=YOUR_PRIVATE_KEY_HERE
DEPLOYER_ADDRESS=0xE7ca1b6407aFA6232760E2eD81075a3274515806

# Network Configuration
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
POLYGON_MAINNET_RPC_URL=https://polygon-rpc.com

# Explorer API Keys
POLYGONSCAN_API_KEY=YOUR_API_KEY_HERE

# Chain IDs
AMOY_CHAIN_ID=80002
POLYGON_CHAIN_ID=137
EOF

# ⚠️ IMPORTANT: Replace YOUR_PRIVATE_KEY_HERE with your actual private key
# ⚠️ NEVER commit .env to git!
```

#### Step 1.4: Get PolygonScan API Key
```
1. Go to: https://polygonscan.com/register
2. Create account
3. Go to: https://polygonscan.com/myapikey
4. Create new API key
5. Copy key to .env file
```

---

### PART 2: Smart Contract Deployment (30 minutes)

#### Step 2.1: Deploy to Polygon Amoy Testnet

```bash
cd /tmp/cc-agent/61475162/project/contracts/evm

# Deploy all contracts (dry run first)
forge script script/DeployV3Core.s.sol:DeployV3Core \
  --rpc-url $POLYGON_AMOY_RPC_URL \
  --private-key $PRIVATE_KEY \
  --sender $DEPLOYER_ADDRESS \
  -vvvv

# If dry run looks good, broadcast the transactions
forge script script/DeployV3Core.s.sol:DeployV3Core \
  --rpc-url $POLYGON_AMOY_RPC_URL \
  --private-key $PRIVATE_KEY \
  --sender $DEPLOYER_ADDRESS \
  --broadcast \
  --verify \
  --etherscan-api-key $POLYGONSCAN_API_KEY \
  -vvvv
```

**Expected Output**:
```
== Logs ==
Deploying TYT Ecosystem to: polygon_amoy (80002)
Deployer: 0xE7ca1b6407aFA6232760E2eD81075a3274515806

[1/10] Deploying MockTYT...
  ✅ MockTYT deployed at: 0x1234...

[2/10] Deploying VotingEscrowTYT...
  ✅ VotingEscrowTYT deployed at: 0x5678...

[3/10] Deploying FeeConfig...
  ✅ FeeConfig deployed at: 0x9abc...

[4/10] Deploying CharityVault...
  ✅ CharityVault deployed at: 0xdef0...

[5/10] Deploying AcademyVault...
  ✅ AcademyVault deployed at: 0x1111...

[6/10] Deploying DiscountCurve...
  ✅ DiscountCurve deployed at: 0x2222...

[7/10] Deploying MinerNFT...
  ✅ MinerNFT deployed at: 0x3333...

[8/10] Deploying RewardsMerkleRegistry...
  ✅ RewardsMerkleRegistry deployed at: 0x4444...

[9/10] Deploying MinerMarketplace...
  ✅ MinerMarketplace deployed at: 0x5555...

[10/10] Deploying FeeConfigGovernance...
  ✅ FeeConfigGovernance deployed at: 0x6666...

✅ All contracts deployed successfully!
Total gas used: ~15,000,000 gas (~30 MATIC)
```

#### Step 2.2: Verify Contracts on PolygonScan

The `--verify` flag should auto-verify, but if needed:

```bash
# Verify each contract manually
forge verify-contract \
  --chain-id 80002 \
  --compiler-version v0.8.20+commit.a1b79de6 \
  --constructor-args $(cast abi-encode "constructor()") \
  0x1234... \
  src/MockTYT.sol:MockTYT \
  --etherscan-api-key $POLYGONSCAN_API_KEY

# Repeat for each contract
```

#### Step 2.3: Save Deployment Addresses

```bash
# The deployment script automatically saves to:
cat contracts/evm/deployments/amoy.json
```

**Example Output**:
```json
{
  "network": "polygon_amoy",
  "chainId": 80002,
  "deployedAt": "2025-12-31T10:30:00Z",
  "deployer": "0xE7ca1b6407aFA6232760E2eD81075a3274515806",
  "contracts": {
    "MockTYT": {
      "address": "0x1234567890abcdef1234567890abcdef12345678",
      "deployTx": "0xabc..."
    },
    "VotingEscrowTYT": {
      "address": "0x2345678901bcdef12345678901bcdef23456789",
      "deployTx": "0xbcd..."
    },
    "FeeConfig": {
      "address": "0x3456789012cdef23456789012cdef34567890ab",
      "deployTx": "0xcde..."
    },
    "CharityVault": {
      "address": "0x456789023def3456789023def456789023def4",
      "deployTx": "0xdef..."
    },
    "AcademyVault": {
      "address": "0x56789034ef456789034ef56789034ef56789034",
      "deployTx": "0xef0..."
    },
    "DiscountCurve": {
      "address": "0x6789045f56789045f6789045f6789045f67890",
      "deployTx": "0xf01..."
    },
    "MinerNFT": {
      "address": "0x789056067890560789056078905607890560678",
      "deployTx": "0x012..."
    },
    "RewardsMerkleRegistry": {
      "address": "0x890671789067178906717890671789067178906",
      "deployTx": "0x123..."
    },
    "MinerMarketplace": {
      "address": "0x901782890178289017828901782890178289017",
      "deployTx": "0x234..."
    },
    "FeeConfigGovernance": {
      "address": "0xa12893a12893a12893a12893a12893a12893a12",
      "deployTx": "0x345..."
    }
  }
}
```

---

### PART 3: Initial Configuration (15 minutes)

#### Step 3.1: Configure Fee Profiles

```bash
# Set deposit fee (1% = 100 bps)
cast send $FEE_CONFIG_ADDRESS \
  "setFeeProfile(string,uint256,address[],uint256[])" \
  "deposit.default" \
  100 \
  "[$PROTOCOL_WALLET,$CHARITY_VAULT,$ACADEMY_VAULT]" \
  "[600,300,100]" \
  --rpc-url $POLYGON_AMOY_RPC_URL \
  --private-key $PRIVATE_KEY

# Set marketplace fee (0.5% = 50 bps)
cast send $FEE_CONFIG_ADDRESS \
  "setFeeProfile(string,uint256,address[],uint256[])" \
  "marketplace.default" \
  50 \
  "[$PROTOCOL_WALLET,$CHARITY_VAULT,$ACADEMY_VAULT]" \
  "[600,300,100]" \
  --rpc-url $POLYGON_AMOY_RPC_URL \
  --private-key $PRIVATE_KEY
```

#### Step 3.2: Configure Discount Tiers

```bash
# Bronze: 2%, 10 TH/s
cast send $DISCOUNT_CURVE_ADDRESS \
  "setTier(string,uint256,uint256)" \
  "Bronze" \
  200 \
  10000000000000000000 \
  --rpc-url $POLYGON_AMOY_RPC_URL \
  --private-key $PRIVATE_KEY

# Silver: 5%, 50 TH/s
cast send $DISCOUNT_CURVE_ADDRESS \
  "setTier(string,uint256,uint256)" \
  "Silver" \
  500 \
  50000000000000000000 \
  --rpc-url $POLYGON_AMOY_RPC_URL \
  --private-key $PRIVATE_KEY

# Gold: 9%, 200 TH/s
cast send $DISCOUNT_CURVE_ADDRESS \
  "setTier(string,uint256,uint256)" \
  "Gold" \
  900 \
  200000000000000000000 \
  --rpc-url $POLYGON_AMOY_RPC_URL \
  --private-key $PRIVATE_KEY

# Platinum: 13%, 1000 TH/s
cast send $DISCOUNT_CURVE_ADDRESS \
  "setTier(string,uint256,uint256)" \
  "Platinum" \
  1300 \
  1000000000000000000000 \
  --rpc-url $POLYGON_AMOY_RPC_URL \
  --private-key $PRIVATE_KEY

# Diamond: 18%, 5000 TH/s
cast send $DISCOUNT_CURVE_ADDRESS \
  "setTier(string,uint256,uint256)" \
  "Diamond" \
  1800 \
  5000000000000000000000 \
  --rpc-url $POLYGON_AMOY_RPC_URL \
  --private-key $PRIVATE_KEY
```

#### Step 3.3: Mint Test TYT Tokens

```bash
# Mint 1 million TYT to your wallet for testing
cast send $MOCK_TYT_ADDRESS \
  "mint(address,uint256)" \
  $DEPLOYER_ADDRESS \
  1000000000000000000000000 \
  --rpc-url $POLYGON_AMOY_RPC_URL \
  --private-key $PRIVATE_KEY

# Verify balance
cast call $MOCK_TYT_ADDRESS \
  "balanceOf(address)" \
  $DEPLOYER_ADDRESS \
  --rpc-url $POLYGON_AMOY_RPC_URL
```

---

### PART 4: Frontend Integration (20 minutes)

#### Step 4.1: Update Contract Addresses

```bash
cd /tmp/cc-agent/61475162/project

# Update frontend config
cat > src/lib/web3/config.ts << 'EOF'
export const CONTRACTS = {
  polygon_amoy: {
    TYT_TOKEN: '0x1234...', // MockTYT address from deployment
    VETYT: '0x2345...',
    MINER_NFT: '0x7890...',
    MARKETPLACE: '0x9017...',
    CHARITY_VAULT: '0x4567...',
    ACADEMY_VAULT: '0x5678...',
    FEE_CONFIG: '0x3456...',
    DISCOUNT_CURVE: '0x6789...',
    REWARDS_MERKLE: '0x8906...',
    GOVERNANCE: '0xa128...'
  }
}

export const SUPPORTED_CHAINS = [
  {
    id: 80002,
    name: 'Polygon Amoy Testnet',
    network: 'polygon_amoy',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrls: {
      default: { http: ['https://rpc-amoy.polygon.technology'] }
    },
    blockExplorers: {
      default: { name: 'PolygonScan', url: 'https://amoy.polygonscan.com' }
    },
    testnet: true
  }
]
EOF
```

#### Step 4.2: Update .env File

```bash
cd /tmp/cc-agent/61475162/project

# Update frontend .env
cat > .env << 'EOF'
# Supabase (existing - don't change)
VITE_SUPABASE_URL=your_existing_url
VITE_SUPABASE_ANON_KEY=your_existing_key

# Polygon Amoy Contracts
VITE_TYT_TOKEN_ADDRESS=0x1234...
VITE_VETYT_ADDRESS=0x2345...
VITE_MINER_NFT_ADDRESS=0x7890...
VITE_MARKETPLACE_ADDRESS=0x9017...
VITE_CHARITY_VAULT_ADDRESS=0x4567...

# Network
VITE_DEFAULT_CHAIN_ID=80002
VITE_NETWORK=polygon_amoy

# API Keys
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
VITE_ALCHEMY_API_KEY=your_alchemy_key
EOF
```

#### Step 4.3: Build & Test Frontend

```bash
cd /tmp/cc-agent/61475162/project

# Install dependencies (if not done)
npm install

# Build
npm run build

# Preview locally
npm run preview

# Test in browser at http://localhost:4173
```

#### Step 4.4: Test User Flows

Open browser and test:
1. ✅ **Connect Wallet**
   - Use MetaMask with Polygon Amoy
   - Switch to your wallet `0xE7ca...`

2. ✅ **Mint TYT Tokens**
   - Navigate to token page
   - Click "Mint Test TYT"
   - Approve transaction

3. ✅ **Create veTYT Lock**
   - Go to Governance page
   - Lock 10,000 TYT for 1 week
   - Verify voting power

4. ✅ **Mint Miner NFT**
   - Go to Miners page
   - Click "Mint Miner"
   - Set power: 100 TH/s
   - Approve TYT payment

5. ✅ **List on Marketplace**
   - Select your miner
   - Click "List for Sale"
   - Set price: 5000 TYT
   - Approve listing

---

### PART 5: Backend Integration (20 minutes)

#### Step 5.1: Update Database

```sql
-- Connect to Supabase SQL Editor
-- Update network metadata

INSERT INTO public.network_metadata (
  network_id,
  display_name,
  is_testnet,
  block_explorer_url,
  native_token_symbol
) VALUES
  ('polygon_amoy', 'Polygon Amoy Testnet', true, 'https://amoy.polygonscan.com', 'MATIC')
ON CONFLICT (network_id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  block_explorer_url = EXCLUDED.block_explorer_url;

-- Add contract addresses
INSERT INTO public.contract_addresses (
  network_id,
  contract_name,
  address,
  abi_version
) VALUES
  ('polygon_amoy', 'TYT_TOKEN', '0x1234...', 'v1'),
  ('polygon_amoy', 'VETYT', '0x2345...', 'v1'),
  ('polygon_amoy', 'MINER_NFT', '0x7890...', 'v1'),
  ('polygon_amoy', 'MARKETPLACE', '0x9017...', 'v1'),
  ('polygon_amoy', 'CHARITY_VAULT', '0x4567...', 'v1')
ON CONFLICT (network_id, contract_name) DO UPDATE SET
  address = EXCLUDED.address,
  abi_version = EXCLUDED.abi_version,
  updated_at = now();
```

#### Step 5.2: Deploy Edge Functions

```bash
cd /tmp/cc-agent/61475162/project/supabase/functions

# Deploy blockchain monitoring
supabase functions deploy monitor-deposits

# Deploy merkle proof generation
supabase functions deploy generate-merkle-proof

# Deploy wallet management
supabase functions deploy generate-custodial-address

# Set secrets
supabase secrets set WALLET_ENCRYPTION_KEY=your_new_key
supabase secrets set ALCHEMY_API_KEY=your_alchemy_key
supabase secrets set POLYGONSCAN_API_KEY=your_polygonscan_key
```

#### Step 5.3: Configure Blockchain Monitoring

```typescript
// Create monitoring job in Supabase
// supabase/functions/cron-monitor-blockchain/index.ts

// This runs every 5 minutes via cron
const monitorBlockchain = async () => {
  // Monitor Polygon Amoy for:
  // 1. NFT mints
  // 2. Marketplace sales
  // 3. veTYT locks
  // 4. Charity donations

  const latestBlock = await getLatestBlock('polygon_amoy')
  const events = await getContractEvents(latestBlock - 100, latestBlock)

  // Process events and update database
  await processEvents(events)
}
```

---

### PART 6: Testing Checklist (30 minutes)

#### Test Scenario 1: Complete User Journey

```
1. User Registration
   ✅ Register with email
   ✅ Verify email
   ✅ Connect wallet
   ✅ Complete KYC (Level 1)

2. Get TYT Tokens
   ✅ Mint test TYT (developer only)
   OR
   ✅ Request from faucet
   OR
   ✅ Swap MATIC for TYT (if liquidity exists)

3. Governance Participation
   ✅ Lock 10,000 TYT for 1 month
   ✅ Receive veTYT voting power
   ✅ View voting power in dashboard
   ✅ Create test proposal
   ✅ Vote on proposal

4. Mining Operations
   ✅ Mint Miner NFT (100 TH/s)
   ✅ View miner in "My Miners"
   ✅ Check daily BTC rewards (simulated)
   ✅ Pay maintenance fees in TYT
   ✅ Upgrade miner efficiency

5. Marketplace Trading
   ✅ List miner for 5000 TYT
   ✅ View listing on marketplace
   ✅ Cancel listing
   ✅ Relist for 4500 TYT
   ✅ Buy with different wallet
   ✅ Verify fee splits (60/30/10)

6. Charity Donation
   ✅ Navigate to Foundation page
   ✅ Donate 100 TYT to charity
   ✅ Verify CharityVault balance increased
   ✅ View donation in transaction history
   ✅ Check transparency dashboard

7. Academy Enrollment
   ✅ Browse academy lessons
   ✅ Complete "Intro to Bitcoin" lesson
   ✅ Take quiz (score 80%+)
   ✅ Earn XP points
   ✅ Track progress

8. Withdrawal Test
   ✅ Request BTC withdrawal (small amount)
   ✅ Complete KYC Level 2 if needed
   ✅ Verify withdrawal limits
   ✅ Track withdrawal status
```

#### Test Scenario 2: Edge Cases

```
Security Tests:
- ✅ Try to mint NFT without TYT → Should fail
- ✅ Try to withdraw from unexpired veTYT lock → Should fail
- ✅ Try to buy NFT without enough TYT → Should fail
- ✅ Try to manipulate fee splits → Should fail
- ✅ Try to access admin functions → Should fail

Performance Tests:
- ✅ Create 10 NFTs rapidly
- ✅ List 10 NFTs simultaneously
- ✅ Process 50 concurrent marketplace views
- ✅ Load test dashboard (100 users)

UX Tests:
- ✅ Mobile responsiveness (iOS/Android)
- ✅ Wallet connection flow (MetaMask, WalletConnect)
- ✅ Error messages are clear
- ✅ Loading states work properly
- ✅ Transaction confirmations display correctly
```

---

### PART 7: Monitoring & Maintenance

#### Setup Monitoring Dashboard

```typescript
// Key metrics to track:

1. Smart Contract Metrics
   - Total TYT supply
   - Total veTYT locked
   - Number of NFTs minted
   - Marketplace volume (24h/7d/30d)
   - Total charity donations
   - Average transaction gas cost

2. User Metrics
   - New registrations per day
   - Active wallets (daily/weekly/monthly)
   - Average session duration
   - User retention rate

3. Technical Metrics
   - API response time
   - Database query performance
   - Edge function cold starts
   - Frontend bundle size
   - Page load time

4. Financial Metrics
   - TVL (Total Value Locked)
   - Daily trading volume
   - Fee revenue
   - Charity fund balance
```

#### Create Alert System

```yaml
# alerts.yml
alerts:
  - name: "High Gas Prices"
    condition: "gas_price > 100 gwei"
    action: "Notify team + pause operations"

  - name: "Contract Interaction Failed"
    condition: "transaction_success_rate < 95%"
    action: "Investigate + notify devs"

  - name: "Charity Vault Low Balance"
    condition: "charity_balance < $1000"
    action: "Notify foundation team"

  - name: "API Downtime"
    condition: "api_uptime < 99%"
    action: "Restart services + notify on-call"
```

---

## 📊 Post-Deployment Analytics

### Week 1 Targets
```
Metrics to Track:
✅ Unique wallet connections: 100+
✅ NFTs minted: 50+
✅ Marketplace listings: 20+
✅ veTYT locks created: 30+
✅ Charity donations: $500+
✅ Academy enrollments: 100+

Success Criteria:
- Zero critical bugs
- >99% uptime
- <$2 average gas cost
- Positive community feedback
```

### Month 1 Targets
```
Growth Metrics:
✅ 1,000 registered users
✅ 500 NFTs minted
✅ $50,000 TVL
✅ $5,000 charity donations
✅ 50 marketplace sales

Technical Metrics:
- >99.5% uptime
- <200ms API response
- <2s page load time
- Zero security incidents
```

---

## 🆘 Troubleshooting Guide

### Common Issues

#### Issue 1: "Insufficient Funds for Gas"
```bash
# Solution: Get more test MATIC
# Polygon Amoy Faucet: https://faucet.polygon.technology/

# Or check balance:
cast balance $DEPLOYER_ADDRESS --rpc-url $POLYGON_AMOY_RPC_URL
```

#### Issue 2: "Contract Verification Failed"
```bash
# Solution: Manually verify
forge verify-contract \
  --chain-id 80002 \
  --watch \
  --constructor-args $(cast abi-encode "constructor(address)" $TYT_TOKEN_ADDRESS) \
  $CONTRACT_ADDRESS \
  src/ContractName.sol:ContractName \
  --etherscan-api-key $POLYGONSCAN_API_KEY
```

#### Issue 3: "Transaction Reverted"
```bash
# Solution: Check transaction details
cast run $TX_HASH --rpc-url $POLYGON_AMOY_RPC_URL --verbose

# Debug with Tenderly
# Upload to: https://dashboard.tenderly.co/
```

#### Issue 4: "Wallet Not Connecting"
```javascript
// Solution: Check network configuration
// Ensure user is on Polygon Amoy (Chain ID: 80002)

if (chainId !== 80002) {
  await switchNetwork({ chainId: 80002 })
}
```

#### Issue 5: "NFT Not Showing in Wallet"
```bash
# Solution: Refresh metadata
# OpenSea Testnet: https://testnets.opensea.io/
# Force refresh on collection page

# Or check token ownership:
cast call $MINER_NFT_ADDRESS \
  "ownerOf(uint256)" \
  1 \
  --rpc-url $POLYGON_AMOY_RPC_URL
```

---

## 🎓 Next Steps After Deployment

### Immediate (Week 1)
1. ✅ Monitor system health 24/7
2. ✅ Fix critical bugs
3. ✅ Gather user feedback
4. ✅ Document issues
5. ✅ Prepare v1.1 improvements

### Short-term (Month 1)
1. ✅ Security audit kickoff
2. ✅ Marketing campaign launch
3. ✅ Hospital partnership outreach
4. ✅ Community building (Discord/Telegram)
5. ✅ Bug bounty program

### Medium-term (Months 2-3)
1. ✅ Mobile app development
2. ✅ Additional features (staking pools, governance UI)
3. ✅ International expansion
4. ✅ Foundation incorporation
5. ✅ Mainnet deployment planning

---

## 📞 Support Contacts

### Development Team
- **Email**: dev@takeyourtoken.com
- **Discord**: discord.gg/tyt-dev
- **GitHub Issues**: github.com/takeyourtoken/issues

### Emergency Contacts
- **Security Issues**: security@takeyourtoken.com
- **Smart Contract Bugs**: contracts@takeyourtoken.com
- **Infrastructure**: ops@takeyourtoken.com

---

## ✅ Final Checklist

### Before You Deploy
- [ ] Read entire deployment guide
- [ ] Fund wallet with test MATIC (minimum 50 MATIC)
- [ ] Install Foundry and dependencies
- [ ] Configure .env file
- [ ] Get PolygonScan API key
- [ ] Backup private key securely
- [ ] Test deployment script (dry run)

### During Deployment
- [ ] Deploy all 10 contracts
- [ ] Verify on PolygonScan
- [ ] Configure fee profiles
- [ ] Set discount tiers
- [ ] Mint test TYT tokens
- [ ] Update frontend config
- [ ] Deploy edge functions
- [ ] Test all user flows

### After Deployment
- [ ] Monitor for 24 hours
- [ ] Document all issues
- [ ] Gather community feedback
- [ ] Plan improvements
- [ ] Prepare audit materials
- [ ] Update documentation
- [ ] Celebrate! 🎉

---

**Deployment Time Estimate**: 2-3 hours
**Difficulty**: Intermediate
**Cost**: ~50 test MATIC (~$0 real value)

**Good luck with your deployment!** 🚀

---

**Document Version**: 1.0
**Last Updated**: December 31, 2025
**Prepared For**: 0xE7ca1b6407aFA6232760E2eD81075a3274515806
**Network**: Polygon Amoy Testnet

*"From Testnet to Saving Lives"* ❤️
