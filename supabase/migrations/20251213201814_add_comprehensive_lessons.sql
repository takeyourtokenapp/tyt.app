/*
  # Add Comprehensive Lessons for All Tracks
  
  Adds 3-4 lessons per track to create a full curriculum
*/

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
2,
'beginner',
12,
true,
12,
true,
true
FROM academy_tracks t WHERE t.slug = 'foundations'
ON CONFLICT (track_id, slug) DO UPDATE SET is_published = true;

INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, sort_order, difficulty, estimated_minutes, has_quiz, completion_xp, is_published, is_free)
SELECT t.id, 'understanding-transactions', 'Understanding Transactions', 'How crypto transactions work',
'## Crypto Transactions Explained

Every cryptocurrency transaction involves sending value from one address to another, recorded permanently on the blockchain.

### Transaction Components

**Inputs**: Source of funds (previous transaction outputs)
**Outputs**: Destination addresses and amounts
**Fee**: Payment to miners/validators
**Signature**: Cryptographic proof of ownership

### Transaction Lifecycle

1. **Initiation**: User creates transaction
2. **Broadcasting**: Sent to network nodes
3. **Mempool**: Pending transactions queue
4. **Validation**: Miners/validators check validity
5. **Confirmation**: Included in block
6. **Finality**: Multiple confirmations = settled

### Transaction Fees

- **Bitcoin**: Based on transaction size (bytes)
- **Ethereum**: Gas fees (computational complexity)
- **Solana**: Minimal fixed fees
- **TYT Platform**: Handles fees automatically!',
3,
'beginner',
15,
true,
15,
true,
true
FROM academy_tracks t WHERE t.slug = 'foundations'
ON CONFLICT (track_id, slug) DO UPDATE SET is_published = true;

-- MINING ESSENTIALS LESSONS
INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, sort_order, difficulty, estimated_minutes, has_quiz, completion_xp, is_published, is_free)
SELECT t.id, 'proof-of-work', 'Proof of Work Explained', 'Understanding Bitcoin mining consensus',
'## Proof of Work (PoW)

Proof of Work is the consensus mechanism securing Bitcoin and many cryptocurrencies.

### How It Works

Miners compete to solve complex mathematical puzzles. The first to solve it gets to:
- Add the next block
- Earn block reward (currently 6.25 BTC)
- Collect transaction fees

### Mining Hardware Evolution

**2009-2010**: CPU Mining
**2010-2013**: GPU Mining  
**2013-Present**: ASIC Miners (specialized chips)

### Key Metrics

**Hashrate (TH/s)**: Mining power  
**Difficulty**: Puzzle complexity (adjusts every 2 weeks)
**Block Time**: ~10 minutes per block
**Energy**: ~100-150 watts per TH/s

### TYT NFT Miners

TYT miners represent fractional ownership of real ASIC hardware, giving you:
- Daily BTC rewards
- No hardware management
- Professional data centers
- Tradeable on marketplace',
1,
'beginner',
18,
true,
18,
true,
false
FROM academy_tracks t WHERE t.slug = 'mining-essentials'
ON CONFLICT (track_id, slug) DO UPDATE SET is_published = true;

INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, sort_order, difficulty, estimated_minutes, has_quiz, completion_xp, is_published, is_free)
SELECT t.id, 'mining-pools', 'Mining Pools & Payouts', 'Why miners work together',
'## Mining Pools

Solo mining is like buying lottery tickets - small chance of huge reward. Pool mining provides consistent smaller rewards.

### How Pools Work

1. **Share Work**: Pool distributes mining tasks
2. **Submit Shares**: Miners submit partial solutions
3. **Block Found**: Pool collects reward
4. **Distribute**: Rewards split based on contribution

### Payout Methods

**PPS (Pay Per Share)**: Fixed payment per share  
**PPLNS (Pay Per Last N Shares)**: Based on recent shares  
**FPPS**: PPS + transaction fee share  
**SOLO**: Keep entire block if you find it

### Pool Fees

Typical fees: 1-3% of rewards

### TYT Advantage

TYT operates its own mining pools, passing savings to NFT miner holders!',
2,
'beginner',
14,
true,
14,
true,
false
FROM academy_tracks t WHERE t.slug = 'mining-essentials'
ON CONFLICT (track_id, slug) DO UPDATE SET is_published = true;

-- TYT PLATFORM LESSONS
INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, sort_order, difficulty, estimated_minutes, has_quiz, completion_xp, is_published, is_free)
SELECT t.id, 'nft-miners-explained', 'NFT Miners Explained', 'Understanding tokenized mining',
'## NFT Digital Miners

TYT NFT miners are ERC-721 tokens representing fractional ownership of real mining hardware.

### Miner Attributes

**Hashrate (TH/s)**: Mining power  
**Efficiency (W/TH)**: Energy per hashrate  
**Region**: Data center location  
**Tier**: Bronze → Diamond (upgradeable)

### Daily Rewards Formula

```
Gross BTC = (Your TH/s / Network TH/s) × Block Reward × Blocks/Day
Net BTC = Gross BTC - Electricity - Maintenance Fee
```

### Maintenance Fees

Paid in TYT, USDT, or BTC
- Cover electricity, cooling, management
- Burn rate increases when paid in TYT (discounts!)

### Miner Tiers

| Tier | Efficiency | Discount |
|------|-----------|----------|
| Bronze | 95 W/TH | 2% |
| Silver | 85 W/TH | 5% |
| Gold | 75 W/TH | 9% |
| Platinum | 65 W/TH | 13% |
| Diamond | 55 W/TH | 18% |',
1,
'intermediate',
20,
true,
20,
true,
false
FROM academy_tracks t WHERE t.slug = 'tyt-platform'
ON CONFLICT (track_id, slug) DO UPDATE SET is_published = true;

INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, sort_order, difficulty, estimated_minutes, has_quiz, completion_xp, is_published, is_free)
SELECT t.id, 'rewards-system', 'Understanding Rewards', 'How daily BTC rewards work',
'## TYT Rewards System

Rewards are calculated and distributed daily based on real mining performance.

### Reward Calculation

**Step 1**: Calculate gross BTC based on your hashrate  
**Step 2**: Deduct electricity costs  
**Step 3**: Apply maintenance fee  
**Step 4**: Apply tier discount  
**Step 5**: Distribute net BTC

### Reinvest Feature

Automatically use rewards to:
- Upgrade miner efficiency
- Buy more TH/s
- Compound your mining power

### Merkle Proofs

Every reward comes with cryptographic proof:
- Verifiable on-chain
- Transparent calculations
- Auditable history

### Performance Factors

**Bitcoin Price**: Higher price = higher USD value  
**Network Difficulty**: Adjusts every 2 weeks  
**Your Hashrate**: More TH/s = more rewards  
**Efficiency**: Lower W/TH = lower costs',
2,
'intermediate',
16,
true,
16,
true,
false
FROM academy_tracks t WHERE t.slug = 'tyt-platform'
ON CONFLICT (track_id, slug) DO UPDATE SET is_published = true;

-- MULTI-CHAIN LESSONS
INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, sort_order, difficulty, estimated_minutes, has_quiz, completion_xp, is_published, is_free)
SELECT t.id, 'ethereum-ecosystem', 'Ethereum Ecosystem', 'Smart contracts and EVM chains',
'## Ethereum & EVM Ecosystem

Ethereum introduced smart contracts - programmable blockchain logic.

### Key Concepts

**Smart Contracts**: Self-executing code on blockchain  
**EVM**: Ethereum Virtual Machine  
**Gas**: Computational fee unit  
**ERC-20**: Fungible token standard  
**ERC-721**: NFT standard (TYT miners!)

### EVM-Compatible Chains

- **Polygon**: Low-fee Ethereum layer 2
- **BSC**: Binance Smart Chain
- **Avalanche**: High-throughput C-Chain
- **Arbitrum**: Optimistic rollup

### DeFi Ecosystem

- **DEXs**: Uniswap, SushiSwap
- **Lending**: Aave, Compound
- **Yield**: Curve, Yearn
- **TYT**: Charity staking!',
1,
'intermediate',
18,
true,
18,
true,
false
FROM academy_tracks t WHERE t.slug = 'multi-chain'
ON CONFLICT (track_id, slug) DO UPDATE SET is_published = true;

INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, sort_order, difficulty, estimated_minutes, has_quiz, completion_xp, is_published, is_free)
SELECT t.id, 'solana-ecosystem', 'Solana Ecosystem', 'High-performance blockchain',
'## Solana: Speed & Scale

Solana is a high-performance blockchain capable of 65,000 TPS.

### Key Features

**Proof of History**: Novel consensus mechanism  
**Low Fees**: <$0.01 per transaction  
**Fast**: 400ms block times  
**SPL Tokens**: Solana token standard

### TYT on Solana

TYT token launched on Solana via pump.fun:
- Lightning-fast transactions
- Minimal fees
- Vibrant ecosystem
- Easy integration with wallets

### Solana DeFi

- **Jupiter**: Top DEX aggregator
- **Orca**: User-friendly AMM
- **Marinade**: Liquid staking
- **Magic Eden**: NFT marketplace

### Wallet Setup

1. Install Phantom or Solflare
2. Create wallet + backup seed
3. Get SOL for fees
4. Add TYT token
5. Start earning!',
2,
'intermediate',
15,
true,
15,
true,
false
FROM academy_tracks t WHERE t.slug = 'multi-chain'
ON CONFLICT (track_id, slug) DO UPDATE SET is_published = true;

COMMENT ON TABLE academy_lessons IS 'Comprehensive lesson content for all tracks';
