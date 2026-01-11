/*
  # Seed AOi Knowledge Graph - Web3 (15 articles)

  Blockchain and crypto education for the takeyourtoken.app domain.
  
  Categories:
  - Blockchain Basics (5 articles)
  - Tokens & Economics (3 articles)
  - Security & Best Practices (4 articles)
  - Wallets & Transactions (3 articles)
*/

INSERT INTO aoi_knowledge_graph (topic_id, topic_name, domain, content_summary, content_full, difficulty_level, prerequisites, related_topics, sources, verified_by, verification_date) VALUES

-- Blockchain Basics (5 articles)
('what-is-blockchain', 'What is Blockchain?', 'web3',
 'Introduction to distributed ledger technology and how blockchains work',
 '# What is Blockchain?

Blockchain is a revolutionary technology that powers cryptocurrencies and much more.

## Core Concept
A blockchain is a distributed digital ledger that records transactions across many computers. Think of it as a shared notebook that everyone can read, but no one can erase or alter past entries.

## How It Works
1. **Transactions**: Users send transactions to the network
2. **Blocks**: Transactions are grouped into blocks
3. **Mining/Validation**: Network participants verify blocks
4. **Chain**: Verified blocks link to previous blocks
5. **Distribution**: Every participant has a copy

## Key Properties
- **Decentralization**: No single authority controls it
- **Transparency**: All transactions visible to everyone
- **Immutability**: Historical data cannot be changed
- **Security**: Cryptographic protection

## Real-World Applications
- **Cryptocurrencies**: Bitcoin, Ethereum, TYT
- **NFTs**: Digital ownership (like TYT miners)
- **Smart Contracts**: Self-executing agreements
- **Supply Chain**: Product tracking
- **Healthcare**: Secure medical records

## Why It Matters
Blockchain removes the need for trusted intermediaries, enabling peer-to-peer transactions and programmable money.',
 2, ARRAY[]::text[], ARRAY['bitcoin-basics', 'ethereum-explained']::text[],
 '[{"title":"Bitcoin Whitepaper","type":"foundational_paper","credibility_score":1.0}]'::jsonb,
 'TYT Academy Team', NOW()),

('bitcoin-basics', 'Bitcoin Fundamentals', 'web3',
 'Understanding Bitcoin: the first and most important cryptocurrency',
 '# Bitcoin Fundamentals

Bitcoin is the first cryptocurrency and the foundation of the entire crypto ecosystem.

## What is Bitcoin?
- Digital currency with no central authority
- Created by Satoshi Nakamoto in 2009
- Fixed supply of 21 million coins
- Transfers directly peer-to-peer

## How Bitcoin Works
**Mining**: Miners compete to solve mathematical puzzles
**Proof of Work**: Energy-intensive but highly secure
**Block Time**: New block every ~10 minutes
**Rewards**: Miners earn BTC for securing network

## Bitcoin as Digital Gold
- **Store of Value**: Limited supply creates scarcity
- **Inflation Hedge**: No government can print more
- **Global**: Works across borders
- **Neutral**: No political control

## TYT Connection
TYT miners earn daily Bitcoin rewards! Your digital miners participate in the Bitcoin network, and you receive BTC payouts.

## Investment Considerations
- Highly volatile price movements
- Long-term adoption trend
- Institutional interest growing
- Regulatory environment evolving

Bitcoin pioneered a new form of money.',
 3, ARRAY['what-is-blockchain']::text[], ARRAY['proof-of-work', 'mining-explained']::text[],
 '[{"title":"Mastering Bitcoin","type":"educational_book","credibility_score":0.96}]'::jsonb,
 'TYT Academy Team', NOW()),

('ethereum-explained', 'Ethereum & Smart Contracts', 'web3',
 'Understanding Ethereum as a programmable blockchain platform',
 '# Ethereum & Smart Contracts

Ethereum extends blockchain beyond currency to programmable applications.

## What is Ethereum?
- Blockchain platform launched in 2015
- Supports smart contracts (self-executing code)
- Native currency: Ether (ETH)
- Foundation for DeFi and NFTs

## Smart Contracts
Programs that run on the blockchain:
- **Automatic Execution**: No intermediaries needed
- **Trustless**: Code enforces rules
- **Composable**: Contracts can interact
- **Transparent**: Code is public

## Use Cases
- **DeFi**: Lending, borrowing, trading
- **NFTs**: Digital art, collectibles, game items
- **DAOs**: Decentralized organizations
- **Tokens**: Create new cryptocurrencies

## Ethereum 2.0
Transition from Proof of Work to Proof of Stake:
- **Energy Efficient**: 99% less energy
- **Faster**: More transactions per second
- **Scalable**: Layer 2 solutions

## TYT on Ethereum
TYT digital miner NFTs run on Ethereum-compatible chains. Each miner is a smart contract token with unique properties.',
 4, ARRAY['what-is-blockchain', 'bitcoin-basics']::text[], ARRAY['smart-contracts-deep-dive', 'defi-basics']::text[],
 '[{"title":"Ethereum Yellow Paper","type":"technical_specification","credibility_score":0.98}]'::jsonb,
 'TYT Academy Team', NOW()),

('proof-of-work', 'Consensus: Proof of Work', 'web3',
 'How blockchain networks reach agreement through mining',
 '# Consensus: Proof of Work

Proof of Work (PoW) is the consensus mechanism securing Bitcoin and many other blockchains.

## The Problem
How do distributed nodes agree on transaction history without a central authority?

## The Solution
Miners compete to solve computational puzzles:

1. **Collect Transactions**: Miners gather pending transactions
2. **Create Block**: Bundle transactions into a candidate block
3. **Find Nonce**: Search for a number that creates a valid hash
4. **First Wins**: First to find valid solution broadcasts block
5. **Network Verifies**: Other nodes check and accept block
6. **Repeat**: Process continues for next block

## Why It Works
- **Costly to Attack**: Would need 51% of network power
- **Easy to Verify**: Anyone can check solutions
- **Incentive Aligned**: Miners earn rewards for honesty
- **Proven Security**: Bitcoin never successfully attacked

## Trade-offs
**Advantages**:
- Extremely secure
- Battle-tested since 2009
- True decentralization

**Disadvantages**:
- Energy intensive
- Slower transaction speed
- Limited scalability

## TYT Mining
TYT users own digital miner NFTs that represent mining power. The platform manages the actual mining, and you earn BTC rewards!',
 5, ARRAY['bitcoin-basics']::text[], ARRAY['mining-explained', 'proof-of-stake']::text[],
 '[{"title":"PoW Consensus Analysis","type":"academic_paper","credibility_score":0.94}]'::jsonb,
 'TYT Academy Team', NOW()),

('mining-explained', 'Bitcoin Mining Explained', 'web3',
 'Deep dive into cryptocurrency mining economics and technology',
 '# Bitcoin Mining Explained

Mining is the process of securing blockchain networks and earning cryptocurrency rewards.

## What Miners Do
- Validate transactions
- Bundle transactions into blocks
- Compete to add blocks to blockchain
- Secure the network from attacks

## Mining Hardware
**Evolution**:
1. CPU (2009-2010): Personal computers
2. GPU (2010-2013): Graphics cards
3. ASIC (2013-present): Specialized chips

**Modern Mining**:
- Industrial scale operations
- Specialized ASIC miners
- Measured in Terahashes per second (TH/s)
- Efficiency measured in Watts per TH (W/TH)

## Mining Economics
**Revenue**:
- Block reward (currently 6.25 BTC)
- Transaction fees
- Halving every 4 years

**Costs**:
- Equipment purchase
- Electricity consumption
- Cooling and maintenance
- Facility costs

**Profitability Factors**:
- Bitcoin price
- Network difficulty
- Electricity costs
- Hardware efficiency

## TYT Mining Model
Instead of buying physical miners:
- Purchase digital miner NFTs
- Platform handles operations
- You earn daily BTC rewards
- Pay maintenance fees in TYT
- Trade miners on marketplace

No noise, no heat, no technical expertise needed!',
 6, ARRAY['proof-of-work', 'bitcoin-basics']::text[], ARRAY['mining-pools', 'tyt-mining-system']::text[],
 '[{"title":"Bitcoin Mining Economics","type":"industry_analysis","credibility_score":0.92}]'::jsonb,
 'TYT Academy Team', NOW()),

-- Tokens & Economics (3 articles)
('tokenomics-basics', 'Understanding Tokenomics', 'web3',
 'Token supply, utility, and economic design in crypto projects',
 '# Understanding Tokenomics

Tokenomics = Token + Economics. It''s how crypto projects design their token systems.

## Key Components

### Supply
- **Total Supply**: Maximum tokens that will exist
- **Circulating Supply**: Tokens currently in circulation
- **Emission Schedule**: How new tokens enter circulation

### Utility
What the token is used for:
- **Payment**: Transaction fees, services
- **Governance**: Voting on proposals
- **Staking**: Earn rewards, secure network
- **Access**: Unlock features or benefits

### Distribution
- **Initial Sale**: ICO, IDO, presale
- **Team Allocation**: Developer incentives
- **Treasury**: Project reserves
- **Mining/Staking**: Ongoing rewards

## Token Types
- **Utility Tokens**: Access to services (TYT)
- **Governance Tokens**: Voting rights
- **Security Tokens**: Investment instruments
- **Stablecoins**: Price-stable assets

## TYT Tokenomics
**Utility**:
- Pay mining maintenance (get discounts!)
- Marketplace currency
- Governance via veTYT
- Academy access

**Burns**:
- Maintenance payments → burned
- Reduces supply over time
- Deflationary pressure

**CharityMint**:
- Portion of burns → Foundation
- Every transaction helps children',
 4, ARRAY['ethereum-explained']::text[], ARRAY['tyt-token-model', 'defi-basics']::text[],
 '[{"title":"Token Economics Design","type":"research_paper","credibility_score":0.91}]'::jsonb,
 'TYT Academy Team', NOW()),

('tyt-token-model', 'TYT Token Deep Dive', 'web3',
 'Complete guide to TYT token utility, burns, and governance',
 '# TYT Token Deep Dive

TYT is the native utility token of the TYT mining ecosystem.

## Core Utilities

### 1. Maintenance Payments
Pay miner maintenance in TYT for discounts:
- Up to 20% discount vs. BTC/USDT
- Automatic token burn on payment
- Reduces circulating supply

### 2. Marketplace Currency
- Only currency accepted for miner trades
- 1% fee supports Foundation
- Liquid secondary market

### 3. Governance (veTYT)
Lock TYT to get voting power:
- 1 week to 4 years lock periods
- Longer locks = more influence
- Vote on fee structure, burn schedule, Foundation allocation

### 4. VIP Benefits
Hold TYT for enhanced benefits:
- Higher rewards multipliers
- Priority support
- Exclusive features

## Burn Mechanics
TYT is deflationary:
- **Maintenance Burns**: Every payment
- **Upgrade Burns**: Miner improvements
- **Marketplace Burns**: 50% of fees

**CharityMint**: Up to 25% of burned amount minted to Foundation wallet

## Supply Model
- **Initial Supply**: Fixed at launch
- **Max Supply**: Capped (no infinite inflation)
- **Circulating Supply**: Decreases over time via burns
- **Net Effect**: Scarcity increases with adoption

## Getting TYT
- Purchase on DEX (Uniswap, PancakeSwap)
- Earn through Academy
- Rewards for referrals
- VIP programs

TYT aligns incentives: users benefit, platform grows, Foundation helps children.',
 5, ARRAY['tokenomics-basics']::text[], ARRAY['vetyt-governance', 'burn-economics']::text[],
 '[{"title":"TYT Tokenomics Whitepaper","type":"official_documentation","credibility_score":1.0}]'::jsonb,
 'TYT Core Team', NOW()),

('defi-basics', 'DeFi Fundamentals', 'web3',
 'Introduction to decentralized finance protocols and opportunities',
 '# DeFi Fundamentals

DeFi = Decentralized Finance. Traditional banking rebuilt on blockchains.

## What is DeFi?
Financial services without banks or brokers:
- **Lending & Borrowing**: Earn interest, get loans
- **Trading**: Swap tokens instantly
- **Derivatives**: Options, futures, synthetics
- **Insurance**: Protect against smart contract risks
- **Staking**: Earn rewards for participation

## Key Concepts

### Liquidity Pools
Users deposit token pairs to enable trading:
- Earn fees from trades
- Provide liquidity to markets
- Risk: Impermanent loss

### Automated Market Makers (AMMs)
Algorithms that set prices:
- No order books
- Always liquid
- Examples: Uniswap, PancakeSwap

### Yield Farming
Earn rewards by providing liquidity:
- APY can be very high
- Complexity varies
- Risk increases with reward

### Lending Protocols
Deposit crypto to earn interest:
- Compound, Aave, Venus
- Variable interest rates
- Collateralized loans

## Risks in DeFi
- **Smart Contract Risk**: Code vulnerabilities
- **Impermanent Loss**: Price divergence in pools
- **Rug Pulls**: Team abandons project
- **High Gas Fees**: Ethereum transactions expensive

## TYT & DeFi
- TYT token available on DEXs
- Liquidity pools for trading
- Staking opportunities
- Future DeFi integrations planned

Always research before investing!',
 5, ARRAY['ethereum-explained', 'tokenomics-basics']::text[], ARRAY['yield-farming', 'lending-protocols']::text[],
 '[{"title":"DeFi Educational Guide","type":"comprehensive_guide","credibility_score":0.93}]'::jsonb,
 'TYT Academy Team', NOW()),

-- Security & Best Practices (4 articles)
('wallet-security', 'Wallet Security Best Practices', 'web3',
 'Protecting your cryptocurrency from hacks, scams, and loss',
 '# Wallet Security Best Practices

Your crypto security is YOUR responsibility. Follow these rules religiously.

## Private Key Security

### Golden Rules
1. **NEVER share your seed phrase** with anyone
2. **NEVER enter seed phrase on websites**
3. **NEVER take digital screenshots** of your seed
4. **WRITE IT DOWN** on paper, store safely

### What is a Seed Phrase?
- 12-24 words that control your wallet
- Anyone with your seed owns your crypto
- No way to recover if lost
- No "forgot password" option

## Wallet Types

### Hot Wallets (Online)
- **Mobile**: MetaMask, Trust Wallet
- **Web**: Browser extensions
- **Desktop**: Exodus, Electrum
- **Pros**: Convenient for daily use
- **Cons**: Connected to internet = higher risk

### Cold Wallets (Offline)
- **Hardware**: Ledger, Trezor devices
- **Paper**: Seed phrase only
- **Pros**: Maximum security
- **Cons**: Less convenient

### TYT Custodial Wallet
- Platform manages security
- Easy for beginners
- Withdraw to personal wallet anytime

## Multi-Factor Authentication
Enable 2FA everywhere:
- Authenticator apps (NOT SMS)
- Hardware keys (YubiKey)
- Biometrics when available

## Common Threats
- **Phishing**: Fake websites steal credentials
- **Clipboard Malware**: Changes addresses when pasting
- **SIM Swapping**: Hijacks phone number
- **Fake Support**: Scammers impersonate help desk

## Safe Practices
- Verify URLs before connecting wallet
- Use separate devices for large holdings
- Test with small amounts first
- Keep software updated
- Use VPN on public WiFi

Security is not optional in crypto!',
 3, ARRAY[]::text[], ARRAY['scam-awareness', 'hardware-wallets']::text[],
 '[{"title":"Cryptocurrency Security Guide","type":"security_handbook","credibility_score":0.97}]'::jsonb,
 'TYT Academy Team', NOW()),

('scam-awareness', 'Recognizing Crypto Scams', 'web3',
 'Identifying and avoiding common cryptocurrency scams and fraud',
 '# Recognizing Crypto Scams

The crypto space attracts scammers. Learn to protect yourself.

## Common Scam Types

### Phishing
Fake websites mimicking real platforms:
- Check URL carefully (typos, wrong domain)
- Bookmark legitimate sites
- Never click links in emails/DMs

### Fake Giveaways
"Send 1 ETH, get 2 back":
- No legitimate project does this
- Celebrity impersonators on social media
- YouTube live stream scams

### Rug Pulls
Developers drain liquidity and disappear:
- New tokens with anonymous teams
- Unrealistic promises
- Locked liquidity = safer (but not guaranteed)

### Pump and Dump
Coordinated price manipulation:
- "Buy signals" in Telegram groups
- Influencer shilling
- You buy high, they dump

### Ponzi Schemes
Unsustainable returns:
- Guaranteed high returns
- Recruiting required
- Complex explanations
- "Secret strategy"

## Red Flags
- Pressure to act quickly
- Guaranteed returns
- "Too good to be true" offers
- Anonymous team
- No working product
- Aggressive marketing
- Request for seed phrase

## How to Verify Projects
- Check team on LinkedIn
- Read audit reports
- Review smart contracts
- Check CoinMarketCap/CoinGecko
- Search for scam warnings
- Join official communities

## If You''re Scammed
- Report to platform (MetaMask, exchange)
- Warn community
- Report to authorities (FBI IC3)
- Learn from experience

## TYT Security
- Team dox and verified
- Contracts audited
- Transparent operations
- Active community
- Never asks for seed phrases

Trust, but verify everything.',
 4, ARRAY['wallet-security']::text[], ARRAY['smart-contract-audits', 'due-diligence']::text[],
 '[{"title":"Crypto Scam Database","type":"community_resource","credibility_score":0.89}]'::jsonb,
 'TYT Academy Team', NOW()),

('smart-contract-security', 'Smart Contract Security', 'web3',
 'Understanding smart contract audits and security considerations',
 '# Smart Contract Security

Smart contracts control billions of dollars. Security is paramount.

## What is a Smart Contract Audit?
Independent security review of contract code:
- Identify vulnerabilities
- Check for exploits
- Verify functionality
- Provide recommendations

## Common Vulnerabilities

### Reentrancy
Attacker calls function recursively:
- Famous DAO hack (2016)
- $60M stolen
- Led to Ethereum fork

### Integer Overflow/Underflow
Numbers exceed maximum values:
- Can create tokens from nothing
- Modern Solidity has protections

### Access Control
Improper permission checks:
- Unauthorized function calls
- Admin key compromise
- Centralization risks

### Front-Running
Bots see pending transactions:
- Execute their transaction first
- Profit from your trade
- MEV (Miner Extractable Value)

## Reading Audit Reports

### Severity Levels
- **Critical**: Funds at immediate risk
- **High**: Significant vulnerability
- **Medium**: Potential issues
- **Low**: Minor improvements
- **Informational**: Best practices

### What to Check
- Were all issues resolved?
- How many critical/high findings?
- Is team responsive?
- Multiple audits better
- Recent audit vs. code changes

## Top Audit Firms
- CertiK
- Trail of Bits
- OpenZeppelin
- ConsenSys Diligence
- Quantstamp

## TYT Contract Security
- Multiple audits before launch
- Open source code
- Bug bounty program
- Gradual rollout
- Time-locks on critical functions

## User Precautions
- Only interact with audited contracts
- Check audit date vs. deploy date
- Start with small amounts
- Watch for exploit warnings
- Use contract checkers (Etherscan)

Code is law, but code can have bugs.',
 7, ARRAY['ethereum-explained']::text[], ARRAY['defi-risks', 'audit-firms']::text[],
 '[{"title":"Smart Contract Security Best Practices","type":"developer_guide","credibility_score":0.95}]'::jsonb,
 'TYT Academy Team', NOW()),

('transaction-safety', 'Safe Transaction Practices', 'web3',
 'How to send crypto safely and avoid costly mistakes',
 '# Safe Transaction Practices

Blockchain transactions are irreversible. One mistake can be very expensive.

## Before Sending

### Verify Address
- **Copy carefully**: One wrong character = lost funds
- **Check first and last characters**: Don''t rely on middle
- **Send test transaction**: Small amount first
- **Use address book**: Save verified addresses
- **Beware clipboard malware**: Malware can change addresses

### Verify Network
- **Check blockchain**: Sending BTC to ETH address = lost
- **Network fees**: Ethereum has gas, check current rates
- **Confirmation times**: Bitcoin ~10 min, Ethereum ~15 sec

### Check Gas Fees
- **Set appropriate limit**: Too low = failed transaction
- **Don''t overpay**: Check current network conditions
- **Use gas tracker**: Etherscan gas tracker
- **Consider timing**: Fees lower on weekends

## During Transaction

### Review Carefully
- **Recipient address**: Triple check
- **Amount**: Decimal places correct?
- **Token**: Sending right asset?
- **Network fee**: Reasonable cost?

### Sign Safely
- **Read what you''re signing**: MetaMask shows details
- **Unknown contracts**: Extra caution needed
- **Unlimited approvals**: Revoke after use

### Monitor Status
- **Track on explorer**: Etherscan, BscScan, etc.
- **Wait for confirmations**: More confirmations = more secure
- **Save transaction hash**: For records

## After Transaction

### Confirm Receipt
- **Check recipient balance**: Did it arrive?
- **Correct amount**: No unexpected fees?
- **Notify recipient**: If business transaction

### Security
- **Disconnect wallet**: After using dApps
- **Revoke approvals**: Use Revoke.cash
- **Clear browser**: If using public computer

## Common Mistakes to Avoid
- Sending to exchange without memo/tag
- Wrong network (BSC vs. ETH)
- Insufficient gas fees
- Decimal errors (0.1 vs. 1.0)
- Contract address instead of token address

## TYT Platform Safety
- Custodial wallet managed securely
- Clear transaction confirmations
- Test mode for new users
- Customer support for issues
- Automatic address validation

Slow down, double-check, stay safe.',
 4, ARRAY['wallet-security']::text[], ARRAY['gas-optimization', 'blockchain-explorers']::text[],
 '[{"title":"Transaction Safety Guidelines","type":"user_manual","credibility_score":0.94}]'::jsonb,
 'TYT Academy Team', NOW()),

-- Wallets & Transactions (3 articles)
('wallet-types-explained', 'Types of Crypto Wallets', 'web3',
 'Comparing custodial, non-custodial, hot, and cold wallet solutions',
 '# Types of Crypto Wallets

Different wallets for different needs. Understanding the options.

## By Custody

### Custodial Wallets
Someone else holds your private keys:
- **Examples**: Coinbase, Binance, TYT platform
- **Pros**: Easy recovery, user-friendly, customer support
- **Cons**: Trust third party, potential hacks, account freezing
- **Best for**: Beginners, active traders

### Non-Custodial Wallets
You control private keys:
- **Examples**: MetaMask, Trust Wallet, Ledger
- **Pros**: Full control, privacy, censorship-resistant
- **Cons**: Responsibility for security, no recovery help
- **Best for**: Experienced users, long-term holders

## By Connection

### Hot Wallets (Connected)
Online and internet-connected:
- **Mobile Apps**: Trust Wallet, Coinbase Wallet
- **Browser Extensions**: MetaMask, Phantom
- **Desktop Software**: Exodus, Atomic Wallet
- **Pros**: Convenient, quick transactions
- **Cons**: Vulnerable to hacks
- **Best for**: Daily use, small amounts

### Cold Wallets (Offline)
Offline storage:
- **Hardware Wallets**: Ledger, Trezor ($50-$200)
- **Paper Wallets**: Seed phrase only
- **Pros**: Maximum security, immune to online attacks
- **Cons**: Less convenient, cost for hardware
- **Best for**: Large holdings, long-term storage

## Multi-Signature Wallets
Require multiple approvals:
- **Use case**: Business, DAOs, joint accounts
- **Security**: No single point of failure
- **Examples**: Gnosis Safe
- **Complexity**: More setup, coordination needed

## Recommendations by Amount
- **Under $100**: Custodial (TYT platform)
- **$100-$10,000**: Hot wallet (MetaMask) + 2FA
- **$10,000+**: Hardware wallet (Ledger)
- **$100,000+**: Multiple hardware wallets, multisig

## TYT Wallet
- Custodial for ease of use
- Withdraw to personal wallet anytime
- Enterprise-grade security
- Insurance coverage
- 24/7 monitoring

Start simple, scale security with holdings.',
 3, ARRAY[]::text[], ARRAY['wallet-security', 'hardware-wallets']::text[],
 '[{"title":"Crypto Wallet Comparison","type":"product_review","credibility_score":0.91}]'::jsonb,
 'TYT Academy Team', NOW()),

('gas-fees-explained', 'Understanding Gas Fees', 'web3',
 'How transaction fees work and how to optimize costs',
 '# Understanding Gas Fees

Gas fees = the cost of using blockchain networks. Essential to understand.

## What Are Gas Fees?

Compensation for network validators/miners:
- **Validates transactions**: Checks rules followed
- **Executes smart contracts**: Runs code
- **Secures network**: Prevents spam

## How Gas Works (Ethereum)

### Components
- **Gas Limit**: Maximum gas you''re willing to use
- **Gas Price**: Amount you pay per unit (Gwei)
- **Total Cost**: Gas Limit × Gas Price

### Example
- Gas Limit: 21,000 (simple transfer)
- Gas Price: 50 Gwei
- Total: 0.00105 ETH (~$2 at $1,900 ETH)

## Factors Affecting Cost

### Network Congestion
- **Peak hours**: More expensive (US business hours)
- **Low activity**: Cheaper (weekends, late night)
- **NFT drops**: Can spike fees 10x

### Transaction Complexity
- **Simple transfer**: 21,000 gas
- **Token swap**: 100,000-200,000 gas
- **NFT mint**: 50,000-150,000 gas
- **Complex DeFi**: 300,000+ gas

### Gas Price Bidding
- **Higher price**: Faster confirmation
- **Lower price**: May wait or fail
- **Optimal**: Check current rates

## Optimizing Gas Costs

### Timing
- Trade during low activity periods
- Use gas trackers (Etherscan, ETH Gas Station)
- Wait for network calm

### Batch Transactions
- Combine multiple operations
- Some wallets support batching
- Saves overall fees

### Layer 2 Solutions
- **Polygon**: ~$0.01 per transaction
- **Arbitrum**: ~$0.10 per transaction
- **Optimism**: ~$0.15 per transaction

### Alternative Chains
- **BSC**: ~$0.20 per transaction
- **Solana**: ~$0.00025 per transaction
- **TRON**: ~$0.10 per transaction

## Gas on Different Chains
- **Bitcoin**: Fee per byte, $1-10 typical
- **Ethereum**: $2-50 depending on congestion
- **BSC**: $0.20-1 usually
- **Polygon**: $0.01-0.10
- **Solana**: $0.00025 (fractions of cent)

## TYT Optimization
- Internal transfers: No gas fees
- Batched withdrawals: Lower per-user cost
- Multi-chain support: Choose cheapest
- Gas subsidies: For small transactions

Plan transactions during quiet times to save money.',
 5, ARRAY['ethereum-explained']::text[], ARRAY['layer2-solutions', 'transaction-optimization']::text[],
 '[{"title":"Gas Optimization Guide","type":"technical_guide","credibility_score":0.92}]'::jsonb,
 'TYT Academy Team', NOW()),

('blockchain-explorers', 'Using Blockchain Explorers', 'web3',
 'How to track transactions and verify contract interactions',
 '# Using Blockchain Explorers

Blockchain explorers = windows into the blockchain. Essential tools for users.

## What Are Explorers?
Websites that display blockchain data:
- **Transactions**: Track your transfers
- **Addresses**: Check balances
- **Smart Contracts**: Read contract code
- **Tokens**: View token holders
- **Blocks**: See mining activity

## Major Explorers

### By Blockchain
- **Bitcoin**: Blockchain.com, Blockchair
- **Ethereum**: Etherscan
- **BSC**: BscScan
- **Polygon**: PolygonScan
- **Solana**: Solscan, Solana Explorer
- **TRON**: Tronscan

All built by same team (except Solana).

## Key Features

### Transaction Lookup
1. **Copy transaction hash**: From wallet
2. **Paste in search**: On appropriate explorer
3. **View details**: Status, amount, fees, time

**Transaction Statuses**:
- **Success**: Completed successfully
- **Pending**: Waiting for confirmation
- **Failed**: Reverted, check error
- **Dropped**: Insufficient gas

### Address Checking
View any address:
- **Balance**: Current holdings
- **Transaction history**: All activity
- **Token holdings**: ERC-20, NFTs
- **First/last activity**: Age of address

### Contract Interaction
For smart contracts:
- **Read functions**: Query data (free)
- **Write functions**: Submit transactions (costs gas)
- **Verify source code**: Transparency
- **Event logs**: Track contract activity

### Token Information
- **Price**: Current value
- **Holders**: Distribution stats
- **Transfers**: Recent activity
- **Contract address**: For adding to wallet

## Practical Uses

### Verify Received Funds
1. Get transaction hash from sender
2. Look up on explorer
3. Confirm amount and recipient

### Troubleshoot Failed Transaction
1. Find transaction on explorer
2. Read error message
3. Check gas used vs. limit
4. Adjust and retry

### Verify Contract Before Interacting
1. Search contract address
2. Check if verified (green checkmark)
3. Read contract code
4. Check for audits
5. Review transaction history

### Track NFT Ownership
1. Enter NFT contract address
2. View token ID
3. See current owner
4. Check transaction history

## TYT on Explorers
View TYT contracts:
- Miner NFT contract
- TYT token contract
- Marketplace contract
- Governance contract

All verified and transparent!

## Privacy Note
Blockchain is public:
- Anyone can see transaction amounts
- Address balances are visible
- Use multiple addresses for privacy
- Don''t share addresses publicly

Explorers are your verification tool - use them!',
 4, ARRAY['ethereum-explained']::text[], ARRAY['transaction-safety', 'smart-contract-security']::text[],
 '[{"title":"Blockchain Explorer Guide","type":"user_tutorial","credibility_score":0.93}]'::jsonb,
 'TYT Academy Team', NOW())

ON CONFLICT (topic_id) DO NOTHING;