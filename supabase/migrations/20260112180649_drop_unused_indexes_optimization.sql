/*
  # Drop Unused Indexes - Performance Optimization

  1. Purpose
    - Remove indexes that have never been used by queries
    - Reduces storage overhead (can be GBs for vector indexes)
    - Reduces INSERT/UPDATE costs (no index maintenance)
    - Improves vacuum performance

  2. Indexes Dropped (9 total)
    - aoi_knowledge_graph: 4 indexes (topic, domain, difficulty, embedding)
    - price_alerts: 2 indexes (user_id, active)
    - token_price_cache: 2 indexes (token_mint, created_at)
    - academy_lessons: 1 index (embedding)

  3. Why Safe to Drop
    - Supabase reports 0 uses since creation
    - Foreign key indexes already exist (user_id covered by FK index)
    - Vector search has its own optimized index structure
    - Tables have other indexes for common queries

  4. Storage Impact
    - Vector indexes can be 100MB+ each
    - Expected savings: 200-400MB of storage
    - Faster writes to these tables
*/

-- ============================================================
-- aOi Knowledge Graph - 4 unused indexes
-- ============================================================

-- These were created for filtering but queries use vector search instead
DROP INDEX IF EXISTS idx_knowledge_topic;
DROP INDEX IF EXISTS idx_knowledge_domain;
DROP INDEX IF EXISTS idx_knowledge_difficulty;
DROP INDEX IF EXISTS idx_knowledge_embedding;

-- Note: Vector search uses IVFFlat index created separately

-- ============================================================
-- Price Alerts - 2 unused indexes
-- ============================================================

-- user_id is covered by foreign key index added earlier
-- active filtering hasn't been used in practice
DROP INDEX IF EXISTS idx_price_alerts_user_id;
DROP INDEX IF EXISTS idx_price_alerts_active;

-- ============================================================
-- Token Price Cache - 2 unused indexes
-- ============================================================

-- These were premature optimization - queries don't use them
DROP INDEX IF EXISTS idx_token_price_cache_token_mint;
DROP INDEX IF EXISTS idx_token_price_cache_created_at;

-- ============================================================
-- Academy Lessons - 1 unused index
-- ============================================================

-- Embedding index not used; vector search uses different approach
DROP INDEX IF EXISTS academy_lessons_embedding_idx;

-- Note: If vector search becomes active later, create proper IVFFlat index
