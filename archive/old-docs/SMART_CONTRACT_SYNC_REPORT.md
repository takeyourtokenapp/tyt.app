# Smart Contract Address Synchronization Report

**Generated:** 2025-12-14
**Project:** TYT Platform (Web3 Mining Platform)
**Network:** Polygon Amoy (Chain ID: 80002)

---

## Executive Summary

This report analyzes the synchronization of smart contract addresses across four key files in the project. The analysis identifies **critical inconsistencies** in naming conventions, **missing contract references**, and **deployment status issues** that could prevent proper contract interaction.

**Status:** CRITICAL SYNCHRONIZATION ISSUES FOUND
- 3 out of 6 contracts have naming inconsistencies
- 1 contract (AcademyVault) is completely missing from one file
- All contracts are currently deployed as placeholders (0x0000...0000)
- Dual naming convention creates confusion

---

## Contract-by-Contract Analysis

### 1. FEE CONFIG

#### Environment Variable (.env)
```
VITE_CONTRACT_FEE_CONFIG=0x0000000000000000000000000000000000000000
VITE_FEE_CONFIG_ADDRESS=0x0000000000000000000000000000000000000000 (legacy)
```

#### Deployment Registry (contracts/evm/deployments/amoy.json)
```json
"FeeConfig": {
  "address": null,
  "deployTx": null
}
```

#### Web3 Config (src/lib/web3/config.ts)
```typescript
feeConfig: import.meta.env.VITE_CONTRACT_FEE_CONFIG || '0x0000000000000000000000000000000000000000'
```

#### Admin Contracts (src/pages/app/AdminContracts.tsx)
```typescript
name: 'Fee Config',
address: import.meta.env.VITE_FEE_CONFIG_ADDRESS || '0x0000000000000000000000000000000000000000'
```

**Inconsistencies Found:**
- **NAMING MISMATCH**: Uses both `VITE_CONTRACT_FEE_CONFIG` and `VITE_FEE_CONFIG_ADDRESS`
- `config.ts` uses `VITE_CONTRACT_FEE_CONFIG` (newer naming)
- `AdminContracts.tsx` uses `VITE_FEE_CONFIG_ADDRESS` (legacy naming)
- **STATUS**: Placeholder address only (not deployed)
- **JSON REFERENCE**: Listed as "FeeConfig" in amoy.json

**Variable Synchronization:**
| File | Variable Name | Value |
|------|--------------|-------|
| .env | VITE_CONTRACT_FEE_CONFIG | 0x0000... |
| .env | VITE_FEE_CONFIG_ADDRESS | 0x0000... |
| config.ts | feeConfig | uses VITE_CONTRACT_FEE_CONFIG |
| AdminContracts.tsx | - | uses VITE_FEE_CONFIG_ADDRESS |
| amoy.json | FeeConfig | null |

---

### 2. CHARITY VAULT

#### Environment Variable (.env)
```
VITE_CONTRACT_CHARITY_VAULT=0x0000000000000000000000000000000000000000
VITE_CHARITY_VAULT_ADDRESS=0x0000000000000000000000000000000000000000 (legacy)
```

#### Deployment Registry (contracts/evm/deployments/amoy.json)
```json
"CharityVault": {
  "address": null,
  "deployTx": null
}
```

#### Web3 Config (src/lib/web3/config.ts)
```typescript
charityVault: import.meta.env.VITE_CONTRACT_CHARITY_VAULT || '0x0000000000000000000000000000000000000000'
```

#### Admin Contracts (src/pages/app/AdminContracts.tsx)
```typescript
name: 'Charity Vault',
address: import.meta.env.VITE_CHARITY_VAULT_ADDRESS || '0x0000000000000000000000000000000000000000'
```

**Used By:**
- `src/hooks/web3/useCharityVault.ts` - Uses `contractAddresses.charityVault` from config.ts
- `src/lib/web3/Web3Provider.tsx` - Imports from config.ts

**Inconsistencies Found:**
- **NAMING MISMATCH**: Same dual naming issue as FeeConfig
- `config.ts` uses `VITE_CONTRACT_CHARITY_VAULT` (newer)
- `AdminContracts.tsx` uses `VITE_CHARITY_VAULT_ADDRESS` (legacy)
- **STATUS**: Placeholder address only (not deployed)
- **JSON REFERENCE**: Listed as "CharityVault" in amoy.json

---

### 3. ACADEMY VAULT

#### Environment Variable (.env)
```
VITE_CONTRACT_ACADEMY_VAULT=0x0000000000000000000000000000000000000000
(No legacy alias defined)
```

#### Deployment Registry (contracts/evm/deployments/amoy.json)
```
MISSING - Not listed in contracts section at all
```

#### Web3 Config (src/lib/web3/config.ts)
```
MISSING - Not defined in contractAddresses object
```

#### Admin Contracts (src/pages/app/AdminContracts.tsx)
```
MISSING - Not displayed in contract list
```

**Critical Issues Found:**
- **NOT IMPLEMENTED** in config.ts
- **NOT DEPLOYED** in amoy.json
- **NOT VISIBLE** in AdminContracts.tsx
- **ENV VARIABLE EXISTS** but unused: `VITE_CONTRACT_ACADEMY_VAULT`
- Potential feature planned but incomplete

**Used By:**
- No web3 hooks currently use this contract
- Created in 60/30/10 fee split documentation but not implemented

---

### 4. MINER NFT

#### Environment Variable (.env)
```
VITE_CONTRACT_MINER_NFT=0x0000000000000000000000000000000000000000
VITE_MINER_NFT_ADDRESS=0x0000000000000000000000000000000000000000 (legacy)
```

#### Deployment Registry (contracts/evm/deployments/amoy.json)
```json
"MinerNFT": {
  "address": null,
  "deployTx": null
}
```

#### Web3 Config (src/lib/web3/config.ts)
```typescript
minerNFT: import.meta.env.VITE_CONTRACT_MINER_NFT || '0x0000000000000000000000000000000000000000'
```

#### Admin Contracts (src/pages/app/AdminContracts.tsx)
```typescript
name: 'Miner NFT',
address: import.meta.env.VITE_MINER_NFT_ADDRESS || '0x0000000000000000000000000000000000000000'
```

**Used By:**
- `src/hooks/web3/useMinerNFT.ts` - Uses `contractAddresses.minerNFT` from config.ts
- `src/components/MinerMintModal.tsx` - References `VITE_MINER_NFT_ADDRESS`

**Inconsistencies Found:**
- **NAMING MISMATCH**: Dual naming convention
- `config.ts` uses `VITE_CONTRACT_MINER_NFT` (newer)
- `AdminContracts.tsx` uses `VITE_MINER_NFT_ADDRESS` (legacy)
- **STATUS**: Placeholder address only (not deployed)
- **JSON REFERENCE**: Listed as "MinerNFT" in amoy.json

---

### 5. MARKETPLACE

#### Environment Variable (.env)
```
VITE_CONTRACT_MARKETPLACE=0x0000000000000000000000000000000000000000
VITE_MARKETPLACE_ADDRESS=0x0000000000000000000000000000000000000000 (legacy)
```

#### Deployment Registry (contracts/evm/deployments/amoy.json)
```json
"MinerMarketplace": {
  "address": null,
  "deployTx": null
}
```

#### Web3 Config (src/lib/web3/config.ts)
```typescript
marketplace: import.meta.env.VITE_CONTRACT_MARKETPLACE || '0x0000000000000000000000000000000000000000'
```

#### Admin Contracts (src/pages/app/AdminContracts.tsx)
```typescript
name: 'Marketplace',
address: import.meta.env.VITE_MARKETPLACE_ADDRESS || '0x0000000000000000000000000000000000000000'
```

**Used By:**
- `src/hooks/web3/useMarketplace.ts` - Uses `contractAddresses.marketplace` from config.ts

**Inconsistencies Found:**
- **NAMING MISMATCH**: Dual naming convention (same pattern)
- `config.ts` uses `VITE_CONTRACT_MARKETPLACE` (newer)
- `AdminContracts.tsx` uses `VITE_MARKETPLACE_ADDRESS` (legacy)
- **JSON NAME MISMATCH**: JSON uses "MinerMarketplace" but env uses "MARKETPLACE"
- **STATUS**: Placeholder address only (not deployed)

---

### 6. REWARDS MERKLE / REWARDS REGISTRY

#### Environment Variable (.env)
```
VITE_CONTRACT_REWARDS_MERKLE=0x0000000000000000000000000000000000000000
VITE_REWARDS_REGISTRY_ADDRESS=0x0000000000000000000000000000000000000000 (legacy)
```

#### Deployment Registry (contracts/evm/deployments/amoy.json)
```json
"RewardsMerkleRegistry": {
  "address": null,
  "deployTx": null
}
```

#### Web3 Config (src/lib/web3/config.ts)
```typescript
rewardsMerkle: import.meta.env.VITE_CONTRACT_REWARDS_MERKLE || '0x0000000000000000000000000000000000000000'
```

#### Admin Contracts (src/pages/app/AdminContracts.tsx)
```typescript
name: 'Rewards Registry',
address: import.meta.env.VITE_REWARDS_REGISTRY_ADDRESS || '0x0000000000000000000000000000000000000000'
```

**Critical Inconsistencies Found:**
- **TRIPLE NAMING ISSUE**: Most severe naming mismatch
  - ENV uses: `VITE_CONTRACT_REWARDS_MERKLE`
  - ENV legacy uses: `VITE_REWARDS_REGISTRY_ADDRESS`
  - JSON uses: `RewardsMerkleRegistry`
  - config.ts property: `rewardsMerkle`
  - AdminContracts display: `Rewards Registry`
- **STATUS**: Placeholder address only (not deployed)

**Used By:**
- No current web3 hooks (not implemented yet)

---

## Summary Table

| Contract | ENV (New) | ENV (Legacy) | config.ts Property | amoy.json Name | AdminContracts | Status | Used By |
|----------|-----------|-------------|-------------------|----------------|---|--------|---------|
| FeeConfig | VITE_CONTRACT_FEE_CONFIG | VITE_FEE_CONFIG_ADDRESS | feeConfig | FeeConfig | Fee Config | Placeholder | None |
| CharityVault | VITE_CONTRACT_CHARITY_VAULT | VITE_CHARITY_VAULT_ADDRESS | charityVault | CharityVault | Charity Vault | Placeholder | useCharityVault.ts |
| AcademyVault | VITE_CONTRACT_ACADEMY_VAULT | - | **MISSING** | **MISSING** | **MISSING** | Not Implemented | None |
| MinerNFT | VITE_CONTRACT_MINER_NFT | VITE_MINER_NFT_ADDRESS | minerNFT | MinerNFT | Miner NFT | Placeholder | useMinerNFT.ts |
| Marketplace | VITE_CONTRACT_MARKETPLACE | VITE_MARKETPLACE_ADDRESS | marketplace | **MinerMarketplace** | Marketplace | Placeholder | useMarketplace.ts |
| RewardsMerkle | VITE_CONTRACT_REWARDS_MERKLE | VITE_REWARDS_REGISTRY_ADDRESS | rewardsMerkle | RewardsMerkleRegistry | Rewards Registry | Placeholder | None |

---

## Detailed Inconsistencies Found

### 1. Dual Naming Convention Issue (Affects 5 contracts)
**Severity:** HIGH

All contracts except AcademyVault have dual naming:
- Modern naming: `VITE_CONTRACT_[NAME]` in config.ts
- Legacy naming: `VITE_[NAME]_ADDRESS` in AdminContracts.tsx

**Root Cause:** Migration from old naming to new naming incomplete

**Files with Discrepancy:**
- `/tmp/cc-agent/61475162/project/src/pages/app/AdminContracts.tsx` (lines 78-102)
- `/tmp/cc-agent/61475162/project/.env` (lines 23-35)
- `/tmp/cc-agent/61475162/project/src/lib/web3/config.ts` (lines 26-31)

### 2. Missing AcademyVault Implementation
**Severity:** CRITICAL

**Current State:**
- ENV variable exists: `VITE_CONTRACT_ACADEMY_VAULT`
- No property in `contractAddresses` object
- No entry in `amoy.json`
- Not displayed in AdminContracts UI
- No web3 hook created

**Impact:** If deployed, AcademyVault cannot be accessed by the application

### 3. Marketplace JSON Name Mismatch
**Severity:** MEDIUM

- ENV uses: `MARKETPLACE`
- JSON uses: `MinerMarketplace`

Inconsistency in naming could cause confusion during deployment.

### 4. Rewards Contract Naming Confusion
**Severity:** HIGH

Three different names used:
- `REWARDS_MERKLE` in config.ts
- `REWARDS_REGISTRY` in AdminContracts and legacy env
- `RewardsMerkleRegistry` in JSON

This triple naming is confusing and error-prone.

### 5. All Contracts Use Placeholder Addresses
**Severity:** CRITICAL

Every contract is configured with `0x0000000000000000000000000000000000000000` (null address)

**Impact:**
- Application cannot interact with any contracts
- `isContractsConfigured` flag will be FALSE
- All contract calls will fail or be skipped

---

## Configuration Dependency Chain

```
.env (VITE_CONTRACT_*)
  ↓
src/lib/web3/config.ts (contractAddresses object)
  ↓
├─ src/hooks/web3/useMinerNFT.ts
├─ src/hooks/web3/useCharityVault.ts
├─ src/hooks/web3/useMarketplace.ts
└─ src/hooks/web3/useRewards.ts (if exists)

.env (VITE_*_ADDRESS legacy)
  ↓
src/pages/app/AdminContracts.tsx
  ↓
Admin UI for contract management

contracts/evm/deployments/amoy.json
  ↓
Deployment registry (NOT synced with env)
```

---

## Missing/Not Implemented Features

1. **AcademyVault Hooks**: No `useAcademyVault.ts` hook
2. **RewardsMerkle Hooks**: No `useRewardsMerkle.ts` hook
3. **Contract ABIs**: Need to verify if all ABIs are imported in hooks
4. **Deployment Sync**: amoy.json contains no actual deployment addresses

---

## Recommendations

### IMMEDIATE ACTIONS (Priority 1)

1. **Standardize Environment Variable Naming**
   - Remove all legacy `VITE_*_ADDRESS` variables
   - Use only `VITE_CONTRACT_*` naming convention
   - Update AdminContracts.tsx to use config.ts instead of env directly

   **Files to Update:**
   - `/tmp/cc-agent/61475162/project/.env` - Remove lines 31-35 (legacy aliases)
   - `/tmp/cc-agent/61475162/project/src/pages/app/AdminContracts.tsx` - Use config.ts imports

2. **Implement Missing AcademyVault**
   - Add to `contractAddresses` in config.ts:
     ```typescript
     academyVault: import.meta.env.VITE_CONTRACT_ACADEMY_VAULT || '0x0000000000000000000000000000000000000000' as `0x${string}`
     ```
   - Create `/tmp/cc-agent/61475162/project/src/hooks/web3/useAcademyVault.ts`
   - Update AdminContracts.tsx to include AcademyVault in contract list
   - Update amoy.json to include AcademyVault

3. **Standardize JSON Naming**
   - Rename "MinerMarketplace" to "Marketplace" in amoy.json
   - Rename "RewardsMerkleRegistry" to "RewardsMerkle" for consistency

### SECONDARY ACTIONS (Priority 2)

4. **Create Configuration Validation Function**
   ```typescript
   // In src/lib/web3/config.ts
   export const validateContractAddresses = () => {
     const missing = Object.entries(contractAddresses)
       .filter(([_, addr]) => addr === '0x0000000000000000000000000000000000000000')
       .map(([name, _]) => name);

     if (missing.length > 0) {
       console.warn('Missing contract deployments:', missing);
     }
     return missing.length === 0;
   };
   ```

5. **Create Deployment Sync Script**
   - Script to automatically update .env from amoy.json after deployment
   - Add to deployment workflow

6. **Add Contract Address Validation to AdminContracts.tsx**
   - Show which contracts are deployed vs placeholder
   - Add warning badge for placeholder addresses
   - Add copy-to-clipboard for addresses

### TERTIARY ACTIONS (Priority 3)

7. **Create Contract Documentation**
   - Document all contract addresses and their purposes
   - Document fee split configuration
   - Create deployment checklist

8. **Implement Contract ABI Registry**
   - Centralize all contract ABIs
   - Add type safety for ABI functions

---

## File-by-File Status

### `/tmp/cc-agent/61475162/project/.env`
**Status:** NEEDS MODIFICATION
- Lines 23-35: Contract addresses
- **Issues:**
  - Legacy aliases (lines 31-35) should be removed
  - AcademyVault should be added
  - All addresses are placeholders

### `/tmp/cc-agent/61475162/project/contracts/evm/deployments/amoy.json`
**Status:** INCOMPLETE DEPLOYMENT REGISTRY
- All contracts have `null` addresses
- "MinerMarketplace" should be "Marketplace"
- Missing AcademyVault entry

### `/tmp/cc-agent/61475162/project/src/lib/web3/config.ts`
**Status:** PARTIALLY INCOMPLETE
- Lines 26-31: Contract addresses
- **Issues:**
  - Missing AcademyVault
  - Missing RewardsMerkle hook usage (no hook exists)
  - Properly uses new naming convention

### `/tmp/cc-agent/61475162/project/src/pages/app/AdminContracts.tsx`
**Status:** USES OUTDATED REFERENCES
- Lines 74-106: Contract list loading
- **Issues:**
  - Uses legacy env variables instead of importing from config.ts
  - Missing AcademyVault
  - Should import `contractAddresses` from config.ts instead

---

## Risk Assessment

**Risk Level:** CRITICAL

Current state prevents the application from functioning with smart contracts:
1. No actual contract addresses deployed (all placeholders)
2. AcademyVault is referenced in env but not implemented
3. AdminContracts.tsx bypasses centralized config
4. Dual naming creates maintenance burden and bugs

**Impact Timeline:**
- **Now:** Application cannot call smart contracts
- **At Deployment:** Risk of using wrong addresses if env not properly updated
- **At Runtime:** Admin panel will show outdated information

---

## Appendix: Code References

### Location of Each Issue

**Dual Naming Pattern (5 contracts):**
```
.env lines 23-35
src/lib/web3/config.ts lines 26-31
src/pages/app/AdminContracts.tsx lines 74-106
```

**Missing AcademyVault:**
```
NOT in: src/lib/web3/config.ts
NOT in: contracts/evm/deployments/amoy.json
NOT in: src/pages/app/AdminContracts.tsx
EXISTS in: .env line 25
```

**RewardsMerkle References:**
```
src/lib/web3/config.ts line 30 (property name)
src/pages/app/AdminContracts.tsx line 90 (display name)
contracts/evm/deployments/amoy.json line 18 (JSON name)
```

---

## Conclusion

The project has **incomplete smart contract integration** with critical synchronization issues across configuration files. The primary issues are:

1. **Naming inconsistency** - Dual naming convention causing maintenance issues
2. **Missing implementation** - AcademyVault referenced but not implemented
3. **Placeholder addresses** - All contracts using null addresses
4. **Fragmented configuration** - AdminContracts bypassing centralized config

These issues must be resolved before contracts can be deployed and properly integrated with the application. The recommended approach is to consolidate on the modern naming convention, complete the AcademyVault implementation, and ensure all addresses are synchronized through the centralized config.ts file.
