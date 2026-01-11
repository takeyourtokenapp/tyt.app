/*
  # Seed Academy Lessons MVP (15 lessons)

  1. Blockchain Fundamentals - 5 lessons
  2. Web3 Security - 3 lessons
  3. Smart Contracts - 4 lessons
  4. DeFi Basics - 3 lessons

  Total: 15 lessons for MVP launch
*/

-- Get track IDs and seed lessons
DO $$
DECLARE
  v_foundations_track_id UUID;
  v_security_track_id UUID;
  v_tyt_platform_track_id UUID;
  v_defi_track_id UUID;
BEGIN
  -- Get track IDs
  SELECT id INTO v_foundations_track_id FROM academy_tracks WHERE slug = 'foundations';
  SELECT id INTO v_security_track_id FROM academy_tracks WHERE slug = 'security-best-practices';
  SELECT id INTO v_tyt_platform_track_id FROM academy_tracks WHERE slug = 'tyt-platform';
  SELECT id INTO v_defi_track_id FROM academy_tracks WHERE slug = 'defi-staking';

  -- Blockchain Fundamentals (5 lessons)
  INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, difficulty, estimated_minutes, completion_xp, sort_order, is_published, is_free) VALUES
  (v_foundations_track_id, 'what-is-blockchain', 'What is Blockchain?', 'Understanding the fundamental concepts of blockchain technology',
   '# What is Blockchain?

## Introduction
Blockchain is a distributed ledger technology that records transactions across multiple computers. Each block contains transaction data, a timestamp, and a cryptographic hash of the previous block, creating an immutable chain.

## Key Features
- **Decentralization**: No single point of control
- **Transparency**: All transactions are visible
- **Immutability**: Once recorded, data cannot be altered
- **Security**: Cryptographic protection

## Real-World Applications
- Cryptocurrencies like Bitcoin
- Supply chain tracking
- Digital identity verification
- Smart contracts',
   'beginner', 15, 50, 1, TRUE, TRUE),
  
  (v_foundations_track_id, 'understanding-wallets', 'Understanding Wallets', 'How to store and manage your cryptocurrency safely',
   '# Understanding Wallets

## Types of Wallets
- **Hot Wallets**: Connected to internet (mobile, web, desktop)
- **Cold Wallets**: Offline storage (hardware, paper)
- **Custodial**: Third-party manages keys
- **Non-custodial**: You control private keys

## Security Best Practices
- Never share your private keys or seed phrase
- Use hardware wallets for large amounts
- Enable 2FA on exchanges
- Regularly backup your wallet
- Verify addresses before sending

## TYT Custodial Wallet
TYT provides a secure custodial wallet for easy onboarding. Your funds are protected with enterprise-grade security while you learn. When ready, you can explore self-custody options.',
   'beginner', 20, 75, 2, TRUE, TRUE),
  
  (v_foundations_track_id, 'how-transactions-work', 'How Transactions Work', 'Deep dive into blockchain transactions and confirmations',
   '# How Transactions Work

## Transaction Lifecycle
1. User initiates transaction
2. Transaction broadcasted to network
3. Miners/validators verify transaction
4. Transaction included in block
5. Block added to blockchain
6. Transaction confirmed

## Transaction Fees
- Gas fees compensate miners/validators
- Fee amount affects transaction speed
- Network congestion impacts fees
- Different chains have different fee structures

## Understanding Confirmations
- More confirmations = more security
- Bitcoin: 6 confirmations standard
- Ethereum: 12-15 confirmations
- TYT platform handles confirmations automatically',
   'intermediate', 25, 100, 3, TRUE, TRUE),
  
  (v_foundations_track_id, 'consensus-mechanisms', 'Consensus Mechanisms', 'Proof of Work, Proof of Stake, and how networks reach agreement',
   '# Consensus Mechanisms

## Proof of Work (PoW)
- Miners compete to solve mathematical puzzles
- First to solve adds next block
- Requires significant computational power
- Used by Bitcoin
- Energy-intensive but highly secure

## Proof of Stake (PoS)
- Validators stake tokens to participate
- Selected based on stake amount
- More energy efficient
- Used by Ethereum 2.0
- Risk of centralization

## Other Mechanisms
- Delegated Proof of Stake (DPoS)
- Proof of Authority (PoA)
- Byzantine Fault Tolerance (BFT)
- Each has tradeoffs in security, speed, and decentralization',
   'intermediate', 30, 125, 4, TRUE, FALSE),
  
  (v_foundations_track_id, 'blockchain-networks', 'Blockchain Networks', 'Bitcoin, Ethereum, Solana, and the multi-chain ecosystem',
   '# Blockchain Networks

## Bitcoin Network
- First cryptocurrency
- Digital gold narrative
- Secure and decentralized
- Limited smart contract functionality
- TYT rewards paid in BTC

## Ethereum
- Smart contract platform
- Largest DeFi ecosystem
- Transitioning to PoS
- High gas fees during congestion
- Supported by TYT platform

## Alternative L1s
- **Solana**: High throughput, low fees
- **TRON**: Popular for stablecoins
- **TON**: Telegram integration
- **Polygon**: Ethereum scaling
- TYT supports multiple chains for flexibility',
   'beginner', 20, 100, 5, TRUE, FALSE);

  -- Web3 Security (3 lessons)
  INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, difficulty, estimated_minutes, completion_xp, sort_order, is_published, is_free) VALUES
  (v_security_track_id, 'common-crypto-scams', 'Common Crypto Scams', 'Identify and avoid phishing, rug pulls, and social engineering',
   '# Common Crypto Scams

## Phishing Attacks
- Fake websites mimicking legitimate platforms
- Email/SMS with malicious links
- Fake customer support
- **Protection**: Always verify URLs, never click suspicious links

## Social Engineering
- Impersonation on social media
- Fake giveaways
- Pump and dump schemes
- **Protection**: Be skeptical, verify authenticity, never share private keys

## Smart Contract Risks
- Rug pulls: Developers drain liquidity
- Unaudited contracts
- Hidden backdoors
- **Protection**: Only use audited contracts, check team reputation',
   'beginner', 25, 100, 1, TRUE, TRUE),
  
  (v_security_track_id, 'securing-your-assets', 'Securing Your Assets', 'Hardware wallets, 2FA, and multi-signature security',
   '# Securing Your Assets

## Hardware Wallets
- Ledger and Trezor devices
- Private keys never leave device
- Required for signing transactions
- Best for long-term storage
- TYT recommends for amounts over $10,000

## Multi-Factor Authentication
- SMS 2FA: Better than nothing
- Authenticator apps: More secure
- Hardware keys: Most secure
- Enable on all exchanges and wallets

## Multi-Signature Wallets
- Requires multiple signatures for transactions
- Ideal for businesses and DAOs
- Reduces single point of failure
- Can be complex to set up',
   'intermediate', 30, 125, 2, TRUE, FALSE),
  
  (v_security_track_id, 'smart-contract-audits', 'Smart Contract Audits', 'Understanding security audits and how to verify contract safety',
   '# Smart Contract Audits

## What is an Audit?
- Independent security review of smart contract code
- Identifies vulnerabilities and exploits
- Provides recommendations
- Does not guarantee 100% safety

## Major Audit Firms
- CertiK
- Trail of Bits
- OpenZeppelin
- ConsenSys Diligence
- Quantstamp

## Reading Audit Reports
- Check severity levels (Critical, High, Medium, Low)
- Verify all issues were resolved
- Look for centralization risks
- TYT contracts audited before mainnet',
   'advanced', 35, 150, 3, TRUE, FALSE);

  -- Smart Contracts (4 lessons)
  INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, difficulty, estimated_minutes, completion_xp, sort_order, is_published, is_free) VALUES
  (v_tyt_platform_track_id, 'intro-to-smart-contracts', 'Introduction to Smart Contracts', 'What are smart contracts and how do they work?',
   '# Introduction to Smart Contracts

## Smart Contract Basics
- Self-executing contracts with terms in code
- Run on blockchain networks
- Automatically enforce agreements
- Transparent and immutable
- No intermediaries needed

## Use Cases
- DeFi protocols (lending, trading)
- NFT minting and marketplaces
- DAO governance
- Supply chain automation
- TYT mining rewards distribution

## Programming Languages
- **Solidity** (Ethereum)
- **Rust** (Solana)
- **Vyper** (Ethereum alternative)
- **Move** (Aptos/Sui)
- TYT uses Solidity for EVM chains',
   'beginner', 20, 75, 10, TRUE, TRUE),
  
  (v_tyt_platform_track_id, 'tyt-miner-nft-contracts', 'TYT Miner NFT Contracts', 'Understanding TYT digital miner smart contracts',
   '# TYT Miner NFT Contracts

## MinerNFT Contract
ERC-721 tokens representing miners. Each NFT has unique properties:
- Hash rate (TH/s)
- Efficiency (W/TH)
- Region (affects electricity cost)
- Upgradable tiers

## Rewards Engine
- Daily BTC rewards calculated on-chain
- Merkle proofs for gas-efficient claims
- Automatic reinvestment options
- Transparent fee structure

## Maintenance System
- Pay in TYT token for discounts
- Automatic burn mechanism
- Dynamic pricing based on BTC difficulty
- Grace period before miner deactivation',
   'intermediate', 30, 125, 11, TRUE, FALSE),
  
  (v_tyt_platform_track_id, 'marketplace-and-trading', 'Marketplace & Trading', 'How the TYT miner marketplace works',
   '# Marketplace & Trading

## Marketplace Contract
- P2P miner trading
- Escrow system for safe trades
- Royalty fees to original creator
- 1% platform fee (supports foundation)
- Only TYT token accepted

## Listing Your Miner
- Set your asking price
- Include miner stats and history
- Buyers can inspect on-chain data
- Instant settlement upon sale
- You keep earned rewards

## Buying Miners
- Filter by hashrate, efficiency, ROI
- Verify contract authenticity
- Check maintenance payment history
- Transfer ownership instantly
- Continue earning immediately',
   'intermediate', 25, 100, 12, TRUE, FALSE),
  
  (v_tyt_platform_track_id, 'governance-and-vetyt', 'Governance & veTYT', 'Participate in TYT protocol governance',
   '# Governance & veTYT

## VotingEscrowTYT
- Lock TYT tokens to get veTYT
- 1 week to 4 years lock periods
- Longer locks = more voting power
- Non-transferable voting rights
- Influences protocol parameters

## Governance Proposals
- Fee adjustments
- Burn schedule changes
- Foundation allocation
- New feature additions
- Requires 100,000 veTYT to propose

## Voting Process
- Review proposals on dashboard
- Cast vote with veTYT weight
- 7-day voting period
- 10% quorum required
- Automatic execution after passage',
   'advanced', 35, 150, 13, TRUE, FALSE);

  -- DeFi Basics (3 lessons)
  INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, difficulty, estimated_minutes, completion_xp, sort_order, is_published, is_free) VALUES
  (v_defi_track_id, 'intro-to-defi', 'Introduction to DeFi', 'Decentralized finance fundamentals and key concepts',
   '# Introduction to DeFi

## What is DeFi?
- Financial services without intermediaries
- Built on smart contracts
- Permissionless and transparent
- Global access 24/7
- Composable (protocols work together)

## Key Protocols
- **Uniswap**: Decentralized exchange
- **Aave**: Lending and borrowing
- **Curve**: Stablecoin swaps
- **Compound**: Money markets
- TYT integrates with major DeFi protocols

## Opportunities
- Earn yield on crypto holdings
- Access to global markets
- Borrow without credit checks
- Trade without KYC (up to limits)
- Participate in governance',
   'beginner', 20, 75, 1, TRUE, TRUE),
  
  (v_defi_track_id, 'liquidity-pools-amms', 'Liquidity Pools & AMMs', 'How automated market makers work and how to provide liquidity',
   '# Liquidity Pools & AMMs

## Automated Market Makers
- Constant product formula (x * y = k)
- No order books needed
- Liquidity providers earn fees
- Slippage based on pool depth
- Used by Uniswap, SushiSwap, PancakeSwap

## Providing Liquidity
- Deposit equal value of two tokens
- Receive LP tokens as receipt
- Earn trading fees (0.3% typical)
- Exposed to impermanent loss
- Can withdraw anytime

## Impermanent Loss
- Loss vs. holding tokens separately
- Occurs when prices diverge
- Often offset by fees over time
- Higher volatility = higher risk
- Stablecoin pairs minimize risk',
   'intermediate', 30, 125, 2, TRUE, FALSE),
  
  (v_defi_track_id, 'yield-farming-staking', 'Yield Farming & Staking', 'Earning passive income with crypto assets',
   '# Yield Farming & Staking

## Staking Basics
- Lock tokens to support network
- Earn rewards for participation
- PoS networks require staking
- Typical APR: 5-20%
- TYT offers charity staking option

## Yield Farming
- Provide liquidity to earn tokens
- Move between pools for best rates
- Compound rewards for growth
- High APY comes with high risk
- Be aware of token emissions

## Risk Management
- Never farm with funds you cannot lose
- Diversify across protocols
- Verify contract audits
- Understand tokenomics
- Monitor pool TVL and rewards',
   'intermediate', 25, 100, 3, TRUE, FALSE);

END $$;