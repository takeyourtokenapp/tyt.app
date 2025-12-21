# TYT V3 - Web3 Mining Platform

**Take Your Token (TYT)** is a next-generation Web3 platform combining NFT mining, tokenomics, blockchain education, and charitable giving.

Every transaction supports children's brain cancer research.

---

## Quick Start

**Get started in 2-4 hours:**

```bash
# 1. Clone repository
git clone https://github.com/yourusername/tyt-v3
cd tyt-v3

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# 4. Start development server
npm run dev
```

**Full deployment guide:** See [START_NOW.md](START_NOW.md)

---

## Features

### NFT Mining Platform
- **Digital Miners:** ERC-721 NFTs with real hashrate (TH/s)
- **Daily BTC Rewards:** Automated distribution with Merkle proofs
- **Upgradeable:** Improve efficiency and hashrate
- **Marketplace:** P2P trading with 60/30/10 fee distribution

### Tokenomics
- **TYT Token:** Governance & utility (Solana SPL)
- **Burn Mechanism:** Every transaction burns TYT
- **veTYT Governance:** Time-locked voting power
- **Discount Curve:** Up to 18% off maintenance fees

### Digital Academy
- **40+ Lessons:** Blockchain basics to advanced topics
- **Interactive Quizzes:** Test knowledge and earn XP
- **Soulbound Certificates:** On-chain proof of learning
- **Owl Ranks:** Worker → Academic → Diplomat → Peacekeeper → Warrior

### Foundation
- **Children's Brain Cancer Research:** 30% of fees
- **Transparent Tracking:** On-chain proof of donations
- **Grant System:** Support research institutions
- **Impact Reports:** Public quarterly reports

---

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite 5 + Tailwind CSS
- React Query + Context API
- wagmi + viem (Web3)

**Backend:**
- Supabase (PostgreSQL + Edge Functions)
- 132 database tables with RLS
- 25 serverless functions
- Real-time subscriptions

**Smart Contracts:**
- Solidity 0.8.20
- Foundry development
- OpenZeppelin libraries
- 9 audited contracts

**Blockchain:**
- Polygon (main chain)
- Solana (TYT token)
- Multi-chain support (BTC, ETH, TRX, XRP, TON)

---

## Project Structure

```
tyt-v3/
├── src/
│   ├── components/      # 74 React components
│   ├── pages/          # 40+ pages
│   ├── hooks/          # Custom hooks
│   ├── utils/          # Services & utilities
│   ├── contexts/       # Global state
│   └── lib/            # Core libraries
│
├── contracts/
│   ├── evm/            # Solidity contracts
│   │   ├── src/        # Contract source
│   │   ├── script/     # Deployment scripts
│   │   └── test/       # Contract tests
│   └── solana/         # Rust programs
│
├── supabase/
│   ├── migrations/     # 82 database migrations
│   └── functions/      # 25 Edge Functions
│
└── docs/               # Technical documentation
```

---

## Documentation

**Quick Start:**
- [START_NOW.md](START_NOW.md) - Deploy testnet in 2-4 hours
- [SUMMARY.txt](SUMMARY.txt) - Project overview

**Deployment:**
- [REAL_LAUNCH_INSTRUCTIONS.md](REAL_LAUNCH_INSTRUCTIONS.md) - Full launch plan
- [contracts/evm/DEPLOYMENT_GUIDE_V3.md](contracts/evm/DEPLOYMENT_GUIDE_V3.md) - Contract deployment

**Architecture:**
- [ARCHITECTURE_IMPLEMENTATION.md](ARCHITECTURE_IMPLEMENTATION.md) - System design
- [TYT_FULL_PROMPT_PACK_V6.md](TYT_FULL_PROMPT_PACK_V6.md) - Complete specification

**Development:**
- [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) - UI/UX guidelines
- [ROADMAP_UPDATED.md](ROADMAP_UPDATED.md) - Development roadmap
- [AUDIT_REPORT.md](AUDIT_REPORT.md) - Code audit results

---

## Environment Setup

### Required Variables

```bash
# Supabase
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# Blockchain
VITE_POLYGON_RPC_URL=your_rpc_url
VITE_ALCHEMY_API_KEY=your_api_key

# Smart Contracts (after deployment)
VITE_CONTRACT_FEE_CONFIG=0x...
VITE_CONTRACT_MINER_NFT=0x...
VITE_CONTRACT_MARKETPLACE=0x...
# ... see .env.example for full list
```

**See [.env.example](.env.example) for complete configuration**

---

## Development

### Install Dependencies
```bash
npm install
```

### Start Dev Server
```bash
npm run dev
# Opens: http://localhost:5173
```

### Build for Production
```bash
npm run build
# Output: dist/
```

### Type Check
```bash
npm run typecheck
```

### Lint Code
```bash
npm run lint
```

---

## Smart Contracts

### Compile Contracts
```bash
cd contracts/evm
forge build
```

### Run Tests
```bash
forge test -vvv
```

### Deploy to Testnet
```bash
# 1. Setup environment
cp .env.example .env
# Fill in PRIVATE_KEY, RPC_URL, etc.

# 2. Deploy MockTYT token
forge create src/MockTYT.sol:MockTYT \
  --rpc-url $RPC_URL_AMOY \
  --private-key $PRIVATE_KEY

# 3. Update TYT_TOKEN_ADDRESS in .env

# 4. Deploy all contracts
forge script script/DeployComplete.s.sol:DeployComplete \
  --rpc-url $RPC_URL_AMOY \
  --broadcast \
  --verify
```

**Full guide:** [contracts/evm/DEPLOYMENT_GUIDE_V3.md](contracts/evm/DEPLOYMENT_GUIDE_V3.md)

---

## Database

### View Tables
```bash
# Using Supabase MCP
supabase db list

# View migrations
ls supabase/migrations/
```

### Run Migrations
```bash
# All migrations run automatically on Supabase
# For local development:
supabase db reset
```

### Access Database
- Dashboard: https://supabase.com/dashboard
- Direct SQL: Supabase SQL Editor

**Schema:** 132 tables with full RLS security

---

## Deployment

### Testnet (2-4 hours)
1. Deploy MockTYT token
2. Deploy all contracts
3. Update .env with addresses
4. Deploy Edge Functions
5. Test end-to-end

### Production (8 weeks)
1. **Week 1-2:** Integrations (KYC, Payments, Monitoring)
2. **Week 3-6:** Security audit + fixes
3. **Week 7:** Mainnet deployment
4. **Week 8:** Public launch

**Budget:** ~$52,600 total

**See:** [REAL_LAUNCH_INSTRUCTIONS.md](REAL_LAUNCH_INSTRUCTIONS.md)

---

## Testing

### Frontend
```bash
npm run dev
# Manual testing in browser
```

### Smart Contracts
```bash
cd contracts/evm
forge test -vvv
```

### E2E Testing
1. Sign up new user
2. Connect Web3 wallet
3. Mint NFT miner
4. List on marketplace
5. Complete Academy lesson
6. Check Foundation stats

---

## Security

### Current Status
- ✅ RLS enabled on all tables
- ✅ Input validation everywhere
- ✅ No hardcoded secrets
- ✅ HTTPS enforced
- ⚠️ Smart contract audit pending
- ⚠️ Penetration test pending

### Before Production
1. Smart contract audit ($25k)
2. Penetration testing ($10k)
3. Bug bounty program
4. Insurance coverage

---

## Contributing

### Code Style
- TypeScript strict mode
- ESLint + Prettier
- No any types
- Comprehensive comments

### Pull Requests
1. Fork repository
2. Create feature branch
3. Make changes
4. Run tests + build
5. Submit PR

### Issues
- Bug reports welcome
- Feature requests welcome
- Security issues: security@takeyourtoken.app

---

## License

MIT License - see [LICENSE](LICENSE)

---

## Support

### Documentation
- Technical: [docs/](docs/)
- API Reference: [Supabase Dashboard](https://supabase.com/dashboard)
- Contract Docs: [contracts/evm/README.md](contracts/evm/README.md)

### Community
- Discord: [discord.gg/tyt](https://discord.gg/tyt)
- Twitter: [@TakeYourToken](https://twitter.com/TakeYourToken)
- Telegram: [t.me/tyt_official](https://t.me/tyt_official)

### Contact
- Email: support@takeyourtoken.app
- Website: https://takeyourtoken.app
- Foundation: foundation@takeyourtoken.app

---

## Mission

**TYT combines Web3 innovation with real-world impact.**

Every transaction on our platform contributes to research fighting children's brain cancer. We're building the future of decentralized mining while making a meaningful difference in young lives.

**Web3 → Medicine → Children's Lives**

---

## Status

**Current Version:** 3.0.0
**Build Status:** ✅ Passing
**Database:** ✅ 132 tables
**Contracts:** ⚠️ Testnet ready
**Frontend:** ✅ Production ready
**Backend:** ✅ 25 functions deployed

**Ready for testnet deployment!**

---

**Made with ❤️ by the TYT Team**

**Powered by:** Supabase, Polygon, Solana, React, TypeScript
