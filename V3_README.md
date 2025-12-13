# 🚀 TYT V3.0 - AGENT ORCHESTRATION GUIDE

**Status**: Phase 3 Complete → Ready for v3.0 Transition
**Date**: 13 December 2024

---

## 📖 QUICK START

You have **4 specialized agents** + **1 integrator** ready to transform TYT from "complete ecosystem with mocks" to "production-ready with real blockchain integration".

### Your Team:

1. **contracts-agent** - Deploys Foundry contracts to Polygon
2. **backend-agent** - Integrates blockchain indexer + merkle proofs
3. **frontend-agent** - Wires UI to real APIs
4. **infra-agent** - Sets up CI/CD + staging
5. **integrator** - Merges everything and runs E2E tests

---

## 📁 KEY DOCUMENTS

| Document | Purpose | Who Uses |
|----------|---------|----------|
| `docs/AGENT_PROMPTS_V3.md` | **Complete prompts for all 4 agents** | All agents |
| `docs/V3_TRANSITION_PLAN.md` | **Roadmap, timeline, risks** | Project manager |
| `docs/PHASE3_COMPLETE_REPORT.md` | **Current state analysis** | Everyone |
| `START_HERE.md` | Original project overview | New team members |

---

## 🎯 THE V3.0 MISSION

### What Changes?

**From (v2 - Current)**:
- Mock rewards calculations
- Simulated blockchain events
- Database-only marketplace
- Trust-based verification

**To (v3.0 - Target)**:
- Real on-chain contracts (Foundry)
- Automated blockchain indexer
- On-chain marketplace with escrow
- Cryptographic proof verification

### What Stays the Same?

✅ Supabase backend (Edge Functions)
✅ React + Vite frontend
✅ 120+ database tables
✅ Complete UI/UX design
✅ All existing features

**v3.0 adds blockchain layer, not rebuilds everything!**

---

## 🏗️ ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND (React)                   │
│  - Wallet UI                                         │
│  - Miners Dashboard                                  │
│  - Marketplace                                       │
│  - Rewards Verification                              │
└────────────────────┬────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────┐
│            BACKEND (Supabase Edge Functions)         │
│  - API Endpoints                                     │
│  - Blockchain Indexer ← NEW!                        │
│  - Merkle Tree Builder ← NEW!                       │
│  - Journal Ledger                                    │
└────────────────────┬────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────┐
│            SMART CONTRACTS (Polygon) ← NEW!          │
│  - FeeConfig                                         │
│  - CharityVault                                      │
│  - MinerNFT (ERC-721)                               │
│  - RewardsMerkleRegistry                            │
│  - MinerMarketplace                                  │
└─────────────────────────────────────────────────────┘
```

---

## 📊 FEE CANON (CRITICAL)

**EVERY agent MUST implement exactly:**

### Deposits: 10% Total Fee
```
User deposits: 1000 USDT
───────────────────────────────
Total Fee:      100 USDT (10%)
  ├─ Protocol:   60 USDT (6%)
  ├─ Charity:    30 USDT (3%)
  └─ Academy:    10 USDT (1%)

User receives:  900 USDT (90%)
```

### Marketplace: 3% Total Fee
```
Miner sells for: 1000 TYT
───────────────────────────────
Total Fee:       30 TYT (3%)
  ├─ Protocol:   18 TYT (1.8%)
  ├─ Charity:     9 TYT (0.9%)
  └─ Academy:     3 TYT (0.3%)

Seller receives: 970 TYT (97%)
```

**Implementation**:
- FeeConfig contract stores all fee profiles
- Backend validates against contract
- Frontend displays breakdown
- Charity funds auto-route to CharityVault

---

## 🗓️ TIMELINE

```
┌──────────┬────────────────────────────────────┐
│  Week    │  Deliverable                       │
├──────────┼────────────────────────────────────┤
│  1-2     │  Contracts deployed to Amoy        │
│  3-4     │  Indexer + Merkle proofs working   │
│  5       │  Frontend wired to real APIs       │
│  6       │  CI/CD + staging automated         │
│  7       │  Integration testing + fixes       │
├──────────┼────────────────────────────────────┤
│  TOTAL   │  7 weeks to production v3.0        │
└──────────┴────────────────────────────────────┘
```

**Start**: Dec 16, 2024
**Launch**: Feb 3, 2025

---

## 🎯 E2E SUCCESS CRITERIA

Platform is v3.0-ready when these 5 scenarios pass:

### ✅ E2E-1: Login Flow
- User registers → receives JWT → session persists

### ✅ E2E-2: Deposit with Fees
- Deposit 1000 USDT → user gets 900, protocol 60, charity 30, academy 10

### ✅ E2E-3: Miner On-Chain
- Mint NFT → indexer syncs → appears in Miners page

### ✅ E2E-4: Rewards Verification
- Cron generates merkle tree → root on-chain → user verifies proof ✅

### ✅ E2E-5: Marketplace Transaction
- List miner → buyer purchases → fees split correctly → ownership transfers

---

## 📋 HOW TO USE THIS GUIDE

### For Project Manager:
1. Read `V3_TRANSITION_PLAN.md` for full roadmap
2. Assign agents to their prompts in `AGENT_PROMPTS_V3.md`
3. Monitor weekly progress
4. Coordinate via integrator for E2E testing

### For contracts-agent:
1. Read your section in `AGENT_PROMPTS_V3.md`
2. Start with FeeConfig.sol
3. Deploy to Polygon Amoy
4. Provide addresses to backend-agent

### For backend-agent:
1. Wait for contract addresses from contracts-agent
2. Implement blockchain indexer
3. Build merkle proof system
4. Enhance edge functions

### For frontend-agent:
1. Wait for API specs from backend-agent
2. Create API client layer
3. Wire pages to real endpoints
4. Add merkle verification UI

### For infra-agent:
1. Setup CI/CD pipeline
2. Configure staging environment
3. Create deployment automation
4. Write runbooks

### For integrator:
1. Merge all branches in correct order
2. Deploy to staging
3. Run E2E tests
4. Create fix tasks if needed

---

## 🔧 COMMANDS CHEAT SHEET

```bash
# Install
npm install
cd contracts/evm && forge install

# Development
npm run dev                    # Frontend
supabase functions serve       # Backend

# Testing
npm run test                   # Frontend tests
cd contracts/evm && forge test # Contract tests

# Building
npm run build                  # Frontend
forge build                    # Contracts

# Deployment
forge script script/DeployAmoy.s.sol --broadcast  # Contracts
supabase functions deploy      # Backend
npm run build && deploy        # Frontend
```

---

## 🚨 CRITICAL PATHS

**Must complete in order:**

1. **Contracts** (Week 1-2)
   - Blocks everything else
   - Get addresses ASAP

2. **Indexer** (Week 3)
   - Frontend needs synced data
   - Critical for UX

3. **Merkle System** (Week 4)
   - Core value proposition
   - Must be secure

4. **Integration** (Week 7)
   - All pieces must work together
   - E2E tests validate everything

---

## 📚 ADDITIONAL RESOURCES

### Current State:
- `PHASE3_COMPLETE_REPORT.md` - What's already done (98%!)
- `IMPLEMENTATION_STATUS_DEC13.md` - Technical details

### Planning:
- `MVP_TO_FULL_ROADMAP.md` - Original roadmap
- `TYT_V2_MASTER_BLUEPRINT.md` - Product vision

### Technical:
- `TYT_API_TECHNICAL_SPEC.md` - API specifications
- `DESIGN_SYSTEM.md` - UI/UX guidelines
- `SECURE_DEPLOYMENT_GUIDE.md` - Security best practices

---

## ⚠️ IMPORTANT NOTES

### Do NOT:
- ❌ Change existing database schema without discussion
- ❌ Copy GoMining branding/UI 1:1
- ❌ Commit private keys to repo
- ❌ Deploy to mainnet without audit

### Do:
- ✅ Follow fee canon exactly (10% deposit, split 60/30/10)
- ✅ Use double-entry ledger for all money movements
- ✅ Write comprehensive tests (>90% coverage)
- ✅ Document everything
- ✅ Communicate blockers early

---

## 🎉 WHY THIS WILL SUCCEED

1. **Strong Foundation**: Phase 3 already 98% complete
2. **Clear Scope**: Not rebuilding, just adding blockchain layer
3. **Proven Stack**: Supabase + Foundry are battle-tested
4. **Detailed Plans**: Every agent has exact instructions
5. **Incremental Approach**: Week-by-week milestones
6. **E2E Validation**: Clear success criteria

---

## 🚀 READY TO START?

### Next Actions:
1. **contracts-agent**: Begin Foundry setup today
2. **Project Manager**: Schedule weekly syncs
3. **All agents**: Read your sections in `AGENT_PROMPTS_V3.md`

### Questions?
- Technical: See `docs/AGENT_PROMPTS_V3.md`
- Planning: See `docs/V3_TRANSITION_PLAN.md`
- Current state: See `PHASE3_COMPLETE_REPORT.md`

---

**Let's build the world's first transparent Web3 mining platform with integrated charity! 🦉⚡**

---

*Version*: 1.0
*Created*: 13 December 2024
*Status*: Ready for Agent Execution
