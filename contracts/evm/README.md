# 🏗️ TYT V2 SMART CONTRACTS

TYT Ecosystem V2 smart contracts with 60/30/10 fee distribution system.

---

## 📦 WHAT'S INCLUDED

### Smart Contracts
- **FeeConfigGovernance.sol** (602 lines) - Governance with 2-day timelock
- **AcademyVault.sol** (287 lines) - 10% fee recipient for education
- **CharityVault.sol** - 30% fee recipient for brain cancer research
- **MinerNFT.sol** - ERC-721 miners with fee integration
- **MinerMarketplace.sol** - Marketplace with automatic fee splits
- **RewardsMerkleRegistry.sol** - Merkle-based reward proofs

### Deployment Scripts
- **DeployV3WithFeeConfig.s.sol** (209 lines) - Complete deployment
- **DeployV3Core.s.sol** - Legacy deployment

### Helper Scripts
- **deploy.sh** - Quick deployment script
- **verify-contracts.sh** - Contract verification script

### Configuration
- **.env.example** - Environment template
- **foundry.toml** - Foundry configuration

---

## 🚀 QUICK START

### 1. Install Foundry

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### 2. Install Dependencies

```bash
forge install
```

### 3. Build Contracts

```bash
forge build
```

### 4. Run Tests

```bash
forge test
```

### 5. Deploy to Testnet

```bash
# Configure environment
cp .env.example .env
nano .env  # Add your keys

# Deploy
./deploy.sh amoy
```

---

## 📝 DEPLOYMENT GUIDE

### Prerequisites

1. **Get Testnet MATIC**
   - Visit: https://faucet.polygon.technology/
   - Request 0.5 MATIC for deployment

2. **Get Alchemy API Key**
   - Sign up: https://www.alchemy.com/
   - Create app: Polygon Amoy
   - Copy RPC URL

3. **Get PolygonScan API Key**
   - Sign up: https://polygonscan.com/
   - API Keys → Create new

### Configuration

Edit `.env`:

```bash
# Required
PRIVATE_KEY=0x...
AMOY_RPC_URL=https://polygon-amoy.g.alchemy.com/v2/YOUR_KEY
POLYGONSCAN_API_KEY=YOUR_KEY

# Contract Config
PROTOCOL_TREASURY=0x...
CHARITY_VAULT=0x...
ACADEMY_VAULT=0x...
ADMIN_ADDRESS=0x...

# Fee Config (basis points)
MINT_FEE_BPS=150          # 1.5%
MARKETPLACE_FEE_BPS=250   # 2.5%
WITHDRAWAL_FEE_BPS=50     # 0.5%
MAINTENANCE_FEE_BPS=100   # 1.0%
DEPOSIT_FEE_BPS=100       # 1.0%
```

### Deploy

```bash
# Quick deploy with script
./deploy.sh amoy

# Manual deploy with Foundry
forge script script/DeployV3WithFeeConfig.s.sol:DeployV3WithFeeConfig \
  --rpc-url $AMOY_RPC_URL \
  --broadcast \
  --verify \
  -vvvv
```

### Verify Contracts

```bash
# Verify all contracts
./verify-contracts.sh amoy

# Manual verification
forge verify-contract $CONTRACT_ADDRESS $CONTRACT_NAME \
  --chain-id 80002 \
  --etherscan-api-key $POLYGONSCAN_API_KEY
```

---

## 🏗️ ARCHITECTURE

### Fee Distribution Flow

```
User Transaction
     ↓
FeeConfigGovernance (calculates split)
     ↓
├─→ 60% → Protocol Treasury
├─→ 30% → Charity Vault → Brain Cancer Research
└─→ 10% → Academy Vault → Student Rewards
```

### Contract Relationships

```
FeeConfigGovernance (Owner)
     ↓
├─→ MinerNFT (calls on mint)
│        ↓
│   MinerMarketplace (calls on sale)
│
├─→ CharityVault (receives 30%)
│        ↓
│   withdraw() → Foundation wallet
│
└─→ AcademyVault (receives 10%)
         ↓
    rewardStudent() → Student wallets
```

---

## 🧪 TESTING

### Run All Tests

```bash
forge test
```

### Run Specific Test

```bash
forge test --match-test testMintWithFeeDistribution
```

### Gas Report

```bash
forge test --gas-report
```

### Coverage

```bash
forge coverage
```

### Verbose Output

```bash
forge test -vvvv
```

---

## 📊 CONTRACT DETAILS

### FeeConfigGovernance

**Purpose:** Manage fee configuration with governance

**Key Features:**
- 60/30/10 split (Protocol/Charity/Academy)
- 2-day timelock for changes
- 5 fee profiles (mint, marketplace, withdrawal, maintenance, deposit)
- Emergency instant updates
- Proposal system

**Key Functions:**
```solidity
function proposeUpdate(uint8 profile, uint16 fee, uint16 proto, uint16 charity, uint16 academy)
function executeProposal(uint256 proposalId)
function emergencySetFees(uint8 profile, ...)  // Instant
function calculateFee(uint256 amount, uint8 profile) returns (uint256, uint256, uint256, uint256)
```

### MinerNFT

**Purpose:** ERC-721 NFT miners with automatic fee distribution

**Key Features:**
- Power (TH/s) and efficiency (W/TH) metadata
- Region-based miners (USA, EU, Asia, Canada)
- Automatic fee collection on mint
- Upgrade system

**Key Functions:**
```solidity
function mint(address to, uint256 power, uint256 efficiency, uint8 region) payable
function mintFree(address to, uint256 power, uint256 efficiency, uint8 region)  // Admin
function upgradePower(uint256 tokenId, uint256 additionalPower) payable
function upgradeEfficiency(uint256 tokenId, uint256 newEfficiency) payable
```

### MinerMarketplace

**Purpose:** Peer-to-peer NFT marketplace with fee splits

**Key Features:**
- List miners for sale
- Native MATIC or ERC20 payment
- Automatic 60/30/10 fee distribution
- Offer system

**Key Functions:**
```solidity
function listMiner(uint256 tokenId, uint256 price, address paymentToken)
function buyMiner(uint256 tokenId) payable
function delistMiner(uint256 tokenId)
function makeOffer(uint256 tokenId, uint256 offerPrice, address paymentToken) payable
```

### CharityVault

**Purpose:** Receive and manage 30% of fees for foundation

**Key Features:**
- Receives 30% automatically
- Withdrawal to foundation wallet
- Transparent tracking

**Key Functions:**
```solidity
function withdraw(uint256 amount)
function getBalance() view returns (uint256)
```

### AcademyVault

**Purpose:** Receive and manage 10% of fees for education

**Key Features:**
- Receives 10% automatically
- Reward students
- Budget management
- Educator roles

**Key Functions:**
```solidity
function rewardStudent(address student, uint256 amount)
function setBudget(uint256 newBudget)
function addEducator(address educator)
function getBalance() view returns (uint256)
```

---

## 🔧 CONFIGURATION

### Fee Profiles

```solidity
enum FeeProfile {
    MINT,           // 0: NFT minting (1.5%)
    MARKETPLACE,    // 1: Marketplace sales (2.5%)
    WITHDRAWAL,     // 2: User withdrawals (0.5%)
    MAINTENANCE,    // 3: Miner maintenance (1%)
    DEPOSIT         // 4: User deposits (1%)
}
```

### Fee Basis Points

100 basis points = 1%

```
150 bps = 1.5%
250 bps = 2.5%
50 bps = 0.5%
100 bps = 1%
```

### Split Percentages

Must sum to 100% (10,000 basis points):

```
Protocol: 6000 bps (60%)
Charity:  3000 bps (30%)
Academy:  1000 bps (10%)
```

---

## 🔒 SECURITY

### Access Control

- **Owner:** Can propose fee updates, manage system
- **Admin:** Can emergency update fees (with caution)
- **Educator:** Can reward students (AcademyVault)

### Timelock

- **Standard updates:** 2-day delay
- **Emergency updates:** Instant (use carefully)

### Reentrancy Protection

All payment functions use OpenZeppelin's `ReentrancyGuard`

### Integer Safety

All contracts use Solidity 0.8+ with automatic overflow checks

---

## 📞 SUPPORT

### Documentation

- **Full Guide:** `DEPLOYMENT_GUIDE.md`
- **Checklist:** `PRE_DEPLOYMENT_CHECKLIST.md`
- **Fee System:** `../FEE_SYSTEM_INTEGRATION_GUIDE.md`

### Resources

- **Foundry Book:** https://book.getfoundry.sh/
- **Polygon Docs:** https://docs.polygon.technology/
- **OpenZeppelin:** https://docs.openzeppelin.com/

### Commands Reference

```bash
# Build
forge build

# Test
forge test

# Deploy
./deploy.sh amoy

# Verify
./verify-contracts.sh amoy

# Interact
cast call $ADDRESS "function()" --rpc-url $RPC
cast send $ADDRESS "function()" --rpc-url $RPC --private-key $KEY
```

---

## 🎯 DEPLOYMENT CHECKLIST

Before deploying:

- [ ] All tests pass
- [ ] `.env` configured
- [ ] Sufficient MATIC balance
- [ ] Fee percentages reviewed
- [ ] Wallet addresses verified
- [ ] Timelock duration set
- [ ] Network confirmed

After deploying:

- [ ] All contracts verified
- [ ] Addresses saved
- [ ] Frontend updated
- [ ] Test transactions executed
- [ ] Fee distribution confirmed

---

## 📄 LICENSE

MIT License - See LICENSE file for details

---

## 🚀 READY TO DEPLOY!

```bash
# 1. Configure
cp .env.example .env
nano .env

# 2. Test
forge test

# 3. Deploy
./deploy.sh amoy

# 4. Verify
./verify-contracts.sh amoy

# 5. Celebrate! 🎉
```

**TYT Ecosystem V2** - Building the future of Mining-to-Medicine! 🌟
