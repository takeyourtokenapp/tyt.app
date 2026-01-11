/*
  # Create AOi Knowledge Graph Table

  This table stores educational content for both CNS (medical) and Web3 domains.
  Supports RAG (Retrieval Augmented Generation) with vector embeddings.
*/

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
  embedding vector(1536),
  sources JSONB DEFAULT '[]',
  verified_by TEXT,
  verification_date TIMESTAMPTZ,
  version INTEGER DEFAULT 1,
  views_count INTEGER DEFAULT 0,
  helpfulness_score DECIMAL(3,2) DEFAULT 0.0 CHECK (helpfulness_score BETWEEN 0 AND 5),
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_knowledge_topic ON aoi_knowledge_graph(topic_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_domain ON aoi_knowledge_graph(domain);
CREATE INDEX IF NOT EXISTS idx_knowledge_difficulty ON aoi_knowledge_graph(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_knowledge_embedding ON aoi_knowledge_graph USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- RLS Policies
ALTER TABLE aoi_knowledge_graph ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view knowledge graph" ON aoi_knowledge_graph FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Admins can insert knowledge" ON aoi_knowledge_graph FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE)
);
CREATE POLICY "Admins can update knowledge" ON aoi_knowledge_graph FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE)
) WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE)
);