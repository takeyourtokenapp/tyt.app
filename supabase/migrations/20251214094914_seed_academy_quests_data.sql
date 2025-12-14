/*
  # Seed Academy Quests Data

  ## Quest Data
  - Insert comprehensive quest catalog
  - Daily, weekly, monthly, and achievement quests
  - Cover all major platform features:
    * Learning and education
    * Mining and marketplace
    * Community participation
    * Governance and DAO
    * Charitable contributions
  
  ## Quest Types
  1. Achievement - one-time milestones
  2. Daily - reset every 24 hours
  3. Weekly - reset every 7 days
  4. Monthly - reset every 30 days
  
  ## Rewards
  - XP for progression
  - TYT tokens for completion
  - Requirements tracked via jsonb
*/

-- Delete existing quests to avoid duplicates
DELETE FROM academy_quests WHERE quest_type IN ('achievement', 'daily', 'weekly', 'monthly');

-- Insert quest data
INSERT INTO academy_quests (
  slug, title, description, quest_type, difficulty, xp_reward, tyt_reward, requirements, icon
) VALUES 
  -- Achievement Quests
  (
    'first-steps',
    'First Steps',
    'Complete your first lesson in the TYT Academy',
    'achievement',
    'easy',
    100,
    5,
    '{"lessons_completed": 1}',
    'BookOpen'
  ),
  (
    'knowledge-seeker',
    'Knowledge Seeker',
    'Complete 10 lessons across different tracks',
    'achievement',
    'medium',
    500,
    25,
    '{"lessons_completed": 10}',
    'Award'
  ),
  (
    'academy-scholar',
    'Academy Scholar',
    'Earn your first certificate by completing a track',
    'achievement',
    'hard',
    1000,
    50,
    '{"certificates_earned": 1}',
    'GraduationCap'
  ),
  (
    'wallet-warrior',
    'Wallet Warrior',
    'Connect your first Web3 wallet',
    'achievement',
    'easy',
    50,
    3,
    '{"wallet_connected": 1}',
    'Wallet'
  ),
  
  -- Daily Quests
  (
    'daily-learner',
    'Daily Learner',
    'Complete one lesson today',
    'daily',
    'easy',
    50,
    2,
    '{"lessons_today": 1}',
    'Calendar'
  ),
  (
    'quiz-master',
    'Quiz Master',
    'Pass a quiz with 80% or higher',
    'daily',
    'medium',
    75,
    3,
    '{"quiz_score_min": 80}',
    'Target'
  ),
  (
    'community-helper',
    'Community Helper',
    'Answer a question in the community chat',
    'daily',
    'easy',
    40,
    1,
    '{"community_messages": 1}',
    'MessageCircle'
  ),
  (
    'daily-miner',
    'Daily Miner',
    'Check your mining dashboard',
    'daily',
    'easy',
    30,
    1,
    '{"dashboard_visits": 1}',
    'BarChart3'
  ),
  
  -- Weekly Quests
  (
    'miner-owner',
    'Miner Owner',
    'Purchase or own at least one NFT miner',
    'weekly',
    'medium',
    200,
    10,
    '{"miners_owned": 1}',
    'Pickaxe'
  ),
  (
    'trader',
    'Trader',
    'Complete a marketplace transaction',
    'weekly',
    'medium',
    150,
    7,
    '{"marketplace_trades": 1}',
    'ShoppingCart'
  ),
  (
    'charitable-soul',
    'Charitable Soul',
    'Make a donation to the TYT Children''s Foundation',
    'weekly',
    'hard',
    300,
    15,
    '{"donations_made": 1}',
    'Heart'
  ),
  (
    'social-butterfly',
    'Social Butterfly',
    'Interact with 5 different community members',
    'weekly',
    'easy',
    100,
    5,
    '{"unique_interactions": 5}',
    'Users'
  ),
  (
    'reward-collector',
    'Reward Collector',
    'Claim your mining rewards',
    'weekly',
    'medium',
    120,
    6,
    '{"rewards_claimed": 1}',
    'Gift'
  ),
  
  -- Monthly Quests
  (
    'dao-participant',
    'DAO Participant',
    'Vote on at least 3 governance proposals',
    'monthly',
    'hard',
    500,
    25,
    '{"governance_votes": 3}',
    'Vote'
  ),
  (
    'mining-tycoon',
    'Mining Tycoon',
    'Accumulate 100 TH/s of mining power',
    'monthly',
    'hard',
    1000,
    50,
    '{"total_th": 100}',
    'Zap'
  ),
  (
    'academy-master',
    'Academy Master',
    'Complete all lessons in any track',
    'monthly',
    'hard',
    2000,
    100,
    '{"track_completed": 1}',
    'Trophy'
  ),
  (
    'charity-champion',
    'Charity Champion',
    'Donate a total of 1000 TYT to the foundation',
    'monthly',
    'hard',
    800,
    40,
    '{"total_donated": 1000}',
    'HeartHandshake'
  ),
  (
    'market-maven',
    'Market Maven',
    'Complete 10 marketplace transactions',
    'monthly',
    'hard',
    600,
    30,
    '{"marketplace_trades": 10}',
    'TrendingUp'
  ),
  (
    'community-leader',
    'Community Leader',
    'Reach top 10 in the leaderboard',
    'monthly',
    'hard',
    1500,
    75,
    '{"leaderboard_rank": 10}',
    'Crown'
  );
