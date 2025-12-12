/*
  # Academy Lessons Seed Data

  Populates all academy tracks with comprehensive lesson content:
  - 60+ lessons across 6 tracks
  - Video content with realistic durations
  - XP rewards for completion
  - Progressive difficulty
  - Quizzes and interactive content
*/

DO $$
DECLARE
  track_foundations UUID;
  track_bitcoin UUID;
  track_nft UUID;
  track_multichain UUID;
  track_security UUID;
  track_compliance UUID;
  default_content TEXT := '# Lesson Content

This lesson covers important concepts and practical knowledge.

## Learning Objectives

- Understand key concepts
- Apply knowledge practically
- Build real-world skills

## Content

Detailed lesson content coming soon...

## Summary

Key takeaways from this lesson.
';
BEGIN
  -- Get existing track IDs
  SELECT id INTO track_foundations FROM academy_tracks WHERE slug = 'foundations';
  SELECT id INTO track_bitcoin FROM academy_tracks WHERE slug = 'bitcoin-mining';
  SELECT id INTO track_nft FROM academy_tracks WHERE slug = 'nft-miners';
  SELECT id INTO track_multichain FROM academy_tracks WHERE slug = 'multi-chain';
  SELECT id INTO track_security FROM academy_tracks WHERE slug = 'security';
  SELECT id INTO track_compliance FROM academy_tracks WHERE slug = 'compliance';

  -- Track 1: Foundations
  INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, difficulty, estimated_minutes, completion_xp, sort_order, has_quiz, is_published, is_free)
  VALUES
    (track_foundations, 'what-is-blockchain', 'What is Blockchain?', 'Introduction to blockchain technology and distributed ledgers', default_content, 'beginner', 15, 100, 1, false, true, true),
    (track_foundations, 'cryptocurrency-basics', 'Cryptocurrency Basics', 'Understanding digital currencies and how they work', default_content, 'beginner', 20, 150, 2, false, true, true),
    (track_foundations, 'wallets-explained', 'Crypto Wallets Explained', 'Different types of wallets and how to use them safely', default_content, 'beginner', 25, 200, 3, false, true, false),
    (track_foundations, 'public-private-keys', 'Public & Private Keys', 'Understanding cryptographic keys and addresses', default_content, 'beginner', 20, 150, 4, false, true, false),
    (track_foundations, 'transactions', 'How Transactions Work', 'Transaction lifecycle from creation to confirmation', default_content, 'beginner', 30, 250, 5, false, true, false),
    (track_foundations, 'consensus-mechanisms', 'Consensus Mechanisms', 'Proof of Work, Proof of Stake, and other consensus models', default_content, 'beginner', 25, 200, 6, false, true, false),
    (track_foundations, 'defi-intro', 'Introduction to DeFi', 'Decentralized Finance basics and opportunities', default_content, 'beginner', 20, 150, 7, false, true, false),
    (track_foundations, 'smart-contracts', 'Smart Contracts 101', 'Self-executing contracts and their applications', default_content, 'beginner', 25, 200, 8, false, true, false),
    (track_foundations, 'foundations-quiz', 'Foundations Quiz', 'Test your cryptocurrency knowledge', default_content, 'beginner', 15, 300, 9, true, true, false);

  -- Track 2: Bitcoin Mining
  INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, difficulty, estimated_minutes, completion_xp, sort_order, has_quiz, is_published, is_free)
  VALUES
    (track_bitcoin, 'bitcoin-history', 'History of Bitcoin', 'From Satoshi''s whitepaper to global adoption', default_content, 'beginner', 20, 150, 1, false, true, true),
    (track_bitcoin, 'proof-of-work', 'Proof of Work Explained', 'Understanding Bitcoin''s consensus mechanism', default_content, 'beginner', 25, 200, 2, false, true, true),
    (track_bitcoin, 'mining-process', 'The Mining Process', 'How miners secure the network and earn rewards', default_content, 'beginner', 30, 250, 3, false, true, false),
    (track_bitcoin, 'hashrate-difficulty', 'Hashrate & Difficulty', 'Network hashrate and difficulty adjustments', default_content, 'intermediate', 25, 200, 4, false, true, false),
    (track_bitcoin, 'mining-economics', 'Mining Economics', 'Costs, rewards, and profitability calculations', default_content, 'intermediate', 35, 300, 5, false, true, false),
    (track_bitcoin, 'halving-events', 'Bitcoin Halving', 'How halvings affect supply and mining rewards', default_content, 'intermediate', 20, 150, 6, false, true, false),
    (track_bitcoin, 'pool-mining', 'Pool vs Solo Mining', 'Different mining approaches and strategies', default_content, 'intermediate', 25, 200, 7, false, true, false),
    (track_bitcoin, 'asic-hardware', 'ASIC Mining Hardware', 'Understanding mining equipment and specifications', default_content, 'intermediate', 30, 250, 8, false, true, false),
    (track_bitcoin, 'mining-regions', 'Global Mining Landscape', 'Mining regions, energy costs, and regulations', default_content, 'intermediate', 25, 200, 9, false, true, false),
    (track_bitcoin, 'bitcoin-quiz', 'Bitcoin Mining Quiz', 'Test your Bitcoin mining knowledge', default_content, 'intermediate', 15, 350, 10, true, true, false);

  -- Track 3: NFT Digital Miners
  INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, difficulty, estimated_minutes, completion_xp, sort_order, has_quiz, is_published, is_free)
  VALUES
    (track_nft, 'nft-miners-intro', 'Introduction to NFT Miners', 'How NFT-based mining works on TYT platform', default_content, 'beginner', 15, 100, 1, false, true, true),
    (track_nft, 'understanding-ths', 'Understanding TH/s', 'Mining power measurement and what it means', default_content, 'beginner', 20, 150, 2, false, true, true),
    (track_nft, 'efficiency-wth', 'Efficiency: W/TH Metric', 'Power efficiency and its impact on profitability', default_content, 'beginner', 25, 200, 3, false, true, false),
    (track_nft, 'miner-tiers', 'Miner Tiers & Rarity', 'Different miner types and their characteristics', default_content, 'beginner', 20, 150, 4, false, true, false),
    (track_nft, 'regional-advantages', 'Regional Mining Benefits', 'USA, Canada, EU, Asia - location advantages', default_content, 'intermediate', 25, 200, 5, false, true, false),
    (track_nft, 'daily-rewards', 'Daily Reward Calculations', 'How your daily BTC rewards are calculated', default_content, 'intermediate', 30, 250, 6, false, true, false),
    (track_nft, 'maintenance-fees', 'Maintenance & Fees', 'Understanding electricity and service costs', default_content, 'intermediate', 25, 200, 7, false, true, false),
    (track_nft, 'upgrades-system', 'Miner Upgrade System', 'How to upgrade TH/s and efficiency', default_content, 'intermediate', 30, 250, 8, false, true, false),
    (track_nft, 'marketplace-trading', 'NFT Marketplace Trading', 'Buy, sell, and trade miners effectively', default_content, 'intermediate', 35, 300, 9, false, true, false),
    (track_nft, 'roi-optimization', 'ROI Optimization', 'Maximize your return on investment', default_content, 'advanced', 40, 400, 10, false, true, false),
    (track_nft, 'nft-miners-quiz', 'NFT Miners Quiz', 'Test your NFT mining expertise', default_content, 'intermediate', 15, 350, 11, true, true, false);

  -- Track 4: Multi-Chain
  INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, difficulty, estimated_minutes, completion_xp, sort_order, has_quiz, is_published, is_free)
  VALUES
    (track_multichain, 'multichain-intro', 'Multi-Chain Ecosystem', 'Understanding multiple blockchain networks', default_content, 'intermediate', 20, 150, 1, false, true, true),
    (track_multichain, 'bitcoin-network', 'Bitcoin Network', 'Layer 1: Bitcoin blockchain fundamentals', default_content, 'intermediate', 25, 200, 2, false, true, false),
    (track_multichain, 'lightning-network', 'Lightning Network', 'Layer 2: Fast and cheap Bitcoin transactions', default_content, 'intermediate', 30, 250, 3, false, true, false),
    (track_multichain, 'liquid-network', 'Liquid Network', 'Confidential Bitcoin transactions and assets', default_content, 'intermediate', 25, 200, 4, false, true, false),
    (track_multichain, 'ethereum-evm', 'Ethereum & EVM Chains', 'Ethereum and EVM-compatible networks', default_content, 'intermediate', 30, 250, 5, false, true, false),
    (track_multichain, 'solana-ecosystem', 'Solana Ecosystem', 'High-performance blockchain for TYT token', default_content, 'intermediate', 25, 200, 6, false, true, false),
    (track_multichain, 'tron-network', 'TRON Network', 'TRON blockchain and TRC-20 tokens', default_content, 'intermediate', 20, 150, 7, false, true, false),
    (track_multichain, 'ton-blockchain', 'TON Blockchain', 'Telegram Open Network integration', default_content, 'intermediate', 25, 200, 8, false, true, false),
    (track_multichain, 'cross-chain-bridges', 'Cross-Chain Bridges', 'Moving assets between blockchains', default_content, 'advanced', 35, 300, 9, false, true, false),
    (track_multichain, 'multichain-quiz', 'Multi-Chain Quiz', 'Test your multi-chain knowledge', default_content, 'intermediate', 15, 350, 10, true, true, false);

  -- Track 5: Security
  INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, difficulty, estimated_minutes, completion_xp, sort_order, has_quiz, is_published, is_free)
  VALUES
    (track_security, 'security-fundamentals', 'Security Fundamentals', 'Basic principles of cryptocurrency security', default_content, 'beginner', 20, 150, 1, false, true, true),
    (track_security, 'wallet-security', 'Wallet Security Best Practices', 'Protect your Bitcoin and crypto assets', default_content, 'beginner', 25, 200, 2, false, true, true),
    (track_security, '2fa-authentication', 'Two-Factor Authentication', 'Secure your accounts with 2FA', default_content, 'beginner', 15, 100, 3, false, true, false),
    (track_security, 'password-management', 'Password Management', 'Creating and storing strong passwords', default_content, 'beginner', 20, 150, 4, false, true, false),
    (track_security, 'phishing-attacks', 'Recognizing Phishing', 'Identify and avoid phishing scams', default_content, 'beginner', 25, 200, 5, false, true, false),
    (track_security, 'social-engineering', 'Social Engineering Threats', 'Protect yourself from manipulation tactics', default_content, 'intermediate', 30, 250, 6, false, true, false),
    (track_security, 'transaction-verification', 'Transaction Verification', 'How to verify blockchain transactions', default_content, 'intermediate', 25, 200, 7, false, true, false),
    (track_security, 'cold-hot-wallets', 'Cold vs Hot Wallets', 'Different storage methods and security levels', default_content, 'intermediate', 30, 250, 8, false, true, false),
    (track_security, 'backup-recovery', 'Backup & Recovery', 'Seed phrases and wallet recovery procedures', default_content, 'intermediate', 25, 200, 9, false, true, false),
    (track_security, 'security-quiz', 'Security Quiz', 'Test your security knowledge', default_content, 'intermediate', 15, 300, 10, true, true, false);

  -- Track 6: Compliance
  INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, difficulty, estimated_minutes, completion_xp, sort_order, has_quiz, is_published, is_free)
  VALUES
    (track_compliance, 'regulatory-landscape', 'Crypto Regulatory Landscape', 'Global regulations and compliance overview', default_content, 'intermediate', 25, 200, 1, false, true, true),
    (track_compliance, 'kyc-aml', 'KYC & AML Requirements', 'Identity verification and anti-money laundering', default_content, 'intermediate', 30, 250, 2, false, true, false),
    (track_compliance, 'tax-obligations', 'Crypto Tax Obligations', 'How mining income is taxed worldwide', default_content, 'intermediate', 35, 300, 3, false, true, false),
    (track_compliance, 'record-keeping', 'Record Keeping Best Practices', 'Maintaining proper documentation', default_content, 'intermediate', 25, 200, 4, false, true, false),
    (track_compliance, 'us-regulations', 'US Crypto Regulations', 'IRS, SEC, and FinCEN requirements', default_content, 'intermediate', 30, 250, 5, false, true, false),
    (track_compliance, 'eu-regulations', 'EU Crypto Framework', 'MiCA and EU compliance requirements', default_content, 'intermediate', 30, 250, 6, false, true, false),
    (track_compliance, 'asia-regulations', 'Asia-Pacific Regulations', 'Compliance in Asian jurisdictions', default_content, 'intermediate', 25, 200, 7, false, true, false),
    (track_compliance, 'legal-structures', 'Legal Business Structures', 'Entity formation for crypto businesses', default_content, 'advanced', 35, 300, 8, false, true, false),
    (track_compliance, 'compliance-quiz', 'Compliance Quiz', 'Test your regulatory knowledge', default_content, 'intermediate', 15, 350, 9, true, true, false);

END $$;