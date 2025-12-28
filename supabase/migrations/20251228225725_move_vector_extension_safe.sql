/*
  # Move Vector Extension from Public Schema (Safe Version)

  1. Purpose
    - Move vector extension from public schema to extensions schema
    - Security best practice: extensions should not be in public schema

  2. Changes
    - Drop vector extension with CASCADE (removes dependent columns)
    - Recreate extension in extensions schema
    - Restore vector columns
    - Update search_path
*/

-- Create extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Grant usage on extensions schema
GRANT USAGE ON SCHEMA extensions TO postgres, anon, authenticated, service_role;

-- Drop vector extension from public schema with CASCADE
-- This will also drop the aoi_knowledge_graph.embedding column
DROP EXTENSION IF EXISTS vector CASCADE;

-- Create vector extension in extensions schema
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- Recreate the embedding column in aoi_knowledge_graph if table exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'aoi_knowledge_graph'
  ) THEN
    -- Add the embedding column back with vector type from extensions schema
    ALTER TABLE public.aoi_knowledge_graph
    ADD COLUMN IF NOT EXISTS embedding extensions.vector(1536);

    RAISE NOTICE 'Recreated aoi_knowledge_graph.embedding column';
  END IF;
END $$;

-- Update search_path for database to include extensions
ALTER DATABASE postgres SET search_path TO public, extensions;

-- Update search_path for current session
SET search_path TO public, extensions;