/*
  # Digital-Interactive-Technology-Blockchain Crypto Academia

  ## Overview
  Educational platform designed for "самого малограмотного среднестатистического человека"
  (the most illiterate average person). Gamified learning with tracks, lessons, quizzes,
  quests, and the Owl Rank System.

  ## Academy Structure
  - **Tracks**: Main learning paths (Foundations, Bitcoin & Mining, NFT Miners, etc.)
  - **Lessons**: MDX-formatted content with interactive elements
  - **Quizzes**: Knowledge checks with XP rewards
  - **Quests**: Real-world tasks tied to platform actions
  - **Progress**: User completion tracking
  - **Owl Ranks**: Worker → Academic → Diplomat → Peacekeeper → Warrior (based on XP)
  - **Certificates**: Soulbound NFTs for completed tracks

  ## New Tables
  1. `academy_tracks` - Main learning paths
  2. `academy_lessons` - Individual lessons (MDX content)
  3. `academy_quizzes` - Quiz questions for lessons
  4. `academy_quiz_attempts` - User quiz submissions
  5. `academy_progress` - User lesson completion tracking
  6. `academy_quests` - Real-world tasks and challenges
  7. `academy_quest_completions` - User quest progress
  8. `academy_certificates` - Soulbound NFTs for track completion
  9. `owl_ranks` - Rank definitions (Worker, Academic, etc.)
  10. `user_academy_stats` - XP, rank, and overall progress

  ## Owl Rank System
  - Worker: 0-99 XP
  - Academic: 100-299 XP
  - Diplomat: 300-699 XP
  - Peacekeeper: 700-1499 XP
  - Warrior: 1500+ XP

  ## Security
  - RLS enabled on all tables
  - Public read for educational content
  - User-specific write access for progress/attempts
  - Certificate NFTs are soulbound (non-transferable)
*/

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE lesson_difficulty AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
CREATE TYPE quiz_question_type AS ENUM ('multiple_choice', 'true_false', 'fill_blank', 'ordering');
CREATE TYPE quest_type AS ENUM ('platform_action', 'social_engagement', 'educational', 'community');
CREATE TYPE quest_status AS ENUM ('locked', 'available', 'in_progress', 'completed');
CREATE TYPE certificate_type AS ENUM ('track_completion', 'quest_mastery', 'special_achievement');

-- ============================================================================
-- OWL RANK SYSTEM
-- ============================================================================

CREATE TABLE IF NOT EXISTS owl_ranks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rank_level integer UNIQUE NOT NULL CHECK (rank_level >= 1 AND rank_level <= 5),
  name text UNIQUE NOT NULL,
  name_en text UNIQUE NOT NULL,
  min_xp integer NOT NULL CHECK (min_xp >= 0),
  max_xp integer,
  
  -- Visual
  badge_icon text,
  badge_color text,
  
  -- Perks
  perks jsonb DEFAULT '[]'::jsonb,
  description text,
  
  created_at timestamptz DEFAULT now()
);

-- Seed Owl Ranks
INSERT INTO owl_ranks (rank_level, name, name_en, min_xp, max_xp, badge_color, description) VALUES
(1, 'Рабочий', 'Worker', 0, 99, '#6B7280', 'Начинающий ученик Academy. Осваивает основы крипто-мира.'),
(2, 'Академик', 'Academic', 100, 299, '#3B82F6', 'Продвинутый студент с глубоким пониманием основ.'),
(3, 'Дипломат', 'Diplomat', 300, 699, '#8B5CF6', 'Опытный специалист, способный обучать других.'),
(4, 'Миротворец', 'Peacekeeper', 700, 1499, '#F59E0B', 'Эксперт с масштабным влиянием в сообществе.'),
(5, 'Воин', 'Warrior', 1500, NULL, '#EF4444', 'Мастер высшего уровня. Защитник и лидер TYT.')
ON CONFLICT (rank_level) DO NOTHING;

-- ============================================================================
-- ACADEMY TRACKS (Learning Paths)
-- ============================================================================

CREATE TABLE IF NOT EXISTS academy_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  
  -- Ordering and structure
  sort_order integer DEFAULT 0,
  difficulty lesson_difficulty DEFAULT 'beginner',
  estimated_hours numeric DEFAULT 0,
  
  -- Prerequisites
  required_track_ids uuid[] DEFAULT ARRAY[]::uuid[],
  min_owl_rank integer DEFAULT 1 CHECK (min_owl_rank >= 1 AND min_owl_rank <= 5),
  
  -- Rewards
  completion_xp integer DEFAULT 100 CHECK (completion_xp >= 0),
  
  -- Visual
  icon text,
  color text,
  cover_image_url text,
  
  -- Status
  is_published boolean DEFAULT false,
  is_premium boolean DEFAULT false,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Seed Academy Tracks
INSERT INTO academy_tracks (slug, title, description, sort_order, difficulty, estimated_hours, completion_xp, icon, color, is_published) VALUES
('foundations', 'Основы криптовалют', 'Введение в блокчейн, кошельки, транзакции. Идеально для новичков.', 1, 'beginner', 3, 50, 'BookOpen', '#3B82F6', true),
('bitcoin-mining', 'Bitcoin и майнинг', 'Как работает Bitcoin, proof-of-work, хешрейт и майнинг-пулы.', 2, 'beginner', 4, 75, 'Cpu', '#F59E0B', true),
('nft-miners', 'NFT Digital Miners', 'Токенизированные майнеры, формулы начислений, обслуживание.', 3, 'intermediate', 3, 60, 'Boxes', '#8B5CF6', true),
('multi-chain', 'Мультичейн экосистемы', 'BTC, ETH, SOL, TRON, TON - различия и возможности.', 4, 'intermediate', 5, 100, 'Network', '#10B981', true),
('security', 'Безопасность и приватность', 'Защита кошельков, seed-фразы, 2FA, фишинг, best practices.', 5, 'intermediate', 4, 80, 'Shield', '#EF4444', true),
('compliance', 'Комплаенс и легальность', 'KYC/AML, налоги, юрисдикции, легальный статус криптовалют.', 6, 'advanced', 3, 70, 'Scale', '#6366F1', true)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- ACADEMY LESSONS (MDX Content)
-- ============================================================================

CREATE TABLE IF NOT EXISTS academy_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id uuid NOT NULL REFERENCES academy_tracks(id) ON DELETE CASCADE,
  slug text NOT NULL,
  title text NOT NULL,
  description text,
  
  -- Content (MDX format)
  content_mdx text NOT NULL,
  
  -- Ordering
  sort_order integer DEFAULT 0,
  difficulty lesson_difficulty DEFAULT 'beginner',
  estimated_minutes integer DEFAULT 10,
  
  -- Interactive elements
  has_quiz boolean DEFAULT false,
  has_calculator boolean DEFAULT false,
  calculator_type text, -- 'reward', 'maintenance', 'roi', 'voting_power', etc.
  
  -- Rewards
  completion_xp integer DEFAULT 10 CHECK (completion_xp >= 0),
  
  -- Prerequisites
  required_lesson_ids uuid[] DEFAULT ARRAY[]::uuid[],
  
  -- Status
  is_published boolean DEFAULT false,
  is_free boolean DEFAULT true,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(track_id, slug)
);

CREATE INDEX idx_academy_lessons_track ON academy_lessons(track_id);
CREATE INDEX idx_academy_lessons_published ON academy_lessons(is_published);

-- ============================================================================
-- ACADEMY QUIZZES
-- ============================================================================

CREATE TABLE IF NOT EXISTS academy_quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES academy_lessons(id) ON DELETE CASCADE,
  question text NOT NULL,
  question_type quiz_question_type DEFAULT 'multiple_choice',
  
  -- Options (for multiple choice)
  options jsonb DEFAULT '[]'::jsonb, -- [{"id": "a", "text": "...", "is_correct": true}, ...]
  
  -- Correct answer
  correct_answer text, -- For fill_blank or true_false
  correct_order jsonb, -- For ordering type: ["id1", "id2", "id3"]
  
  -- Metadata
  explanation text, -- Shown after answering
  sort_order integer DEFAULT 0,
  points integer DEFAULT 5 CHECK (points >= 0),
  
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_academy_quizzes_lesson ON academy_quizzes(lesson_id);

-- ============================================================================
-- USER PROGRESS TRACKING
-- ============================================================================

-- User lesson completion
CREATE TABLE IF NOT EXISTS academy_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES academy_lessons(id) ON DELETE CASCADE,
  
  -- Progress
  is_completed boolean DEFAULT false,
  completed_at timestamptz,
  time_spent_seconds integer DEFAULT 0,
  
  -- Quiz score
  quiz_score numeric, -- Percentage (0-100)
  quiz_passed boolean DEFAULT false,
  
  -- XP earned
  xp_earned integer DEFAULT 0,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX idx_academy_progress_user ON academy_progress(user_id);
CREATE INDEX idx_academy_progress_lesson ON academy_progress(lesson_id);

-- User quiz attempts
CREATE TABLE IF NOT EXISTS academy_quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quiz_id uuid NOT NULL REFERENCES academy_quizzes(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES academy_lessons(id) ON DELETE CASCADE,
  
  -- Answer
  user_answer jsonb NOT NULL, -- Depends on question type
  is_correct boolean NOT NULL,
  
  -- Metadata
  attempt_number integer DEFAULT 1,
  points_earned integer DEFAULT 0,
  
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_academy_quiz_attempts_user ON academy_quiz_attempts(user_id);
CREATE INDEX idx_academy_quiz_attempts_quiz ON academy_quiz_attempts(quiz_id);

-- ============================================================================
-- QUEST SYSTEM
-- ============================================================================

CREATE TABLE IF NOT EXISTS academy_quests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  
  -- Quest type and requirements
  quest_type quest_type NOT NULL,
  
  -- Platform action verification
  required_action text, -- 'purchase_miner', 'stake_tyt', 'marketplace_sale', etc.
  required_amount numeric, -- If applicable (e.g., stake 100 TYT)
  
  -- Social engagement
  social_platform text, -- 'telegram', 'twitter', 'discord'
  social_action text, -- 'join', 'share', 'follow'
  social_url text,
  
  -- Prerequisites
  required_track_ids uuid[] DEFAULT ARRAY[]::uuid[],
  required_quest_ids uuid[] DEFAULT ARRAY[]::uuid[],
  min_owl_rank integer DEFAULT 1,
  
  -- Rewards
  xp_reward integer DEFAULT 20 CHECK (xp_reward >= 0),
  tyt_reward numeric DEFAULT 0,
  
  -- Visual
  icon text,
  color text,
  
  -- Status
  is_active boolean DEFAULT true,
  is_repeatable boolean DEFAULT false,
  
  created_at timestamptz DEFAULT now()
);

-- Seed some example quests
INSERT INTO academy_quests (slug, title, description, quest_type, required_action, xp_reward, tyt_reward, icon, is_active) VALUES
('first_miner', 'Первый Digital Miner', 'Купите свой первый NFT майнер и начните получать BTC!', 'platform_action', 'purchase_miner', 50, 10, 'ShoppingCart', true),
('stake_100_tyt', 'Заблокируй 100 TYT', 'Застейкайте 100 TYT токенов для получения veTYT и скидок.', 'platform_action', 'stake_tyt', 30, 5, 'Lock', true),
('join_telegram', 'Присоединись в Telegram', 'Вступи в официальное сообщество TYT в Telegram.', 'social_engagement', 'join_telegram', 15, 0, 'MessageCircle', true),
('complete_foundations', 'Освой основы', 'Завершите трек "Основы криптовалют" и получите сертификат.', 'educational', 'complete_track_foundations', 100, 20, 'Award', true)
ON CONFLICT (slug) DO NOTHING;

-- User quest completions
CREATE TABLE IF NOT EXISTS academy_quest_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quest_id uuid NOT NULL REFERENCES academy_quests(id) ON DELETE CASCADE,
  
  status quest_status DEFAULT 'available',
  
  -- Completion
  completed_at timestamptz,
  verified_at timestamptz,
  
  -- Rewards claimed
  xp_claimed integer DEFAULT 0,
  tyt_claimed numeric DEFAULT 0,
  
  -- Verification (for platform actions)
  verification_data jsonb, -- Transaction hash, timestamp, etc.
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id, quest_id)
);

CREATE INDEX idx_academy_quest_completions_user ON academy_quest_completions(user_id);
CREATE INDEX idx_academy_quest_completions_quest ON academy_quest_completions(quest_id);

-- ============================================================================
-- SOULBOUND CERTIFICATES (NFTs)
-- ============================================================================

CREATE TABLE IF NOT EXISTS academy_certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id text UNIQUE NOT NULL,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  certificate_type certificate_type DEFAULT 'track_completion',
  
  -- Reference to completed track/quest
  track_id uuid REFERENCES academy_tracks(id),
  quest_id uuid REFERENCES academy_quests(id),
  
  -- Certificate data
  title text NOT NULL,
  description text,
  issued_at timestamptz DEFAULT now(),
  
  -- Metadata
  metadata_uri text, -- IPFS link to certificate metadata
  image_url text,
  
  -- Soulbound (non-transferable)
  is_soulbound boolean DEFAULT true,
  
  -- On-chain verification
  blockchain_tx_hash text,
  minted_at timestamptz,
  
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_academy_certificates_user ON academy_certificates(user_id);
CREATE INDEX idx_academy_certificates_track ON academy_certificates(track_id);

-- ============================================================================
-- USER ACADEMY STATS (XP, Rank, Overall Progress)
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_academy_stats (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- XP and Rank
  total_xp integer DEFAULT 0 CHECK (total_xp >= 0),
  current_rank_level integer DEFAULT 1 CHECK (current_rank_level >= 1 AND current_rank_level <= 5),
  
  -- Progress
  tracks_completed integer DEFAULT 0,
  lessons_completed integer DEFAULT 0,
  quizzes_passed integer DEFAULT 0,
  quests_completed integer DEFAULT 0,
  
  -- Certificates
  certificates_earned integer DEFAULT 0,
  
  -- Time tracking
  total_study_time_minutes integer DEFAULT 0,
  
  -- Streaks
  current_streak_days integer DEFAULT 0,
  longest_streak_days integer DEFAULT 0,
  last_activity_at timestamptz,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Calculate user's Owl Rank based on XP
CREATE OR REPLACE FUNCTION calculate_owl_rank(p_xp integer)
RETURNS integer AS $$
DECLARE
  v_rank_level integer := 1;
BEGIN
  SELECT rank_level INTO v_rank_level
  FROM owl_ranks
  WHERE p_xp >= min_xp 
    AND (max_xp IS NULL OR p_xp <= max_xp)
  ORDER BY rank_level DESC
  LIMIT 1;
  
  RETURN COALESCE(v_rank_level, 1);
END;
$$ LANGUAGE plpgsql;

-- Update user academy stats when lesson completed
CREATE OR REPLACE FUNCTION update_academy_stats_on_lesson_completion()
RETURNS TRIGGER AS $$
DECLARE
  v_lesson_xp integer;
  v_new_total_xp integer;
  v_new_rank integer;
BEGIN
  -- Only process when lesson is marked as completed
  IF NEW.is_completed = true AND (OLD.is_completed = false OR OLD.is_completed IS NULL) THEN
    -- Get lesson XP
    SELECT completion_xp INTO v_lesson_xp
    FROM academy_lessons
    WHERE id = NEW.lesson_id;
    
    -- Update user stats
    INSERT INTO user_academy_stats (user_id, total_xp, lessons_completed, last_activity_at)
    VALUES (NEW.user_id, v_lesson_xp, 1, now())
    ON CONFLICT (user_id) DO UPDATE SET
      total_xp = user_academy_stats.total_xp + v_lesson_xp,
      lessons_completed = user_academy_stats.lessons_completed + 1,
      last_activity_at = now();
    
    -- Get new total XP
    SELECT total_xp INTO v_new_total_xp
    FROM user_academy_stats
    WHERE user_id = NEW.user_id;
    
    -- Calculate new rank
    v_new_rank := calculate_owl_rank(v_new_total_xp);
    
    -- Update rank
    UPDATE user_academy_stats
    SET current_rank_level = v_new_rank
    WHERE user_id = NEW.user_id;
    
    -- Store XP earned in progress record
    NEW.xp_earned := v_lesson_xp;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_academy_stats_on_lesson
  BEFORE INSERT OR UPDATE ON academy_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_academy_stats_on_lesson_completion();

-- Update user academy stats when quest completed
CREATE OR REPLACE FUNCTION update_academy_stats_on_quest_completion()
RETURNS TRIGGER AS $$
DECLARE
  v_quest_xp integer;
  v_quest_tyt numeric;
  v_new_total_xp integer;
  v_new_rank integer;
BEGIN
  -- Only process when quest is marked as completed
  IF NEW.status = 'completed' AND (OLD.status != 'completed' OR OLD.status IS NULL) THEN
    -- Get quest rewards
    SELECT xp_reward, tyt_reward INTO v_quest_xp, v_quest_tyt
    FROM academy_quests
    WHERE id = NEW.quest_id;
    
    -- Update user stats
    INSERT INTO user_academy_stats (user_id, total_xp, quests_completed, last_activity_at)
    VALUES (NEW.user_id, v_quest_xp, 1, now())
    ON CONFLICT (user_id) DO UPDATE SET
      total_xp = user_academy_stats.total_xp + v_quest_xp,
      quests_completed = user_academy_stats.quests_completed + 1,
      last_activity_at = now();
    
    -- Get new total XP
    SELECT total_xp INTO v_new_total_xp
    FROM user_academy_stats
    WHERE user_id = NEW.user_id;
    
    -- Calculate new rank
    v_new_rank := calculate_owl_rank(v_new_total_xp);
    
    -- Update rank
    UPDATE user_academy_stats
    SET current_rank_level = v_new_rank
    WHERE user_id = NEW.user_id;
    
    -- Store claimed rewards
    NEW.xp_claimed := v_quest_xp;
    NEW.tyt_claimed := v_quest_tyt;
    
    -- Award TYT tokens to user's wallet
    IF v_quest_tyt > 0 THEN
      UPDATE custodial_wallets
      SET balance = balance + v_quest_tyt,
          updated_at = now()
      WHERE user_id = NEW.user_id AND currency = 'TYT';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_academy_stats_on_quest
  BEFORE INSERT OR UPDATE ON academy_quest_completions
  FOR EACH ROW
  EXECUTE FUNCTION update_academy_stats_on_quest_completion();

-- Automatically create academy stats for new users
CREATE OR REPLACE FUNCTION create_academy_stats_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_academy_stats (user_id, total_xp, current_rank_level, last_activity_at)
  VALUES (NEW.id, 0, 1, now())
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_academy_stats
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_academy_stats_for_new_user();

-- Issue certificate when track completed
CREATE OR REPLACE FUNCTION issue_track_certificate()
RETURNS TRIGGER AS $$
DECLARE
  v_track_title text;
  v_total_lessons integer;
  v_completed_lessons integer;
BEGIN
  -- Only process when lesson is marked as completed
  IF NEW.is_completed = true AND (OLD.is_completed = false OR OLD.is_completed IS NULL) THEN
    -- Get track info
    SELECT t.title, COUNT(l.id)
    INTO v_track_title, v_total_lessons
    FROM academy_lessons l
    JOIN academy_tracks t ON t.id = l.track_id
    WHERE l.track_id = (SELECT track_id FROM academy_lessons WHERE id = NEW.lesson_id)
    GROUP BY t.id, t.title;
    
    -- Count completed lessons in this track
    SELECT COUNT(*)
    INTO v_completed_lessons
    FROM academy_progress ap
    JOIN academy_lessons l ON l.id = ap.lesson_id
    WHERE ap.user_id = NEW.user_id
      AND l.track_id = (SELECT track_id FROM academy_lessons WHERE id = NEW.lesson_id)
      AND ap.is_completed = true;
    
    -- If all lessons completed, issue certificate
    IF v_completed_lessons >= v_total_lessons THEN
      INSERT INTO academy_certificates (
        token_id,
        user_id,
        track_id,
        certificate_type,
        title,
        description,
        issued_at
      )
      SELECT
        'CERT-' || gen_random_uuid()::text,
        NEW.user_id,
        l.track_id,
        'track_completion',
        'Certificate: ' || v_track_title,
        'Successfully completed all lessons in track: ' || v_track_title,
        now()
      FROM academy_lessons l
      WHERE l.id = NEW.lesson_id
      ON CONFLICT DO NOTHING;
      
      -- Update stats
      UPDATE user_academy_stats
      SET 
        tracks_completed = tracks_completed + 1,
        certificates_earned = certificates_earned + 1
      WHERE user_id = NEW.user_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_issue_track_certificate
  AFTER INSERT OR UPDATE ON academy_progress
  FOR EACH ROW
  EXECUTE FUNCTION issue_track_certificate();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE owl_ranks ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_quest_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_academy_stats ENABLE ROW LEVEL SECURITY;

-- Public read for educational content
CREATE POLICY "Anyone can view owl ranks"
  ON owl_ranks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view published tracks"
  ON academy_tracks FOR SELECT
  TO authenticated
  USING (is_published = true);

CREATE POLICY "Anyone can view published lessons"
  ON academy_lessons FOR SELECT
  TO authenticated
  USING (is_published = true);

CREATE POLICY "Anyone can view quizzes for published lessons"
  ON academy_quizzes FOR SELECT
  TO authenticated
  USING (
    lesson_id IN (SELECT id FROM academy_lessons WHERE is_published = true)
  );

CREATE POLICY "Anyone can view active quests"
  ON academy_quests FOR SELECT
  TO authenticated
  USING (is_active = true);

-- User-specific progress
CREATE POLICY "Users can view their own progress"
  ON academy_progress FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own progress"
  ON academy_progress FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own progress"
  ON academy_progress FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Quiz attempts
CREATE POLICY "Users can view their own quiz attempts"
  ON academy_quiz_attempts FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create quiz attempts"
  ON academy_quiz_attempts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Quest completions
CREATE POLICY "Users can view their own quest completions"
  ON academy_quest_completions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create quest completions"
  ON academy_quest_completions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own quest completions"
  ON academy_quest_completions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Certificates
CREATE POLICY "Users can view their own certificates"
  ON academy_certificates FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Academy stats
CREATE POLICY "Users can view their own academy stats"
  ON user_academy_stats FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view others' public stats"
  ON user_academy_stats FOR SELECT
  TO authenticated
  USING (true); -- For leaderboards