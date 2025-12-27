/*
  # aOi Cross-Domain Integration System

  Creates database schema for aOi AI-powered cross-domain learning system.

  ## New Tables
  1. `aoi_user_profiles` - User learning profiles across domains
  2. `aoi_activity_log` - Cross-domain activity tracking
  3. `aoi_knowledge_graph` - Knowledge topics with vector embeddings
  4. `aoi_learning_paths` - Predefined learning journeys
  5. `aoi_user_path_progress` - Individual user progress
  6. `aoi_training_feedback` - AI improvement feedback
  7. `aoi_recommendations` - Personalized content recommendations

  ## Security
  - RLS enabled on all tables
  - Users can only access their own data
  - Admin-only access for knowledge graph management
*/

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. aoi_user_profiles
CREATE TABLE IF NOT EXISTS aoi_user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  web3_mastery_level INTEGER DEFAULT 0 CHECK (web3_mastery_level BETWEEN 0 AND 100),
  cns_knowledge_level INTEGER DEFAULT 0 CHECK (cns_knowledge_level BETWEEN 0 AND 100),
  overall_rank TEXT DEFAULT 'Student' CHECK (overall_rank IN ('Student', 'Explorer', 'Researcher', 'Expert')),
  active_path_id UUID,
  learning_pace TEXT DEFAULT 'regular' CHECK (learning_pace IN ('casual', 'regular', 'intensive')),
  interests TEXT[] DEFAULT '{}',
  preferred_domain TEXT DEFAULT 'app' CHECK (preferred_domain IN ('foundation', 'app', 'both')),
  aoi_context JSONB DEFAULT '{}',
  last_interaction_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX idx_aoi_profiles_user ON aoi_user_profiles(user_id);
CREATE INDEX idx_aoi_profiles_rank ON aoi_user_profiles(overall_rank);

-- 2. aoi_activity_log
CREATE TABLE IF NOT EXISTS aoi_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  domain TEXT NOT NULL CHECK (domain IN ('foundation', 'app')),
  activity_type TEXT NOT NULL,
  item_id TEXT,
  item_title TEXT,
  result JSONB DEFAULT '{}',
  xp_earned INTEGER DEFAULT 0 CHECK (xp_earned >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_user_time ON aoi_activity_log(user_id, created_at DESC);
CREATE INDEX idx_activity_type ON aoi_activity_log(activity_type);
CREATE INDEX idx_activity_domain ON aoi_activity_log(domain);

-- 3. aoi_knowledge_graph
CREATE TABLE IF NOT EXISTS aoi_knowledge_graph (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id TEXT UNIQUE NOT NULL,
  topic_name TEXT NOT NULL,
  domain TEXT NOT NULL CHECK (domain IN ('cns', 'web3', 'both')),
  content_summary TEXT,
  content_full TEXT,
  difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 10),
  prerequisites TEXT[] DEFAULT '{}',
  related_topics TEXT[] DEFAULT '{}',
  embedding VECTOR(1536),
  sources JSONB DEFAULT '[]',
  verified_by TEXT,
  verification_date TIMESTAMPTZ,
  version INTEGER DEFAULT 1,
  views_count INTEGER DEFAULT 0,
  helpfulness_score DECIMAL(3,2) DEFAULT 0.0 CHECK (helpfulness_score BETWEEN 0 AND 5),
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_knowledge_topic ON aoi_knowledge_graph(topic_id);
CREATE INDEX idx_knowledge_domain ON aoi_knowledge_graph(domain);
CREATE INDEX idx_knowledge_difficulty ON aoi_knowledge_graph(difficulty_level);
CREATE INDEX idx_knowledge_embedding ON aoi_knowledge_graph USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- 4. aoi_learning_paths
CREATE TABLE IF NOT EXISTS aoi_learning_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  target_audience TEXT CHECK (target_audience IN ('student', 'university', 'researcher', 'supporter')),
  difficulty TEXT DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  estimated_duration TEXT,
  steps JSONB NOT NULL,
  enrolled_count INTEGER DEFAULT 0,
  completion_count INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0.0,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_paths_audience ON aoi_learning_paths(target_audience);
CREATE INDEX idx_paths_active ON aoi_learning_paths(is_active) WHERE is_active = TRUE;

-- 5. aoi_user_path_progress
CREATE TABLE IF NOT EXISTS aoi_user_path_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  path_id UUID REFERENCES aoi_learning_paths(id) ON DELETE CASCADE NOT NULL,
  current_step INTEGER DEFAULT 0,
  completed_steps INTEGER[] DEFAULT '{}',
  total_xp_earned INTEGER DEFAULT 0,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('enrolled', 'in_progress', 'completed', 'abandoned')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, path_id)
);

CREATE INDEX idx_path_progress_user ON aoi_user_path_progress(user_id);
CREATE INDEX idx_path_progress_path ON aoi_user_path_progress(path_id);

-- 6. aoi_training_feedback
CREATE TABLE IF NOT EXISTS aoi_training_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interaction_id TEXT,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  query TEXT,
  response TEXT,
  feedback_type TEXT CHECK (feedback_type IN ('accuracy', 'helpfulness', 'clarity', 'other')),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  was_helpful BOOLEAN,
  comment TEXT,
  suggested_improvement TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_feedback_user ON aoi_training_feedback(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_feedback_type ON aoi_training_feedback(feedback_type);

-- 7. aoi_recommendations
CREATE TABLE IF NOT EXISTS aoi_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content_type TEXT NOT NULL,
  content_id TEXT NOT NULL,
  content_title TEXT NOT NULL,
  domain TEXT NOT NULL CHECK (domain IN ('foundation', 'app')),
  url TEXT NOT NULL,
  relevance_score DECIMAL(4,3) CHECK (relevance_score BETWEEN 0 AND 1),
  confidence_score DECIMAL(4,3) CHECK (confidence_score BETWEEN 0 AND 1),
  reason TEXT,
  experiment_id TEXT,
  variant TEXT,
  presented_at TIMESTAMPTZ DEFAULT NOW(),
  clicked_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_recommendations_user ON aoi_recommendations(user_id, presented_at DESC);
CREATE INDEX idx_recommendations_active ON aoi_recommendations(user_id, is_active) WHERE is_active = TRUE;

-- RLS Policies
ALTER TABLE aoi_user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own aOi profile" ON aoi_user_profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own aOi profile" ON aoi_user_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can insert own aOi profile" ON aoi_user_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

ALTER TABLE aoi_activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own activity log" ON aoi_activity_log FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activity" ON aoi_activity_log FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

ALTER TABLE aoi_knowledge_graph ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view knowledge graph" ON aoi_knowledge_graph FOR SELECT TO authenticated USING (TRUE);

ALTER TABLE aoi_learning_paths ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active paths" ON aoi_learning_paths FOR SELECT TO authenticated USING (is_active = TRUE);

ALTER TABLE aoi_user_path_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own path progress" ON aoi_user_path_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own path progress" ON aoi_user_path_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can enroll in paths" ON aoi_user_path_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

ALTER TABLE aoi_training_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can submit feedback" ON aoi_training_feedback FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can view own feedback" ON aoi_training_feedback FOR SELECT TO authenticated USING (auth.uid() = user_id);

ALTER TABLE aoi_recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own recommendations" ON aoi_recommendations FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "System can insert recommendations" ON aoi_recommendations FOR INSERT TO authenticated WITH CHECK (TRUE);
CREATE POLICY "Users can update own recommendations" ON aoi_recommendations FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION calculate_aoi_rank(web3_level INTEGER, cns_level INTEGER) RETURNS TEXT AS $$
BEGIN
  IF (web3_level + cns_level) / 2 >= 75 THEN RETURN 'Expert';
  ELSIF (web3_level + cns_level) / 2 >= 50 THEN RETURN 'Researcher';
  ELSIF (web3_level + cns_level) / 2 >= 25 THEN RETURN 'Explorer';
  ELSE RETURN 'Student';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION update_aoi_rank() RETURNS TRIGGER AS $$
BEGIN
  NEW.overall_rank := calculate_aoi_rank(NEW.web3_mastery_level, NEW.cns_knowledge_level);
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_update_aoi_rank BEFORE UPDATE OF web3_mastery_level, cns_knowledge_level ON aoi_user_profiles FOR EACH ROW EXECUTE FUNCTION update_aoi_rank();

CREATE OR REPLACE FUNCTION log_aoi_activity(
  p_user_id UUID, p_domain TEXT, p_activity_type TEXT, p_item_id TEXT, p_item_title TEXT, p_result JSONB, p_xp_earned INTEGER
) RETURNS UUID AS $$
DECLARE
  v_activity_id UUID;
  v_profile_exists BOOLEAN;
BEGIN
  INSERT INTO aoi_activity_log (user_id, domain, activity_type, item_id, item_title, result, xp_earned)
  VALUES (p_user_id, p_domain, p_activity_type, p_item_id, p_item_title, p_result, p_xp_earned)
  RETURNING id INTO v_activity_id;
  
  SELECT EXISTS(SELECT 1 FROM aoi_user_profiles WHERE user_id = p_user_id) INTO v_profile_exists;
  IF NOT v_profile_exists THEN INSERT INTO aoi_user_profiles (user_id) VALUES (p_user_id); END IF;
  
  IF p_domain = 'app' THEN
    UPDATE aoi_user_profiles SET web3_mastery_level = LEAST(100, web3_mastery_level + (p_xp_earned / 50)), last_interaction_at = NOW() WHERE user_id = p_user_id;
  ELSIF p_domain = 'foundation' THEN
    UPDATE aoi_user_profiles SET cns_knowledge_level = LEAST(100, cns_knowledge_level + (p_xp_earned / 50)), last_interaction_at = NOW() WHERE user_id = p_user_id;
  END IF;
  
  RETURN v_activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Seed data
INSERT INTO aoi_learning_paths (name, description, target_audience, difficulty, estimated_duration, steps) VALUES
('Student Explorer (Ages 12-16)', 'Begin your journey into brain science and blockchain', 'student', 'beginner', '8 weeks', 
 '[{"step":1,"title":"Welcome to Brain Science","domain":"foundation","url":"/knowledge/brain-basics","xp":50}]'::jsonb),
('University Research Track', 'Deep dive into CNS tumor biology and Web3 funding', 'university', 'intermediate', '12 weeks',
 '[{"step":1,"title":"CNS Tumor Biology","domain":"foundation","url":"/knowledge/pediatric-tumors","xp":150}]'::jsonb)
ON CONFLICT DO NOTHING;

INSERT INTO aoi_knowledge_graph (topic_id, topic_name, domain, content_summary, difficulty_level, sources) VALUES
('brain_anatomy_basics', 'Brain Anatomy Basics', 'cns', 'Introduction to brain structure and function', 3, '[{"title":"Pediatric Neuroanatomy","credibility_score":0.95}]'::jsonb),
('blockchain_fundamentals', 'Blockchain Fundamentals', 'web3', 'Understanding distributed ledgers and consensus', 4, '[{"title":"Bitcoin Whitepaper","credibility_score":1.0}]'::jsonb)
ON CONFLICT (topic_id) DO NOTHING;
