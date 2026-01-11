/*
  # Add Knowledge Search Functions and Academy Lesson Embeddings

  1. Academy Lessons
    - Add `embedding_vector` column for RAG search
    - Create vector index for fast similarity search
  
  2. Search Functions
    - `search_aoi_knowledge(query_embedding, domain_filter, match_count)`
    - `search_academy_lessons(query_embedding, match_count)`
  
  3. Indexes
    - Add IVFFlat index on academy_lessons.embedding_vector
  
  Note: aoi_knowledge_graph already has embeddings and indexes from previous migration
*/

-- Add embedding column to academy_lessons
ALTER TABLE academy_lessons
  ADD COLUMN IF NOT EXISTS embedding_vector vector(1536);

-- Create index for vector similarity search on lessons
CREATE INDEX IF NOT EXISTS academy_lessons_embedding_idx 
  ON academy_lessons USING ivfflat (embedding_vector vector_cosine_ops)
  WITH (lists = 100);

-- Create search function for aOi knowledge graph
CREATE OR REPLACE FUNCTION search_aoi_knowledge(
  query_embedding vector(1536),
  domain_filter text DEFAULT NULL,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  topic_id text,
  topic_name text,
  domain text,
  content_summary text,
  content_full text,
  difficulty_level int,
  similarity float
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    aoi_knowledge_graph.id,
    aoi_knowledge_graph.topic_id,
    aoi_knowledge_graph.topic_name,
    aoi_knowledge_graph.domain,
    aoi_knowledge_graph.content_summary,
    aoi_knowledge_graph.content_full,
    aoi_knowledge_graph.difficulty_level,
    1 - (aoi_knowledge_graph.embedding <=> query_embedding) as similarity
  FROM aoi_knowledge_graph
  WHERE 
    aoi_knowledge_graph.embedding IS NOT NULL
    AND (domain_filter IS NULL OR aoi_knowledge_graph.domain = domain_filter OR aoi_knowledge_graph.domain = 'both')
  ORDER BY aoi_knowledge_graph.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Create search function for academy lessons
CREATE OR REPLACE FUNCTION search_academy_lessons(
  query_embedding vector(1536),
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  track_id uuid,
  difficulty text,
  order_index int,
  similarity float
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    academy_lessons.id,
    academy_lessons.title,
    academy_lessons.description,
    academy_lessons.track_id,
    academy_lessons.difficulty,
    academy_lessons.order_index,
    1 - (academy_lessons.embedding_vector <=> query_embedding) as similarity
  FROM academy_lessons
  WHERE academy_lessons.embedding_vector IS NOT NULL
  ORDER BY academy_lessons.embedding_vector <=> query_embedding
  LIMIT match_count;
END;
$$;