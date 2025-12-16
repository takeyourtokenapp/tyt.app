/*
  # Rank & Gamification Service - Block 2.9

  ## Summary
  Rank and achievement system with score calculation.

  ## Rank Tiers
    - Worker: 0-99
    - Academic: 100-499
    - Diplomat: 500-999
    - Peacekeeper: 1,000-4,999
    - Ambassador: 5,000-9,999
    - Warrior: 10,000+
*/

-- Add rank fields
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'rank'
  ) THEN
    ALTER TABLE profiles
      ADD COLUMN rank text DEFAULT 'worker',
      ADD COLUMN rank_score integer DEFAULT 0,
      ADD COLUMN rank_updated_at timestamptz DEFAULT now();
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_profiles_rank_score ON profiles(rank_score DESC);

-- Achievement definitions
CREATE TABLE IF NOT EXISTS achievement_definitions (
  badge_code text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  icon text,
  category text NOT NULL,
  rarity text DEFAULT 'common',
  points_bonus integer DEFAULT 0,
  requirement jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Drop existing user_achievements if it has wrong foreign key
DROP TABLE IF EXISTS user_achievements CASCADE;

-- Recreate user_achievements
CREATE TABLE user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_code text NOT NULL REFERENCES achievement_definitions(badge_code),
  earned_at timestamptz DEFAULT now(),
  source text,
  metadata jsonb DEFAULT '{}'::jsonb,
  UNIQUE(user_id, badge_code)
);

CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_earned ON user_achievements(earned_at DESC);

ALTER TABLE achievement_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view definitions"
  ON achievement_definitions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role manages definitions"
  ON achievement_definitions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can view achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role manages achievements"
  ON user_achievements FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Calculate rank score
CREATE OR REPLACE FUNCTION calculate_rank_score(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
  v_total integer := 0;
  v_th integer := 0;
  v_vetyt integer := 0;
  v_academy integer := 0;
  v_payment integer := 0;
  v_bonus integer := 0;
BEGIN
  SELECT COALESCE(SUM(power_th) * 10, 0)::integer INTO v_th
  FROM nft_miners
  WHERE owner_id = p_user_id AND status = 'active';

  SELECT COALESCE((voting_power / 1000)::integer, 0) INTO v_vetyt
  FROM user_vetyt_cache
  WHERE user_id = p_user_id;

  SELECT COALESCE(COUNT(*) * 100, 0)::integer INTO v_academy
  FROM academy_certificates
  WHERE user_id = p_user_id;

  SELECT COALESCE(COUNT(*) * 5, 0)::integer INTO v_payment
  FROM maintenance_invoices mi
  JOIN nft_miners nm ON mi.miner_id = nm.id
  WHERE nm.owner_id = p_user_id
    AND mi.status = 'paid'
    AND mi.paid_at <= mi.due_date;

  SELECT COALESCE(SUM(ad.points_bonus), 0)::integer INTO v_bonus
  FROM user_achievements ua
  JOIN achievement_definitions ad ON ua.badge_code = ad.badge_code
  WHERE ua.user_id = p_user_id;

  v_total := v_th + v_vetyt + v_academy + v_payment + v_bonus;
  RETURN v_total;
END;
$$;

-- Determine rank
CREATE OR REPLACE FUNCTION determine_rank(p_score integer)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  IF p_score < 100 THEN RETURN 'worker';
  ELSIF p_score < 500 THEN RETURN 'academic';
  ELSIF p_score < 1000 THEN RETURN 'diplomat';
  ELSIF p_score < 5000 THEN RETURN 'peacekeeper';
  ELSIF p_score < 10000 THEN RETURN 'ambassador';
  ELSE RETURN 'warrior';
  END IF;
END;
$$;

-- Update rank
CREATE OR REPLACE FUNCTION update_user_rank(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_score integer;
  v_rank text;
  v_old_rank text;
BEGIN
  SELECT rank INTO v_old_rank FROM profiles WHERE id = p_user_id;
  v_score := calculate_rank_score(p_user_id);
  v_rank := determine_rank(v_score);

  UPDATE profiles
  SET rank_score = v_score, rank = v_rank, rank_updated_at = now()
  WHERE id = p_user_id;

  RETURN jsonb_build_object(
    'user_id', p_user_id,
    'score', v_score,
    'rank', v_rank,
    'old_rank', v_old_rank,
    'changed', v_old_rank != v_rank
  );
END;
$$;

-- Check achievements
CREATE OR REPLACE FUNCTION check_achievements(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_miners integer;
  v_th numeric;
  v_certs integer;
  v_votes integer;
BEGIN
  SELECT COUNT(*), COALESCE(SUM(power_th), 0)
  INTO v_miners, v_th
  FROM nft_miners WHERE owner_id = p_user_id;

  SELECT COUNT(*) INTO v_certs FROM academy_certificates WHERE user_id = p_user_id;
  SELECT COUNT(*) INTO v_votes FROM governance_votes WHERE user_id = p_user_id;

  IF v_miners >= 1 THEN
    INSERT INTO user_achievements (user_id, badge_code, source)
    VALUES (p_user_id, 'first_miner', 'auto')
    ON CONFLICT DO NOTHING;
  END IF;

  IF v_th >= 10 THEN
    INSERT INTO user_achievements (user_id, badge_code, source)
    VALUES (p_user_id, 'power_10', 'auto')
    ON CONFLICT DO NOTHING;
  END IF;

  IF v_th >= 100 THEN
    INSERT INTO user_achievements (user_id, badge_code, source)
    VALUES (p_user_id, 'power_100', 'auto')
    ON CONFLICT DO NOTHING;
  END IF;

  IF v_certs >= 3 THEN
    INSERT INTO user_achievements (user_id, badge_code, source)
    VALUES (p_user_id, 'academy_graduate', 'auto')
    ON CONFLICT DO NOTHING;
  END IF;

  IF v_votes >= 10 THEN
    INSERT INTO user_achievements (user_id, badge_code, source)
    VALUES (p_user_id, 'governance_voter', 'auto')
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN jsonb_build_object(
    'checked', true,
    'miners', v_miners,
    'th', v_th
  );
END;
$$;

-- Leaderboard
CREATE OR REPLACE FUNCTION get_leaderboard(p_limit integer DEFAULT 100)
RETURNS TABLE (
  user_id uuid,
  username text,
  rank text,
  rank_score integer,
  total_hashrate numeric,
  pos bigint
)
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH ranked AS (
    SELECT
      p.id, p.username, p.rank, p.rank_score,
      COALESCE(SUM(nm.power_th), 0) as th,
      ROW_NUMBER() OVER (ORDER BY p.rank_score DESC) as rn
    FROM profiles p
    LEFT JOIN nft_miners nm ON p.id = nm.owner_id AND nm.status = 'active'
    GROUP BY p.id
  )
  SELECT r.id, r.username, r.rank, r.rank_score, r.th, r.rn
  FROM ranked r
  LIMIT p_limit;
END;
$$;

GRANT EXECUTE ON FUNCTION calculate_rank_score TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION determine_rank TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION update_user_rank TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION check_achievements TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_leaderboard TO authenticated, service_role;

-- Seed achievements
INSERT INTO achievement_definitions (badge_code, name, description, category, rarity, points_bonus) VALUES
  ('first_miner', 'First Miner', 'First NFT miner', 'mining', 'common', 10),
  ('power_10', 'Power Player', '10 TH/s', 'mining', 'common', 50),
  ('power_100', 'Mining Baron', '100 TH/s', 'mining', 'rare', 200),
  ('power_1000', 'Hash Master', '1000 TH/s', 'mining', 'epic', 1000),
  ('early_adopter', 'Early Adopter', 'Top 1000 users', 'special', 'legendary', 500),
  ('academy_graduate', 'Graduate', '3+ courses', 'academy', 'rare', 300),
  ('governance_voter', 'Voter', '10+ votes', 'governance', 'rare', 250),
  ('charity_supporter', 'Supporter', '$100+ donated', 'charity', 'epic', 400)
ON CONFLICT (badge_code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;
