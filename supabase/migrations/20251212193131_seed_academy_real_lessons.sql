/*
  # Seed Academy with Real Educational Content
  
  Comprehensive curriculum covering:
  - Crypto Fundamentals (wallets, keys, security)
  - Mining Essentials (hashrate, efficiency, maintenance)
  - TYT Platform Mastery (NFT miners, marketplace, rewards)
  - Advanced Topics (multi-chain, governance)
  - Risk & Compliance (security, KYC)
*/

-- Insert real lesson content for Foundations track
INSERT INTO academy_lessons (
  track_id, 
  slug,
  title, 
  description, 
  content_mdx,
  sort_order,
  difficulty,
  estimated_minutes,
  has_quiz,
  completion_xp,
  is_published,
  is_free
) 
SELECT 
  t.id,
  'what-is-blockchain',
  'What is Blockchain?',
  'Understanding the revolutionary technology behind cryptocurrencies',
  '## What is Blockchain?

Blockchain is a **distributed ledger technology** that records transactions across many computers in a way that makes it nearly impossible to alter retroactively.

### Key Concepts

**1. Decentralization**
Unlike traditional databases controlled by a single entity, blockchain distributes data across thousands of computers (nodes) worldwide.

**2. Immutability**
Once data is recorded on a blockchain, it cannot be easily changed. Each block contains a cryptographic hash of the previous block, creating an unbreakable chain.

**3. Transparency**
All transactions are visible to anyone with access to the network, while user identities remain pseudonymous.

### How It Works

1. A transaction is requested (e.g., sending Bitcoin)
2. The transaction is broadcast to a network of nodes
3. Nodes validate the transaction using consensus mechanisms
4. The validated transaction is combined with others into a block
5. The block is added to the existing blockchain
6. The transaction is complete and permanent

### Why It Matters for Mining

In Bitcoin mining, miners compete to validate transactions and add new blocks. The first miner to solve a complex mathematical puzzle earns the right to add the block and receives a reward in BTC.

**TYT NFT miners represent shares of real mining hardware, giving you exposure to this process without managing physical equipment.**',
  1,
  'beginner',
  15,
  true,
  15,
  true,
  true
FROM academy_tracks t WHERE t.slug = 'foundations'
ON CONFLICT (track_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  content_mdx = EXCLUDED.content_mdx,
  is_published = true;

-- Crypto Wallets lesson
INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, sort_order, difficulty, estimated_minutes, has_quiz, completion_xp, is_published, is_free)
SELECT t.id, 'crypto-wallets', 'Cryptocurrency Wallets', 'Learn about different wallet types and security',
'## Understanding Crypto Wallets

A cryptocurrency wallet does not actually store your coins - it stores the **private keys** that give you access to your crypto on the blockchain.

### Types of Wallets

**Hot Wallets (Online)**
- Connected to the internet
- Convenient for frequent transactions
- Examples: MetaMask, Phantom, Trust Wallet

**Cold Wallets (Offline)**
- Not connected to the internet
- Best for long-term storage
- Examples: Ledger, Trezor

### Security Best Practices

1. **Never share your private keys or seed phrase**
2. **Use hardware wallets for large holdings**
3. **Enable 2FA on all exchange accounts**
4. **Verify addresses before sending**
5. **Be wary of phishing attempts**

### TYT Custodial Wallet

TYT provides a custodial wallet system with:
- Enterprise-grade security
- Multi-signature protection
- Easy-to-use interface
- Multi-chain support (BTC, ETH, SOL, TRX)',
2, 'beginner', 20, true, 20, true, true
FROM academy_tracks t WHERE t.slug = 'foundations'
ON CONFLICT (track_id, slug) DO UPDATE SET content_mdx = EXCLUDED.content_mdx, is_published = true;

-- Transaction Fees lesson
INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, sort_order, difficulty, estimated_minutes, has_quiz, completion_xp, is_published, is_free)
SELECT t.id, 'transaction-fees', 'Understanding Transaction Fees', 'How blockchain fees work and optimization tips',
'## Transaction Fees Explained

Every blockchain transaction requires a fee to compensate miners/validators.

### Fee Structures by Network

| Network | Typical Fee | Speed |
|---------|-------------|-------|
| Bitcoin | $2-10 | 10-60 min |
| Ethereum | $5-50 | 15 sec - 5 min |
| Solana | ~$0.001 | 1-2 sec |
| TRON | ~$1 | 3 sec |

### Optimizing Your Fees

1. **Time your transactions**: Lower fees during off-peak hours
2. **Batch transactions**: Combine multiple sends
3. **Choose the right network**: Use low-fee networks for smaller amounts
4. **Use Layer 2 solutions**: Lightning Network, Polygon

### TYT Fee Structure

- **Deposits**: Small network fee + 1% platform fee
- **Withdrawals**: Network fee + 0.5% platform fee
- **Marketplace**: 5% total (charity, burn, protocol)
- **Maintenance**: Pay with TYT for 20% discount!',
3, 'beginner', 15, true, 15, true, true
FROM academy_tracks t WHERE t.slug = 'foundations'
ON CONFLICT (track_id, slug) DO UPDATE SET content_mdx = EXCLUDED.content_mdx, is_published = true;

-- Bitcoin Mining lesson
INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, sort_order, difficulty, estimated_minutes, has_quiz, completion_xp, is_published, is_free)
SELECT t.id, 'how-bitcoin-mining-works', 'How Bitcoin Mining Works', 'The fundamentals of proof-of-work mining',
'## Bitcoin Mining Fundamentals

Bitcoin mining is the process of validating transactions and adding them to the blockchain while creating new bitcoins.

### The Mining Process

**1. Transaction Pool**
Unconfirmed transactions wait in the mempool.

**2. Block Assembly**
Miners select transactions and assemble them into a candidate block.

**3. Proof of Work**
Miners compete to find a hash value below the target difficulty.

**4. Block Reward**
The winning miner receives:
- Block subsidy (currently 3.125 BTC after 2024 halving)
- All transaction fees in the block

### Key Metrics

**Hashrate** - Measured in TH/s (terahashes per second)

**Difficulty** - Adjusts every 2016 blocks (~2 weeks)

**Efficiency** - Measured in W/TH (watts per terahash)

### Mining Economics

```
Daily Revenue = (Your Hashrate / Network Hashrate) x Daily Block Rewards
Daily Profit = Daily Revenue - Electricity Costs - Maintenance
```

### Why NFT Mining?

TYT NFT miners eliminate barriers by tokenizing shares of professionally managed mining operations.',
1, 'beginner', 25, true, 25, true, true
FROM academy_tracks t WHERE t.slug = 'bitcoin-mining'
ON CONFLICT (track_id, slug) DO UPDATE SET content_mdx = EXCLUDED.content_mdx, is_published = true;

-- Hashrate and Efficiency lesson  
INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, sort_order, difficulty, estimated_minutes, has_quiz, completion_xp, is_published, is_free)
SELECT t.id, 'hashrate-efficiency', 'Hashrate and Efficiency', 'Key metrics that determine mining profitability',
'## Hashrate & Efficiency Deep Dive

### Hashrate Explained

**Measuring Hashrate**
- 1 TH/s = 1 trillion hashes per second
- 1 PH/s = 1,000 TH/s
- 1 EH/s = 1,000 PH/s

**Current Network Stats**
- Bitcoin Network: ~600+ EH/s
- Typical ASIC miner: 100-200 TH/s
- TYT NFT range: 0.1 TH/s - 100+ TH/s per NFT

### Efficiency Ratings (W/TH)

| Generation | Typical W/TH | Example Model |
|------------|-------------|---------------|
| Old (2019) | 65-100 W/TH | Antminer S17 |
| Current (2022) | 30-38 W/TH | Antminer S19 Pro |
| Latest (2024) | 15-21 W/TH | Antminer S21 |

**Why Efficiency Matters**

Example at 100 TH/s:
- 38 W/TH = 3,800W = ~$9/day electricity
- 21 W/TH = 2,100W = ~$5/day electricity
- **Savings: $4/day = $1,460/year**

### TYT Miner Specifications

Each TYT NFT miner has:
- **power_th**: Your share of hashrate
- **efficiency_w_th**: Electricity efficiency
- **region**: Data center location
- **maintenance_rate**: Daily upkeep cost',
2, 'beginner', 20, true, 20, true, true
FROM academy_tracks t WHERE t.slug = 'bitcoin-mining'
ON CONFLICT (track_id, slug) DO UPDATE SET content_mdx = EXCLUDED.content_mdx, is_published = true;

-- Maintenance Costs lesson
INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, sort_order, difficulty, estimated_minutes, has_quiz, completion_xp, is_published, is_free)
SELECT t.id, 'maintenance-costs', 'Maintenance Costs and Discounts', 'Understanding operational costs and how to minimize them',
'## Mining Maintenance & Costs

### What is Maintenance?

Maintenance covers operational costs:
- **Electricity**: ~70% of maintenance
- **Cooling**: Data center climate control
- **Staff**: 24/7 monitoring
- **Infrastructure**: Internet, security
- **Repairs**: Hardware replacement

### TYT Discount System

**Base Discount: Pay with TYT**
20% discount when paying with TYT. All TYT used is burned!

**VIP Tier Bonuses**

| Tier | Required Spend | Additional Discount |
|------|----------------|---------------------|
| Bronze | $0 | +2% |
| Silver | $1,000 | +5% |
| Gold | $5,000 | +9% |
| Platinum | $15,000 | +13% |
| Diamond | $50,000+ | +18% |

**Maximum Savings: 20% + 18% = 38% off maintenance!**

### Service Button

Daily free bonus - click every 24 hours:
- Bronze: 10 TYT
- Silver: 15 TYT
- Gold: 25 TYT
- Platinum: 40 TYT
- Diamond: 100 TYT

### Pro Tips

1. Always pay maintenance with TYT
2. Keep TYT balance funded
3. Set up auto-reinvest
4. Claim Service Button daily
5. Upgrade efficiency to reduce costs',
3, 'intermediate', 20, true, 20, true, true
FROM academy_tracks t WHERE t.slug = 'bitcoin-mining'
ON CONFLICT (track_id, slug) DO UPDATE SET content_mdx = EXCLUDED.content_mdx, is_published = true;

-- NFT Miners Getting Started
INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, sort_order, difficulty, estimated_minutes, has_quiz, completion_xp, is_published, is_free)
SELECT t.id, 'first-nft-miner', 'Your First NFT Miner', 'Step-by-step guide to purchasing your miner',
'## Getting Started with TYT Miners

### Step 1: Create Your Account
1. Go to takeyourtoken.app/signup
2. Verify your email
3. Complete basic profile

### Step 2: Fund Your Wallet

**Deposit Options:**
- Bitcoin (BTC)
- USDT (TRC-20, ERC-20, SOL)
- TRX, SOL
- TYT (from pump.fun)

### Step 3: Browse the Marketplace

**Filter by:**
- Price range
- Hashrate (TH/s)
- Efficiency (W/TH)
- Region
- ROI estimate

### Step 4: Purchase Your Miner

1. Select a miner
2. Review specifications
3. Click "Buy Now"
4. Confirm payment (TYT only)
5. Miner appears instantly!

### Step 5: Start Earning

Your miner begins mining immediately:
- Daily BTC rewards at midnight UTC
- View earnings in Dashboard

### Understanding Your Miner Card

- **TH/s**: Mining power
- **W/TH**: Efficiency rating
- **Daily Reward**: Estimated BTC
- **Maintenance**: Daily cost
- **Net Profit**: After deductions
- **Status**: Active/Delinquent',
1, 'beginner', 25, true, 30, true, true
FROM academy_tracks t WHERE t.slug = 'nft-miners'
ON CONFLICT (track_id, slug) DO UPDATE SET content_mdx = EXCLUDED.content_mdx, is_published = true;

-- Security lesson
INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, sort_order, difficulty, estimated_minutes, has_quiz, completion_xp, is_published, is_free)
SELECT t.id, 'account-security', 'Protecting Your Account', 'Essential security practices',
'## Account Security Best Practices

### Password Security

**Creating Strong Passwords**
- Minimum 16 characters
- Mix of uppercase, lowercase, numbers, symbols
- Use a password manager

### Two-Factor Authentication (2FA)

**Types (ranked by security)**
1. Hardware keys (YubiKey) - Best
2. Authenticator apps - Great
3. SMS codes - Acceptable
4. Email codes - Minimum

### Recognizing Phishing

**Red Flags**
- Urgent language
- Suspicious sender addresses
- Requests for passwords
- Too-good-to-be-true offers

**TYT Official Domains**
- takeyourtoken.app
- app.takeyourtoken.app

**We Will NEVER:**
- Ask for your password
- Ask for your seed phrase
- Contact you about "prizes"

### Device Security

1. Keep OS updated
2. Use antivirus software
3. Avoid public WiFi for crypto
4. Use a VPN when traveling
5. Log out from shared devices',
1, 'intermediate', 20, true, 25, true, true
FROM academy_tracks t WHERE t.slug = 'security'
ON CONFLICT (track_id, slug) DO UPDATE SET content_mdx = EXCLUDED.content_mdx, is_published = true;

-- KYC lesson
INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, sort_order, difficulty, estimated_minutes, has_quiz, completion_xp, is_published, is_free)
SELECT t.id, 'kyc-requirements', 'Understanding KYC', 'Why identity verification matters',
'## KYC (Know Your Customer) Guide

### Why KYC?

**Regulatory Compliance**
- Prevent money laundering
- Combat terrorist financing
- Protect users from fraud

### TYT KYC Tiers

**Tier 0: Unverified**
- Email only
- $100/day withdrawal

**Tier 1: Basic**
- Name and phone
- $1,000/day withdrawal

**Tier 2: Standard**
- Government ID + Selfie
- $10,000/day withdrawal

**Tier 3: Enhanced**
- Video verification
- $50,000/day withdrawal

### Required Documents
- Government-issued ID
- Proof of address (<3 months)
- Clear selfie holding ID

### Tips for Approval
1. High-quality photos
2. All text readable
3. Document not expired
4. Name must match exactly

### Privacy Protection

Your KYC data is:
- Encrypted at rest and in transit
- Stored with certified providers
- Never shared without consent',
2, 'intermediate', 20, true, 20, true, true
FROM academy_tracks t WHERE t.slug = 'security'
ON CONFLICT (track_id, slug) DO UPDATE SET content_mdx = EXCLUDED.content_mdx, is_published = true;

-- Multi-chain lesson
INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, sort_order, difficulty, estimated_minutes, has_quiz, completion_xp, is_published, is_free)
SELECT t.id, 'multi-chain-withdrawals', 'Multi-Chain Withdrawals', 'Withdraw across different blockchains',
'## Multi-Chain Withdrawal Guide

### Supported Networks

| Network | Assets | Fee |
|---------|--------|-----|
| Bitcoin | BTC | ~$2-10 |
| Lightning | BTC | ~$0.01 |
| Ethereum | ETH, USDT | ~$5-50 |
| Polygon | MATIC, USDT | ~$0.01 |
| Solana | SOL, USDT | ~$0.001 |
| TRON | TRX, USDT | ~$1 |

### Choosing the Right Network

**Large Amounts ($10,000+)**
- Bitcoin mainnet
- Ethereum

**Medium Amounts ($100-$10,000)**
- TRON
- Polygon
- Solana

**Small Amounts (Under $100)**
- Lightning Network
- Solana

### Withdrawal Process

1. Navigate to Wallet > Withdraw
2. Select asset
3. Choose network
4. Enter destination address
5. **Double-check address!**
6. Complete 2FA
7. Confirm withdrawal

### Safety Tips

1. Always verify address
2. Send test amount first
3. Use correct network
4. Check memo/tag if required
5. Keep records for taxes',
1, 'intermediate', 25, true, 30, true, true
FROM academy_tracks t WHERE t.slug = 'multi-chain'
ON CONFLICT (track_id, slug) DO UPDATE SET content_mdx = EXCLUDED.content_mdx, is_published = true;

-- Add quizzes for the lessons
INSERT INTO academy_quizzes (lesson_id, question, question_type, options, explanation, sort_order, points)
SELECT l.id, 'What is the main purpose of blockchain technology?', 'multiple_choice',
'[{"id": "a", "text": "Store files in the cloud", "is_correct": false}, {"id": "b", "text": "Record transactions in a distributed, immutable ledger", "is_correct": true}, {"id": "c", "text": "Send emails securely", "is_correct": false}, {"id": "d", "text": "Play video games", "is_correct": false}]'::jsonb,
'Blockchain is a distributed ledger technology designed to record transactions permanently and transparently.', 1, 10
FROM academy_lessons l WHERE l.slug = 'what-is-blockchain'
ON CONFLICT DO NOTHING;

INSERT INTO academy_quizzes (lesson_id, question, question_type, options, explanation, sort_order, points)
SELECT l.id, 'Which wallet type is safest for long-term storage?', 'multiple_choice',
'[{"id": "a", "text": "Hot wallet on exchange", "is_correct": false}, {"id": "b", "text": "Cold hardware wallet", "is_correct": true}, {"id": "c", "text": "Browser extension wallet", "is_correct": false}, {"id": "d", "text": "Mobile wallet app", "is_correct": false}]'::jsonb,
'Cold hardware wallets like Ledger or Trezor are not connected to the internet, making them the safest for long-term storage.', 1, 10
FROM academy_lessons l WHERE l.slug = 'crypto-wallets'
ON CONFLICT DO NOTHING;

INSERT INTO academy_quizzes (lesson_id, question, question_type, options, explanation, sort_order, points)
SELECT l.id, 'What happens when you pay TYT maintenance with TYT tokens?', 'multiple_choice',
'[{"id": "a", "text": "Nothing special", "is_correct": false}, {"id": "b", "text": "You get 20% discount and TYT is burned", "is_correct": true}, {"id": "c", "text": "You pay extra fees", "is_correct": false}, {"id": "d", "text": "You earn more BTC", "is_correct": false}]'::jsonb,
'Paying with TYT gives you 20% discount and the tokens are burned, reducing total supply!', 1, 10
FROM academy_lessons l WHERE l.slug = 'maintenance-costs'
ON CONFLICT DO NOTHING;