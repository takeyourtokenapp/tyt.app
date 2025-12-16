/*
  # Rename owl_rank to rank across all tables

  This migration renames the `owl_rank` column to `rank` for consistency with the actual database schema.

  ## Changes Made:
  1. Rename `owl_rank` to `rank` in `community_messages` table
  
  ## Notes:
  - The `profiles` table already uses `rank` - no changes needed
  - This fixes the "column owl_rank does not exist" errors
*/

-- Rename owl_rank to rank in community_messages if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'community_messages' AND column_name = 'owl_rank'
  ) THEN
    ALTER TABLE community_messages RENAME COLUMN owl_rank TO rank;
  END IF;
END $$;
