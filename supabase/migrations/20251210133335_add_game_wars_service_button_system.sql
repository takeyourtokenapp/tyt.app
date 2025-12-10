/*
  # Miner Wars Game System + Service Button + GoBoxes
  
  ## Comprehensive Gaming & Rewards Layer
  
  This migration adds:
  1. **Miner Wars** - Clan-based PvP battles for BTC/TYT prizes
  2. **Service Button** - Daily -3% maintenance discount
  3. **Upgrade Tiers** - 20 levels (100 TH/s → 5000 TH/s max)
  4. **GoBoxes** - Loot boxes for VIP level achievements
  5. **Token Burn Schedule** - Weekly burn events with public reports
  6. **Game Boosts** - Purchasable power-ups (triggers 5% referral commission)
  
  ## Based on GoMining Analysis
  - Clan system with 50-member limit
  - Tournament brackets (weekly/monthly)
  - Real-time leaderboards
  - Boost marketplace
  - Service button cooldown (24h)
*/

-- Enums
DO $$ BEGIN
  CREATE TYPE clan_rank AS ENUM ('private', 'corporal', 'sergeant', 'lieutenant', 'captain', 'leader');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE tournament_status AS ENUM ('upcoming', 'active', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE boost_type AS ENUM ('hashrate_multiplier', 'efficiency_boost', 'maintenance_discount', 'reward_multiplier');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE burn_event_status AS ENUM ('scheduled', 'in_progress', 'completed', 'failed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE gobox_rarity AS ENUM ('common', 'rare', 'epic', 'legendary');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Game Clans
CREATE TABLE IF NOT EXISTS game_clans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  tag text UNIQUE NOT NULL CHECK (length(tag) <= 6),
  leader_id uuid NOT NULL REFERENCES profiles(id),
  description text,
  image_url text,
  total_members integer DEFAULT 1,
  total_hashrate numeric DEFAULT 0,
  total_btc_won numeric DEFAULT 0,
  total_tyt_won numeric DEFAULT 0,
  global_rank integer,
  win_count integer DEFAULT 0,
  loss_count integer DEFAULT 0,
  is_recruiting boolean DEFAULT true,
  min_hashrate_requirement numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS game_clan_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clan_id uuid NOT NULL REFERENCES game_clans(id) ON DELETE CASCADE,
  user_id uuid UNIQUE NOT NULL REFERENCES profiles(id),
  rank clan_rank DEFAULT 'private',
  hashrate_contribution numeric DEFAULT 0,
  battles_participated integer DEFAULT 0,
  points_earned integer DEFAULT 0,
  joined_at timestamptz DEFAULT now(),
  last_active_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS game_tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  tournament_type text DEFAULT 'weekly',
  status tournament_status DEFAULT 'upcoming',
  prize_pool_btc numeric DEFAULT 0,
  prize_pool_tyt numeric DEFAULT 0,
  winning_clan_id uuid REFERENCES game_clans(id),
  winning_user_id uuid REFERENCES profiles(id),
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  min_hashrate numeric DEFAULT 0,
  entry_fee_tyt numeric DEFAULT 0,
  participants_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE TABLE IF NOT EXISTS game_boosts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  boost_type boost_type NOT NULL,
  boost_name text NOT NULL,
  boost_value numeric NOT NULL CHECK (boost_value > 0),
  duration_hours integer NOT NULL CHECK (duration_hours > 0),
  cost_tyt numeric NOT NULL CHECK (cost_tyt > 0),
  activated_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  is_active boolean DEFAULT true,
  transaction_id uuid,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS game_tournament_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid NOT NULL REFERENCES game_tournaments(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id),
  clan_id uuid REFERENCES game_clans(id),
  score integer DEFAULT 0,
  rank integer,
  btc_won numeric DEFAULT 0,
  tyt_won numeric DEFAULT 0,
  registered_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_tournament_user ON game_tournament_participants(tournament_id, user_id) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_tournament_clan ON game_tournament_participants(tournament_id, clan_id) WHERE clan_id IS NOT NULL;

-- Service Button
CREATE TABLE IF NOT EXISTS service_button_activations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  activation_date date NOT NULL DEFAULT CURRENT_DATE,
  discount_percent numeric DEFAULT 3 CHECK (discount_percent > 0 AND discount_percent <= 3),
  activated_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  maintenance_saved numeric DEFAULT 0,
  UNIQUE(user_id, activation_date)
);

-- Miner Upgrade Tiers (1-20)
CREATE TABLE IF NOT EXISTS miner_upgrade_tiers (
  level integer PRIMARY KEY CHECK (level >= 1 AND level <= 20),
  max_hashrate numeric NOT NULL,
  upgrade_cost_tyt numeric NOT NULL CHECK (upgrade_cost_tyt > 0),
  upgrade_cost_btc numeric,
  efficiency_improvement_percent numeric DEFAULT 5,
  efficiency_upgrade_cost_tyt numeric,
  description text,
  created_at timestamptz DEFAULT now()
);

INSERT INTO miner_upgrade_tiers (level, max_hashrate, upgrade_cost_tyt, upgrade_cost_btc, efficiency_improvement_percent, efficiency_upgrade_cost_tyt, description) VALUES
(1, 100, 100, 0.0025, 5, 50, 'Entry - 100 TH/s'),
(2, 250, 200, 0.005, 5, 75, 'Hobbyist - 250 TH/s'),
(3, 500, 400, 0.01, 5, 100, 'Enthusiast - 500 TH/s'),
(4, 750, 600, 0.015, 5, 150, 'Semi-Pro - 750 TH/s'),
(5, 1000, 800, 0.02, 5, 200, 'Pro - 1,000 TH/s'),
(6, 1500, 1200, 0.03, 7, 300, 'Advanced - 1,500 TH/s'),
(7, 2000, 1600, 0.04, 7, 400, 'Expert - 2,000 TH/s'),
(8, 2500, 2000, 0.05, 7, 500, 'Master - 2,500 TH/s'),
(9, 3000, 2500, 0.0625, 7, 600, 'Grandmaster - 3,000 TH/s'),
(10, 3500, 3000, 0.075, 10, 700, 'Elite - 3,500 TH/s'),
(11, 4000, 3500, 0.0875, 10, 800, 'Champion - 4,000 TH/s'),
(12, 4200, 4000, 0.1, 10, 900, 'Hero - 4,200 TH/s'),
(13, 4400, 4500, 0.1125, 10, 1000, 'Legend - 4,400 TH/s'),
(14, 4600, 5000, 0.125, 12, 1100, 'Mythic - 4,600 TH/s'),
(15, 4750, 5500, 0.1375, 12, 1200, 'Immortal - 4,750 TH/s'),
(16, 4850, 6000, 0.15, 12, 1300, 'Divine - 4,850 TH/s'),
(17, 4925, 6500, 0.1625, 15, 1400, 'Transcendent - 4,925 TH/s'),
(18, 4975, 7000, 0.175, 15, 1500, 'Celestial - 4,975 TH/s'),
(19, 4990, 7500, 0.1875, 15, 1600, 'Eternal - 4,990 TH/s'),
(20, 5000, 8000, 0.2, 20, 2000, 'Ultimate - 5,000 TH/s MAX')
ON CONFLICT (level) DO NOTHING;

-- GoBoxes
CREATE TABLE IF NOT EXISTS goboxes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  rarity gobox_rarity NOT NULL,
  vip_level_achieved integer NOT NULL CHECK (vip_level_achieved >= 0 AND vip_level_achieved <= 10),
  tyt_reward numeric DEFAULT 0,
  btc_reward numeric DEFAULT 0,
  avatar_id uuid REFERENCES avatars(id),
  boost_duration_hours integer DEFAULT 0,
  is_opened boolean DEFAULT false,
  opened_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Token Burn Events
CREATE TABLE IF NOT EXISTS token_burn_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scheduled_at timestamptz NOT NULL,
  collected_amount numeric DEFAULT 0,
  burned_amount numeric DEFAULT 0,
  charity_mint_amount numeric DEFAULT 0,
  burn_tx_hash text,
  mint_tx_hash text,
  status burn_event_status DEFAULT 'scheduled',
  report_url text,
  executed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS burn_mint_distributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  burn_event_id uuid NOT NULL REFERENCES token_burn_events(id),
  hashrate_providers_amount numeric DEFAULT 0,
  ve_lockers_amount numeric DEFAULT 0,
  community_treasury_amount numeric DEFAULT 0,
  charity_foundation_amount numeric DEFAULT 0,
  hashrate_providers_percent numeric DEFAULT 40,
  ve_lockers_percent numeric DEFAULT 30,
  community_treasury_percent numeric DEFAULT 20,
  charity_foundation_percent numeric DEFAULT 10,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_game_clans_leader ON game_clans(leader_id);
CREATE INDEX IF NOT EXISTS idx_game_clan_members_clan ON game_clan_members(clan_id);
CREATE INDEX IF NOT EXISTS idx_game_tournaments_status ON game_tournaments(status);
CREATE INDEX IF NOT EXISTS idx_game_boosts_user ON game_boosts(user_id);
CREATE INDEX IF NOT EXISTS idx_service_button_user ON service_button_activations(user_id);
CREATE INDEX IF NOT EXISTS idx_goboxes_user ON goboxes(user_id);
CREATE INDEX IF NOT EXISTS idx_token_burn_events_status ON token_burn_events(status);

-- RLS
ALTER TABLE game_clans ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_clan_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_boosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_button_activations ENABLE ROW LEVEL SECURITY;
ALTER TABLE miner_upgrade_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE goboxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_burn_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE burn_mint_distributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read clans" ON game_clans FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users create clans" ON game_clans FOR INSERT TO authenticated WITH CHECK (leader_id = auth.uid());
CREATE POLICY "Leaders update clans" ON game_clans FOR UPDATE TO authenticated USING (leader_id = auth.uid());

CREATE POLICY "Public read clan members" ON game_clan_members FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users join clans" ON game_clan_members FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users leave clans" ON game_clan_members FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Public read tournaments" ON game_tournaments FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users view own boosts" ON game_boosts FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users buy boosts" ON game_boosts FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users view own service button" ON service_button_activations FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users activate service button" ON service_button_activations FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Public read upgrade tiers" ON miner_upgrade_tiers FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users view own goboxes" ON goboxes FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users open own goboxes" ON goboxes FOR UPDATE TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Public read burn events" ON token_burn_events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read burn distributions" ON burn_mint_distributions FOR SELECT TO authenticated USING (true);