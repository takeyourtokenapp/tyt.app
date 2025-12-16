/*
  # Fix anonymous access to Academy tracks

  This migration ensures that:
  1. Anonymous users can view published tracks
  2. Authenticated users can view published tracks
  3. Proper grants are in place

  ## Problem:
  The RLS policy exists but anon role cannot access the table.

  ## Solution:
  Grant SELECT permission to anon and authenticated roles explicitly.
*/

-- Grant SELECT on academy_tracks to anon and authenticated users
GRANT SELECT ON academy_tracks TO anon, authenticated;

-- Grant SELECT on academy_lessons to anon and authenticated users
GRANT SELECT ON academy_lessons TO anon, authenticated;

-- Grant SELECT on academy_quizzes to anon and authenticated users
GRANT SELECT ON academy_quizzes TO anon, authenticated;

-- Ensure the RLS policy is correct
DROP POLICY IF EXISTS "Anyone can view published tracks" ON academy_tracks;

CREATE POLICY "Anyone can view published tracks"
ON academy_tracks
FOR SELECT
TO anon, authenticated
USING (is_published = true);

-- Same for lessons
DROP POLICY IF EXISTS "Anyone can view published lessons" ON academy_lessons;

CREATE POLICY "Anyone can view published lessons"
ON academy_lessons
FOR SELECT
TO anon, authenticated
USING (is_published = true);
