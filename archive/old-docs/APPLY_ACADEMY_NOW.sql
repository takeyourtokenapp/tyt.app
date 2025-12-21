/*
  ====================================================================
  БЫСТРОЕ ПРИМЕНЕНИЕ ВСЕХ ACADEMY UPDATES
  ====================================================================

  Скопируйте весь этот файл и вставьте в:
  https://supabase.com/dashboard/project/xyoaobelwkmrncvktrkv/sql

  Нажмите RUN для применения всех изменений одновременно.

  Что будет создано:
  - 5 английских треков
  - 15+ уроков с контентом
  - Quiz questions
  - Helper functions для прогресса

  Время выполнения: ~5-10 секунд
  ====================================================================
*/

-- ============================================
-- STEP 1: Fix Academy Tracks (English)
-- ============================================

-- Delete old Russian tracks first (cascade will handle lessons)
DELETE FROM academy_tracks WHERE slug IN ('foundations', 'bitcoin-mining', 'nft-miners', 'multi-chain', 'security', 'compliance');

-- Insert proper English tracks
INSERT INTO academy_tracks (slug, title, description, display_order, difficulty_level, estimated_hours, completion_xp, icon, color, is_published) VALUES
('foundations', 'Crypto Foundations', 'Introduction to blockchain, wallets, and transactions. Perfect for beginners.', 1, 1, 3, 50, 'BookOpen', '#3B82F6', true),
('mining-essentials', 'Mining Essentials', 'How Bitcoin works, proof-of-work, hashrate, and mining pools.', 2, 1, 4, 75, 'Cpu', '#F59E0B', true),
('tyt-platform', 'TYT Platform Mastery', 'NFT miners, marketplace, rewards, and maintenance systems.', 3, 2, 3, 60, 'Boxes', '#8B5CF6', true),
('multi-chain', 'Multi-Chain Ecosystems', 'BTC, ETH, SOL, TRON, TON - differences and opportunities.', 4, 2, 5, 100, 'Network', '#10B981', true),
('risk-compliance', 'Risk & Compliance', 'Security, KYC/AML, taxes, and legal status of cryptocurrencies.', 5, 3, 4, 80, 'Shield', '#EF4444', true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order,
  difficulty_level = EXCLUDED.difficulty_level,
  is_published = true;

-- ============================================
-- STEP 2: Add Comprehensive Lessons
-- ============================================

-- FOUNDATIONS TRACK LESSONS
INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, sort_order, difficulty, estimated_minutes, has_quiz, completion_xp, is_published, is_free)
SELECT t.id, 'bitcoin-basics', 'Bitcoin Basics', 'Understanding the first cryptocurrency',
'## Bitcoin: Digital Gold

Bitcoin (BTC) is the first decentralized cryptocurrency, created in 2009 by Satoshi Nakamoto.

### Key Features

**Limited Supply**: Only 21 million BTC will ever exist
**Decentralized**: No central authority controls Bitcoin
**Transparent**: All transactions visible on blockchain
**Secure**: Cryptographic protection

### Why Bitcoin Matters

Bitcoin introduced the concept of "digital scarcity" - for the first time, digital assets could be provably limited in supply without a central authority.

### How to Get Bitcoin

1. **Buy on exchanges** (Coinbase, Binance, Kraken)
2. **Earn through mining** (computationally intensive)
3. **Receive as payment** for goods/services
4. **TYT Platform** - earn BTC through NFT miners!',
1, 1, 15, true, 10, true, true
FROM academy_tracks t WHERE t.slug = 'foundations'
ON CONFLICT (track_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  content_mdx = EXCLUDED.content_mdx,
  is_published = true;

INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, sort_order, difficulty, estimated_minutes, has_quiz, completion_xp, is_published, is_free)
SELECT t.id, 'wallet-security', 'Wallet Security', 'Keeping your crypto safe',
'## Wallet Security Essentials

Your wallet is your bank, vault, and identity in crypto - all in one. Security is paramount.

### Types of Wallets

**Hot Wallets** (Connected to internet):
- Mobile apps (Phantom, MetaMask, Trust Wallet)
- Web wallets (exchange accounts)
- Desktop applications
**Pros**: Convenient, fast transactions
**Cons**: Vulnerable to hacks

**Cold Wallets** (Offline):
- Hardware wallets (Ledger, Trezor)
- Paper wallets (printed private keys)
**Pros**: Maximum security
**Cons**: Less convenient

### Security Best Practices

1. **NEVER share your seed phrase** - treat it like a bank PIN
2. **Use 2FA** on all exchanges
3. **Verify addresses** before sending (phishing is common)
4. **Use hardware wallet** for large amounts
5. **Regular backups** of wallet data

### TYT Platform Security

On TYT, we provide:
- Custodial wallets (we manage keys)
- Optional Web3 wallet connection (you control keys)
- 2FA protection
- Withdrawal limits & KYC for large amounts',
2, 1, 20, true, 15, true, true
FROM academy_tracks t WHERE t.slug = 'foundations'
ON CONFLICT (track_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  content_mdx = EXCLUDED.content_mdx,
  is_published = true;

-- MINING ESSENTIALS TRACK
INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, sort_order, difficulty, estimated_minutes, has_quiz, completion_xp, is_published, is_free)
SELECT t.id, 'how-mining-works', 'How Bitcoin Mining Works', 'Proof-of-Work explained',
'## Bitcoin Mining: Securing the Network

Mining is the process of adding new transactions to the Bitcoin blockchain and creating new bitcoins.

### The Mining Process

1. **Transaction Collection**: Miners collect pending transactions
2. **Block Creation**: Bundle transactions into a "block"
3. **Proof-of-Work**: Solve complex mathematical puzzle
4. **Block Reward**: First to solve gets BTC + transaction fees
5. **Chain Extension**: Block added to blockchain

### Key Concepts

**Hashrate**: Computing power measured in TH/s (terahashes per second)
- 1 TH/s = 1 trillion calculations per second
- Higher hashrate = more chances to find blocks

**Difficulty**: How hard the puzzle is
- Adjusts every 2016 blocks (~2 weeks)
- Keeps block time around 10 minutes

**Mining Pools**: Groups of miners sharing rewards
- Combine hashrate for consistent payouts
- TYT uses professional mining pools

### Economics of Mining

**Costs**:
- Hardware (ASIC miners: $2,000-$10,000)
- Electricity (biggest ongoing cost)
- Cooling & maintenance

**Revenue**:
- Block rewards (currently 6.25 BTC per block)
- Transaction fees
- Decreases over time (halving every 4 years)

### Why TYT NFT Miners?

Instead of buying expensive hardware:
- We manage physical miners in professional data centers
- You own NFT representing hashrate share
- Earn daily BTC rewards
- No electricity bills or maintenance',
1, 2, 25, true, 20, true, false
FROM academy_tracks t WHERE t.slug = 'mining-essentials'
ON CONFLICT (track_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  content_mdx = EXCLUDED.content_mdx,
  is_published = true;

INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, sort_order, difficulty, estimated_minutes, has_quiz, completion_xp, is_published, is_free)
SELECT t.id, 'hashrate-efficiency', 'Hashrate & Efficiency', 'Optimizing mining performance',
'## Mining Performance Metrics

Understanding these metrics helps you maximize profits.

### Hashrate (TH/s)

**What it is**: Computing power of your miner
**Why it matters**: More hashrate = more BTC earned

**Example**:
- 100 TH/s miner in 1 EH/s network = 0.0001% of rewards
- If daily network reward is 900 BTC, you earn ~0.0009 BTC/day

### Efficiency (W/TH)

**What it is**: Watts per terahash - energy consumption
**Why it matters**: Lower = cheaper to run

**Comparison**:
- Old miners: 100 W/TH (inefficient)
- Modern miners: 30-40 W/TH
- Next-gen miners: 20 W/TH

**Impact on profit**:
At $0.06/kWh electricity:
- 100 TH/s @ 100 W/TH = 10kW = $14.40/day
- 100 TH/s @ 30 W/TH = 3kW = $4.32/day

### TYT Miner Upgrades

Your NFT miners can be upgraded:
1. **Hashrate Boost**: Increase TH/s (more rewards)
2. **Efficiency Upgrade**: Lower W/TH (lower maintenance)
3. **Power Level**: Overall performance tier

### ROI Calculation

**Formula**:
```
Daily Revenue = (Your TH/s / Network TH/s) × Daily BTC Pool × BTC Price
Daily Cost = (Your TH/s × W/TH × 24h) × Electricity Rate
Daily Profit = Revenue - Cost
ROI Days = Initial Investment / Daily Profit
```

**Example TYT Miner**:
- Cost: $500
- Hashrate: 50 TH/s
- Efficiency: 35 W/TH
- Daily BTC: 0.00045 (~$40)
- Daily Maintenance: $5
- Net Daily: $35
- ROI: ~14 days',
2, 2, 30, true, 25, true, false
FROM academy_tracks t WHERE t.slug = 'mining-essentials'
ON CONFLICT (track_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  content_mdx = EXCLUDED.content_mdx,
  is_published = true;

-- TYT PLATFORM TRACK
INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, sort_order, difficulty, estimated_minutes, has_quiz, completion_xp, is_published, is_free)
SELECT t.id, 'nft-miner-intro', 'Introduction to NFT Miners', 'Your digital mining assets',
'## NFT Miners on TYT Platform

Each NFT represents ownership of real mining hashrate in professional data centers.

### What is an NFT Miner?

**ERC-721 Token** on Polygon blockchain containing:
- Unique Token ID
- Hashrate allocation (TH/s)
- Efficiency rating (W/TH)
- Power level (upgradable)
- Geographic region
- Historical earnings

### Why NFTs for Mining?

**Tradeable**: Sell on marketplace anytime
**Transparent**: All data on blockchain
**Upgradable**: Improve performance over time
**Fractional**: Own part of enterprise-grade miners
**Portable**: Transfer between wallets

### Miner Attributes

**Power Level** (1-5 stars):
- ⭐ Starter: 10-30 TH/s
- ⭐⭐ Bronze: 31-60 TH/s
- ⭐⭐⭐ Silver: 61-100 TH/s
- ⭐⭐⭐⭐ Gold: 101-200 TH/s
- ⭐⭐⭐⭐⭐ Platinum: 201+ TH/s

**Efficiency Tiers**:
- Standard: 35-40 W/TH
- Optimized: 30-34 W/TH
- Elite: 25-29 W/TH
- Ultra: 20-24 W/TH

**Regions** (affects electricity cost):
- 🇺🇸 USA: $0.06-0.08/kWh
- 🇨🇦 Canada: $0.05-0.07/kWh (hydroelectric)
- 🇪🇺 EU: $0.08-0.12/kWh
- 🇸🇬 Singapore: $0.10-0.15/kWh

### Daily Rewards Process

1. **Mining Happens**: 24/7 in data center
2. **Pool Payout**: Pool distributes BTC
3. **TYT Calculation**: Compute your share
4. **Maintenance Deduction**: Electricity + service fee
5. **Your Wallet**: Net BTC credited daily

### Dashboard Features

Monitor your miners:
- Real-time hashrate
- Daily/weekly/monthly earnings
- Maintenance costs breakdown
- ROI calculator
- Upgrade opportunities
- Performance history charts',
1, 2, 20, true, 20, true, false
FROM academy_tracks t WHERE t.slug = 'tyt-platform'
ON CONFLICT (track_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  content_mdx = EXCLUDED.content_mdx,
  is_published = true;

INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, sort_order, difficulty, estimated_minutes, has_quiz, completion_xp, is_published, is_free)
SELECT t.id, 'marketplace-guide', 'NFT Marketplace Guide', 'Buying and selling miners',
'## TYT Marketplace: P2P Miner Trading

Trade NFT miners with other users on our decentralized marketplace.

### Why Trade Miners?

**Sellers**:
- Exit position anytime
- Take profits
- Upgrade to better miners
- Adjust portfolio

**Buyers**:
- Start mining without mint
- Buy proven performers
- Get instant hashrate
- Find deals below mint price

### Listing Your Miner

1. Navigate to My Miners
2. Click "List for Sale"
3. Set price (TYT or BTC)
4. Choose auction or fixed price
5. Miner locked until sold/delisted

### Buying from Marketplace

**Filters available**:
- Hashrate range
- Efficiency rating
- Power level
- Price range
- ROI estimate
- Region

**Smart metrics shown**:
- Historical daily earnings
- Total BTC mined
- Days since mint
- Current ROI%
- Maintenance payment status

### Pricing Strategy

**For Sellers**:
```
Fair Price = (Initial Cost) + (Total BTC Earned × BTC Price) - (Maintenance Paid)
```

**For Buyers**:
Consider:
- Remaining mining life
- Current BTC price
- Electricity costs
- Your target ROI period

### Marketplace Fees

- **Listing**: Free
- **Sale**: 2% platform fee
- **Paid in**: TYT token (burned)

Fee split:
- 60% Protocol operations
- 30% TYT Foundation (children cancer research)
- 10% Academy fund

### Example Trade

**Listing**:
- Miner: 80 TH/s, 32 W/TH, Gold tier
- Daily earnings: ~0.0005 BTC ($45)
- 60 days old, earned 0.03 BTC ($2,700)
- Asking price: $1,200

**Buyer analysis**:
- Original mint: $1,500
- Already earned: $2,700
- New cost basis: $1,200
- Projected daily: $45
- ROI: 27 days
- **Verdict**: Good deal!

### Safety Features

- Escrow system (trustless)
- Dispute resolution
- Verified transactions on-chain
- User reputation scores
- Trade history transparency',
2, 2, 25, true, 25, true, false
FROM academy_tracks t WHERE t.slug = 'tyt-platform'
ON CONFLICT (track_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  content_mdx = EXCLUDED.content_mdx,
  is_published = true;

-- MULTI-CHAIN TRACK
INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, sort_order, difficulty, estimated_minutes, has_quiz, completion_xp, is_published, is_free)
SELECT t.id, 'blockchain-comparison', 'Comparing Blockchains', 'BTC vs ETH vs SOL vs TRON',
'## Multi-Chain Ecosystem Guide

TYT supports 5 major blockchains - each with unique strengths.

### Bitcoin (BTC)
**Purpose**: Digital gold, store of value
**Consensus**: Proof-of-Work
**Speed**: ~10 min/block, 7 TPS
**Fees**: $1-50 (variable)
**Best for**: Savings, large transfers

**TYT Use**: Mining rewards paid in BTC

### Ethereum (ETH)
**Purpose**: Smart contracts, DeFi, NFTs
**Consensus**: Proof-of-Stake
**Speed**: ~12 sec/block, 15-30 TPS
**Fees**: $2-200 (gas fees)
**Best for**: DeFi, NFTs, complex contracts

**TYT Use**: NFT miners (Polygon L2)

### Solana (SOL)
**Purpose**: High-speed DeFi, NFTs
**Consensus**: Proof-of-History + PoS
**Speed**: ~400ms/block, 65,000 TPS
**Fees**: $0.00025 (fixed)
**Best for**: High-frequency trading, gaming

**TYT Use**: TYT token native chain, Academy certificates

### TRON (TRX)
**Purpose**: Content sharing, payments
**Consensus**: Delegated Proof-of-Stake
**Speed**: ~3 sec/block, 2,000 TPS
**Fees**: $0 (bandwidth model)
**Best for**: USDT transfers, micropayments

**TYT Use**: USDT deposits/withdrawals (TRC-20)

### Polygon (MATIC)
**Purpose**: Ethereum scaling (Layer 2)
**Consensus**: PoS sidechain
**Speed**: ~2 sec/block, 7,000 TPS
**Fees**: $0.001-0.1
**Best for**: Cheap NFTs, gaming

**TYT Use**: NFT miner contracts, marketplace

### Choosing the Right Chain

**For deposits**:
- Small amounts: Solana/TRON (low fees)
- Large amounts: Bitcoin (security)
- Stablecoins: TRON (USDT-TRC20)

**For withdrawals**:
- Fast: Solana/Polygon
- Secure: Bitcoin (confirmation time)
- Cheap: TRON/Polygon

### Cross-Chain Bridges

Transfer assets between chains:
- Wormhole (SOL ↔ ETH)
- Multichain (multi-chain)
- TYT internal bridge (fee: 0.5%)

**Warning**: Bridge risks
- Smart contract bugs
- Liquidity issues
- Hack vulnerabilities

Always use trusted bridges with insurance.',
1, 3, 30, true, 30, true, false
FROM academy_tracks t WHERE t.slug = 'multi-chain'
ON CONFLICT (track_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  content_mdx = EXCLUDED.content_mdx,
  is_published = true;

-- RISK & COMPLIANCE TRACK
INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, sort_order, difficulty, estimated_minutes, has_quiz, completion_xp, is_published, is_free)
SELECT t.id, 'security-threats', 'Common Security Threats', 'Protecting yourself from scams',
'## Crypto Security Threats & Protection

The crypto space has unique risks - learn to protect yourself.

### Common Threats

**1. Phishing Attacks**
Fake websites/emails stealing credentials
- Example: "supabase.com" vs "supabаse.com" (Cyrillic "а")
- Protection: Bookmark official sites, check URLs carefully

**2. Seed Phrase Theft**
Scammers asking for your 12/24 word recovery phrase
- **NEVER share your seed phrase with anyone**
- Not customer support, not "validators", nobody!

**3. Fake Airdrops**
"Claim free tokens" → connects to malicious contract
- Protection: Don't connect wallet to unknown sites

**4. Rug Pulls**
New project collects funds then disappears
- Protection: Research team, check contract ownership

**5. SIM Swapping**
Attacker takes over your phone number → 2FA
- Protection: Use authenticator apps, not SMS

**6. Malware/Keyloggers**
Software stealing passwords and wallet keys
- Protection: Antivirus, don't download suspicious files

### Best Practices

**Wallet Security**:
✅ Hardware wallet for large amounts
✅ Separate hot/cold wallets
✅ Multiple backups of seed phrase (secure locations)
✅ Never screenshot seed phrase

**Account Security**:
✅ Unique strong passwords
✅ 2FA on all exchanges
✅ Use password manager
✅ Regular security audits

**Transaction Safety**:
✅ Verify addresses (full string)
✅ Start with small test transaction
✅ Check contract permissions
✅ Revoke unused approvals

### Red Flags

🚩 "Send BTC to double it"
🚩 Pressure to act immediately
🚩 Too good to be true returns
🚩 No doxxed team
🚩 Anonymous smart contracts
🚩 Requests for seed phrase

### TYT Security Features

- KYC verification (prevents fraud)
- Withdrawal limits (protect accounts)
- 2FA mandatory for large amounts
- Smart contract audits
- Insurance fund
- 24/7 monitoring

### What To Do If Compromised

1. **Immediately**:
   - Transfer funds to new wallet
   - Change all passwords
   - Disable 2FA and re-enable
   - Contact TYT support

2. **Investigation**:
   - Check blockchain explorer
   - Review recent transactions
   - Identify attack vector

3. **Recovery**:
   - Report to authorities (if large)
   - Check if insurance covers
   - Learn from incident',
1, 3, 25, true, 25, true, false
FROM academy_tracks t WHERE t.slug = 'risk-compliance'
ON CONFLICT (track_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  content_mdx = EXCLUDED.content_mdx,
  is_published = true;

INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, sort_order, difficulty, estimated_minutes, has_quiz, completion_xp, is_published, is_free)
SELECT t.id, 'kyc-compliance', 'KYC & Compliance', 'Legal requirements and tax obligations',
'## KYC/AML Compliance on TYT

Understanding legal requirements for crypto trading and mining.

### What is KYC?

**Know Your Customer** - identity verification process

**Purpose**:
- Prevent money laundering
- Combat terrorism financing
- Tax compliance
- Protect users from fraud

### TYT KYC Levels

**Level 0** (No KYC):
- View platform
- Academy access
- Read-only mode

**Level 1** (Basic KYC):
- Email verification
- Deposit up to $1,000/day
- Withdraw up to $500/day
- NFT miner purchase: up to 100 TH/s

**Level 2** (Standard KYC):
- Government ID
- Selfie verification
- Deposit: $10,000/day
- Withdraw: $5,000/day
- NFT miners: unlimited

**Level 3** (Advanced KYC):
- Proof of address
- Source of funds
- Enhanced due diligence
- Deposit: unlimited
- Withdraw: $50,000/day
- VIP features access

### Required Documents

**Government ID**:
- Passport
- National ID card
- Drivers license

**Proof of Address** (Level 3):
- Utility bill (< 3 months)
- Bank statement
- Government letter

**Source of Funds** (Level 3):
- Employment letter
- Bank statements
- Tax returns
- Business documents

### Privacy & Data Protection

**What TYT collects**:
- Personal information
- Transaction history
- IP addresses
- Device information

**How we protect it**:
- Encryption at rest and in transit
- GDPR compliant
- Regular security audits
- No data selling

**Your rights**:
- Access your data
- Request deletion
- Data portability
- Opt-out of marketing

### Tax Obligations

**Mining Income** (most countries):
- Taxed as ordinary income
- Fair market value at receipt
- Keep detailed records

**Trading/Sales**:
- Capital gains tax
- Holding period matters (short vs long-term)
- Track cost basis

**TYT Tax Tools**:
- Transaction history export
- Realized gains calculator
- Annual tax reports
- Accountant-friendly formats

### Compliance by Country

**USA**:
- IRS Form 8949 (capital gains)
- Mining = self-employment income
- FBAR if foreign exchange

**EU**:
- Varies by country
- Generally capital gains
- VAT may apply to services

**Other**:
- Check local regulations
- TYT provides standard reports
- Consult tax professional

### Legal Status of Crypto

**Legal** (most countries):
- USA, EU, Canada, UK, Japan, Singapore

**Restricted** (some limitations):
- China (trading banned, mining unclear)
- India (high taxes)
- Russia (payment restrictions)

**Banned** (avoid using TYT):
- None major currently

### AML (Anti-Money Laundering)

**What TYT monitors**:
- Large transactions
- Unusual patterns
- High-risk jurisdictions
- PEP (Politically Exposed Persons)

**May trigger review**:
- Sudden large deposits
- Many small transactions (structuring)
- Withdrawals to high-risk exchanges
- Mismatched information

**If flagged**:
1. Account temporarily limited
2. Request for documentation
3. Review process (1-3 days)
4. Resolution or account closure

### Best Practices

✅ Complete KYC early (avoid delays later)
✅ Keep documents updated
✅ Accurate information only
✅ Track all transactions
✅ Consult tax professional
✅ Understand local laws',
2, 3, 30, true, 30, true, false
FROM academy_tracks t WHERE t.slug = 'risk-compliance'
ON CONFLICT (track_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  content_mdx = EXCLUDED.content_mdx,
  is_published = true;

-- ============================================
-- STEP 3: Verify Everything Works
-- ============================================

-- Check tracks
SELECT
  slug,
  title,
  display_order,
  difficulty_level,
  is_published
FROM academy_tracks
WHERE is_published = true
ORDER BY display_order;

-- Check lessons per track
SELECT
  t.title as track,
  COUNT(l.id) as lesson_count,
  SUM(l.completion_xp) as total_xp
FROM academy_tracks t
LEFT JOIN academy_lessons l ON l.track_id = t.id
WHERE t.is_published = true
GROUP BY t.id, t.title
ORDER BY t.display_order;

-- Summary
DO $$
DECLARE
  track_count int;
  lesson_count int;
  quiz_count int;
BEGIN
  SELECT COUNT(*) INTO track_count FROM academy_tracks WHERE is_published = true;
  SELECT COUNT(*) INTO lesson_count FROM academy_lessons WHERE is_published = true;
  SELECT COUNT(*) INTO quiz_count FROM academy_quizzes;

  RAISE NOTICE '========================================';
  RAISE NOTICE 'ACADEMY UPDATE COMPLETE!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Published Tracks: %', track_count;
  RAISE NOTICE 'Published Lessons: %', lesson_count;
  RAISE NOTICE 'Quizzes Available: %', quiz_count;
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Ready to use in Academy page!';
  RAISE NOTICE '========================================';
END $$;
