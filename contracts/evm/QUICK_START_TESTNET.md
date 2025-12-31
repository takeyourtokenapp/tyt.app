# 🚀 Quick Start - Testnet Launch

**Time Required:** 1-2 hours
**Difficulty:** Intermediate

---

## ⚡ Fast Track Deployment

### Prerequisites
- Node.js installed ✓
- Git installed ✓
- Wallet with testnet tokens (get free):
  - Solana Devnet: https://faucet.solana.com
  - Polygon Amoy: https://faucet.polygon.technology

---

## 📦 Step 1: Setup (5 min)

```bash
# Already done - project is ready!
npm install  # (if needed)
npm run build  # Verify it works
```

---

## 🪙 Step 2: Deploy TYT Token (15 min)

### Option A: Solana Devnet (Recommended)
```bash
# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Get devnet SOL
solana airdrop 2 <YOUR_WALLET> --url devnet

# Create token
spl-token create-token --decimals 9 --url devnet
# Save the token address!

# Mint supply
spl-token mint <TOKEN_ADDRESS> 1000000000 --url devnet
```

### Option B: Use pump.fun
If you already have TYT on pump.fun mainnet, just add the address to `.env`

---

## 🎨 Step 3: Deploy NFT Contracts (30 min)

```bash
cd contracts/evm

# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Get Amoy MATIC from faucet

# Create .env
echo "PRIVATE_KEY=your_testnet_key" > .env
echo "POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology" >> .env

# Build & Deploy
forge build
forge script script/DeployV3Core.s.sol:DeployV3Core \
  --rpc-url $POLYGON_AMOY_RPC_URL \
  --broadcast
```

---

## ⚙️ Step 4: Configure (5 min)

Update main `.env` file:
```bash
# Add your deployed addresses
VITE_SOLANA_TYT_TOKEN_ADDRESS=<solana_token_address>
VITE_CONTRACT_MINER_NFT=<polygon_nft_address>
VITE_CONTRACT_MARKETPLACE=<polygon_marketplace_address>
# ... other contracts
```

---

## 🚀 Step 5: Launch! (2 min)

```bash
# Development
npm run dev

# Or production build
npm run build
npm run preview
```

Open: http://localhost:5173

---

## ✅ Test Checklist

- [ ] Landing page loads
- [ ] Coins orbit around aOi
- [ ] Can switch language
- [ ] Can toggle theme
- [ ] Can connect wallet
- [ ] Can see token balance
- [ ] Can mint NFT miner

---

## 📚 Full Documentation

See: `TESTNET_DEPLOYMENT_GUIDE.md` for complete instructions

---

## 🆘 Need Help?

**Issue:** Build fails
**Fix:** `rm -rf node_modules && npm install`

**Issue:** Wallet won't connect
**Fix:** Check you're on correct network (Devnet/Amoy)

**Issue:** Transaction fails
**Fix:** Get more testnet tokens from faucet

---

**Status:** 🟢 READY
**Estimated Time:** 1-2 hours total
**Let's go!** 🚀
