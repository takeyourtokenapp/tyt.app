/*
  # Add Missing RLS Policies

  ## Problem
  Table game_tournament_participants has RLS enabled but no policies exist.
  This means no one can access the data, breaking functionality.

  ## Solution
  Add appropriate RLS policies for tournament participation.

  ## Policies Added
  - Users can view all tournament participants (public data)
  - Users can join tournaments
  - Users can view their own participation
*/

-- Allow everyone to view tournament participants (public leaderboard data)
CREATE POLICY "Everyone can view tournament participants"
  ON public.game_tournament_participants
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to join tournaments
CREATE POLICY "Users can join tournaments"
  ON public.game_tournament_participants
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- Allow users to update their own participation
CREATE POLICY "Users can update own participation"
  ON public.game_tournament_participants
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));