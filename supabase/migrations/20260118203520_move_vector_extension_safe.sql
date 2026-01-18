/*
  # Move Vector Extension to Extensions Schema - Safe Version
  
  ## Problem
  Extension 'vector' is installed in public schema.
  Best practice is to keep extensions in a separate schema.
  
  ## Solution
  Move vector extension to extensions schema.
  Update actual tables: academy_lessons.embedding_vector and aoi_knowledge_graph.embedding
  
  ## Changes
  - Create extensions schema if not exists
  - Move vector extension safely
  - Update search paths
*/

-- Create extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Grant usage on extensions schema
GRANT USAGE ON SCHEMA extensions TO postgres, anon, authenticated, service_role;

-- Move vector extension to extensions schema
DO $$
BEGIN
  -- Check if vector extension exists in public schema
  IF EXISTS (
    SELECT 1 FROM pg_extension 
    WHERE extname = 'vector'
  ) THEN
    
    -- Check current schema
    IF (SELECT extnamespace::regnamespace::text FROM pg_extension WHERE extname = 'vector') = 'public' THEN
      
      -- Store vector data temporarily for academy_lessons
      CREATE TEMP TABLE IF NOT EXISTS temp_academy_embeddings AS
      SELECT id, embedding_vector::text as embedding_text
      FROM academy_lessons
      WHERE embedding_vector IS NOT NULL;
      
      -- Store vector data temporarily for aoi_knowledge_graph
      CREATE TEMP TABLE IF NOT EXISTS temp_aoi_knowledge_embeddings AS
      SELECT id, embedding::text as embedding_text
      FROM aoi_knowledge_graph
      WHERE embedding IS NOT NULL;
      
      -- Drop vector columns
      ALTER TABLE academy_lessons DROP COLUMN IF EXISTS embedding_vector;
      ALTER TABLE aoi_knowledge_graph DROP COLUMN IF EXISTS embedding;
      
      -- Drop and recreate vector extension in extensions schema
      DROP EXTENSION vector CASCADE;
      CREATE EXTENSION vector WITH SCHEMA extensions;
      
      -- Recreate vector columns with extensions schema prefix
      ALTER TABLE academy_lessons 
        ADD COLUMN embedding_vector extensions.vector(1536);
      
      ALTER TABLE aoi_knowledge_graph 
        ADD COLUMN embedding extensions.vector(1536);
      
      -- Restore data (convert text back to vector)
      UPDATE academy_lessons al
      SET embedding_vector = t.embedding_text::extensions.vector
      FROM temp_academy_embeddings t
      WHERE al.id = t.id;
      
      UPDATE aoi_knowledge_graph kg
      SET embedding = t.embedding_text::extensions.vector
      FROM temp_aoi_knowledge_embeddings t
      WHERE kg.id = t.id;
      
      -- Recreate indexes that used vector operators
      CREATE INDEX IF NOT EXISTS idx_academy_lessons_embedding 
        ON academy_lessons 
        USING ivfflat (embedding_vector extensions.vector_cosine_ops)
        WITH (lists = 100);
      
      CREATE INDEX IF NOT EXISTS idx_aoi_knowledge_embedding 
        ON aoi_knowledge_graph 
        USING ivfflat (embedding extensions.vector_cosine_ops)
        WITH (lists = 100);
      
    END IF;
  ELSE
    -- Vector extension doesn't exist, create it in extensions schema
    CREATE EXTENSION vector WITH SCHEMA extensions;
  END IF;
END $$;

-- Update default search_path to include extensions
ALTER DATABASE postgres SET search_path TO public, extensions;

-- Update search_path for current session
SET search_path TO public, extensions;
