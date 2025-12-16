# TYT v3 Complete Deployment Guide

## New Contracts

This deployment includes two new critical components:

1. **VotingEscrowTYT.sol** - Governance voting power through time-locked TYT
2. **DiscountCurve.sol** - Advanced discount calculation library

## Prerequisites

Before deploying, ensure you have:

### 1. Environment Variables

Create a `.env` file in `contracts/evm/`:

```bash
# Deployment
PRIVATE_KEY=your_private_key_here
ADMIN_ADDRESS=0x... # Optional, defaults to deployer
PROTOCOL_TREASURY=0x... # Optional, defaults to deployer

# TYT Token (REQUIRED)
TYT_TOKEN_ADDRESS=0x... # TYT token on target chain

# RPC URLs
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology
POLYGON_MAINNET_RPC=https://polygon-rpc.com

# Block Explorers (for verification)
POLYGONSCAN_API_KEY=your_api_key_here
```

### 2. TYT Token Setup

The VotingEscrowTYT contract requires a TYT token address. Options:

**Option A: Testnet** (Recommended for first deployment)
Deploy a mock ERC20 token for testing:

```solidity
// MockTYT.sol
contract MockTYT is ERC20 {
    constructor() ERC20("Test TYT", "TYT") {
        _mint(msg.sender, 1000000 * 10**18); // 1M tokens
    }
}
```

**Option B: Bridged Token** (Production)
Bridge TYT from Solana to Polygon using Wormhole or similar.

**Option C: Wrapped Token** (Production)
Create a wrapped TYT on Polygon with minting authority.

## Deployment Steps

### Step 1: Install Dependencies

```bash
cd contracts/evm
forge install
```

### Step 2: Compile Contracts

```bash
forge build
```

Expected output:
```
[⠊] Compiling...
[⠒] Compiling 8 files with 0.8.20
[⠢] Solc 0.8.20 finished in XXXms
Compiler run successful!
```

### Step 3: Run Tests (Optional but Recommended)

```bash
forge test -vvv
```

### Step 4: Deploy to Testnet (Polygon Amoy)

```bash
forge script script/DeployComplete.s.sol:DeployComplete \
  --rpc-url $POLYGON_AMOY_RPC \
  --private-key $PRIVATE_KEY \
  --broadcast \
  -vvvv
```

### Step 5: Verify Contracts

```bash
# After deployment, verify each contract
forge verify-contract \
  --chain-id 80002 \
  --num-of-optimizations 200 \
  --watch \
  --constructor-args $(cast abi-encode "constructor(address)" $TYT_TOKEN_ADDRESS) \
  --etherscan-api-key $POLYGONSCAN_API_KEY \
  --compiler-version v0.8.20 \
  $DEPLOYED_VETYT_ADDRESS \
  src/VotingEscrowTYT.sol:VotingEscrowTYT
```

## Contract Addresses

After deployment, save the addresses from `deployments/amoy.json`:

```json
{
  "feeConfig": "0x...",
  "charityVault": "0x...",
  "academyVault": "0x...",
  "minerNFT": "0x...",
  "marketplace": "0x...",
  "rewardsRegistry": "0x...",
  "veTYT": "0x...",
  "tytToken": "0x...",
  "deployer": "0x..."
}
```

## Update Frontend Environment

Copy these addresses to your frontend `.env`:

```bash
# In project root .env
VITE_CONTRACT_FEE_CONFIG=0x...
VITE_CONTRACT_CHARITY_VAULT=0x...
VITE_CONTRACT_ACADEMY_VAULT=0x...
VITE_CONTRACT_MINER_NFT=0x...
VITE_CONTRACT_MARKETPLACE=0x...
VITE_CONTRACT_REWARDS_MERKLE=0x...
VITE_CONTRACT_VETYT=0x... # NEW
VITE_TYT_TOKEN_ADDRESS=0x... # NEW
```

## Testing Deployment

### 1. Test VotingEscrowTYT

```bash
# Using cast (Foundry)
cast call $VETYT_ADDRESS "tytToken()" --rpc-url $POLYGON_AMOY_RPC
cast call $VETYT_ADDRESS "MIN_LOCK_DURATION()" --rpc-url $POLYGON_AMOY_RPC
cast call $VETYT_ADDRESS "MAX_LOCK_DURATION()" --rpc-url $POLYGON_AMOY_RPC
```

Expected:
- `tytToken()` returns your TYT token address
- `MIN_LOCK_DURATION()` returns 604800 (1 week in seconds)
- `MAX_LOCK_DURATION()` returns 126144000 (4 years in seconds)

### 2. Test Creating a Lock

```bash
# Approve TYT first
cast send $TYT_TOKEN_ADDRESS \
  "approve(address,uint256)" \
  $VETYT_ADDRESS \
  1000000000000000000 \
  --rpc-url $POLYGON_AMOY_RPC \
  --private-key $PRIVATE_KEY

# Create lock (1000 TYT for 1 year)
cast send $VETYT_ADDRESS \
  "createLock(uint256,uint256)" \
  1000000000000000000 \
  31536000 \
  --rpc-url $POLYGON_AMOY_RPC \
  --private-key $PRIVATE_KEY
```

### 3. Test DiscountCurve Library

The DiscountCurve library is called by other contracts. Test via MinerNFT or Marketplace.

## Integration with Existing System

### 1. Maintenance Discount Integration

Update your maintenance calculation to use DiscountCurve:

```typescript
// In maintenance-engine Edge Function
import { discountCurveABI, DISCOUNT_CONSTANTS } from '@/lib/contracts/abis';

const discountParams = {
  vipLevel: user.vip_level,
  prepayDays: user.prepaid_days,
  veTytPower: await getVeTytPower(user.address),
  totalVeTytPower: await getTotalVeTytPower(),
  serviceButtonUsed: user.service_button_active
};

const discount = await contract.computeDiscount(discountParams);
```

### 2. Governance Integration

Create governance proposals that read veTYT:

```typescript
// Check if user can create proposal
const votingPower = await veTYTContract.getVotingPower(userAddress);
const minVotingPower = 1000n * 10n**18n; // 1000 veTYT minimum

if (votingPower >= minVotingPower) {
  // Allow proposal creation
}
```

## Deployment Checklist

- [ ] Deploy TYT token (or use existing)
- [ ] Deploy CharityVault
- [ ] Deploy AcademyVault
- [ ] Deploy FeeConfigGovernance
- [ ] Deploy MinerNFT
- [ ] Deploy MinerMarketplace
- [ ] Deploy RewardsMerkleRegistry
- [ ] Deploy VotingEscrowTYT
- [ ] Verify all contracts on explorer
- [ ] Test createLock on veTYT
- [ ] Update frontend .env
- [ ] Test frontend connection
- [ ] Grant Oracle role for RewardsMerkleRegistry
- [ ] Configure governance timelock (optional)
- [ ] Document all addresses

## Mainnet Deployment

When ready for mainnet:

1. **Double-check all addresses**
2. **Use hardware wallet for deployment**
3. **Set proper admin multisig**
4. **Configure timelock for governance**
5. **Audit smart contracts** (if not done)
6. **Deploy to Polygon mainnet**
7. **Verify all contracts**
8. **Transfer admin roles to multisig**
9. **Renounce deployer privileges**

## Troubleshooting

### Issue: "TYT_TOKEN_ADDRESS must be set"

**Solution**: Set `TYT_TOKEN_ADDRESS` in your `.env` file.

### Issue: "Insufficient funds for gas"

**Solution**: Get testnet MATIC from [Polygon Faucet](https://faucet.polygon.technology/).

### Issue: "Contract verification failed"

**Solution**: Make sure compiler version and optimization settings match:
```bash
forge verify-contract --compiler-version v0.8.20 --num-of-optimizations 200 ...
```

### Issue: "Lock creation fails"

**Solution**:
1. Ensure TYT approval is sufficient
2. Check lock duration is between MIN and MAX
3. Verify TYT balance is sufficient

## Support

For issues or questions:
- GitHub Issues: [github.com/tyt/contracts](https://github.com/tyt/contracts)
- Discord: [discord.gg/tyt](https://discord.gg/tyt)
- Docs: [docs.takeyourtoken.app](https://docs.takeyourtoken.app)

---

**Last Updated**: December 2024
**Network**: Polygon Amoy (Testnet), Polygon (Mainnet)
**Solidity Version**: 0.8.20
