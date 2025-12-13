/*
  # Add More Academy Content - Quests & Advanced Lessons
  
  1. Additional Lessons
    - Advanced mining strategies
    - DeFi integration
    - NFT marketplace mastery
    - Charity staking guide
  
  2. Quest System
    - Daily quests
    - Weekly challenges
    - Achievement milestones
*/

-- Add more advanced lessons to TYT Platform track
INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, sort_order, difficulty, estimated_minutes, has_quiz, completion_xp, is_published, is_free)
SELECT t.id, 'marketplace-strategies', 'NFT Marketplace Strategies', 'Learn how to buy, sell, and trade miners profitably',
'## NFT Marketplace Mastery

The TYT marketplace is where miners trade hands. Understanding market dynamics can maximize your returns.

### Buying Strategies

**1. Entry Points**
- Look for miners during market dips
- Compare hashrate vs. price ($/TH)
- Check maintenance history and efficiency

**2. Tier Selection**
- **Bronze**: Best for beginners, lower cost
- **Silver/Gold**: Balanced efficiency and rewards
- **Platinum/Diamond**: Premium efficiency, higher upfront cost

### Selling Strategies

**1. Timing**
- Sell during bull markets
- Consider maintenance cost increases
- Factor in remaining profitable lifespan

**2. Pricing**
- Benchmark against similar listings
- Highlight unique advantages (efficiency, region)
- Consider quick-sell vs. premium pricing

### Market Analysis

Track these metrics:
- **Floor price**: Lowest listed price by tier
- **Volume**: Number of trades (indicates demand)
- **Avg. ROI time**: How long until breakeven
- **TYT/BTC ratio**: Affects maintenance costs

### Pro Tips

💡 **Upgrade before listing** - Higher tier miners command premiums

💡 **Bundle sales** - Multiple miners may attract serious buyers

💡 **Seasonal trends** - Mining profitability follows Bitcoin price cycles',
12,
'intermediate',
20,
true,
20,
true,
false
FROM academy_tracks t WHERE t.slug = 'tyt-platform'
ON CONFLICT (track_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  content_mdx = EXCLUDED.content_mdx,
  is_published = true;

-- Charity staking lesson
INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, sort_order, difficulty, estimated_minutes, has_quiz, completion_xp, is_published, is_free)
SELECT t.id, 'charity-staking-guide', 'Charity Staking Guide', 'Stake TYT to support brain cancer research',
'## Charity Staking: Mining with Purpose

TYT Charity Staking lets you earn rewards while supporting children with brain cancer.

### How It Works

1. **Stake TYT Tokens**  
   Lock your TYT for 30, 90, or 180 days

2. **Earn Staking Rewards**  
   Receive competitive APY on your stake

3. **Support Research**  
   1% of all staking rewards goes to the Foundation

### Staking Tiers

| Duration | APY | Bonus XP | Foundation Impact |
|----------|-----|----------|------------------|
| 30 days  | 12% | +50 XP   | Low              |
| 90 days  | 18% | +150 XP  | Medium           |
| 180 days | 25% | +400 XP  | High             |

### Benefits

✅ **Passive Income** - Earn rewards automatically

✅ **Make Impact** - Every stake helps fund research

✅ **Rank Boost** - Earn bonus XP towards Owl ranks

✅ **Early Unstake** - 5% penalty, but flexibility available

### Example Calculation

```
Stake: 10,000 TYT
Duration: 90 days (18% APY)
Rewards: 10,000 × 0.18 × (90/365) = 443 TYT
Foundation: 443 × 0.01 = 4.43 TYT donated
Your Net: 438.57 TYT profit
```

### Getting Started

1. Navigate to **Charity Staking** page
2. Select amount and duration
3. Confirm transaction
4. Track your rewards daily

Every TYT staked brings us closer to curing childhood brain cancer. 💙',
15,
'beginner',
12,
true,
15,
true,
true
FROM academy_tracks t WHERE t.slug = 'tyt-platform'
ON CONFLICT (track_id, slug) DO UPDATE SET is_published = true;

-- Advanced security lesson
INSERT INTO academy_lessons (track_id, slug, title, description, content_mdx, sort_order, difficulty, estimated_minutes, has_quiz, completion_xp, is_published, is_free)
SELECT t.id, 'advanced-security', 'Advanced Security Practices', 'Protect your assets like a pro',
'## Advanced Crypto Security

Security is your responsibility. These practices protect you from 99% of threats.

### Hardware Wallet Integration

**Best Practice**: Never keep large amounts on exchanges or hot wallets.

**Setup Steps**:
1. Purchase Ledger or Trezor from official site
2. Initialize with new seed phrase (NEVER digital!)
3. Write seed on metal backup (fireproof)
4. Store in separate secure locations
5. Test small transactions before large ones

### Multi-Signature Wallets

For amounts >$50k, consider multi-sig:
- Requires 2-of-3 or 3-of-5 signatures
- No single point of failure
- Ideal for business/DAO treasuries

**Popular Options**: Gnosis Safe, Casa, Unchained Capital

### Phishing & Scam Protection

🚨 **Common Scams**:
- Fake support contacting you first
- "Verify your wallet" emails
- Airdrop scams requiring seed phrases
- Impersonator bots in Telegram/Discord
- Too-good-to-be-true investment schemes

🛡️ **Protection**:
- Bookmark official sites
- Verify URLs before wallet connects
- Enable transaction confirmations on device
- Use separate email for crypto
- NEVER share seed phrase

### Smart Contract Risks

Before using DeFi:
- Check contract audits (CertiK, Quantstamp)
- Verify on blockchain explorer
- Test with small amounts first
- Use revoke.cash to remove old approvals
- Understand impermanent loss (for LPs)

### Operational Security (OpSec)

💡 **Digital Hygiene**:
- Use password manager (1Password, Bitwarden)
- Enable 2FA everywhere (use Authy, not SMS)
- Different passwords for every service
- VPN for public WiFi
- Regular malware scans

💡 **Physical Security**:
- Don''t discuss holdings publicly
- Secure home network (change router password)
- Camera covers on devices
- Encrypted hard drives

Remember: **Not your keys, not your crypto.** 🔐',
8,
'advanced',
25,
true,
30,
true,
false
FROM academy_tracks t WHERE t.slug = 'risk-compliance'
ON CONFLICT (track_id, slug) DO UPDATE SET is_published = true;

-- Create quest system
CREATE TABLE IF NOT EXISTS academy_quests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  quest_type text NOT NULL CHECK (quest_type IN ('daily', 'weekly', 'monthly', 'achievement')),
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  xp_reward integer NOT NULL DEFAULT 0,
  tyt_reward numeric(20,8) DEFAULT 0,
  requirements jsonb NOT NULL DEFAULT '{}',
  icon text,
  is_active boolean DEFAULT true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_academy_quests_type ON academy_quests(quest_type);
CREATE INDEX IF NOT EXISTS idx_academy_quests_active ON academy_quests(is_active);

-- User quest progress tracking
CREATE TABLE IF NOT EXISTS academy_user_quests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id uuid NOT NULL REFERENCES academy_quests(id) ON DELETE CASCADE,
  progress jsonb DEFAULT '{}',
  completed_at timestamptz,
  claimed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, quest_id)
);

CREATE INDEX IF NOT EXISTS idx_academy_user_quests_user ON academy_user_quests(user_id);
CREATE INDEX IF NOT EXISTS idx_academy_user_quests_completed ON academy_user_quests(completed_at);

-- Enable RLS
ALTER TABLE academy_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_user_quests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quests
CREATE POLICY "Anyone can view active quests"
  ON academy_quests FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Users can view own quest progress"
  ON academy_user_quests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own quest progress"
  ON academy_user_quests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quest progress update"
  ON academy_user_quests FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Seed initial quests
INSERT INTO academy_quests (title, description, quest_type, difficulty, xp_reward, tyt_reward, requirements, icon) VALUES
('First Steps', 'Complete your first lesson in the Academy', 'achievement', 'easy', 50, 0.5, '{"lessons_completed": 1}', '🎓'),
('Knowledge Seeker', 'Complete 5 lessons', 'achievement', 'easy', 150, 2, '{"lessons_completed": 5}', '📚'),
('Academy Scholar', 'Complete 15 lessons', 'achievement', 'medium', 500, 10, '{"lessons_completed": 15}', '🏆'),
('Daily Learner', 'Complete 1 lesson today', 'daily', 'easy', 25, 0.1, '{"daily_lessons": 1}', '☀️'),
('Quiz Master', 'Score 100% on any quiz', 'achievement', 'medium', 100, 1, '{"perfect_quiz": 1}', '✨'),
('Community Helper', 'Refer 3 friends to TYT', 'weekly', 'medium', 300, 5, '{"referrals": 3}', '🤝'),
('Miner Owner', 'Purchase your first NFT miner', 'achievement', 'easy', 200, 5, '{"miners_owned": 1}', '⛏️'),
('Trader', 'Complete your first marketplace transaction', 'achievement', 'easy', 150, 3, '{"marketplace_trades": 1}', '💱'),
('Charitable Soul', 'Stake TYT in Charity Staking', 'achievement', 'medium', 250, 8, '{"charity_stakes": 1}', '💙'),
('DAO Participant', 'Vote in a governance proposal', 'achievement', 'medium', 200, 5, '{"dao_votes": 1}', '🗳️');

COMMENT ON TABLE academy_quests IS 'Quest system for gamification and engagement';
COMMENT ON TABLE academy_user_quests IS 'User progress tracking for quests';
