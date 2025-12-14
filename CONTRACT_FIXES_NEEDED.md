# Smart Contract Synchronization - Specific Code Fixes

## Overview
This document provides exact code changes needed to fix contract address synchronization issues.

---

## FIX #1: Update src/lib/web3/config.ts (Add AcademyVault)

**File:** `/tmp/cc-agent/61475162/project/src/lib/web3/config.ts`

**Current Code (lines 26-32):**
```typescript
export const contractAddresses = {
  feeConfig: (import.meta.env.VITE_CONTRACT_FEE_CONFIG || '0x0000000000000000000000000000000000000000') as `0x${string}`,
  charityVault: (import.meta.env.VITE_CONTRACT_CHARITY_VAULT || '0x0000000000000000000000000000000000000000') as `0x${string}`,
  minerNFT: (import.meta.env.VITE_CONTRACT_MINER_NFT || '0x0000000000000000000000000000000000000000') as `0x${string}`,
  rewardsMerkle: (import.meta.env.VITE_CONTRACT_REWARDS_MERKLE || '0x0000000000000000000000000000000000000000') as `0x${string}`,
  marketplace: (import.meta.env.VITE_CONTRACT_MARKETPLACE || '0x0000000000000000000000000000000000000000') as `0x${string}`
} as const;
```

**Fixed Code:**
```typescript
export const contractAddresses = {
  feeConfig: (import.meta.env.VITE_CONTRACT_FEE_CONFIG || '0x0000000000000000000000000000000000000000') as `0x${string}`,
  charityVault: (import.meta.env.VITE_CONTRACT_CHARITY_VAULT || '0x0000000000000000000000000000000000000000') as `0x${string}`,
  academyVault: (import.meta.env.VITE_CONTRACT_ACADEMY_VAULT || '0x0000000000000000000000000000000000000000') as `0x${string}`,
  minerNFT: (import.meta.env.VITE_CONTRACT_MINER_NFT || '0x0000000000000000000000000000000000000000') as `0x${string}`,
  rewardsMerkle: (import.meta.env.VITE_CONTRACT_REWARDS_MERKLE || '0x0000000000000000000000000000000000000000') as `0x${string}`,
  marketplace: (import.meta.env.VITE_CONTRACT_MARKETPLACE || '0x0000000000000000000000000000000000000000') as `0x${string}`
} as const;
```

**Change:** Add line for academyVault

---

## FIX #2: Update src/pages/app/AdminContracts.tsx (Use centralized config)

**File:** `/tmp/cc-agent/61475162/project/src/pages/app/AdminContracts.tsx`

### Step 1: Add import at top of file (around line 1)

**Add after existing imports:**
```typescript
import { contractAddresses } from '@/lib/web3/config';
```

**Current imports (first 5 lines):**
```typescript
import { useState, useEffect } from 'react';
import { Shield, Settings, Pause, Play, DollarSign, Flame, RefreshCw, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useAccount } from 'wagmi';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/contexts/ToastContext';
```

**Should become:**
```typescript
import { useState, useEffect } from 'react';
import { Shield, Settings, Pause, Play, DollarSign, Flame, RefreshCw, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useAccount } from 'wagmi';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/contexts/ToastContext';
import { contractAddresses } from '@/lib/web3/config';
```

### Step 2: Replace loadContractData function (lines 72-115)

**Current Code:**
```typescript
  const loadContractData = async () => {
    try {
      // Load contract addresses from env
      const contractList: ContractInfo[] = [
        {
          name: 'Miner NFT',
          address: import.meta.env.VITE_MINER_NFT_ADDRESS || '0x0000000000000000000000000000000000000000',
          isPaused: false,
          balance: '0',
        },
        {
          name: 'Marketplace',
          address: import.meta.env.VITE_MARKETPLACE_ADDRESS || '0x0000000000000000000000000000000000000000',
          isPaused: false,
          balance: '0',
        },
        {
          name: 'Rewards Registry',
          address: import.meta.env.VITE_REWARDS_REGISTRY_ADDRESS || '0x0000000000000000000000000000000000000000',
          isPaused: false,
          balance: '0',
        },
        {
          name: 'Charity Vault',
          address: import.meta.env.VITE_CHARITY_VAULT_ADDRESS || '0x0000000000000000000000000000000000000000',
          isPaused: false,
          balance: '0',
        },
        {
          name: 'Fee Config',
          address: import.meta.env.VITE_FEE_CONFIG_ADDRESS || '0x0000000000000000000000000000000000000000',
          isPaused: false,
          balance: '0',
        },
      ];

      setContracts(contractList);

      // In production, call contract methods to get actual status
      // Example: const isPaused = await minerNFTContract.read.paused();
    } catch (err) {
      console.error('Error loading contract data:', err);
    }
  };
```

**Fixed Code:**
```typescript
  const loadContractData = async () => {
    try {
      // Load contract addresses from centralized config
      const contractList: ContractInfo[] = [
        {
          name: 'Fee Config',
          address: contractAddresses.feeConfig,
          isPaused: false,
          balance: '0',
        },
        {
          name: 'Charity Vault',
          address: contractAddresses.charityVault,
          isPaused: false,
          balance: '0',
        },
        {
          name: 'Academy Vault',
          address: contractAddresses.academyVault,
          isPaused: false,
          balance: '0',
        },
        {
          name: 'Miner NFT',
          address: contractAddresses.minerNFT,
          isPaused: false,
          balance: '0',
        },
        {
          name: 'Marketplace',
          address: contractAddresses.marketplace,
          isPaused: false,
          balance: '0',
        },
        {
          name: 'Rewards Registry',
          address: contractAddresses.rewardsMerkle,
          isPaused: false,
          balance: '0',
        },
      ];

      setContracts(contractList);

      // In production, call contract methods to get actual status
      // Example: const isPaused = await minerNFTContract.read.paused();
    } catch (err) {
      console.error('Error loading contract data:', err);
    }
  };
```

**Changes:**
- Import contractAddresses from config.ts
- Replace all import.meta.env.VITE_*_ADDRESS references with contractAddresses.*
- Add AcademyVault to the contract list
- Reorder to match config.ts order

---

## FIX #3: Remove legacy env variables from .env

**File:** `/tmp/cc-agent/61475162/project/.env`

**Remove these lines (31-35):**
```
# Legacy aliases (for backward compatibility)
VITE_MINER_NFT_ADDRESS=0x0000000000000000000000000000000000000000
VITE_MARKETPLACE_ADDRESS=0x0000000000000000000000000000000000000000
VITE_REWARDS_REGISTRY_ADDRESS=0x0000000000000000000000000000000000000000
VITE_CHARITY_VAULT_ADDRESS=0x0000000000000000000000000000000000000000
VITE_FEE_CONFIG_ADDRESS=0x0000000000000000000000000000000000000000
```

The .env should look like (after removal):
```
# ============================================
# SMART CONTRACT ADDRESSES (REQUIRED)
# ============================================
# Update these after deploying contracts to Polygon Amoy
# Get from contracts/evm/deployments/amoy.json after deployment
VITE_CONTRACT_FEE_CONFIG=0x0000000000000000000000000000000000000000
VITE_CONTRACT_CHARITY_VAULT=0x0000000000000000000000000000000000000000
VITE_CONTRACT_ACADEMY_VAULT=0x0000000000000000000000000000000000000000
VITE_CONTRACT_MINER_NFT=0x0000000000000000000000000000000000000000
VITE_CONTRACT_MARKETPLACE=0x0000000000000000000000000000000000000000
VITE_CONTRACT_REWARDS_MERKLE=0x0000000000000000000000000000000000000000

# ============================================
# BLOCKCHAIN RPC PROVIDERS (REQUIRED)
# ============================================
```

---

## FIX #4: Update contracts/evm/deployments/amoy.json

**File:** `/tmp/cc-agent/61475162/project/contracts/evm/deployments/amoy.json`

**Current Content:**
```json
{
  "network": "polygon_amoy",
  "chainId": 80002,
  "deployedAt": null,
  "contracts": {
    "FeeConfig": {
      "address": null,
      "deployTx": null
    },
    "CharityVault": {
      "address": null,
      "deployTx": null
    },
    "MinerNFT": {
      "address": null,
      "deployTx": null
    },
    "RewardsMerkleRegistry": {
      "address": null,
      "deployTx": null
    },
    "MinerMarketplace": {
      "address": null,
      "deployTx": null
    }
  },
  "feeProfiles": {
    "deposit.default": {
      "totalBps": 1000,
      "split": "60/30/10 (protocol/charity/academy)"
    },
    "marketplace.default": {
      "totalBps": 500,
      "split": "60/30/10 (protocol/charity/academy)"
    }
  }
}
```

**Fixed Content:**
```json
{
  "network": "polygon_amoy",
  "chainId": 80002,
  "deployedAt": null,
  "contracts": {
    "FeeConfig": {
      "address": null,
      "deployTx": null
    },
    "CharityVault": {
      "address": null,
      "deployTx": null
    },
    "AcademyVault": {
      "address": null,
      "deployTx": null
    },
    "MinerNFT": {
      "address": null,
      "deployTx": null
    },
    "Marketplace": {
      "address": null,
      "deployTx": null
    },
    "RewardsMerkle": {
      "address": null,
      "deployTx": null
    }
  },
  "feeProfiles": {
    "deposit.default": {
      "totalBps": 1000,
      "split": "60/30/10 (protocol/charity/academy)"
    },
    "marketplace.default": {
      "totalBps": 500,
      "split": "60/30/10 (protocol/charity/academy)"
    }
  }
}
```

**Changes:**
- Rename "MinerMarketplace" to "Marketplace"
- Rename "RewardsMerkleRegistry" to "RewardsMerkle"
- Add "AcademyVault" entry

---

## FIX #5: Create src/hooks/web3/useAcademyVault.ts (Optional but Recommended)

**New File:** `/tmp/cc-agent/61475162/project/src/hooks/web3/useAcademyVault.ts`

**Content:**
```typescript
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { contractAddresses, isContractsConfigured } from '@/lib/web3/config';
import { academyVaultABI } from '@/lib/contracts/abis';
import { parseEther } from 'viem';

export function useAcademyVault() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const donate = async (amountInTYT: string) => {
    if (!isContractsConfigured) {
      throw new Error('Smart contracts not configured');
    }

    return writeContract({
      address: contractAddresses.academyVault,
      abi: academyVaultABI,
      functionName: 'donate',
      value: parseEther(amountInTYT)
    });
  };

  return {
    donate,
    isPending: isPending || isConfirming,
    isSuccess,
    txHash: hash
  };
}

export function useAcademyBalance() {
  const { data: balance, refetch } = useReadContract({
    address: contractAddresses.academyVault,
    abi: academyVaultABI,
    functionName: 'getTotalDonations',
    query: {
      enabled: isContractsConfigured
    }
  });

  return {
    balance: balance as bigint | undefined,
    refetch
  };
}

export function useUserAcademyDonations(address?: `0x${string}`) {
  const { data: donations } = useReadContract({
    address: contractAddresses.academyVault,
    abi: academyVaultABI,
    functionName: 'getUserDonations',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isContractsConfigured
    }
  });

  return { donations: donations as bigint | undefined };
}
```

**Note:** Requires academyVaultABI to be available in `/tmp/cc-agent/61475162/project/src/lib/contracts/abis/index.ts`

---

## Summary of Changes

### Files to Modify:
1. ✏️ `src/lib/web3/config.ts` - Add academyVault property
2. ✏️ `src/pages/app/AdminContracts.tsx` - Use centralized config
3. ✏️ `.env` - Remove legacy aliases
4. ✏️ `contracts/evm/deployments/amoy.json` - Add AcademyVault, normalize names

### Files to Create (Optional):
5. ✨ `src/hooks/web3/useAcademyVault.ts` - Hook for AcademyVault

### Estimated Time:
- Time to implement: 10-15 minutes
- Time to test: 5-10 minutes
- Total: 15-25 minutes

### Testing After Changes:
1. npm run dev (verify no errors)
2. Check browser console for warnings
3. Navigate to /app/admin-contracts
4. Verify all 6 contracts display
5. Verify addresses show (should be 0x0000... placeholders)
6. Verify no console errors

---

## Verification Checklist

After making all changes, verify:

- [ ] `src/lib/web3/config.ts` compiles without errors
- [ ] `src/pages/app/AdminContracts.tsx` compiles without errors
- [ ] `.env` has all VITE_CONTRACT_* variables
- [ ] `.env` does NOT have legacy VITE_*_ADDRESS variables
- [ ] `amoy.json` has AcademyVault entry
- [ ] `amoy.json` uses "Marketplace" (not MinerMarketplace)
- [ ] `amoy.json` uses "RewardsMerkle" (not RewardsMerkleRegistry)
- [ ] AdminContracts page shows 6 contracts
- [ ] All contract addresses display correctly
- [ ] No console errors in browser DevTools
- [ ] No TypeScript errors in IDE

---

## Rollback Plan

If something breaks:

1. Restore original files from git
2. Apply changes one file at a time
3. Test after each change
4. If error occurs on specific file, that file has issue

```bash
# Revert single file
git checkout src/lib/web3/config.ts

# Revert all changes
git checkout .
```
