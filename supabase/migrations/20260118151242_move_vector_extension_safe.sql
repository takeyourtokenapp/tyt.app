/*
  # Move Vector Extension Safely

  1. Strategy
    - Create extensions schema
    - Keep vector in public for now (dependent objects exist)
    - Add extensions to default search_path

  2. Note
    - Moving vector requires CASCADE which would affect:
      - academy_lessons.embedding_vector
      - aoi_knowledge_graph.embedding
      - search functions
    - Better to leave in public and add extensions to search_path
*/

-- Create extensions schema
CREATE SCHEMA IF NOT EXISTS extensions;

-- Grant usage
GRANT USAGE ON SCHEMA extensions TO postgres, anon, authenticated, service_role;

-- Update search_path for database to include both schemas
ALTER DATABASE postgres SET search_path TO public, extensions, auth;

-- Note: vector extension will remain in public schema
-- This is acceptable as long as search_path includes extensions for future extensions
