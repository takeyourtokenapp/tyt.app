# TYT v2 — МАСТЕР-СПЕЦИФИКАЦИЯ
## Take Your Token v2 — Полная техническая документация

**Версия:** 2.0
**Дата:** Декабрь 2024
**Статус:** Phase 0 → Phase 1 (MVP Development)

---

## 📋 СОДЕРЖАНИЕ

1. [Миссия и концепция](#миссия)
2. [Feature-паритет с GoMining](#gomining-parity)
3. [Архитектура системы](#architecture)
4. [Блокчейн и контракты](#blockchain)
5. [База данных](#database)
6. [Функциональные модули](#modules)
7. [Токеномика](#tokenomics)
8. [UX потоки](#ux-flows)
9. [Технический стек](#tech-stack)
10. [API спецификация](#api-spec)
11. [Дорожная карта](#roadmap)
12. [Комплаенс и юридические аспекты](#compliance)

---

<a name="миссия"></a>
## 1. МИССИЯ И КОНЦЕПЦИЯ

### Что такое TYT?

**Take Your Token (TYT)** — Web3-платформа нового поколения, объединяющая:

1. **NFT-майнинг** — цифровые майнеры с реальными BTC-вознаграждениями
2. **Token Economy** — TYT токен с burn-механикой и veTYT governance
3. **Blockchain Academy** — образовательная платформа с сертификатами (Soulbound NFTs)
4. **Children's Brain Cancer Foundation** — медицинский фонд, финансируемый через Web3

### Уникальное Ценностное Предложение (UVP)

> **TYT — первый в мире mining-NFT проект, где майнинг → медицина → детские жизни.**

**Каждая транзакция** в экосистеме автоматически поддерживает исследования опухолей мозга у детей.

### Три Столпа TYT

```
┌─────────────────────────────────────────────────────────────────┐
│                        TYT ECOSYSTEM                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │  MINING & TOKEN  │  │  DIGITAL ACADEMY │  │  FOUNDATION  │ │
│  │     ECONOMY      │  │                  │  │              │ │
│  ├──────────────────┤  ├──────────────────┤  ├──────────────┤ │
│  │ • NFT Miners     │  │ • Web3 Education │  │ • Research   │ │
│  │ • BTC Rewards    │  │ • Certifications │  │ • Grants     │ │
│  │ • Marketplace    │  │ • Owl Ranks      │  │ • Support    │ │
│  │ • Governance     │  │ • Gamification   │  │ • Hospitals  │ │
│  │ • Burn/Mint      │  │ • Quests         │  │ • Reports    │ │
│  └──────────────────┘  └──────────────────┘  └──────────────┘ │
│                                                                  │
│             1% от КАЖДОЙ транзакции → Foundation                │
└─────────────────────────────────────────────────────────────────┘
```

---

<a name="gomining-parity"></a>
## 2. FEATURE-ПАРИТЕТ С GOMINING

### Что повторяем из GoMining

| Модуль | Описание | Статус |
|--------|----------|--------|
| **Digital Miners (NFT)** | Токенизированные майнеры с TH/s и W/TH параметрами | ✅ |
| **LBH Protocol** | Liquid Bitcoin Hashrate — конвертация физического хешрейта в on-chain NFT | 🔄 |
| **Daily BTC Rewards** | Ежедневные начисления в кастодиальный кошелёк | ✅ |
| **Maintenance System** | Плата за электроэнергию (kWh × W/TH × TH/s) + сервис | ✅ |
| **Token Discounts** | Оплата TYT даёт скидку до -20% | ✅ |
| **Service Button** | Дополнительная скидка -3% ежедневно | ✅ |
| **VIP Program** | 11 уровней (0-10), на основе hashrate или voting power | ✅ |
| **Marketplace** | P2P торговля NFT-майнерами (валюта: TYT) | ✅ |
| **Miner Upgrades** | 20 уровней мощности (100 TH/s → 5000 TH/s max) | ✅ |
| **Efficiency Upgrades** | Улучшение W/TH (5-20% improvement) | ✅ |
| **Miner Wars** | Clan battles за BTC/TYT призы | ✅ |
| **Avatars (GoMiners)** | Бонусные NFT с игровыми бустами | ✅ |
| **Burn & Mint Cycle** | Еженедельное сжигание токенов (вторник 12:00 UTC) | ✅ |
| **veToken Locks** | Блокировка токенов на 1 неделя → 4 года для governance | ✅ |
| **Live Streams** | 24/7 видео с дата-центров (США: WA/SC/TX) | 📋 |
| **Referral Program** | 5-5-5 модель (5% за покупки, апгрейды, игровые бусты) | ✅ |
| **Multi-chain Wallet** | BTC, Lightning, Liquid, wBTC, USDT, TRX, SOL, TON, XRP | ✅ |
| **Mobile Apps** | iOS/Android с паритетом веб-функционала | 📋 |

**Легенда:** ✅ Реализовано | 🔄 В разработке | 📋 Запланировано

---

<a name="architecture"></a>
## 3. АРХИТЕКТУРА СИСТЕМЫ

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├──────────────────┬──────────────────┬───────────────────────────┤
│   Web (Next.js)  │  iOS (Native)    │  Android (Native)         │
│   • SSR/ISR      │  • Swift/SwiftUI │  • Kotlin/Jetpack         │
│   • React Query  │  • Push Notify   │  • Deep Links             │
│   • Web3Modal    │  • Biometrics    │  • In-App Purchase        │
└──────────────────┴──────────────────┴───────────────────────────┘
                              ↓ HTTPS/WSS
┌─────────────────────────────────────────────────────────────────┐
│                         API GATEWAY                              │
│                    (Kong / AWS API Gateway)                      │
│  • Rate Limiting  • Auth Middleware  • Request Logging          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND SERVICES (NestJS)                   │
├──────────────────┬──────────────────┬───────────────────────────┤
│  Auth Service    │  Miner Service   │  Rewards Engine           │
│  • Login/Signup  │  • NFT Mgmt      │  • Daily BTC Calc         │
│  • KYC/AML       │  • Upgrades      │  • Merkle Proofs          │
│  • Sessions      │  • Marketplace   │  • Distribution           │
├──────────────────┼──────────────────┼───────────────────────────┤
│  Payment Service │  Governance Svc  │  Foundation Service       │
│  • Deposits      │  • veTYT Locks   │  • Donations              │
│  • Withdrawals   │  • Proposals     │  • Grants                 │
│  • On-Ramp       │  • Voting        │  • Reports                │
└──────────────────┴──────────────────┴───────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      DATA & STORAGE LAYER                        │
├──────────────────┬──────────────────┬───────────────────────────┤
│  PostgreSQL      │  Redis           │  IPFS/S3                  │
│  (Supabase)      │  (Cache/Queue)   │  (Media/NFT Metadata)     │
│  • Users         │  • Sessions      │  • Images                 │
│  • Miners        │  • Rates         │  • Certificates           │
│  • Transactions  │  • Leaderboards  │  • Documents              │
└──────────────────┴──────────────────┴───────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      BLOCKCHAIN LAYER                            │
├──────────────────┬──────────────────┬───────────────────────────┤
│  TRON (Primary)  │  Solana          │  EVM (Bridges)            │
│  • TYT (TRC-20)  │  • TYT (SPL)     │  • Polygon                │
│  • Miners (721)  │  • Charity Mint  │  • BSC                    │
│  • Marketplace   │  • Compressed    │  • Optimism               │
│  • veTYT Locks   │    NFTs          │                           │
└──────────────────┴──────────────────┴───────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      EXTERNAL INTEGRATIONS                       │
├──────────────────┬──────────────────┬───────────────────────────┤
│  Payment Gateways│  Price Oracles   │  KYC/AML Providers        │
│  • Stripe        │  • Chainlink     │  • Sumsub                 │
│  • Ramp Network  │  • Pyth          │  • Onfido                 │
│  • Transak       │  • API3          │  • Jumio                  │
└──────────────────┴──────────────────┴───────────────────────────┘
```

### Service Architecture

```typescript
// Backend Services Structure (NestJS)

src/
├── auth/                    // Authentication & Authorization
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   ├── kyc.service.ts
│   └── 2fa.service.ts
│
├── miners/                  // NFT Miner Management
│   ├── miners.service.ts
│   ├── upgrades.service.ts
│   ├── efficiency.service.ts
│   └── metadata.service.ts
│
├── rewards/                 // BTC Rewards Engine
│   ├── rewards.service.ts   // Daily calculations
│   ├── distribution.service.ts
│   ├── merkle.service.ts
│   └── proofs.service.ts
│
├── maintenance/             // Maintenance & Discounts
│   ├── maintenance.service.ts
│   ├── discounts.service.ts
│   ├── service-button.service.ts
│   └── invoices.service.ts
│
├── marketplace/             // P2P Marketplace
│   ├── listings.service.ts
│   ├── offers.service.ts
│   ├── sales.service.ts
│   └── escrow.service.ts
│
├── governance/              // veTYT & DAO
│   ├── locks.service.ts
│   ├── proposals.service.ts
│   ├── voting.service.ts
│   └── treasury.service.ts
│
├── game/                    // Miner Wars
│   ├── clans.service.ts
│   ├── tournaments.service.ts
│   ├── boosts.service.ts
│   └── leaderboards.service.ts
│
├── payments/                // Payments & Withdrawals
│   ├── deposits.service.ts
│   ├── withdrawals.service.ts
│   ├── on-ramp.service.ts
│   └── custodial.service.ts
│
├── foundation/              // Children's Cancer Foundation
│   ├── campaigns.service.ts
│   ├── donations.service.ts
│   ├── grants.service.ts
│   └── reports.service.ts
│
├── academy/                 // Educational Platform
│   ├── courses.service.ts
│   ├── lessons.service.ts
│   ├── certificates.service.ts
│   └── xp.service.ts
│
└── blockchain/              // Blockchain Integration
    ├── tron.service.ts
    ├── solana.service.ts
    ├── indexer.service.ts
    └── events.service.ts
```

---

<a name="blockchain"></a>
## 4. БЛОКЧЕЙН И КОНТРАКТЫ

### Выбор блокчейна

**Основная сеть:** TRON (TRC-20/721)

**Причины:**
- ✅ Низкие комиссии (0.1-1 TRX)
- ✅ Высокая пропускная способность
- ✅ Быстрое время подтверждения (~3 сек)
- ✅ Устоявшаяся экосистема
- ✅ TRC-20 USDT — самый популярный стейблкоин

**Опциональные мосты:**
- Polygon (EVM-совместимость)
- Solana (TYT токен origin — pump.fun)
- BSC (дополнительная ликвидность)

### Smart Contracts Architecture

#### 1. TYT Token (TRC-20)

```solidity
// TYT.sol - Main Token Contract

contract TYT is TRC20, Ownable, Burnable {
    // Roles
    address public treasury;
    address public burner;
    address public discountController;

    // Permit (EIP-2612-like)
    mapping(address => uint256) public nonces;

    // Functions
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE);
    function burn(uint256 amount) public;
    function burnFrom(address account, uint256 amount) public;
    function permit(...) external; // Gasless approvals

    // Events
    event Burned(uint256 amount, uint256 timestamp);
    event MaintenancePaid(address user, uint256 amount, uint256 discount);
}
```

**Address:** `T...` (to be deployed)

#### 2. Miner NFT (TRC-721)

```solidity
// MinerNFT.sol - Digital Miners

contract MinerNFT is TRC721, Ownable {
    struct Miner {
        uint256 hashrate;        // TH/s
        uint256 efficiency;      // W/TH
        uint8 powerLevel;        // 1-20
        uint256 maintenanceRate; // Daily cost in USD
        string farmId;           // Data center ID
        bool isListed;           // Marketplace status
        uint256 listedPrice;
        uint256 totalRewardsBtc;
        uint256 lastRewardAt;
    }

    mapping(uint256 => Miner) public miners;

    // Functions
    function mint(address to, MinerParams memory params) external;
    function upgrade(uint256 tokenId, uint8 newPowerLevel) external;
    function improveEfficiency(uint256 tokenId, uint256 percent) external;
    function list(uint256 tokenId, uint256 price) external;
    function unlist(uint256 tokenId) external;

    // Events
    event MinerMinted(uint256 indexed tokenId, address owner, uint256 hashrate);
    event MinerUpgraded(uint256 indexed tokenId, uint8 fromLevel, uint8 toLevel);
    event RewardAccrued(uint256 indexed tokenId, uint256 btcAmount);
}
```

**Address:** `T...` (to be deployed)

#### 3. RewardsTreasury

```solidity
// RewardsTreasury.sol - BTC Reward Distribution

contract RewardsTreasury is Ownable {
    // Wrapped BTC on TRON (or custodial system)
    ITRC20 public wbtc;

    // Daily snapshot system
    mapping(uint256 => DailySnapshot) public snapshots;

    struct DailySnapshot {
        uint256 totalHashrate;
        uint256 btcRewardPool;
        uint256 networkDifficulty;
        bytes32 merkleRoot;
    }

    // Functions
    function createSnapshot(uint256 date, ...) external onlyOracle;
    function claimReward(uint256 date, bytes32[] memory proof) external;
    function calculateDailyReward(uint256 hashrate, uint256 efficiency) public view returns (uint256);
}
```

#### 4. Maintenance & Discounts

```solidity
// Maintenance.sol - Maintenance Fee Controller

contract Maintenance is Ownable {
    // Fee parameters (adjustable via Governance)
    uint256 public kwhRate = 0.05e6; // $0.05 per kWh (6 decimals)
    uint256 public serviceFeePercent = 10; // 10%

    // Discount system
    mapping(address => uint256) public userDiscountPercent; // 0-20% for token payment
    mapping(address => uint256) public serviceButtonLastUsed; // Daily -3%
    mapping(address => uint8) public vipLevel; // 0-10

    // VIP discounts
    uint8[11] public VIP_DISCOUNTS = [0, 1, 2, 3, 4, 5, 7, 9, 11, 13, 15];

    // Functions
    function calculateDailyCost(
        uint256 hashrate,
        uint256 efficiency,
        uint256 btcPrice
    ) public view returns (uint256);

    function payMaintenance(uint256 minerId, address paymentToken) external;
    function activateServiceButton() external;
    function calculateTotalDiscount(address user) public view returns (uint256);
}
```

#### 5. Marketplace

```solidity
// Marketplace.sol - P2P Trading

contract Marketplace is Ownable {
    ITRC20 public tytToken;
    IMinerNFT public minerNFT;

    struct Listing {
        address seller;
        uint256 price; // in TYT
        bool active;
    }

    mapping(uint256 => Listing) public listings;

    uint256 public platformFeePercent = 3; // 3%
    address public foundationWallet;

    // Functions
    function createListing(uint256 tokenId, uint256 price) external;
    function cancelListing(uint256 tokenId) external;
    function buy(uint256 tokenId) external;
    function makeOffer(uint256 tokenId, uint256 price) external;

    // Events
    event Listed(uint256 indexed tokenId, address seller, uint256 price);
    event Sold(uint256 indexed tokenId, address seller, address buyer, uint256 price);
}
```

#### 6. veTYT (Vote-Escrowed TYT)

```solidity
// veTYT.sol - Governance Locks

contract veTYT is Ownable {
    ITRC20 public tytToken;

    struct Lock {
        uint256 amount;
        uint256 unlockTime;
        uint256 votingPower;
        bool isActive;
    }

    mapping(address => Lock) public locks;
    uint256 public constant MIN_LOCK_TIME = 1 weeks;
    uint256 public constant MAX_LOCK_TIME = 4 * 365 days;

    // Voting power formula: amount * (lockTime / MAX_LOCK_TIME)
    // Example: 1000 TYT locked for 4 years = 1000 voting power
    //          1000 TYT locked for 1 year = 250 voting power
    function lock(uint256 amount, uint256 lockTime) external;
    function extendLock(uint256 newUnlockTime) external;
    function increaseAmount(uint256 additionalAmount) external;
    function unlock() external;
    function getVotingPower(address user) public view returns (uint256);

    // Events
    event Locked(address indexed user, uint256 amount, uint256 unlockTime, uint256 votingPower);
    event Unlocked(address indexed user, uint256 amount);
}
```

**Address:** `T...` (to be deployed)

#### 7. BurnScheduler (Weekly Automation)

```solidity
// BurnScheduler.sol - Weekly Burn Events

contract BurnScheduler is Ownable {
    ITRC20 public tytToken;
    address public charityMint; // Solana program address

    uint256 public constant BURN_DAY = 2; // Tuesday
    uint256 public constant BURN_HOUR = 12; // 12:00 UTC

    struct BurnEvent {
        uint256 id;
        uint256 timestamp;
        uint256 collectedAmount;
        uint256 burnedAmount;
        uint256 charityMintAmount;
        bytes32 txHash;
        bool executed;
    }

    BurnEvent[] public burnHistory;

    // Distribution percentages (adjustable via governance)
    uint256 public hashrateProvidersPercent = 40;
    uint256 public veLockersPercent = 30;
    uint256 public treasuryPercent = 20;
    uint256 public charityPercent = 10; // Charity gets up to 25% via Charity Mint

    // Functions
    function executeBurn() external;
    function calculateDistribution(uint256 burnedAmount) public view returns (
        uint256 toHashrateProviders,
        uint256 toVeLockers,
        uint256 toTreasury,
        uint256 toCharity
    );
    function setDistributionPercents(...) external onlyGovernance;

    // Events
    event BurnExecuted(uint256 indexed eventId, uint256 burned, uint256 charityMinted);
    event DistributionSent(address indexed recipient, uint256 amount);
}
```

#### 8. FundSplitter (1% Auto-Donation)

```solidity
// FundSplitter.sol - Automatic Foundation Contributions

contract FundSplitter {
    address public foundationWallet;

    // 1% of all transactions
    uint256 public constant FOUNDATION_PERCENT = 100; // 1% = 100 basis points

    mapping(bytes32 => uint256) public contributionsByTxType;
    uint256 public totalContributed;

    // Functions
    function splitPayment(uint256 amount) internal returns (uint256 netAmount, uint256 foundationAmount) {
        foundationAmount = amount * FOUNDATION_PERCENT / 10000;
        netAmount = amount - foundationAmount;

        // Send to foundation
        payable(foundationWallet).transfer(foundationAmount);
        totalContributed += foundationAmount;

        emit DonationMade(msg.sender, foundationAmount);
    }

    // Events
    event DonationMade(address indexed from, uint256 amount);
}
```

### Contract Deployment Checklist

- [ ] Deploy TYT Token (TRC-20) on TRON mainnet
- [ ] Deploy MinerNFT (TRC-721) on TRON mainnet
- [ ] Deploy RewardsTreasury contract
- [ ] Deploy Maintenance contract
- [ ] Deploy Marketplace contract
- [ ] Deploy veTYT contract
- [ ] Deploy BurnScheduler contract
- [ ] Deploy FundSplitter contract
- [ ] Verify all contracts on TronScan
- [ ] Set up multi-sig for contract ownership
- [ ] Configure Oracle for BTC price feeds
- [ ] Set up automated cron jobs for burn events

---

<a name="database"></a>
## 5. БАЗА ДАННЫХ (PostgreSQL/Supabase)

### Database Overview

**Total Tables:** 50+
**Migrations:** 8 applied
**Security:** Row Level Security (RLS) enabled on all tables

### Core Schema

#### User Management

```sql
-- profiles: Extended user data
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  username text UNIQUE,
  kyc_status text DEFAULT 'pending',
  kyc_level integer DEFAULT 0,
  vip_level integer DEFAULT 0,
  total_hashrate numeric DEFAULT 0,
  rank_score numeric DEFAULT 0,
  owl_rank text DEFAULT 'worker',
  avatar_id uuid REFERENCES avatars(id),
  referred_by uuid REFERENCES profiles(id),
  referral_code text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- custodial_wallets: Multi-asset balances
CREATE TABLE custodial_wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  asset text NOT NULL, -- BTC, USDT, TYT, ETH, SOL, TRX, XRP
  balance numeric DEFAULT 0,
  locked_balance numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, asset)
);

-- wallet_transactions: All financial activity
CREATE TABLE wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  transaction_type text NOT NULL,
  asset text NOT NULL,
  amount numeric NOT NULL,
  fee numeric DEFAULT 0,
  status text DEFAULT 'pending',
  blockchain_tx_hash text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);
```

#### NFT Miners

```sql
-- nft_collections: Miner series
CREATE TABLE nft_collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  symbol text NOT NULL,
  contract_address text UNIQUE,
  total_supply integer DEFAULT 0,
  base_hashrate numeric NOT NULL,
  base_efficiency numeric NOT NULL,
  floor_price numeric,
  is_active boolean DEFAULT true,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- nft_miners: Individual miners
CREATE TABLE nft_miners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id text UNIQUE NOT NULL,
  owner_id uuid NOT NULL REFERENCES profiles(id),
  collection_id uuid NOT NULL REFERENCES nft_collections(id),
  name text NOT NULL,
  hashrate numeric NOT NULL CHECK (hashrate > 0),
  efficiency numeric NOT NULL CHECK (efficiency > 0),
  power_level integer DEFAULT 1 CHECK (power_level BETWEEN 1 AND 20),
  maintenance_rate numeric DEFAULT 0,
  farm_id text REFERENCES data_centers(id),
  status text DEFAULT 'active',
  is_listed boolean DEFAULT false,
  total_rewards_btc numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- miner_upgrades: Upgrade history
CREATE TABLE miner_upgrades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  miner_id uuid NOT NULL REFERENCES nft_miners(id),
  user_id uuid NOT NULL REFERENCES profiles(id),
  upgrade_type text NOT NULL, -- hashrate, efficiency, power_level
  from_value numeric NOT NULL,
  to_value numeric NOT NULL,
  cost numeric NOT NULL,
  cost_currency text DEFAULT 'TYT',
  created_at timestamptz DEFAULT now()
);

-- miner_upgrade_tiers: Cost schedule for 20 levels
CREATE TABLE miner_upgrade_tiers (
  level integer PRIMARY KEY CHECK (level BETWEEN 1 AND 20),
  max_hashrate numeric NOT NULL,
  upgrade_cost_tyt numeric NOT NULL,
  upgrade_cost_btc numeric,
  efficiency_improvement_percent numeric DEFAULT 5,
  description text
);
```

#### Rewards System

```sql
-- daily_rewards: BTC distribution tracking
CREATE TABLE daily_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  miner_id uuid NOT NULL REFERENCES nft_miners(id),
  reward_date date NOT NULL,
  gross_btc numeric NOT NULL,
  maintenance_cost_btc numeric NOT NULL,
  net_btc numeric NOT NULL,
  hashrate_snapshot_th numeric NOT NULL,
  global_difficulty numeric,
  merkle_leaf text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(miner_id, reward_date)
);

-- maintenance_invoices: Payment tracking
CREATE TABLE maintenance_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  miner_id uuid NOT NULL REFERENCES nft_miners(id),
  invoice_date date NOT NULL,
  electricity_cost_usd numeric NOT NULL,
  service_fee_usd numeric NOT NULL,
  total_usd numeric NOT NULL,
  discount_applied_pct numeric DEFAULT 0,
  final_amount_usd numeric NOT NULL,
  paid_in_asset text,
  status text DEFAULT 'pending',
  due_date date NOT NULL,
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- service_button_activations: Daily -3% discount
CREATE TABLE service_button_activations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  activation_date date NOT NULL DEFAULT CURRENT_DATE,
  discount_percent numeric DEFAULT 3,
  activated_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  maintenance_saved numeric DEFAULT 0,
  UNIQUE(user_id, activation_date)
);
```

#### Marketplace

```sql
-- marketplace_listings: P2P sales
CREATE TABLE marketplace_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  miner_id uuid NOT NULL REFERENCES nft_miners(id),
  seller_id uuid NOT NULL REFERENCES profiles(id),
  list_price_amount numeric NOT NULL,
  list_price_asset text DEFAULT 'TYT',
  listing_type text DEFAULT 'fixed_price',
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

-- marketplace_offers: Buyer bids
CREATE TABLE marketplace_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES marketplace_listings(id),
  buyer_id uuid NOT NULL REFERENCES profiles(id),
  offer_amount numeric NOT NULL,
  offer_currency text DEFAULT 'TYT',
  status text DEFAULT 'pending',
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- marketplace_sales: Completed transactions
CREATE TABLE marketplace_sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES marketplace_listings(id),
  miner_id uuid NOT NULL REFERENCES nft_miners(id),
  seller_id uuid NOT NULL REFERENCES profiles(id),
  buyer_id uuid NOT NULL REFERENCES profiles(id),
  sale_amount numeric NOT NULL,
  platform_fee_amount numeric NOT NULL,
  seller_net_amount numeric NOT NULL,
  referrer_commission_amount numeric DEFAULT 0,
  blockchain_tx_hash text,
  completed_at timestamptz DEFAULT now()
);
```

#### Game Wars (Miner Wars)

```sql
-- game_clans: Clan system (max 50 members)
CREATE TABLE game_clans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  tag text UNIQUE NOT NULL CHECK (length(tag) <= 6),
  leader_id uuid NOT NULL REFERENCES profiles(id),
  description text,
  total_members integer DEFAULT 1,
  total_hashrate numeric DEFAULT 0,
  total_btc_won numeric DEFAULT 0,
  global_rank integer,
  win_count integer DEFAULT 0,
  is_recruiting boolean DEFAULT true,
  min_hashrate_requirement numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- game_clan_members: Membership
CREATE TABLE game_clan_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clan_id uuid NOT NULL REFERENCES game_clans(id),
  user_id uuid NOT NULL REFERENCES profiles(id),
  rank text DEFAULT 'private', -- private, corporal, sergeant, lieutenant, captain, leader
  hashrate_contribution numeric DEFAULT 0,
  battles_participated integer DEFAULT 0,
  points_earned numeric DEFAULT 0,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(clan_id, user_id)
);

-- game_tournaments: Competitions
CREATE TABLE game_tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tournament_type text NOT NULL,
  status text DEFAULT 'upcoming',
  prize_pool_btc numeric DEFAULT 0,
  prize_pool_tyt numeric DEFAULT 0,
  winning_clan_id uuid REFERENCES game_clans(id),
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  min_hashrate numeric DEFAULT 0,
  entry_fee_tyt numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- game_boosts: Purchasable power-ups
CREATE TABLE game_boosts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  boost_type text NOT NULL,
  boost_name text NOT NULL,
  boost_value numeric NOT NULL,
  duration_hours integer NOT NULL,
  cost_tyt numeric NOT NULL,
  activated_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  is_active boolean DEFAULT true
);
```

#### VIP & Loyalty

```sql
-- vip_tiers: 11 levels (0-10)
CREATE TABLE vip_tiers (
  level integer PRIMARY KEY CHECK (level BETWEEN 0 AND 10),
  name text NOT NULL,
  min_hashrate numeric,
  min_voting_power numeric,
  requirement_type text DEFAULT 'either',
  maintenance_discount_percent numeric DEFAULT 0,
  marketplace_fee_discount_percent numeric DEFAULT 0,
  priority_support boolean DEFAULT false,
  early_access boolean DEFAULT false,
  exclusive_avatars boolean DEFAULT false,
  custom_badge text
);

-- avatars: Bonus NFTs
CREATE TABLE avatars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id text UNIQUE NOT NULL,
  owner_id uuid NOT NULL REFERENCES profiles(id),
  name text NOT NULL,
  rarity text NOT NULL, -- common, uncommon, rare, epic, legendary
  image_url text,
  boost_type text,
  boost_value numeric DEFAULT 0,
  is_equipped boolean DEFAULT false,
  is_tradeable boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- goboxes: VIP upgrade rewards
CREATE TABLE goboxes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  rarity text NOT NULL,
  vip_level_achieved integer NOT NULL,
  tyt_reward numeric DEFAULT 0,
  btc_reward numeric DEFAULT 0,
  avatar_id uuid REFERENCES avatars(id),
  boost_duration_hours integer DEFAULT 0,
  is_opened boolean DEFAULT false,
  opened_at timestamptz,
  created_at timestamptz DEFAULT now()
);
```

#### Referral System (5-5-5)

```sql
-- referral_earnings: Commission tracking
CREATE TABLE referral_earnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES profiles(id),
  referred_user_id uuid NOT NULL REFERENCES profiles(id),
  event_type text NOT NULL,
  base_amount numeric NOT NULL,
  commission_percent numeric NOT NULL,
  commission_amount numeric NOT NULL,
  status text DEFAULT 'pending',
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- ambassadors: High-tier referrers
CREATE TABLE ambassadors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  tier text DEFAULT 'bronze',
  status text DEFAULT 'active',
  purchase_commission_percent numeric DEFAULT 5,
  upgrade_commission_percent numeric DEFAULT 5,
  marketplace_commission_percent numeric DEFAULT 5,
  total_referrals integer DEFAULT 0,
  total_earnings_tyt numeric DEFAULT 0,
  custom_code text UNIQUE,
  assigned_at timestamptz DEFAULT now()
);
```

#### Token Economics

```sql
-- ve_tyt_locks: Governance voting power
CREATE TABLE ve_tyt_locks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  amount numeric NOT NULL,
  lock_duration_seconds bigint NOT NULL,
  voting_power numeric NOT NULL,
  locked_at timestamptz DEFAULT now(),
  unlock_at timestamptz NOT NULL,
  is_active boolean DEFAULT true,
  withdrawn_at timestamptz
);

-- governance_proposals: DAO voting
CREATE TABLE governance_proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposer_id uuid NOT NULL REFERENCES profiles(id),
  title text NOT NULL,
  description text NOT NULL,
  proposal_type text NOT NULL,
  status text DEFAULT 'active',
  votes_for numeric DEFAULT 0,
  votes_against numeric DEFAULT 0,
  quorum_required numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  voting_ends_at timestamptz NOT NULL,
  executed_at timestamptz
);

-- token_burn_events: Weekly schedule (Tuesdays 12:00 UTC)
CREATE TABLE token_burn_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scheduled_at timestamptz NOT NULL,
  collected_amount numeric NOT NULL,
  burned_amount numeric NOT NULL,
  charity_mint_amount numeric NOT NULL,
  burn_tx_hash text,
  mint_tx_hash text,
  status text DEFAULT 'scheduled',
  executed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- burn_mint_distributions: Stakeholder payouts
CREATE TABLE burn_mint_distributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  burn_event_id uuid NOT NULL REFERENCES token_burn_events(id),
  hashrate_providers_amount numeric NOT NULL,
  ve_lockers_amount numeric NOT NULL,
  community_treasury_amount numeric NOT NULL,
  charity_foundation_amount numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

#### Academy

```sql
-- academy_tracks: Learning paths
CREATE TABLE academy_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  difficulty_level integer DEFAULT 1,
  estimated_hours integer,
  is_published boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- academy_lessons: Course content
CREATE TABLE academy_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id uuid NOT NULL REFERENCES academy_tracks(id),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  content_mdx text NOT NULL,
  lesson_type text DEFAULT 'theory',
  xp_reward integer DEFAULT 0,
  is_published boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- user_lesson_progress: Completion tracking
CREATE TABLE user_lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  lesson_id uuid NOT NULL REFERENCES academy_lessons(id),
  status text DEFAULT 'not_started',
  xp_earned integer DEFAULT 0,
  completed_at timestamptz,
  UNIQUE(user_id, lesson_id)
);
```

#### Foundation

```sql
-- foundation_campaigns: Research funding
CREATE TABLE foundation_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  goal_usd numeric NOT NULL,
  raised_usd numeric DEFAULT 0,
  campaign_type text NOT NULL,
  status text DEFAULT 'active',
  start_date timestamptz NOT NULL,
  end_date timestamptz,
  featured_image_url text,
  created_at timestamptz DEFAULT now()
);

-- foundation_donations: Transparent tracking
CREATE TABLE foundation_donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES foundation_campaigns(id),
  donor_id uuid REFERENCES profiles(id),
  amount_usd numeric NOT NULL,
  source_transaction_id uuid REFERENCES wallet_transactions(id),
  is_anonymous boolean DEFAULT false,
  donated_at timestamptz DEFAULT now()
);

-- foundation_fund_distributions: Grant allocations
CREATE TABLE foundation_fund_distributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES foundation_campaigns(id),
  recipient_name text NOT NULL,
  amount_usd numeric NOT NULL,
  purpose text NOT NULL,
  report_url text,
  distributed_at timestamptz DEFAULT now()
);
```

### Database Functions

```sql
-- Calculate daily BTC reward for a miner
CREATE OR REPLACE FUNCTION calculate_daily_btc_reward(
  p_hashrate numeric,
  p_efficiency numeric,
  p_btc_network_hashrate numeric DEFAULT 400000000,
  p_btc_block_reward numeric DEFAULT 3.125,
  p_blocks_per_day numeric DEFAULT 144
) RETURNS numeric AS $$
DECLARE
  v_daily_btc numeric;
BEGIN
  v_daily_btc := (p_hashrate / p_btc_network_hashrate) * (p_btc_block_reward * p_blocks_per_day);
  v_daily_btc := v_daily_btc * (25.0 / GREATEST(p_efficiency, 1));
  RETURN v_daily_btc;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Calculate daily maintenance cost
CREATE OR REPLACE FUNCTION calculate_daily_maintenance(
  p_hashrate numeric,
  p_efficiency numeric,
  p_kwh_rate numeric DEFAULT 0.05,
  p_btc_price_usd numeric DEFAULT 40000
) RETURNS numeric AS $$
DECLARE
  v_daily_kwh numeric;
  v_daily_cost_usd numeric;
BEGIN
  v_daily_kwh := (p_efficiency * p_hashrate * 24) / 1000.0;
  v_daily_cost_usd := v_daily_kwh * p_kwh_rate;
  RETURN v_daily_cost_usd;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Get user's total discount percentage
CREATE OR REPLACE FUNCTION get_user_total_discount(
  p_user_id uuid,
  p_paying_with_tyt boolean,
  p_service_button_active boolean
) RETURNS numeric AS $$
DECLARE
  v_vip_level integer;
  v_vip_discount numeric;
  v_token_discount numeric := 0;
  v_service_discount numeric := 0;
  v_total_discount numeric;
BEGIN
  SELECT vip_level INTO v_vip_level FROM profiles WHERE id = p_user_id;
  SELECT maintenance_discount_percent INTO v_vip_discount FROM vip_tiers WHERE level = v_vip_level;

  IF p_paying_with_tyt THEN
    v_token_discount := 20;
  END IF;

  IF p_service_button_active THEN
    v_service_discount := 3;
  END IF;

  v_total_discount := LEAST(v_vip_discount + v_token_discount + v_service_discount, 50);
  RETURN v_total_discount;
END;
$$ LANGUAGE plpgsql;
```

---

<a name="modules"></a>
## 6. ФУНКЦИОНАЛЬНЫЕ МОДУЛИ

### 6.1 Authentication & KYC

**Components:**
- Email/password authentication with Supabase Auth
- 2FA (TOTP) for enhanced security
- Social login (Google, Apple) - optional
- KYC integration with Sumsub/Onfido
- 3-tier KYC system:
  - Level 0: Basic registration (no KYC) - $1,000 limit
  - Level 1: ID verification - $10,000 limit
  - Level 2: Enhanced verification - unlimited

**Flow:**
1. User signs up with email
2. Email verification required
3. Optional 2FA setup
4. KYC prompted at first deposit/withdrawal
5. Gradual level progression based on transaction volume

### 6.2 NFT Miner Management

**Features:**
- Browse miner collections
- View miner stats (hashrate, efficiency, power level, ROI)
- Upgrade miners (20 power levels: 100 TH/s → 5000 TH/s)
- Improve efficiency (reduce W/TH)
- Assign miners to data centers
- Track historical performance
- Enable/disable reinvestment mode

**Upgrade Economics:**
```
Level 1:  100 TH/s  →  Cost: 100 TYT (0.0025 BTC)
Level 5:  500 TH/s  →  Cost: 500 TYT (0.0125 BTC)
Level 10: 1500 TH/s →  Cost: 2000 TYT (0.05 BTC)
Level 15: 3000 TH/s →  Cost: 5000 TYT (0.125 BTC)
Level 20: 5000 TH/s →  Cost: 8000 TYT (0.2 BTC) [MAX]
```

### 6.3 Rewards & Maintenance

**Daily Reward Calculation:**
```
Gross BTC = (Miner Hashrate / Network Hashrate) × Daily Block Rewards
Efficiency Multiplier = 25 / Miner Efficiency (W/TH)
Final BTC = Gross BTC × Efficiency Multiplier
```

**Maintenance Cost:**
```
Daily kWh = (Efficiency × Hashrate × 24) / 1000
Electricity Cost = Daily kWh × kWh Rate ($0.05 default)
Service Fee = Electricity Cost × 10%
Gross Maintenance = Electricity Cost + Service Fee
```

**Discount Stacking (Max 50%):**
1. Token Payment Discount: -20% (pay in TYT)
2. Service Button: -3% (daily activation)
3. VIP Tier: 0-15% (levels 0-10)
4. Balance Coverage: 2-18% (20-360 days of maintenance pre-paid)

**Example:**
- Gross maintenance: $10/day
- Paying with TYT: -$2 (20%)
- Service button active: -$0.30 (3%)
- VIP level 5: -$0.50 (5%)
- Total discount: 28% → Net cost: $7.20/day

### 6.4 Marketplace

**Listing Types:**
- Fixed price (TYT only)
- Auction (coming soon)
- Make offer system

**Fees:**
- Platform fee: 3%
- Referrer commission: 5% (if applicable)
- Foundation donation: 1% (automatic)

**Security:**
- Escrow system via smart contract
- NFT locked during listing
- Instant settlement on purchase
- Dispute resolution via support

### 6.5 Game Wars (Miner Wars)

**Clan System:**
- Max 50 members per clan
- Ranks: Private → Corporal → Sergeant → Lieutenant → Captain → Leader
- Combined hashrate determines clan power
- Weekly clan battles

**Tournaments:**
- Weekly tournaments (every Saturday)
- Monthly championships
- Entry fee: 100-1000 TYT
- Prize pools: 1-10 BTC + 10,000-100,000 TYT

**Boosts:**
- Hashrate Multiplier: +10-50% for 1-24 hours
- Efficiency Boost: -5-20% W/TH improvement
- Maintenance Discount: Additional -5-15%
- Reward Multiplier: +10-30% BTC rewards

### 6.6 VIP Program

**11 Tiers (0-10):**

| Level | Name | Hashrate OR Voting Power | Maintenance Discount | Marketplace Fee |
|-------|------|--------------------------|---------------------|-----------------|
| 0 | Worker | 0 | 0% | 3% |
| 1 | Apprentice | 100 TH/s or 1,000 veTYT | 1% | 2.9% |
| 2 | Skilled | 250 TH/s or 2,500 veTYT | 2% | 2.8% |
| 3 | Expert | 500 TH/s or 5,000 veTYT | 3% | 2.7% |
| 4 | Master | 1,000 TH/s or 10,000 veTYT | 4% | 2.6% |
| 5 | Elite | 2,500 TH/s or 25,000 veTYT | 5% | 2.5% |
| 6 | Champion | 5,000 TH/s or 50,000 veTYT | 7% | 2.3% |
| 7 | Legend | 10,000 TH/s or 100,000 veTYT | 9% | 2.1% |
| 8 | Mythic | 25,000 TH/s or 250,000 veTYT | 11% | 1.9% |
| 9 | Immortal | 50,000 TH/s or 500,000 veTYT | 13% | 1.7% |
| 10 | Eternal Owl | 100,000 TH/s or 1M veTYT | 15% | 1.5% |

**Benefits:**
- Maintenance discounts (cumulative with other discounts)
- Reduced marketplace fees
- Priority customer support
- Early access to new features
- Exclusive avatars and badges
- GoBox rewards on level-up

### 6.7 Referral Program (5-5-5)

**Commission Structure:**
- Miner purchases: 5% of purchase price
- Miner upgrades: 5% of upgrade cost
- Marketplace sales: 5% of sale price
- Game boosts: 5% of boost cost

**Ambassador Program:**
- Bronze: 5 active referrals → 5% commission
- Silver: 25 active referrals → 6% commission
- Gold: 100 active referrals → 7% commission
- Platinum: 500 active referrals → 8% commission
- Diamond: 2,000 active referrals → 10% commission

**Tracking:**
- Custom referral codes
- Dashboard with earnings breakdown
- Real-time commission updates
- Monthly payouts in TYT

### 6.8 Academy (Educational Platform)

**Learning Tracks:**
1. Bitcoin Basics (5 lessons, 50 XP each)
2. Mining 101 (10 lessons, 100 XP each)
3. Blockchain Technology (15 lessons, 150 XP each)
4. DeFi & Trading (20 lessons, 200 XP each)
5. Advanced Mining Economics (25 lessons, 250 XP each)

**Features:**
- Interactive lessons with quizzes
- Video content and infographics
- Soulbound NFT certificates (non-transferable)
- XP progression system
- Owl Rank advancement

**Owl Ranks:**
- Worker: 0-1,000 XP
- Academic: 1,001-5,000 XP
- Diplomat: 5,001-15,000 XP
- Peacekeeper: 15,001-40,000 XP
- Warrior: 40,001+ XP

### 6.9 Foundation (Children's Brain Cancer)

**Funding Sources:**
- 1% of all platform transactions (automatic)
- Direct donations from users
- 10-25% of weekly token burns (Charity Mint)
- Corporate partnerships

**Transparency:**
- Public campaign tracking
- Real-time donation dashboard
- Quarterly impact reports
- Grant recipient updates
- Hospital partnerships showcase

**Current Focus:**
- Research grants for pediatric brain cancer
- Family support programs
- Medical equipment funding
- Clinical trial support

---

<a name="tokenomics"></a>
## 7. ТОКЕНОМИКА

### TYT Token Overview

**Token Information:**
- Name: Take Your Token
- Symbol: TYT
- Origin: Solana (pump.fun)
- Bridge: TRON (TRC-20) primary
- Max Supply: TBD (inflationary with burn mechanism)

### Utility

1. **Maintenance Payments** → 100% burned
2. **Miner Upgrades** → 100% burned
3. **Marketplace Currency** → 3% fee burned
4. **Game Boosts** → 100% burned
5. **Governance Voting** (via veTYT locks)
6. **VIP Level Qualification** (via veTYT)
7. **Academy Access** (premium courses)

### Burn & Mint Mechanism

**Weekly Burn Schedule:**
- Day: Tuesday
- Time: 12:00 UTC
- Frequency: Every week

**Burn Sources:**
- All maintenance payments
- All upgrade costs
- Marketplace fees (3%)
- Game boost purchases
- Manual burns from treasury

**Distribution After Burn:**
```
40% → Hashrate Providers (proportional to TH/s)
30% → veTYT Lockers (proportional to voting power)
20% → Community Treasury (governance-controlled)
10% → Foundation (+ up to 25% Charity Mint)
```

**Charity Mint:**
- Minted on Solana as new TYT
- Amount: 0-25% of burned TYT
- Destination: Foundation wallet
- Governance vote can adjust percentage

### veTYT (Vote-Escrowed TYT)

**Lock Periods:**
- Minimum: 1 week
- Maximum: 4 years (208 weeks)

**Voting Power Formula:**
```
Voting Power = TYT Amount × (Lock Time / Max Lock Time)

Examples:
- 1,000 TYT locked for 4 years = 1,000 veTYT
- 1,000 TYT locked for 2 years = 500 veTYT
- 1,000 TYT locked for 1 year = 250 veTYT
- 1,000 TYT locked for 1 month = ~21 veTYT
```

**Benefits:**
- Governance voting rights
- VIP level qualification (alternative to hashrate)
- Weekly distribution from burn events (30% share)
- Priority in platform decisions

**Decay:**
- Voting power decays linearly over time
- Users can extend lock or add more TYT
- No early unlock (except via governance proposal)

### Token Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      USER ACTIONS                            │
├──────────────┬──────────────┬──────────────┬────────────────┤
│ Buy Miners   │ Upgrade      │ Marketplace  │ Game Boosts    │
│ Pay in TYT   │ Pay in TYT   │ 3% Fee       │ Pay in TYT     │
└──────┬───────┴──────┬───────┴──────┬───────┴────────┬───────┘
       │              │              │                │
       └──────────────┴──────────────┴────────────────┘
                              ↓
                ┌─────────────────────────────┐
                │   BURN ACCUMULATOR WALLET   │
                │   Collects all TYT to burn  │
                └─────────────┬───────────────┘
                              ↓
                   Every Tuesday 12:00 UTC
                              ↓
                ┌─────────────────────────────┐
                │      BURN EVENT EXECUTED    │
                │   X TYT burned on TRON      │
                │   Y TYT minted on Solana    │
                │      (Charity Mint)         │
                └─────────────┬───────────────┘
                              ↓
        ┌─────────────────────┴──────────────────────┐
        │                                             │
        ↓                                             ↓
┌───────────────┐                           ┌─────────────────┐
│  DISTRIBUTION │                           │  CHARITY MINT   │
│   (Burned)    │                           │   (New TYT)     │
├───────────────┤                           ├─────────────────┤
│ 40% Hashrate  │                           │ → Foundation    │
│ 30% veTYT     │                           │ → Medical       │
│ 20% Treasury  │                           │ → Research      │
│ 10% Foundation│                           │ → Families      │
└───────────────┘                           └─────────────────┘
```

### Economic Sustainability

**Revenue Streams:**
1. Marketplace fees (3%)
2. Miner sale commissions
3. Upgrade revenue (partially funds operations)
4. Game boost sales
5. Partnership revenue

**Operational Costs:**
- BTC reward pool (must be maintained)
- Data center operations
- Platform development
- Marketing and growth
- Customer support

**Deflationary Pressure:**
- All maintenance → burned
- All upgrades → burned
- Marketplace fees → burned
- Game boosts → burned

**Inflationary Pressure:**
- Weekly Charity Mint (0-25% of burn)
- Governance can adjust mint percentage

**Net Effect:**
- Likely deflationary long-term
- Dependent on Charity Mint governance decisions
- Higher usage = more burn = stronger deflation

---

<a name="ux-flows"></a>
## 8. UX ПОТОКИ (User Flows)

### 8.1 Onboarding Flow

```
1. Landing Page
   ↓
2. Sign Up (email + password)
   ↓
3. Email Verification
   ↓
4. Welcome Dashboard (Tutorial overlay)
   ↓
5. Connect Wallet OR Use Custodial
   ↓
6. Browse Miner Collections
   ↓
7. Purchase First Miner (with on-ramp guidance)
   ↓
8. View Daily Rewards
```

### 8.2 Daily User Flow

```
1. Login (Email or Social)
   ↓
2. Dashboard Overview
   ├─→ Total Hashrate
   ├─→ Daily BTC Earned
   ├─→ Maintenance Due
   └─→ VIP Progress
   ↓
3. Check Notifications
   ├─→ Maintenance reminders
   ├─→ Reward notifications
   ├─→ Tournament invites
   └─→ Foundation updates
   ↓
4. Service Button (Press for -3% discount)
   ↓
5. Pay Maintenance (if due)
   ↓
6. Claim Daily Rewards
   ↓
7. Optional: Upgrade Miners, Join Battles, Complete Lessons
```

### 8.3 Miner Purchase Flow

```
1. Browse Marketplace
   ├─→ Filter by hashrate
   ├─→ Filter by price
   └─→ Sort by ROI
   ↓
2. Select Miner
   ↓
3. View Details
   ├─→ Current stats
   ├─→ Historical performance
   ├─→ Data center location
   └─→ ROI calculation
   ↓
4. Add Funds (if needed)
   ├─→ Crypto deposit
   ├─→ Card payment
   └─→ Third-party on-ramp
   ↓
5. Confirm Purchase (Pay in TYT for 20% discount)
   ↓
6. Receive NFT (TRON wallet or custodial)
   ↓
7. Start Earning BTC (next day)
```

### 8.4 Upgrade Flow

```
1. My Miners Page
   ↓
2. Select Miner to Upgrade
   ↓
3. View Upgrade Options
   ├─→ Hashrate upgrade (next power level)
   ├─→ Efficiency improvement
   └─→ Combined upgrade deal
   ↓
4. Cost Calculator
   ├─→ TYT cost
   ├─→ BTC cost (alternative)
   └─→ ROI improvement estimate
   ↓
5. Confirm Upgrade
   ↓
6. Transaction Processing
   ↓
7. Updated Stats (immediate)
   ↓
8. Higher Rewards (next day)
```

### 8.5 Marketplace Selling Flow

```
1. My Miners Page
   ↓
2. Select Miner to Sell
   ↓
3. Set List Price (TYT only)
   ├─→ View floor price
   ├─→ See recent sales
   └─→ Auto-suggest optimal price
   ↓
4. Create Listing
   ↓
5. Miner Locked (cannot earn while listed)
   ↓
6. Buyer Makes Offer OR Purchases
   ↓
7. Accept Offer (if applicable)
   ↓
8. Instant Settlement
   ├─→ Seller receives TYT (minus 3% fee)
   ├─→ Buyer receives NFT
   ├─→ Foundation receives 1%
   └─→ Referrer receives 5% (if applicable)
```

### 8.6 Governance Participation

```
1. Governance Page
   ↓
2. Lock TYT for veTYT
   ├─→ Choose amount
   ├─→ Choose duration (1 week - 4 years)
   └─→ See voting power calculation
   ↓
3. Confirm Lock
   ↓
4. Browse Active Proposals
   ├─→ Fee adjustments
   ├─→ Burn distribution changes
   ├─→ New features
   └─→ Treasury allocations
   ↓
5. Vote on Proposals
   ├─→ For / Against
   ├─→ Voting power applied
   └─→ See current results
   ↓
6. Earn from Burns (30% share)
   ↓
7. Extend Lock or Unlock (after expiry)
```

---

<a name="tech-stack"></a>
## 9. ТЕХНИЧЕСКИЙ СТЕК

### Frontend

**Web Application:**
- Framework: React 18 + TypeScript
- Routing: React Router v7
- Styling: Tailwind CSS 3.4
- Icons: Lucide React
- State Management: React Context + Hooks
- API Client: Supabase JS SDK
- Build Tool: Vite 5

**Mobile Apps (Planned):**
- iOS: Swift + SwiftUI
- Android: Kotlin + Jetpack Compose
- Cross-platform alternative: React Native

### Backend

**Database:**
- PostgreSQL 15 (Supabase)
- Real-time subscriptions
- Row Level Security (RLS)
- 50+ tables with full audit trails

**API Layer:**
- REST API via Supabase
- Supabase Edge Functions (Deno)
- Real-time WebSocket connections
- Serverless architecture

**Backend Services (Future: NestJS):**
- Auth Service (Supabase Auth + KYC)
- Rewards Engine (Daily BTC distribution)
- Marketplace Service (Escrow + Settlement)
- Game Engine (Tournaments + Leaderboards)
- Foundation Service (Donations + Reports)

### Blockchain

**Primary Chain: TRON**
- TYT Token: TRC-20
- Miner NFTs: TRC-721
- veTYT Locks: Custom contract
- Marketplace: Escrow contract

**Secondary Chains:**
- Solana: TYT origin (pump.fun) + Charity Mint
- Polygon: Optional bridge for wBTC miners
- BSC: Optional bridge for liquidity

**Web3 Integration:**
- TronWeb.js for TRON
- Solana Web3.js
- WalletConnect for multi-chain
- Custodial wallet option (no blockchain knowledge required)

### Infrastructure

**Hosting:**
- Frontend: Vercel / Netlify
- Database: Supabase Cloud
- Edge Functions: Supabase Edge Runtime
- Media Storage: S3 / IPFS

**DevOps:**
- CI/CD: GitHub Actions
- Monitoring: Sentry (errors) + PostHog (analytics)
- Logging: Supabase Logs
- Alerts: Discord webhooks

**Security:**
- SSL/TLS encryption
- Rate limiting (Kong API Gateway)
- DDoS protection (Cloudflare)
- KYC/AML (Sumsub/Onfido)
- Penetration testing (annual)
- Bug bounty program

### External Integrations

**Payment Gateways:**
- Stripe (cards)
- Ramp Network (crypto on-ramp)
- Transak (fiat on-ramp)
- Binance Pay
- Coinbase Pay

**Price Oracles:**
- Chainlink (BTC/USD, TYT/USD)
- Pyth Network (backup)
- CoinGecko API (fallback)

**KYC/AML:**
- Sumsub (primary)
- Onfido (backup)

**Communications:**
- SendGrid (emails)
- Twilio (SMS for 2FA)
- Discord (community + alerts)

---

<a name="api-spec"></a>
## 10. API СПЕЦИФИКАЦИЯ

### Authentication Endpoints

```typescript
POST /auth/signup
Body: { email, password, referralCode? }
Response: { user, session }

POST /auth/login
Body: { email, password }
Response: { user, session, accessToken }

POST /auth/logout
Headers: { Authorization: Bearer <token> }
Response: { success: boolean }

POST /auth/verify-email
Body: { token }
Response: { success: boolean }

POST /auth/2fa/enable
Headers: { Authorization: Bearer <token> }
Response: { secret, qrCode }

POST /auth/2fa/verify
Body: { code }
Response: { success: boolean }
```

### User Profile Endpoints

```typescript
GET /api/profile
Headers: { Authorization: Bearer <token> }
Response: Profile

PATCH /api/profile
Body: { username?, avatar_id? }
Response: Profile

GET /api/profile/stats
Response: {
  totalHashrate, totalRewardsBtc, vipLevel,
  owlRank, xpPoints, referralCount
}
```

### Miner Endpoints

```typescript
GET /api/miners
Query: { owner_id?, collection_id?, is_listed?, limit, offset }
Response: NFTMiner[]

GET /api/miners/:id
Response: NFTMiner & { collection, rewards[], upgrades[] }

POST /api/miners/:id/upgrade
Body: { upgradeType: 'hashrate' | 'efficiency', targetLevel }
Response: { miner: NFTMiner, transaction }

POST /api/miners/:id/assign-farm
Body: { farmId }
Response: NFTMiner

GET /api/miners/:id/performance
Query: { startDate, endDate }
Response: {
  dailyRewards: DailyReward[],
  totalBtc, avgHashrate, uptimePercent
}
```

### Rewards Endpoints

```typescript
GET /api/rewards
Query: { user_id?, miner_id?, startDate, endDate }
Response: DailyReward[]

GET /api/rewards/summary
Response: {
  todayBtc, weekBtc, monthBtc, allTimeBtc,
  pendingClaim, nextDistribution
}

POST /api/rewards/claim
Body: { rewardIds: uuid[] }
Response: { claimedAmount, txHash }
```

### Maintenance Endpoints

```typescript
GET /api/maintenance/invoices
Query: { status?, limit, offset }
Response: MaintenanceInvoice[]

POST /api/maintenance/pay
Body: { invoiceId, paymentAsset: 'TYT' | 'BTC' | 'USDT' }
Response: { invoice, transaction, appliedDiscounts }

POST /api/maintenance/service-button
Response: {
  activated: boolean,
  discount: number,
  expiresAt, maintenanceSaved
}

GET /api/maintenance/calculate
Query: { minerId, paymentAsset? }
Response: {
  grossCost, discounts[], netCost, breakdown
}
```

### Marketplace Endpoints

```typescript
GET /api/marketplace/listings
Query: {
  minHashrate?, maxPrice?, sortBy?, limit, offset
}
Response: MarketplaceListing[]

POST /api/marketplace/list
Body: {
  minerId, listPrice, listingType: 'fixed_price'
}
Response: MarketplaceListing

DELETE /api/marketplace/listings/:id
Response: { success: boolean }

POST /api/marketplace/offers
Body: { listingId, offerAmount, message? }
Response: MarketplaceOffer

POST /api/marketplace/offers/:id/accept
Response: {
  sale: MarketplaceSale,
  txHash, sellerAmount, buyerMiner
}

POST /api/marketplace/buy/:listingId
Response: {
  sale: MarketplaceSale,
  miner: NFTMiner, transaction
}
```

### Game Wars Endpoints

```typescript
GET /api/game/clans
Query: { isRecruiting?, minHashrate?, limit, offset }
Response: GameClan[]

POST /api/game/clans
Body: { name, tag, description, minHashrate }
Response: GameClan

POST /api/game/clans/:id/join
Response: GameClanMember

GET /api/game/tournaments
Query: { status?, type? }
Response: GameTournament[]

POST /api/game/tournaments/:id/enter
Body: { clanId? }
Response: { participant, entryFee, receipt }

GET /api/game/boosts
Response: {
  available: GameBoost[],
  active: GameBoost[]
}

POST /api/game/boosts/activate
Body: {
  boostType, duration, minerId?
}
Response: GameBoost & { transaction }
```

### Governance Endpoints

```typescript
POST /api/governance/lock
Body: { amount, duration }
Response: {
  lock: VeTytLock,
  votingPower, unlockDate, transaction
}

POST /api/governance/extend
Body: { lockId, newUnlockDate }
Response: VeTytLock

POST /api/governance/unlock
Body: { lockId }
Response: { amount, transaction }

GET /api/governance/proposals
Query: { status?, limit, offset }
Response: GovernanceProposal[]

POST /api/governance/vote
Body: { proposalId, vote: 'for' | 'against' }
Response: { votingPower, currentTally }
```

### Foundation Endpoints

```typescript
GET /api/foundation/campaigns
Query: { status?, type? }
Response: FoundationCampaign[]

GET /api/foundation/campaigns/:id
Response: FoundationCampaign & {
  donations[], distributions[], progress
}

POST /api/foundation/donate
Body: {
  campaignId?, amount, asset, isAnonymous?
}
Response: { donation, receipt, taxDocument? }

GET /api/foundation/impact
Response: {
  totalDonated, activeCampaigns,
  familiesSupported, researchGrants
}
```

### Academy Endpoints

```typescript
GET /api/academy/tracks
Response: AcademyTrack[]

GET /api/academy/tracks/:id/lessons
Response: AcademyLesson[]

POST /api/academy/lessons/:id/complete
Body: { quizAnswers? }
Response: {
  xpEarned, newOwlRank?, certificate?, progress
}

GET /api/academy/progress
Response: {
  completedLessons, totalXp, owlRank,
  certificates[], nextMilestone
}
```

---

<a name="roadmap"></a>
## 11. ДОРОЖНАЯ КАРТА

### Phase 0: Foundation (COMPLETE ✅)

**Duration:** December 2024
**Status:** Done

- [x] Project specification (PDF + Word docs)
- [x] Database schema design (50+ tables)
- [x] Migration scripts (8 migrations)
- [x] TypeScript type definitions
- [x] Utility functions (maintenance, upgrades, rewards)
- [x] TRON blockchain integration setup
- [x] Authentication flow (Supabase)
- [x] Basic frontend structure (React + Tailwind)

### Phase 1: MVP Launch (Months 1-3)

**Target:** Q1 2025

**Core Features:**
- [ ] Complete UI for all main pages
- [ ] Smart contract deployment (TRON mainnet)
  - TYT Token (TRC-20)
  - MinerNFT (TRC-721)
  - Marketplace Escrow
  - veTYT Locks
- [ ] Custodial wallet integration
- [ ] Miner purchase flow
- [ ] Daily rewards engine
- [ ] Maintenance payment system
- [ ] Basic marketplace (fixed-price listings)
- [ ] KYC integration (Sumsub Level 1)
- [ ] Payment on-ramp (Stripe + Ramp Network)

**Deliverables:**
- Web app (desktop + mobile responsive)
- Smart contracts (audited)
- Admin dashboard
- Documentation site

### Phase 2: Gaming & Social (Months 4-6)

**Target:** Q2 2025

**New Features:**
- [ ] Miner Wars (clan system)
- [ ] Tournament engine
- [ ] Game boosts marketplace
- [ ] Service button (daily discount)
- [ ] VIP tier system
- [ ] GoBox distribution
- [ ] Referral dashboard
- [ ] Ambassador program
- [ ] Social features (chat, leaderboards)
- [ ] Mobile app beta (iOS + Android)

**Marketing:**
- Influencer partnerships
- Community building (Discord/Telegram)
- First tournament (10 BTC prize pool)
- Ambassador recruitment

### Phase 3: Education & Foundation (Months 7-9)

**Target:** Q3 2025

**New Modules:**
- [ ] Academy platform
  - 5 learning tracks
  - 75+ lessons
  - Interactive quizzes
  - Soulbound certificates
- [ ] Foundation transparency dashboard
- [ ] Campaign creation tools
- [ ] Direct donation portal
- [ ] Impact reports (quarterly)
- [ ] Hospital partnership showcase

**Content:**
- Bitcoin/Blockchain education
- Mining economics courses
- DeFi trading guides
- Video tutorials

### Phase 4: Governance & Decentralization (Months 10-12)

**Target:** Q4 2025

**DAO Launch:**
- [ ] veTYT full implementation
- [ ] Proposal creation interface
- [ ] Voting system
- [ ] Treasury management
- [ ] Parameter adjustment (fees, burn %)
- [ ] Weekly burn automation
- [ ] Charity Mint governance
- [ ] Multi-sig treasury

**Decentralization:**
- Transfer platform control to DAO
- Community-elected moderators
- Open-source selected components
- Bug bounty program

### Phase 5: Expansion (Year 2)

**Target:** 2026

**New Chains:**
- [ ] Polygon bridge (wBTC miners)
- [ ] Solana integration (native TYT)
- [ ] TON blockchain support
- [ ] BSC liquidity pools

**Advanced Features:**
- [ ] Miner derivatives (hashrate futures)
- [ ] Lending protocol (borrow against NFTs)
- [ ] Insurance products
- [ ] Institutional mining (large-scale)
- [ ] Live stream integration (24/7 data center cams)
- [ ] API for third-party developers

**Global Growth:**
- Multi-language support (10+ languages)
- Regional partnerships
- Physical mining facilities
- Regulatory compliance (EU, US, APAC)

### Phase 6: Maturity (Year 3+)

**Long-term Goals:**
- 100,000+ active miners (NFTs minted)
- 10,000+ daily active users
- $1B+ in total value locked
- Top 3 Bitcoin mining platform by hashrate
- #1 charity-backed crypto project
- $10M+ raised for children's brain cancer research

---

<a name="compliance"></a>
## 12. КОМПЛАЕНС И ЮРИДИЧЕСКИЕ АСПЕКТЫ

### Legal Structure

**Platform Entity:**
- Jurisdiction: Delaware, USA (or Cayman Islands)
- Structure: LLC or Foundation
- Purpose: Technology platform operator

**Foundation Entity:**
- Jurisdiction: Israel or EU (Netherlands)
- Structure: Non-profit 501(c)(3) equivalent
- Purpose: Charitable activities

### Regulatory Compliance

**Securities Law:**
- NFT miners = utility tokens, NOT securities
- No promises of guaranteed returns
- Dynamic reward formulas (based on BTC network)
- Educational disclaimers on all pages
- No ROI marketing claims

**AML/KYC:**
- KYC required for withdrawals > $1,000
- Enhanced KYC for > $10,000
- Transaction monitoring
- Suspicious activity reporting
- Sanctions screening (OFAC compliance)

**Consumer Protection:**
- Clear Terms of Service
- Privacy Policy (GDPR compliant)
- Cookie consent
- Right to be forgotten
- Data export functionality

**Tax Compliance:**
- User tax reporting tools
- 1099 forms (US users)
- Transaction history exports
- Partnership with tax software (CoinTracker)

### Risk Disclosures

**User Agreements Must Include:**
1. Cryptocurrency volatility risks
2. Mining profitability not guaranteed
3. Maintenance costs may exceed rewards
4. Platform operational risks
5. Smart contract risks
6. Regulatory changes
7. No FDIC/SIPC insurance

**Platform Safeguards:**
- Reserve fund for operational continuity
- Insurance coverage (cyber, D&O)
- Multi-sig wallets
- Regular security audits
- Incident response plan

### Intellectual Property

**Trademarks:**
- "Take Your Token" ® (pending)
- "TYT" ® (pending)
- Logo and brand assets

**Patents:**
- Consider utility patents for:
  - Charity Mint mechanism
  - Service Button discount system
  - veTYT governance model

**Open Source:**
- Smart contracts (audited and verified)
- API documentation
- SDK/libraries

### Data Protection (GDPR)

**User Rights:**
- Right to access data
- Right to rectification
- Right to erasure
- Right to data portability
- Right to object

**Implementation:**
- Data encryption (at rest and in transit)
- Minimal data collection
- Pseudonymization where possible
- Regular security assessments
- DPO appointed

### Foundation Governance

**Board Structure:**
- 5-7 board members
- Medical professionals (2)
- Crypto/tech experts (2)
- Community representatives (2-3)
- Independent auditor

**Transparency:**
- Public financial statements (annual)
- Donation tracking (real-time)
- Grant decisions (documented)
- Impact metrics (quarterly)

**Audit:**
- Annual financial audit (Big 4 firm)
- Smart contract audit (Trail of Bits, etc.)
- Compliance audit (KYC/AML)