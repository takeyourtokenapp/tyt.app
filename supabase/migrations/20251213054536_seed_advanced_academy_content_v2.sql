/*
  # Advanced Academy Content

  1. Purpose
    - Add advanced tracks: Mining Economics, Security, DeFi, TYT Ecosystem
    - Add comprehensive lessons for each track
    
  2. New Tracks
    - Mining Economics & ROI
    - Security & Best Practices
    - DeFi & Staking
    - TYT Ecosystem Mastery
*/

DO $$
DECLARE
  v_track_id uuid;
  v_track_exists boolean;
BEGIN
  SELECT EXISTS(SELECT 1 FROM academy_tracks WHERE slug = 'mining-economics') INTO v_track_exists;
  
  IF NOT v_track_exists THEN
    INSERT INTO academy_tracks (slug, title, description, sort_order, difficulty, estimated_hours, is_published, icon, color)
    VALUES 
      ('mining-economics', 'Mining Economics & ROI', 'Master the economics of Bitcoin mining, calculate profitability, and optimize your mining operations', 2, 'intermediate', 4, true, 'TrendingUp', 'amber'),
      ('security-best-practices', 'Security & Best Practices', 'Learn advanced security practices to protect your crypto assets and prevent common attacks', 3, 'intermediate', 3, true, 'Shield', 'red'),
      ('defi-staking', 'DeFi & Staking', 'Understand decentralized finance, yield farming, and staking strategies', 4, 'advanced', 5, true, 'Coins', 'green'),
      ('tyt-ecosystem', 'TYT Ecosystem Mastery', 'Deep dive into TYT token economics, governance, and platform features', 5, 'advanced', 6, true, 'Zap', 'purple');

    SELECT id INTO v_track_id FROM academy_tracks WHERE slug = 'mining-economics' LIMIT 1;
    INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, sort_order, difficulty, estimated_minutes, has_quiz, completion_xp, is_published)
    VALUES 
      (v_track_id, 'roi-basics', 'Understanding ROI in Mining', 'Learn how to calculate Return on Investment for mining operations', '# Understanding ROI in Mining\n\nROI (Return on Investment) is crucial for mining profitability.\n\n## Key Metrics\n- Initial Investment\n- Daily Revenue\n- Maintenance Costs\n- Electricity Costs\n- Break-even Point', 1, 'intermediate', 15, true, 30, true),
      (v_track_id, 'hash-rate-efficiency', 'Hashrate vs Efficiency', 'Balance between hashrate and power efficiency', '# Hashrate vs Efficiency\n\nUnderstand the relationship between TH/s and W/TH.\n\n## Key Concepts\n- Higher hashrate = more BTC\n- Lower W/TH = lower costs\n- Sweet spot optimization', 2, 'intermediate', 20, true, 35, true),
      (v_track_id, 'difficulty-adjustments', 'Bitcoin Difficulty Adjustments', 'How network difficulty affects your mining rewards', '# Bitcoin Difficulty Adjustments\n\nEvery 2016 blocks, Bitcoin adjusts mining difficulty.\n\n## Impact on Mining\n- Difficulty increases reduce rewards\n- Network hashrate correlation\n- Long-term planning strategies', 3, 'intermediate', 25, true, 40, true),
      (v_track_id, 'halving-economics', 'Bitcoin Halving Economics', 'Understanding the halving cycle and its impact', '# Bitcoin Halving Economics\n\nEvery 210,000 blocks (~4 years), block rewards halve.\n\n## Historical Halvings\n- 2012: 50 → 25 BTC\n- 2016: 25 → 12.5 BTC\n- 2020: 12.5 → 6.25 BTC\n- 2024: 6.25 → 3.125 BTC', 4, 'intermediate', 20, true, 35, true);

    SELECT id INTO v_track_id FROM academy_tracks WHERE slug = 'security-best-practices' LIMIT 1;
    INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, sort_order, difficulty, estimated_minutes, has_quiz, completion_xp, is_published)
    VALUES 
      (v_track_id, 'private-key-security', 'Private Key Security', 'Best practices for securing your private keys', '# Private Key Security\n\nYour private keys = your Bitcoin. Never share them!\n\n## Best Practices\n- Use hardware wallets\n- Never store online\n- Multiple backups\n- Metal seed plates', 1, 'intermediate', 15, true, 30, true),
      (v_track_id, 'phishing-prevention', 'Phishing Attack Prevention', 'Recognize and avoid phishing scams', '# Phishing Attack Prevention\n\nPhishing is the #1 attack vector in crypto.\n\n## Red Flags\n- Unsolicited messages\n- Urgent action required\n- Suspicious links\n- Grammar mistakes', 2, 'intermediate', 20, true, 35, true),
      (v_track_id, 'two-factor-auth', 'Two-Factor Authentication', 'Implementing 2FA for maximum security', '# Two-Factor Authentication\n\n2FA adds critical security layer.\n\n## 2FA Methods\n- Authenticator apps (best)\n- Hardware keys (excellent)\n- SMS (avoid)\n- Email (avoid)', 3, 'intermediate', 15, true, 30, true),
      (v_track_id, 'cold-storage', 'Cold Storage Strategies', 'Long-term storage for large amounts', '# Cold Storage Strategies\n\nFor HODLing, nothing beats cold storage.\n\n## Options\n- Hardware wallets\n- Paper wallets\n- Metal plates\n- Multi-sig vaults', 4, 'advanced', 25, true, 40, true);

    SELECT id INTO v_track_id FROM academy_tracks WHERE slug = 'defi-staking' LIMIT 1;
    INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, sort_order, difficulty, estimated_minutes, has_quiz, completion_xp, is_published)
    VALUES 
      (v_track_id, 'defi-intro', 'Introduction to DeFi', 'Understanding decentralized finance basics', '# Introduction to DeFi\n\nDeFi = Financial services without intermediaries.\n\n## Core Principles\n- Permissionless\n- Transparent\n- Composable\n- Non-custodial', 1, 'advanced', 20, true, 40, true),
      (v_track_id, 'staking-basics', 'Staking Fundamentals', 'How staking works and why it matters', '# Staking Fundamentals\n\nStaking = locking tokens to earn rewards.\n\n## Benefits\n- Passive income\n- Network security\n- Governance rights\n- Compound returns', 2, 'advanced', 20, true, 40, true),
      (v_track_id, 'yield-farming', 'Yield Farming Strategies', 'Advanced yield farming techniques', '# Yield Farming Strategies\n\nMaximize returns through strategic liquidity provision.\n\n## Strategies\n- Single-asset staking\n- LP token farming\n- Auto-compounding\n- Risk management', 3, 'advanced', 30, true, 50, true),
      (v_track_id, 'impermanent-loss', 'Understanding Impermanent Loss', 'Risks of liquidity provision', '# Understanding Impermanent Loss\n\nIL = temporary loss from price divergence in LP pools.\n\n## Key Concepts\n- Price ratio changes\n- Pool rebalancing\n- Mitigation strategies\n- Fee compensation', 4, 'advanced', 25, true, 45, true);

    SELECT id INTO v_track_id FROM academy_tracks WHERE slug = 'tyt-ecosystem' LIMIT 1;
    INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, sort_order, difficulty, estimated_minutes, has_quiz, completion_xp, is_published)
    VALUES 
      (v_track_id, 'tyt-tokenomics', 'TYT Tokenomics Deep Dive', 'Complete overview of TYT token economics', '# TYT Tokenomics Deep Dive\n\nTYT is the heart of the ecosystem.\n\n## Utility\n- Maintenance payments (-20% fee)\n- Governance voting\n- Marketplace currency\n- VIP tier unlocks', 1, 'advanced', 25, true, 50, true),
      (v_track_id, 'vetyt-governance', 'veTYT Governance Model', 'Lock TYT for voting power', '# veTYT Governance Model\n\nveTYT = vote-escrowed TYT for governance.\n\n## Mechanics\n- Lock 1 week → 4 years\n- Longer lock = more power\n- Voting on proposals\n- Weekly rewards', 2, 'advanced', 30, true, 50, true),
      (v_track_id, 'discount-system', 'TYT Discount System', 'Maximize your maintenance savings', '# TYT Discount System\n\nPay maintenance in TYT for huge discounts!\n\n## Discount Tiers\n- Bronze: 2%\n- Silver: 5%\n- Gold: 9%\n- Platinum: 13%\n- Diamond: 18%', 3, 'advanced', 20, true, 40, true),
      (v_track_id, 'burn-mechanics', 'Burn & CharityMint Mechanics', 'Deflationary tokenomics explained', '# Burn & CharityMint Mechanics\n\nTYT is deflationary with charity component.\n\n## Burn Sources\n- All maintenance fees\n- Marketplace fees\n- Upgrade fees\n- Weekly burn events\n\n## CharityMint\n- 25% of burn → foundation\n- Sustainable funding\n- Transparent on-chain', 4, 'advanced', 25, true, 45, true),
      (v_track_id, 'marketplace-strategies', 'NFT Marketplace Strategies', 'Trading miners like a pro', '# NFT Marketplace Strategies\n\nMaster the art of miner trading.\n\n## Strategies\n- Buy undervalued miners\n- Flip for profit\n- Hold for rewards\n- Upgrade before selling', 5, 'advanced', 30, true, 50, true),
      (v_track_id, 'foundation-impact', 'Foundation Impact & Transparency', 'How your transactions save lives', '# Foundation Impact & Transparency\n\nEvery TYT transaction helps children.\n\n## Funding Sources\n- 1% of all fees\n- Direct donations\n- CharityMint\n- Charity staking rewards\n\n## Impact\n- Medical research\n- Family support\n- Hospital equipment\n- Clinical trials', 6, 'advanced', 20, true, 40, true);
  END IF;
END $$;
