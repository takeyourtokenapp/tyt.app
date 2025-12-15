/*
  # Add Missing RLS Policies
  
  1. New Policies
    - Add RLS policy for game_tournament_participants table
    - This table had RLS enabled but no policies (security issue)
  
  2. Security
    - Users can view tournament participants
    - Users can manage their own participations
    - Admins (service_role) have full access
*/

-- Add policies for game_tournament_participants
CREATE POLICY "Users can view tournament participants"
  ON public.game_tournament_participants
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own participation"
  ON public.game_tournament_participants
  FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Service role has full access"
  ON public.game_tournament_participants
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
