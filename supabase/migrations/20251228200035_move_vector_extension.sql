/*
  # Move Vector Extension from Public Schema

  1. Purpose
    - Move vector extension from public schema to extensions schema
    - Security best practice: extensions should not be in public schema

  2. Changes
    - Create extensions schema if not exists
    - Drop vector extension from public
    - Recreate vector extension in extensions schema
    - Update search_path for functions that use vector
*/

-- Create extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Grant usage on extensions schema
GRANT USAGE ON SCHEMA extensions TO postgres, anon, authenticated, service_role;

-- Drop vector extension from public schema (if it exists)
DROP EXTENSION IF EXISTS vector;

-- Create vector extension in extensions schema
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- Update search_path for database to include extensions
ALTER DATABASE postgres SET search_path TO public, extensions;

-- Note: Functions using vector types will need to be updated to reference extensions.vector
-- or have their search_path updated
