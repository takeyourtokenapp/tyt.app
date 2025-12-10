# Take Your Token (TYT) Platform

> A comprehensive digital mining platform featuring NFT miners, daily BTC rewards, multi-chain support, and an integrated crypto academy.

![Status](https://img.shields.io/badge/status-MVP-green)
![Build](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-Proprietary-red)

## 🌟 Overview

Take Your Token (TYT) is a GoMining-class protocol that enables users to own digital miners as NFTs, earn daily Bitcoin rewards, and participate in a transparent tokenomics system with burn cycles.

### Three Core Pillars

1. **🔥 Digital Mining Platform** - NFT miners with daily BTC rewards and marketplace
2. **📚 Crypto Academia** - Interactive learning platform with Owl rank progression
3. **❤️ TYT Foundation** - Pediatric brain tumor research and family support

### Key Features

- ✅ Multi-asset wallet (BTC, ETH, SOL, TRX, XRP, TYT, USDT)
- ✅ NFT miner management with upgrades
- ✅ Daily BTC rewards with Merkle proof verification
- ✅ Maintenance payment system with up to 18% TYT discounts
- ✅ P2P marketplace for miner trading
- ✅ 11-tier VIP system with automated upgrades
- ✅ Owl rank progression (Worker → Academic → Diplomat → Peacekeeper → Warrior)
- ✅ Weekly TYT burn cycles with transparency reports
- ✅ Foundation donations with impact tracking

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account (credentials in `.env`)

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Access the application at `http://localhost:5173`

### First Time Setup

1. **Sign up** at `/signup`
2. **Sign in** at `/login`
3. **Explore** the dashboard at `/app`

## 🏗️ Architecture

### Technology Stack

**Frontend**
- React 18 + TypeScript + Vite
- React Router DOM v7
- Tailwind CSS
- Lucide React icons

**Backend & Database**
- Supabase (PostgreSQL)
- 47 production-ready tables
- Row Level Security enabled
- Automated triggers

**Planned Smart Contracts**
- Polygon PoS (ERC-721, ERC-20)
- TYT token on Solana (pump.fun)

### Project Structure

```
takeyourtoken.app/
├── src/
│   ├── components/           # UI components
│   │   └── AppLayout.tsx     # Main layout with sidebar
│   ├── contexts/             # React contexts
│   │   └── AuthContext.tsx   # Auth state management
│   ├── lib/
│   │   └── supabase.ts       # Database client
│   ├── pages/
│   │   ├── Landing.tsx       # Public landing
│   │   ├── Login.tsx         # Authentication
│   │   ├── Signup.tsx        # Registration
│   │   └── app/
│   │       └── Dashboard.tsx # Main dashboard
│   ├── types/
│   │   ├── contracts.ts      # Smart contract types
│   │   └── database.ts       # Database models
│   ├── utils/
│   │   └── maintenance.ts    # Calculations
│   └── App.tsx               # Routing
├── supabase/
│   └── migrations/           # 7 migration files
└── .env                      # Configuration
```

## 💾 Database Schema

### Core Tables (47 total)

#### Mining Platform (11 tables)
- `profiles` - User accounts with KYC, VIP, Owl rank
- `custodial_wallets` - Multi-asset balances
- `nft_miners` - Digital miners (hashrate, efficiency)
- `daily_rewards` - Reward history + Merkle proofs
- `maintenance_invoices` - Cost tracking
- `marketplace_listings` - NFT trading
- `vip_tiers` - 11 levels (Bronze → Legendary)
- `referral_codes` - 5-5-5 commission model
- `avatars` - Profile NFTs
- `burn_windows` - Weekly TYT burns
- `tyt_discount_snapshots` - Discount calculations

#### Academy (10 tables)
- `academy_tracks` - 6 learning paths
- `academy_lessons` - MDX content
- `academy_quizzes` - Q&A system
- `academy_progress` - Completion tracking
- `academy_quest_definitions` - Real-world tasks
- `academy_quest_progress` - Quest completion
- `owl_rank_definitions` - Rank system
- `user_xp_ledger` - Experience points
- `academy_certificates` - Track completion
- `soulbound_nft_certificates` - On-chain certs

#### Foundation (8 tables)
- `foundation_campaigns` - Fundraising drives
- `foundation_donations` - Multi-chain tracking
- `foundation_grants` - Research funding
- `foundation_grant_milestones` - Progress tracking
- `foundation_family_support_requests` - Assistance
- `foundation_transparency_reports` - Accountability
- `foundation_impact_metrics` - Outcomes
- `foundation_matching_pools` - Donation matching

## 📊 Tokenomics

### TYT Token Utility

1. **Maintenance Payments** - Lower costs with TYT
2. **Discount Tiers** - 2% → 18% based on balance
3. **Marketplace Fees** - Reduced trading fees
4. **Governance** - Platform voting (veTYT)
5. **Weekly Burns** - Deflationary mechanism

### Discount Tiers

| Tier | Coverage | Discount |
|------|----------|----------|
| 🥉 Bronze | 30 days | 2% |
| 🥈 Silver | 90 days | 5% |
| 🥇 Gold | 180 days | 9% |
| 💎 Platinum | 270 days | 13% |
| 🏆 Diamond | 360+ days | 18% |

**Formula**: `Coverage Days = TYT Balance / Daily Maintenance Cost`

### VIP System

11 automated tiers with benefits:
- Enhanced maintenance discounts
- Reduced marketplace fees
- Priority customer support
- Exclusive miner drops
- Governance voting power

Requirements: Minimum hashrate + TYT balance

## 🎓 Crypto Academia

### Owl Rank Progression

| Rank | XP Range | Description |
|------|----------|-------------|
| 🦉 Worker | 0-99 | Learning basics |
| 📚 Academic | 100-299 | Studying concepts |
| 🤝 Diplomat | 300-699 | Understanding ecosystems |
| 🛡️ Peacekeeper | 700-1,499 | Mastering security |
| ⚔️ Warrior | 1,500+ | Platform expert |

### Pre-populated Tracks

1. **Foundations** - Wallets, keys, transactions
2. **Bitcoin & Mining** - How mining works
3. **NFT Miners** - Digital miner concepts
4. **Multi-Chain** - L1/L2, cross-chain
5. **Security** - Phishing, 2FA, safety
6. **Compliance** - Legal considerations

## 🛠️ Development

### Available Scripts

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview build
npm run lint      # Run ESLint
npm run typecheck # TypeScript check
```

### Creating New Pages

1. Create component in `src/pages/app/`
2. Add route in `src/App.tsx`
3. Add nav link in `src/components/AppLayout.tsx`

Example:
```typescript
// src/pages/app/NewPage.tsx
export default function NewPage() {
  return <div>Content</div>;
}

// Add to App.tsx
<Route path="newpage" element={<NewPage />} />
```

### Database Queries

```typescript
import { supabase } from '../lib/supabase';

const { data } = await supabase
  .from('nft_miners')
  .select('*')
  .eq('owner_id', userId)
  .eq('status', 'active');
```

### Maintenance Calculations

```typescript
import { calculateNetMaintenanceCost } from '../utils/maintenance';

const result = calculateNetMaintenanceCost(
  {
    hashrateTerahash: 100,
    efficiencyWattsPerTh: 25,
    kwhPriceUsd: 0.08,
    serviceFeeUsd: 5
  },
  1000 // TYT balance
);
// Returns: { grossCost, discountTier, discountAmount, netCost }
```

## 📋 Roadmap

### ✅ Phase 0: MVP Foundation (Complete)
- [x] Database schema (47 tables)
- [x] Authentication system
- [x] Landing page
- [x] Dashboard
- [x] App layout & routing

### ✅ Phase 1: Core Features (Complete)
- [x] My Miners page with management
- [x] Rewards history with Merkle proofs
- [x] Marketplace with listings
- [x] Multi-asset wallet management
- [x] Demo data seeding
- [x] Payment processing utilities
- [x] Blockchain utilities
- [x] Toast notification system

### ✅ Phase 2: Academy & Foundation (Complete)
- [x] Academy page with tracks
- [x] Owl rank progression
- [x] Foundation page with campaigns
- [x] Donation flows with multi-asset support
- [x] Settings page
- [x] Campaign management

### 🔮 Phase 3: Advanced Features
- [ ] Mobile app (React Native)
- [ ] veTYT governance
- [ ] Analytics dashboard
- [ ] Referral system UI
- [ ] VIP perks

## 🔒 Security

### Current Implementation

✅ Row Level Security on all tables
✅ Authenticated-only access
✅ Environment variable protection
✅ Supabase Auth password hashing

### Planned Enhancements

- [ ] 2FA implementation
- [ ] KYC/AML integration
- [ ] Rate limiting
- [ ] Smart contract audits
- [ ] Bug bounty program

## 📄 Legal & Compliance

### Disclaimers

- Not investment advice
- Not a security or deposit
- Variable rewards and costs
- No device mining performed
- Comply with local laws

### Required Policies (TBD)

- Terms of Service
- Privacy Policy
- Risk Disclosure
- Cookie Policy
- KYC/AML procedures

## 🤝 Contributing

Contributions welcome in:

1. **Frontend Pages** - Miners, Marketplace, Academy
2. **Smart Contracts** - ERC-721, ERC-20, Marketplace
3. **Backend Services** - Rewards engine, Burn cycles
4. **UI/UX** - Design, animations, responsive
5. **Documentation** - API docs, guides

## 📞 Support & Resources

- **Website**: https://takeyourtoken.app
- **Telegram**: https://t.me/takeyourtoken
- **Token**: [View on pump.fun](https://pump.fun/APadkPpjonaLBpLYDzKB6753QQU3s8VZhEtkvLgrpump)

## 📜 License

Proprietary - All rights reserved

---

**Take Your Token (TYT)** - Own Digital Miners. Earn Daily BTC.

*Built with React, TypeScript, Tailwind CSS, and Supabase*

© 2025 Take Your Token. All rights reserved.
