# 🚀 EVM Smart Contracts - Deployment Guide

Complete guide to deploying TYT Platform smart contracts.

---

## 📚 Quick Navigation

### For First Time Users
1. Start with `QUICKSTART.md` - Fastest way to get started
2. Then read `PRE_DEPLOYMENT_CHECKLIST.md` - Before deploying

### For Testnet Deployment
1. `QUICK_START_TESTNET.md` - Quick testnet guide
2. `TESTNET_DEPLOYMENT_GUIDE.md` - Detailed testnet guide
3. `TESTNET_DEPLOYMENT_SUMMARY.md` - Summary and results

### For Mainnet Deployment
1. `DEPLOYMENT_GUIDE.md` - General deployment guide
2. `DEPLOYMENT_GUIDE_V3.md` - V3 specific guide
3. `PRE_DEPLOYMENT_CHECKLIST.md` - Pre-flight checklist

---

## 📖 All Documentation Files

| File | Purpose | When to Use |
|------|---------|-------------|
| **Quick Start** | | |
| `QUICKSTART.md` | Fastest start | First time, learning |
| `QUICK_START_TESTNET.md` | Quick testnet | Testing quickly |
| **Testnet** | | |
| `TESTNET_DEPLOYMENT_GUIDE.md` | Full testnet guide | Testnet deployment |
| `TESTNET_DEPLOYMENT_SUMMARY.md` | Results & addresses | After testnet deploy |
| **Mainnet** | | |
| `DEPLOYMENT_GUIDE.md` | General deployment | Production deploy |
| `DEPLOYMENT_GUIDE_V3.md` | V3 architecture | V3 contracts |
| **Preparation** | | |
| `PRE_DEPLOYMENT_CHECKLIST.md` | Pre-flight check | Before any deploy |
| **Reference** | | |
| `README.md` | Contract overview | Understanding system |
| `MINERNFT_V3_IMPLEMENTATION.md` | NFT details | NFT implementation |
| `DEPLOYMENT_VIDEO_SCRIPT.md` | Video tutorial | Visual learners |

---

## 🎯 Recommended Paths

### Path 1: Quick Learning (30 minutes)
```
1. QUICKSTART.md
2. PRE_DEPLOYMENT_CHECKLIST.md
3. Deploy to testnet
```

### Path 2: Thorough Preparation (2 hours)
```
1. README.md (understand contracts)
2. MINERNFT_V3_IMPLEMENTATION.md (understand NFTs)
3. PRE_DEPLOYMENT_CHECKLIST.md (prepare)
4. TESTNET_DEPLOYMENT_GUIDE.md (deploy testnet)
5. Test thoroughly
6. DEPLOYMENT_GUIDE_V3.md (deploy mainnet)
```

### Path 3: Video Tutorial (1 hour)
```
1. Watch DEPLOYMENT_VIDEO_SCRIPT.md
2. Follow along with QUICKSTART.md
3. Deploy
```

---

## ⚠️ Important Notes

### Before You Start
- ✅ Read `PRE_DEPLOYMENT_CHECKLIST.md`
- ✅ Have testnet ETH/MATIC ready
- ✅ MetaMask wallet configured
- ✅ Foundry installed

### Deployment Order
1. **Always test on testnet first**
2. Verify all contracts
3. Test all functions
4. Then deploy to mainnet

### Security
- 🔒 Never commit private keys
- 🔒 Use environment variables
- 🔒 Verify contracts on explorer
- 🔒 Multi-sig for mainnet admin

---

## 🔗 Quick Links

- Testnet Faucets: See `TESTNET_DEPLOYMENT_GUIDE.md`
- Contract ABIs: `src/lib/contracts/abis/`
- Deployment Scripts: `script/`
- Contract Source: `src/`

---

## 📊 Contracts Overview

```
FeeConfig             → Fee management & profiles
CharityVault          → Charity donations
AcademyVault          → Academy rewards
MinerNFT              → Mining NFT ERC721
Marketplace           → NFT marketplace
RewardsMerkleRegistry → Merkle proofs for rewards
VotingEscrowTYT       → veTYT governance
```

See `README.md` for full details.

---

## 🆘 Need Help?

- **Quick question?** Check `QUICKSTART.md`
- **Testnet issues?** See `TESTNET_DEPLOYMENT_GUIDE.md`
- **Contract questions?** Read `MINERNFT_V3_IMPLEMENTATION.md`
- **Pre-deployment?** Use `PRE_DEPLOYMENT_CHECKLIST.md`

---

**Last Updated**: January 1, 2026
**Contracts Version**: V3
