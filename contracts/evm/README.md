# TYT v3 EVM Contracts

Solidity smart contracts for TYT v3 on Polygon (EVM).

## Contracts

| Contract | Purpose |
|----------|---------|
| `FeeConfig.sol` | Fee profile management (10% deposit = 6/3/1 split) |
| `CharityVault.sol` | Donation tracking and treasury management |
| `MinerNFT.sol` | ERC-721 miner ownership with upgrades |
| `RewardsMerkleRegistry.sol` | Immutable daily reward merkle roots |
| `MinerMarketplace.sol` | NFT marketplace with fee distribution |

## V3 Canonical Fee Model

```
deposit_fee_total_bps = 1000 (10%)
split inside fee_total:
  - protocol: 60% = 6% of deposit
  - charity:  30% = 3% of deposit
  - academy:  10% = 1% of deposit
```

## Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Node.js 18+ (for scripts)

## Setup

```bash
cd contracts/evm

# Install dependencies
forge install OpenZeppelin/openzeppelin-contracts
forge install foundry-rs/forge-std

# Build
forge build

# Test
forge test -vvv
```

## Environment Variables

Create `.env` file:

```env
PRIVATE_KEY=0x...
RPC_URL_AMOY=https://rpc-amoy.polygon.technology
RPC_URL_POLYGON=https://polygon-rpc.com

ADMIN_ADDRESS=0x...
TREASURY_MULTISIG=0x...
PROTOCOL_TREASURY=0x...
CHARITY_TREASURY=0x...
ACADEMY_TREASURY=0x...
FEE_SETTER_ADMIN=0x...
REWARDS_PUBLISHER=0x...

POLYGONSCAN_API_KEY=...
```

## Deploy

### Amoy Testnet

```bash
source .env
forge script script/DeployV3Core.s.sol:DeployV3Core \
  --rpc-url $RPC_URL_AMOY \
  --broadcast \
  --verify
```

### Polygon Mainnet (CAUTION)

```bash
source .env
forge script script/DeployV3Core.s.sol:DeployV3Core \
  --rpc-url $RPC_URL_POLYGON \
  --broadcast \
  --verify
```

## Deploy Order

1. `FeeConfig` - Core fee management
2. `CharityVault` - Treasury (set multisig)
3. `MinerNFT` - NFT contract
4. `RewardsMerkleRegistry` - Rewards proofs
5. `MinerMarketplace` - Wire FeeConfig + MinerNFT

## Testing

```bash
# All tests
forge test

# Verbose
forge test -vvv

# Specific test
forge test --match-test testCalculateFeeV3Canonical -vvv

# Gas report
forge test --gas-report

# Coverage
forge coverage
```

## Contract Interactions

### Set Fee Profile

```solidity
bytes32 key = keccak256("deposit.default");
address[] memory recipients = [protocol, charity, academy];
uint256[] memory splits = [6000, 3000, 1000]; // 60/30/10
feeConfig.setFeeProfile(key, 1000, recipients, splits);
```

### Calculate Fee

```solidity
(uint256 feeTotal, address[] memory recipients, uint256[] memory amounts) =
    feeConfig.calculateFee(key, depositAmount);
// For 1000 USDT deposit:
// feeTotal = 100 USDT
// amounts = [60, 30, 10] USDT
```

### Publish Rewards Root

```solidity
uint32 dateKey = 20241212; // YYYYMMDD
bytes32 root = 0x...; // Merkle root
rewardsRegistry.publishRoot(dateKey, root, "ipfs://...");
```

### Verify Reward

```solidity
bool valid = rewardsRegistry.verifyReward(
    dateKey,
    userAddress,
    rewardAmount,
    keccak256("BTC"),
    merkleProof
);
```

## Security

- All contracts use OpenZeppelin's battle-tested implementations
- Role-based access control (RBAC)
- ReentrancyGuard on value transfers
- Immutable merkle roots (no overwrites)
- Fee profiles validated on-chain

## Deployed Addresses

See `deployments/amoy.json` and `deployments/polygon.json` after deployment.
