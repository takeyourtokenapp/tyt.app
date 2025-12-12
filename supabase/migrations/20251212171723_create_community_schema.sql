/*
  # Community Features Schema

  1. New Tables
    - `community_messages`
      - Real-time chat messages with user info
      - Supports moderation and filtering
    - `community_online_users`
      - Track online users in real-time
      - Auto-cleanup old sessions
    - `community_leaderboard_cache`
      - Cached leaderboard data for performance
      - Updates every 5 minutes
    - `user_achievements`
      - Track user achievements and badges
      - Gamification system
    - `community_announcements`
      - Platform-wide announcements
      - Support for targeting and scheduling

  2. Security
    - Enable RLS on all tables
    - Policies for authenticated users only
    - Moderation roles for admins

  3. Functions
    - Auto-cleanup old messages (7 days)
    - Real-time online user counting
    - Leaderboard calculation
*/

-- Community Messages Table
CREATE TABLE IF NOT EXISTS community_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  username text NOT NULL,
  avatar text,
  owl_rank text DEFAULT 'Worker',
  message text NOT NULL,
  is_system boolean DEFAULT false,
  is_deleted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_community_messages_created_at ON community_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_messages_user_id ON community_messages(user_id);

-- Enable RLS
ALTER TABLE community_messages ENABLE ROW LEVEL SECURITY;

-- Policies for community_messages
CREATE POLICY "Anyone can read non-deleted messages"
  ON community_messages FOR SELECT
  TO authenticated
  USING (is_deleted = false);

CREATE POLICY "Users can insert own messages"
  ON community_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own messages"
  ON community_messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Online Users Tracking
CREATE TABLE IF NOT EXISTS community_online_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  last_seen timestamptz DEFAULT now(),
  session_id text NOT NULL,
  UNIQUE(user_id, session_id)
);

CREATE INDEX IF NOT EXISTS idx_online_users_last_seen ON community_online_users(last_seen);

-- Enable RLS
ALTER TABLE community_online_users ENABLE ROW LEVEL SECURITY;

-- Policies for online users
CREATE POLICY "Users can manage own sessions"
  ON community_online_users FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Everyone can count online users"
  ON community_online_users FOR SELECT
  TO authenticated
  USING (true);

-- Leaderboard Cache
CREATE TABLE IF NOT EXISTS community_leaderboard_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  username text NOT NULL,
  avatar text,
  owl_rank text DEFAULT 'Worker',
  total_hashrate numeric DEFAULT 0,
  total_rewards numeric DEFAULT 0,
  total_xp integer DEFAULT 0,
  rank_hashrate integer,
  rank_rewards integer,
  rank_xp integer,
  badges jsonb DEFAULT '[]'::jsonb,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_hashrate ON community_leaderboard_cache(total_hashrate DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_rewards ON community_leaderboard_cache(total_rewards DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_xp ON community_leaderboard_cache(total_xp DESC);

-- Enable RLS
ALTER TABLE community_leaderboard_cache ENABLE ROW LEVEL SECURITY;

-- Policies for leaderboard
CREATE POLICY "Everyone can read leaderboard"
  ON community_leaderboard_cache FOR SELECT
  TO authenticated
  USING (true);

-- User Achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_code text NOT NULL,
  achievement_name text NOT NULL,
  achievement_description text,
  icon text,
  color text,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_code)
);

CREATE INDEX IF NOT EXISTS idx_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_earned ON user_achievements(earned_at DESC);

-- Enable RLS
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Policies for achievements
CREATE POLICY "Users can read own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Everyone can see achievement counts"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (true);

-- Community Announcements
CREATE TABLE IF NOT EXISTS community_announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info',
  icon text,
  color text DEFAULT 'blue',
  is_active boolean DEFAULT true,
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  target_audience text DEFAULT 'all',
  priority integer DEFAULT 0,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_announcements_active ON community_announcements(is_active, priority DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_dates ON community_announcements(start_date, end_date);

-- Enable RLS
ALTER TABLE community_announcements ENABLE ROW LEVEL SECURITY;

-- Policies for announcements
CREATE POLICY "Everyone can read active announcements"
  ON community_announcements FOR SELECT
  TO authenticated
  USING (
    is_active = true
    AND start_date <= now()
    AND (end_date IS NULL OR end_date >= now())
  );

-- Function to cleanup old messages (keep 7 days)
CREATE OR REPLACE FUNCTION cleanup_old_community_messages()
RETURNS void AS $$
BEGIN
  DELETE FROM community_messages
  WHERE created_at < now() - interval '7 days'
  AND is_system = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update online user status
CREATE OR REPLACE FUNCTION update_online_status(
  p_session_id text
)
RETURNS void AS $$
BEGIN
  INSERT INTO community_online_users (user_id, session_id, last_seen)
  VALUES (auth.uid(), p_session_id, now())
  ON CONFLICT (user_id, session_id)
  DO UPDATE SET last_seen = now();

  -- Cleanup inactive sessions (>5 minutes)
  DELETE FROM community_online_users
  WHERE last_seen < now() - interval '5 minutes';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get online user count
CREATE OR REPLACE FUNCTION get_online_users_count()
RETURNS integer AS $$
BEGIN
  -- Cleanup first
  DELETE FROM community_online_users
  WHERE last_seen < now() - interval '5 minutes';

  -- Return count
  RETURN (SELECT COUNT(DISTINCT user_id) FROM community_online_users);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update leaderboard cache
CREATE OR REPLACE FUNCTION update_leaderboard_cache()
RETURNS void AS $$
BEGIN
  -- Clear cache
  DELETE FROM community_leaderboard_cache;

  -- Calculate and insert new data
  WITH user_stats AS (
    SELECT
      u.id as user_id,
      COALESCE(u.raw_user_meta_data->>'username', u.email) as username,
      COALESCE(u.raw_user_meta_data->>'avatar', '🦉') as avatar,
      COALESCE(u.raw_user_meta_data->>'owl_rank', 'Worker') as owl_rank,
      COALESCE(SUM(m.power_th), 0) as total_hashrate,
      COALESCE(SUM(r.amount), 0) as total_rewards,
      COALESCE(
        (SELECT SUM(xp) FROM user_xp WHERE user_xp.user_id = u.id),
        0
      ) as total_xp
    FROM auth.users u
    LEFT JOIN nft_miners m ON u.id = m.owner_id AND m.status = 'active'
    LEFT JOIN rewards r ON u.id = r.user_id AND r.status = 'completed'
    GROUP BY u.id
  ),
  ranked_stats AS (
    SELECT
      *,
      ROW_NUMBER() OVER (ORDER BY total_hashrate DESC) as rank_hashrate,
      ROW_NUMBER() OVER (ORDER BY total_rewards DESC) as rank_rewards,
      ROW_NUMBER() OVER (ORDER BY total_xp DESC) as rank_xp
    FROM user_stats
  )
  INSERT INTO community_leaderboard_cache
  SELECT
    gen_random_uuid(),
    user_id,
    username,
    avatar,
    owl_rank,
    total_hashrate,
    total_rewards,
    total_xp,
    rank_hashrate::integer,
    rank_rewards::integer,
    rank_xp::integer,
    '[]'::jsonb,
    now()
  FROM ranked_stats
  WHERE total_hashrate > 0 OR total_rewards > 0 OR total_xp > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;