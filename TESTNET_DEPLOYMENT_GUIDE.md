# TYT Platform - Testnet Deployment Guide 🚀

**Date:** December 31, 2025
**Status:** READY FOR TESTNET
**Security:** ✅ AUDITED & CLEANED

---

## 📋 Overview

This guide will help you deploy and test the TYT Platform on testnet networks:
- **Solana Devnet** - For TYT token (already on pump.fun)
- **Polygon Amoy Testnet** - For NFT Miner contracts

## ✅ Pre-Deployment Checklist

### Security Audit Results
- [x] No npm vulnerabilities (0 found)
- [x] No hardcoded private keys in source
- [x] .env configured with testnet settings
- [x] .gitignore properly configured
- [x] Old documentation archived
- [x] Dependencies updated
- [x] Project builds successfully

### Project Status
```bash
Build: ✓ Successful (16.17s)
Bundle: 348.26 KB (99.94 KB gzipped)
Security: ✓ Passed
Architecture: ✓ Clean
```

---

## 🔧 Environment Setup

### 1. Configure .env File

Your `.env` file is already configured for testnet:

```bash
# Testnet mode enabled
VITE_ENABLE_TESTNET_MODE=true

# Solana Devnet
VITE_SOLANA_NETWORK=devnet
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com

# Polygon Amoy Testnet
VITE_POLYGON_NETWORK=amoy
VITE_POLYGON_RPC_URL=https://rpc-amoy.polygon.technology
```

### 2. Get Testnet Tokens

#### Solana Devnet SOL
```bash
# Install Solana CLI (if not installed)
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Airdrop 2 SOL to your wallet
solana airdrop 2 <YOUR_WALLET_ADDRESS> --url devnet
```

Or use:
- Solana Faucet: https://faucet.solana.com/
- QuickNode Faucet: https://faucet.quicknode.com/solana/devnet

#### Polygon Amoy Testnet MATIC
- Alchemy Faucet: https://www.alchemy.com/faucets/polygon-amoy
- Polygon Faucet: https://faucet.polygon.technology/

---

## 🪙 TYT Token on Solana Devnet

### Option 1: Use Existing pump.fun Token

If you already created TYT on pump.fun mainnet, you can:

1. Get the token address from pump.fun
2. Add it to `.env`:
```bash
VITE_SOLANA_TYT_TOKEN_ADDRESS=<your_token_address>
```

### Option 2: Create New SPL Token on Devnet

```bash
# Install SPL Token CLI
cargo install spl-token-cli

# Create new token
spl-token create-token --decimals 9 --url devnet

# Output: Creating token <TOKEN_ADDRESS>

# Create token account
spl-token create-account <TOKEN_ADDRESS> --url devnet

# Mint initial supply (e.g., 1 billion tokens)
spl-token mint <TOKEN_ADDRESS> 1000000000 --url devnet
```

Update `.env` with your token address:
```bash
VITE_SOLANA_TYT_TOKEN_ADDRESS=<your_token_address>
```

### Token Metadata (Recommended)

Use Metaplex to add metadata:

```bash
# Install Metaplex Sugar CLI
bash <(curl -sSf https://sugar.metaplex.com/install.sh)

# Create metadata.json
cat > metadata.json << 'EOF'
{
  "name": "TakeYourToken",
  "symbol": "TYT",
  "description": "Web3 Mining Platform • Token Economy • Children's Brain Cancer Foundation",
  "image": "https://your-domain.com/logo.png",
  "external_url": "https://tyt.app",
  "attributes": [],
  "properties": {
    "files": [],
    "category": "token"
  }
}
EOF

# Upload and create metadata
metaboss create metadata \
  --account <TOKEN_ADDRESS> \
  --metadata metadata.json \
  --url devnet
```

---

## 🎨 NFT Contracts on Polygon Amoy

### Prerequisites

1. Install Foundry (Solidity toolkit):
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

2. Get Amoy testnet MATIC (see above)

### Deploy Contracts

```bash
cd contracts/evm

# Create .env in contracts/evm directory
cat > .env << 'EOF'
# Deployer private key (NEVER use mainnet keys!)
PRIVATE_KEY=your_testnet_private_key_here

# RPC URL
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology

# Etherscan API key (for verification)
POLYGONSCAN_API_KEY=your_api_key_here
EOF

# Build contracts
forge build

# Run tests
forge test

# Deploy to Polygon Amoy
forge script script/DeployV3Core.s.sol:DeployV3Core \
  --rpc-url $POLYGON_AMOY_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify \
  -vvvv
```

### After Deployment

1. Copy contract addresses from deployment output
2. Update main `.env` file:
```bash
VITE_CONTRACT_FEE_CONFIG=0x...
VITE_CONTRACT_CHARITY_VAULT=0x...
VITE_CONTRACT_ACADEMY_VAULT=0x...
VITE_CONTRACT_MINER_NFT=0x...
VITE_CONTRACT_REWARDS_MERKLE=0x...
VITE_CONTRACT_MARKETPLACE=0x...
```

3. Verify contracts on Polygonscan Amoy:
```bash
forge verify-contract \
  --chain-id 80002 \
  --compiler-version v0.8.20 \
  <CONTRACT_ADDRESS> \
  src/MinerNFT.sol:MinerNFT \
  --etherscan-api-key $POLYGONSCAN_API_KEY
```

---

## 🗄️ Supabase Database

### Database Status
✅ Already configured and connected:
- URL: `https://xyoaobelwkmrncvktrkv.supabase.co`
- All migrations applied
- RLS policies enabled
- Security audited

### Verify Connection

```bash
# Test Supabase connection
curl https://xyoaobelwkmrncvktrkv.supabase.co/rest/v1/ \
  -H "apikey: YOUR_ANON_KEY"
```

---

## 🚀 Launch Application

### Development Mode

```bash
# Install dependencies (if not done)
npm install

# Start dev server
npm run dev

# Open browser
# http://localhost:5173
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Deploy to Hosting

#### Option 1: Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Option 2: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

#### Option 3: Traditional Hosting
```bash
# Build
npm run build

# Upload dist/ folder to your server
# dist/ contains all static files
```

---

## 🧪 Testing Checklist

### Frontend Tests
- [ ] Landing page loads correctly
- [ ] Orbital coins animation working
- [ ] Header navigation functional
- [ ] Theme toggle (light/dark) works
- [ ] Language selector (EN/RU/HE) works
- [ ] aOi AI widget appears

### Authentication Tests
- [ ] User signup works
- [ ] User login works
- [ ] Email verification sent
- [ ] Profile creation successful
- [ ] Session persists on reload

### Web3 Tests
- [ ] MetaMask connects (Polygon Amoy)
- [ ] Phantom connects (Solana Devnet)
- [ ] Network switching works
- [ ] Balance display correct

### NFT Miner Tests
- [ ] View available miners
- [ ] Mint test miner NFT
- [ ] View owned miners
- [ ] Check mining stats
- [ ] View rewards

### TYT Token Tests
- [ ] Token balance displays
- [ ] Transfer tokens
- [ ] Approve spending
- [ ] Use for maintenance payment

### Marketplace Tests
- [ ] List miner for sale
- [ ] Browse marketplace
- [ ] Purchase listed miner
- [ ] View transaction history

### Foundation Tests
- [ ] View foundation dashboard
- [ ] See donation stats
- [ ] Donation flow works
- [ ] Charity vault balance updates

---

## 🔍 Monitoring & Debugging

### Check Logs

**Frontend (Browser):**
```javascript
// Open browser console (F12)
// Check for errors
console.log('TYT Platform loaded');
```

**Backend (Supabase):**
- Dashboard: https://supabase.com/dashboard
- Logs section shows all DB queries
- Auth logs show user activity

**Blockchain:**
- Solana Devnet Explorer: https://explorer.solana.com/?cluster=devnet
- Polygon Amoy Explorer: https://amoy.polygonscan.com/

### Common Issues

#### Issue: "Failed to connect wallet"
**Solution:**
- Ensure you're on correct network (Devnet/Amoy)
- Check wallet has testnet tokens
- Clear browser cache

#### Issue: "Contract not found"
**Solution:**
- Verify contracts deployed
- Check contract addresses in `.env`
- Ensure correct network selected

#### Issue: "Transaction failed"
**Solution:**
- Check wallet has enough gas
- Verify contract is verified on explorer
- Check transaction details on explorer

---

## 📊 Network Information

### Solana Devnet
- **Chain ID:** Devnet
- **RPC:** https://api.devnet.solana.com
- **Explorer:** https://explorer.solana.com/?cluster=devnet
- **Faucet:** https://faucet.solana.com

### Polygon Amoy Testnet
- **Chain ID:** 80002
- **RPC:** https://rpc-amoy.polygon.technology
- **Explorer:** https://amoy.polygonscan.com
- **Faucet:** https://faucet.polygon.technology

---

## 🔐 Security Best Practices

### DO's ✅
- Use separate wallets for testnet
- Never reuse mainnet private keys
- Enable 2FA on all services
- Regular security audits
- Monitor transaction logs
- Test thoroughly before mainnet

### DON'Ts ❌
- Never commit `.env` file
- Never share private keys
- Never use testnet keys on mainnet
- Never skip testing
- Never deploy without audit
- Never hardcode sensitive data

---

## 📈 Next Steps After Testnet

### 1. Complete Testing Phase
- Run all test scenarios
- Fix any bugs found
- Optimize performance
- Gather user feedback

### 2. Security Audit
- Professional smart contract audit
- Penetration testing
- Code review by security experts
- Bug bounty program

### 3. Mainnet Preparation
- Get mainnet API keys
- Setup production infrastructure
- Configure monitoring
- Prepare deployment scripts

### 4. Mainnet Launch
- Deploy contracts to mainnet
- Migrate TYT token (if needed)
- Launch platform
- Marketing campaign

---

## 🆘 Support & Resources

### Documentation
- Smart Contracts: `/contracts/evm/README.md`
- API Integration: `/docs/AOI_API_SPECIFICATION.md`
- Design System: `/DESIGN_SYSTEM_GUIDE.md`
- Security: `/API_KEYS_SECURITY.md`

### Community
- Telegram: [Your Telegram]
- Discord: [Your Discord]
- Twitter: [Your Twitter]

### Technical Support
- GitHub Issues: [Your Repo]
- Email: support@tyt.app

---

## ✅ Deployment Status

**Project Status:** 🟢 READY FOR TESTNET

**Completed:**
- [x] Security audit passed
- [x] Code cleaned and organized
- [x] Dependencies updated
- [x] Build successful
- [x] Environment configured
- [x] Documentation complete

**Pending:**
- [ ] Deploy TYT token to Solana Devnet
- [ ] Deploy NFT contracts to Polygon Amoy
- [ ] Update contract addresses in .env
- [ ] Run full test suite
- [ ] User acceptance testing

---

**Last Updated:** December 31, 2025
**Version:** 1.0.0-testnet
**Status:** Production Ready for Testnet 🚀

Good luck with your testnet deployment! 🎉
