# Smart Contract Naming Inconsistencies - Visual Guide

## Overview
This document shows all the naming inconsistencies visually to help understand the sync problems.

---

## FEECONFIG - Naming Mismatch

```
                                    FEECONFIG
                                        |
                        ________________|________________
                       |                                |
                       V                                V
              [Modern Naming]                    [Legacy Naming]

.env:         VITE_CONTRACT_FEE_CONFIG      VITE_FEE_CONFIG_ADDRESS
                        |                              |
                        V                              V
config.ts:    feeConfig                              X (not used)
                        |
                        V
AdminContracts.tsx: X (should be used)      VITE_FEE_CONFIG_ADDRESS
                                                      |
amoy.json:    FeeConfig                              X
```

**Problem:** AdminContracts.tsx uses LEGACY path instead of centralized config.ts

---

## CHARITYVAULT - Naming Mismatch

```
                                 CHARITYVAULT
                                        |
                        ________________|________________
                       |                                |
                       V                                V
              [Modern Naming]                    [Legacy Naming]

.env:         VITE_CONTRACT_CHARITY_VAULT   VITE_CHARITY_VAULT_ADDRESS
                        |                              |
                        V                              V
config.ts:    charityVault                           X
                        |
                        V
AdminContracts.tsx: X                        VITE_CHARITY_VAULT_ADDRESS
                                                      |
amoy.json:    CharityVault                           X
```

**Problem:** Same as FeeConfig - AdminContracts uses legacy vars

---

## ACADEMYVAULT - Missing Implementation

```
                                  ACADEMYVAULT
                                        |
                ________________________|_______________________________
               |                        |                              |
               V                        V                              V
.env:          VITE_CONTRACT_        config.ts:              AdminContracts.tsx:
               ACADEMY_VAULT          MISSING                MISSING

               (Defined but          (Not in              (Not in UI)
                unused)              contractAddresses)

amoy.json:     MISSING
               (Not in registry)
```

**Problem:** Referenced in env but never implemented anywhere else

---

## MINERNFT - Naming Mismatch

```
                                    MINERNFT
                                        |
                        ________________|________________
                       |                                |
                       V                                V
              [Modern Naming]                    [Legacy Naming]

.env:         VITE_CONTRACT_MINER_NFT        VITE_MINER_NFT_ADDRESS
                        |                              |
                        V                              V
config.ts:    minerNFT                                X
                        |
                        V
AdminContracts.tsx: X                        VITE_MINER_NFT_ADDRESS
                                                      |
Hooks:        useMinerNFT.ts               (unused)
                        |
                        V
amoy.json:    MinerNFT                               X
```

**Problem:** Config uses modern naming, AdminContracts uses legacy

---

## MARKETPLACE - Dual Problem (Naming + JSON Mismatch)

```
                                  MARKETPLACE
                                        |
                        ________________|________________
                       |                                |
                       V                                V
              [Modern Naming]                    [Legacy Naming]

.env:         VITE_CONTRACT_MARKETPLACE      VITE_MARKETPLACE_ADDRESS
                        |                              |
                        V                              V
config.ts:    marketplace                             X
                        |
                        V
AdminContracts.tsx: X                        VITE_MARKETPLACE_ADDRESS
                                                      |
Hooks:        useMarketplace.ts                   (unused)
                        |
                        V
amoy.json:    MinerMarketplace (NAME MISMATCH!)     X
```

**Problems:**
1. AdminContracts uses legacy naming
2. JSON uses "MinerMarketplace" while env uses "MARKETPLACE"

---

## REWARDSMERKLE - Triple Naming Chaos (WORST CASE)

```
                          REWARDSMERKLE / REWARDSREGISTRY
                                        |
                    _____________________|___________________
                   |                     |                   |
                   V                     V                   V
            [MERKLE variant]      [REGISTRY variant]   [JSON variant]

.env:       VITE_CONTRACT_        VITE_REWARDS_           (N/A)
            REWARDS_MERKLE        REGISTRY_ADDRESS
                   |                     |
                   V                     V
config.ts:  rewardsMerkle               X

AdminContracts.tsx: X              VITE_REWARDS_
                                   REGISTRY_ADDRESS
                                   (displays as "Rewards Registry")

amoy.json:  RewardsMerkleRegistry
            (Different name from all three above!)
```

**Problems:**
1. ENV uses MERKLE
2. Legacy ENV uses REGISTRY
3. JSON uses MERKLEREGISTRY
4. All four names are different!

---

## Current Information Flow (BROKEN)

```
Development Flow:

User wants to deploy contract on Polygon Amoy
        |
        V
Run deployment script
        |
        ├─────────────────────────────────────┐
        |                                     |
        V                                     V
   contracts/evm/deployments/amoy.json    Manually update .env?
   (Contains null addresses)               (Not documented)
        |
        └─────────────────────────────────────┤
                                              |
                                              V
                                    .env with new addresses
                                              |
                                    __________|__________
                                   |                     |
                                   V                     V
                        config.ts (MODERN)    AdminContracts.tsx (LEGACY)
                        (CORRECT PATH)        (BYPASSES CONFIG!)
                                   |                     |
                                   V                     V
                            Web3 Hooks          Admin UI (May be out of sync!)
                            (Works fine)        (Potential bugs!)
```

**Key Issue:** Two separate configuration paths that aren't synchronized

---

## Proposed Fixed Information Flow

```
Proper Flow (After Fixes):

User deploys contract on Polygon Amoy
        |
        V
Update contracts/evm/deployments/amoy.json
        |
        V
Run script to sync amoy.json → .env
        |
        V
.env (SINGLE SOURCE OF TRUTH for env vars)
        |
        └──→ src/lib/web3/config.ts (CENTRALIZED CONFIG)
             (contractAddresses object)
                     |
        ______________________________|_______________________________
       |                             |                              |
       V                             V                              V
src/hooks/web3/      src/pages/app/          Other components
use*.ts              AdminContracts.tsx
(Web3 interactions)  (Admin UI)              (All features)
       |                             |                              |
       └─────────────────────────────┴──────────────────────────────┘
                            |
                            V
                    Consistent Application
                    (Single source of truth)
```

**Key Improvement:** Everything flows from centralized config.ts

---

## Naming Comparison Table

This shows what names are used in each file for each contract:

```
┌─────────────────────┬─────────────────────────────┬─────────────────────────────┬──────────────────┬─────────────────┐
│ CONTRACT            │ .env (VITE_CONTRACT_*)      │ .env (Legacy)               │ config.ts        │ amoy.json       │
├─────────────────────┼─────────────────────────────┼─────────────────────────────┼──────────────────┼─────────────────┤
│ 1. FeeConfig        │ VITE_CONTRACT_FEE_CONFIG    │ VITE_FEE_CONFIG_ADDRESS     │ feeConfig        │ FeeConfig       │
├─────────────────────┼─────────────────────────────┼─────────────────────────────┼──────────────────┼─────────────────┤
│ 2. CharityVault     │ VITE_CONTRACT_CHARITY_...   │ VITE_CHARITY_VAULT_ADDRESS  │ charityVault     │ CharityVault    │
├─────────────────────┼─────────────────────────────┼─────────────────────────────┼──────────────────┼─────────────────┤
│ 3. AcademyVault     │ VITE_CONTRACT_ACADEMY_...   │ (MISSING)                   │ (MISSING)        │ (MISSING)       │
├─────────────────────┼─────────────────────────────┼─────────────────────────────┼──────────────────┼─────────────────┤
│ 4. MinerNFT         │ VITE_CONTRACT_MINER_NFT     │ VITE_MINER_NFT_ADDRESS      │ minerNFT         │ MinerNFT        │
├─────────────────────┼─────────────────────────────┼─────────────────────────────┼──────────────────┼─────────────────┤
│ 5. Marketplace      │ VITE_CONTRACT_MARKETPLACE   │ VITE_MARKETPLACE_ADDRESS    │ marketplace      │ MinerMarketplace│
├─────────────────────┼─────────────────────────────┼─────────────────────────────┼──────────────────┼─────────────────┤
│ 6. RewardsMerkle    │ VITE_CONTRACT_REWARDS_...   │ VITE_REWARDS_REGISTRY_...   │ rewardsMerkle    │ RewardsMerkle...|
└─────────────────────┴─────────────────────────────┴─────────────────────────────┴──────────────────┴─────────────────┘

Legend:
✓ = Consistent
✗ = Missing
! = Mismatch
```

---

## Problem Severity Heat Map

```
                          CONSISTENCY SCORE

FeeConfig              ████░░░░░░  40% (Modern path works, legacy exists)
CharityVault           ████░░░░░░  40% (Modern path works, legacy exists)
AcademyVault           ░░░░░░░░░░   0% (MISSING EVERYWHERE)
MinerNFT               ████░░░░░░  40% (Modern path works, legacy exists)
Marketplace            ███░░░░░░░  30% (JSON name wrong: MinerMarketplace)
RewardsMerkle          ██░░░░░░░░  20% (Three different names! Maximum chaos)

Overall Project Health: ███░░░░░░░  25% (Critical issues blocking deployment)
```

---

## Breaking It Down by File

### .env Status

```
Modern Variables (VITE_CONTRACT_*):
  ✓ VITE_CONTRACT_FEE_CONFIG
  ✓ VITE_CONTRACT_CHARITY_VAULT
  ✓ VITE_CONTRACT_ACADEMY_VAULT
  ✓ VITE_CONTRACT_MINER_NFT
  ✓ VITE_CONTRACT_MARKETPLACE
  ✓ VITE_CONTRACT_REWARDS_MERKLE

Legacy Variables (VITE_*_ADDRESS):
  ✗ VITE_FEE_CONFIG_ADDRESS (SHOULD BE REMOVED)
  ✗ VITE_CHARITY_VAULT_ADDRESS (SHOULD BE REMOVED)
  ✗ VITE_MINER_NFT_ADDRESS (SHOULD BE REMOVED)
  ✗ VITE_MARKETPLACE_ADDRESS (SHOULD BE REMOVED)
  ✗ VITE_REWARDS_REGISTRY_ADDRESS (SHOULD BE REMOVED)

Rating: NEEDS CLEANUP - Remove all legacy variables
```

### config.ts Status

```
Contract Definitions:
  ✓ feeConfig
  ✓ charityVault
  ✗ academyVault (MISSING - SHOULD ADD)
  ✓ minerNFT
  ✓ marketplace
  ✓ rewardsMerkle

Naming Convention:
  ✓ All use camelCase
  ✓ All reference VITE_CONTRACT_* variables
  ✓ Proper TypeScript types

Rating: 85% GOOD - Just add academyVault
```

### AdminContracts.tsx Status

```
Uses Correct Reference Path:
  ✗ VITE_FEE_CONFIG_ADDRESS (SHOULD USE config.ts)
  ✗ VITE_CHARITY_VAULT_ADDRESS (SHOULD USE config.ts)
  ✗ VITE_MINER_NFT_ADDRESS (SHOULD USE config.ts)
  ✗ VITE_MARKETPLACE_ADDRESS (SHOULD USE config.ts)
  ✗ VITE_REWARDS_REGISTRY_ADDRESS (SHOULD USE config.ts)
  ✗ (MISSING AcademyVault entirely)

Rating: 0% GOOD - Complete refactor needed to use config.ts
```

### amoy.json Status

```
Contract Names:
  ✓ FeeConfig
  ✓ CharityVault
  ✗ AcademyVault (MISSING)
  ✓ MinerNFT
  ✗ MinerMarketplace (SHOULD BE "Marketplace")
  ✗ RewardsMerkleRegistry (SHOULD BE "RewardsMerkle")

All Addresses: null (EXPECTED - not deployed yet)

Rating: 50% GOOD - Add AcademyVault, fix naming
```

---

## The Root Cause

The project started with one naming convention (VITE_*_ADDRESS), then migrated to a new one (VITE_CONTRACT_*). However:

1. **config.ts** was updated to use the new convention
2. **AdminContracts.tsx** was NOT updated and still uses legacy
3. **AcademyVault** was planned but not completed
4. **amoy.json** uses inconsistent naming (MinerMarketplace, RewardsMerkleRegistry)

Result: **Fragmented, un-synchronized configuration**

---

## Migration Path (What Needs to Happen)

```
Step 1: Remove Legacy Variables
        .env: Delete VITE_*_ADDRESS lines
        Impact: AdminContracts will break (expected)

Step 2: Fix AdminContracts.tsx
        Import contractAddresses from config.ts
        Use centralized config instead of env vars
        Add AcademyVault to list
        Impact: AdminContracts will work again

Step 3: Update config.ts
        Add academyVault property
        Impact: All features can access AcademyVault

Step 4: Fix amoy.json
        Add AcademyVault
        Rename MinerMarketplace → Marketplace
        Rename RewardsMerkleRegistry → RewardsMerkle
        Impact: Deployment registry matches other files

Step 5: Verify
        Run app, check AdminContracts page
        Verify no console errors
        Verify all 6 contracts show with correct addresses
        Impact: Project is now synchronized
```

---

## Visual Before/After

### BEFORE (Current - Broken)

```
.env Variables                  Code Usage
├─ VITE_CONTRACT_*             config.ts (used correctly)
│  │                           └─→ Web3 Hooks (works)
│  └─→ AdminContracts (NOT USING)
│
├─ VITE_*_ADDRESS (legacy)     AdminContracts (using old vars)
│  │                           └─→ Hard-coded references (fragile)
│  └─→ NOT in config.ts
│
└─ AcademyVault                (Referenced but NOT IMPLEMENTED)
   └─→ Everywhere is broken!
```

### AFTER (Fixed - Synchronized)

```
.env Variables
├─ VITE_CONTRACT_*
│  └─→ config.ts (single source of truth)
│     ├─→ Web3 Hooks (uses config.ts)
│     │   └─→ Features (all working)
│     │
│     └─→ AdminContracts.tsx (imports from config.ts)
│         └─→ Admin UI (synchronized)
│
└─ (No legacy variables)
   (Everything clean and simple)
```

---

## Summary

| Issue | Current | Target | Effort |
|-------|---------|--------|--------|
| Dual naming convention | 5 contracts affected | 0 contracts affected | 10 min |
| Missing AcademyVault | Not implemented | Fully implemented | 15 min |
| AdminContracts sync | Out of sync | Uses config.ts | 10 min |
| JSON naming | Inconsistent | Standardized | 5 min |
| **Total** | **Multiple issues** | **Synchronized** | **~40 min** |

Once fixed, the project will have a **clean, single-source-of-truth configuration system**.
