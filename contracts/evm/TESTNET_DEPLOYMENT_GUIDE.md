# 🚀 TYT V3 Testnet Deployment Guide

**Complete step-by-step guide for deploying to Polygon Amoy Testnet**

---

## 📋 Prerequisites

### 1. Install Foundry

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

Verify installation:
```bash
forge --version
cast --version
```

### 2. Get Testnet Wallet & Funds

1. **Create MetaMask wallet** (if you don't have one)
   - Install MetaMask: https://metamask.io
   - Create new wallet
   - **SAVE YOUR SEED PHRASE SECURELY!**

2. **Add Polygon Amoy network to MetaMask:**
   - Network Name: `Polygon Amoy Testnet`
   - RPC URL: `https://rpc-amoy.polygon.technology`
   - Chain ID: `80002`
   - Currency Symbol: `MATIC`
   - Block Explorer: `https://amoy.polygonscan.com`

3. **Get testnet MATIC** (free):
   - Visit: https://faucet.polygon.technology
   - Enter your wallet address
   - Request 0.5 MATIC
   - Wait 1-2 minutes for confirmation

4. **Verify balance:**
   ```bash
   cast balance YOUR_ADDRESS --rpc-url https://rpc-amoy.polygon.technology
   ```

### 3. Get RPC & API Keys

#### Alchemy RPC (Recommended - Free Tier)
1. Visit: https://www.alchemy.com
2. Sign up for free account
3. Create new app:
   - Chain: **Polygon**
   - Network: **Polygon Amoy**
4. Copy your HTTP URL
5. Paste into `.env` as `RPC_URL_AMOY`

#### PolygonScan API Key (For Contract Verification)
1. Visit: https://polygonscan.com/myapikey
2. Sign up/Login
3. Create new API key
4. Copy key
5. Paste into `.env` as `POLYGONSCAN_API_KEY`

---

## 🛠️ Setup

### 1. Clone & Install Dependencies

```bash
cd contracts/evm
forge install
```

This installs:
- OpenZeppelin Contracts
- Forge Standard Library

### 2. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit with your values
nano .env
```

**Required variables:**
```bash
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
ADMIN_ADDRESS=0xYOUR_WALLET_ADDRESS
TYT_TOKEN_ADDRESS=0xTYT_TOKEN_ADDRESS_HERE
RPC_URL_AMOY=https://polygon-amoy.g.alchemy.com/v2/YOUR_KEY
POLYGONSCAN_API_KEY=YOUR_API_KEY_HERE
```

⚠️ **SECURITY WARNING:**
- NEVER commit `.env` to git
- `.env` is already in `.gitignore`
- Keep your private key secret!

### 3. Export Private Key from MetaMask

1. Open MetaMask
2. Click account menu → Account Details
3. Click "Export Private Key"
4. Enter password
5. Copy private key
6. Paste into `.env` (with `0x` prefix)

---

## 🚢 Deployment Steps

### Step 1: Build Contracts

```bash
forge build
```

Expected output:
```
[⠢] Compiling...
[⠆] Compiling 47 files with 0.8.20
[⠰] Solc 0.8.20 finished in 3.21s
Compiler run successful!
```

### Step 2: Run Tests (Optional but Recommended)

```bash
forge test -vv
```

All tests should pass:
```
Running 15 tests for test/FeeConfig.t.sol:FeeConfigTest
[PASS] testCalculateFees() (gas: 89234)
[PASS] testSetFeeProfile() (gas: 123456)
...
Test result: ok. 15 passed; 0 failed; 0 skipped;
```

### Step 3: Check Deployer Balance

```bash
source .env
cast balance $ADMIN_ADDRESS --rpc-url $RPC_URL_AMOY
```

You should have at least **0.5 MATIC** (500000000000000000 wei)

### Step 4: Dry Run Deployment (Simulate)

```bash
forge script script/DeployComplete.s.sol:DeployComplete \
  --rpc-url $RPC_URL_AMOY \
  --sender $ADMIN_ADDRESS \
  -vvvv
```

This simulates deployment WITHOUT spending gas.
Review the output for any errors.

### Step 5: Deploy to Testnet (REAL)

```bash
forge script script/DeployComplete.s.sol:DeployComplete \
  --rpc-url $RPC_URL_AMOY \
  --broadcast \
  --verify \
  --etherscan-api-key $POLYGONSCAN_API_KEY \
  -vvvv
```

**What happens:**
1. Deploys all 9 contracts sequentially
2. Sets up permissions
3. Configures fee profiles
4. Verifies contracts on PolygonScan
5. Saves addresses to `deployments/amoy.json`

**Estimated time:** 3-5 minutes
**Estimated cost:** ~0.03 MATIC ($0.02 USD)

### Step 6: Verify Deployment

Check deployment file:
```bash
cat deployments/amoy.json | jq '.'
```

Example output:
```json
{
  "feeConfig": "0x1234...",
  "charityVault": "0x5678...",
  "academyVault": "0x9abc...",
  "minerNFT": "0xdef0...",
  "marketplace": "0x1234...",
  "rewardsRegistry": "0x5678...",
  "veTYT": "0x9abc...",
  "tytToken": "0xdef0...",
  "deployer": "0x1234..."
}
```

### Step 7: Verify on PolygonScan

Visit PolygonScan to confirm:
```
https://amoy.polygonscan.com/address/YOUR_CONTRACT_ADDRESS
```

You should see:
- ✅ Green checkmark (verified)
- Contract name
- Source code tab
- Read/Write contract tabs

---

## 📝 Manual Verification (If Auto-Verify Fails)

Sometimes auto-verification fails. Verify manually:

```bash
# Get contract addresses from deployments/amoy.json
FEE_CONFIG=$(cat deployments/amoy.json | jq -r '.feeConfig')
MINER_NFT=$(cat deployments/amoy.json | jq -r '.minerNFT')
MARKETPLACE=$(cat deployments/amoy.json | jq -r '.marketplace')
CHARITY_VAULT=$(cat deployments/amoy.json | jq -r '.charityVault')
ACADEMY_VAULT=$(cat deployments/amoy.json | jq -r '.academyVault')
REWARDS_REGISTRY=$(cat deployments/amoy.json | jq -r '.rewardsRegistry')
VETYT=$(cat deployments/amoy.json | jq -r '.veTYT')

# Verify each contract
forge verify-contract \
  --chain-id 80002 \
  --etherscan-api-key $POLYGONSCAN_API_KEY \
  --compiler-version v0.8.20 \
  $FEE_CONFIG \
  src/FeeConfigGovernance.sol:FeeConfigGovernance

# Repeat for each contract...
```

---

## 🧪 Test Deployed Contracts

### 1. Read Contract Data

```bash
# Get MinerNFT name
cast call $MINER_NFT "name()" --rpc-url $RPC_URL_AMOY

# Get total minted
cast call $MINER_NFT "totalMinted()" --rpc-url $RPC_URL_AMOY

# Get fee profile
cast call $FEE_CONFIG "getFeeProfile(bytes32)" \
  $(cast keccak "mint.default") \
  --rpc-url $RPC_URL_AMOY
```

### 2. Mint Test Miner

```bash
# Mint a test miner (free admin mint)
cast send $MINER_NFT \
  "mintFree(address,uint256,uint256,uint256,string)" \
  $ADMIN_ADDRESS \
  1 \
  100000000 \
  50000000 \
  "USA" \
  --rpc-url $RPC_URL_AMOY \
  --private-key $PRIVATE_KEY

# Check balance
cast call $MINER_NFT "balanceOf(address)" $ADMIN_ADDRESS \
  --rpc-url $RPC_URL_AMOY
```

### 3. Test Marketplace Listing

```bash
# Approve marketplace
cast send $MINER_NFT \
  "approve(address,uint256)" \
  $MARKETPLACE \
  0 \
  --rpc-url $RPC_URL_AMOY \
  --private-key $PRIVATE_KEY

# Create listing (tokenId=0, native payment, 0.01 MATIC price)
cast send $MARKETPLACE \
  "createOrder(uint256,address,uint256)" \
  0 \
  0x0000000000000000000000000000000000000000 \
  10000000000000000 \
  --rpc-url $RPC_URL_AMOY \
  --private-key $PRIVATE_KEY

# Get active orders
cast call $MARKETPLACE "getActiveOrders()" \
  --rpc-url $RPC_URL_AMOY
```

---

## 📊 Update Frontend

Add contract addresses to frontend `.env`:

```bash
# Root .env file (not contracts/evm/.env!)
cd ../..
nano .env
```

Add these lines:
```bash
# Polygon Amoy Testnet Contracts
VITE_NETWORK=amoy
VITE_CHAIN_ID=80002
VITE_RPC_URL=https://rpc-amoy.polygon.technology

# Contract Addresses (from deployments/amoy.json)
VITE_CONTRACT_FEE_CONFIG=0x...
VITE_CONTRACT_CHARITY_VAULT=0x...
VITE_CONTRACT_ACADEMY_VAULT=0x...
VITE_CONTRACT_MINER_NFT=0x...
VITE_CONTRACT_MARKETPLACE=0x...
VITE_CONTRACT_REWARDS_MERKLE=0x...
VITE_CONTRACT_VETYT=0x...
VITE_TYT_TOKEN=0x...
```

---

## 🔧 Troubleshooting

### Error: "insufficient funds for gas"
**Solution:** Get more MATIC from faucet

### Error: "nonce too low"
**Solution:**
```bash
cast nonce $ADMIN_ADDRESS --rpc-url $RPC_URL_AMOY
```
Reset MetaMask: Settings → Advanced → Clear Activity Tab Data

### Error: "TYT_TOKEN_ADDRESS must be set"
**Solution:** Deploy or use mock TYT token first

Deploy mock TYT for testing:
```bash
cast send --rpc-url $RPC_URL_AMOY \
  --private-key $PRIVATE_KEY \
  --create $(cat <<EOF
608060405234801561001057600080fd5b50...
EOF
)
```

### Error: "Invalid chainid"
**Solution:** Verify `--chain-id 80002` for Amoy

### Verification fails
**Solution:** Wait 1-2 minutes, then run manual verification command

---

## 📁 Files Created

After successful deployment:

```
contracts/evm/
├── deployments/
│   └── amoy.json          # Contract addresses
├── broadcast/
│   └── DeployComplete.s.sol/
│       └── 80002/
│           ├── run-latest.json
│           └── run-*.json  # Deployment transaction logs
├── out/                    # Compiled contracts
└── cache/                  # Foundry cache
```

---

## ✅ Success Checklist

- [ ] Foundry installed
- [ ] Wallet funded with 0.5+ MATIC
- [ ] `.env` configured
- [ ] Contracts compiled (`forge build`)
- [ ] Tests passing (`forge test`)
- [ ] Deployed to testnet
- [ ] All 7 contracts verified on PolygonScan
- [ ] `deployments/amoy.json` exists
- [ ] Frontend `.env` updated
- [ ] Test mint successful
- [ ] Test marketplace listing successful

---

## 🎉 You're Done!

Your TYT v3 contracts are now live on Polygon Amoy Testnet!

**Next Steps:**
1. Integrate contracts with frontend
2. Test all user flows
3. Invite beta testers
4. Monitor for bugs
5. Prepare for mainnet deployment

**Support:**
- Discord: https://discord.gg/takeyourtoken
- Docs: https://docs.takeyourtoken.app
- GitHub Issues: https://github.com/takeyourtoken/tyt-v3/issues

---

**Deployed by the TYT Team** 🚀
*Building the future of Web3 mining & charity*
