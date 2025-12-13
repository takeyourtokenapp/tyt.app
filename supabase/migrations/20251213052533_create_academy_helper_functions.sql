/*
  # Academy Helper Functions

  1. New Functions
    - `add_user_xp(p_user_id, p_xp_amount)` - Add XP to user and update owl_rank
    - `update_owl_rank(p_user_id)` - Automatically update user's owl rank based on XP
    - `get_user_progress_summary(p_user_id)` - Get user's academy progress summary

  2. Purpose
    - Enable XP rewards for completing lessons and quizzes
    - Automatically progress users through owl ranks
    - Provide quick access to progress stats
*/

CREATE OR REPLACE FUNCTION add_user_xp(
  p_user_id uuid,
  p_xp_amount integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE profiles
  SET rank_score = rank_score + p_xp_amount,
      updated_at = now()
  WHERE id = p_user_id;

  PERFORM update_owl_rank(p_user_id);
END;
$$;

CREATE OR REPLACE FUNCTION update_owl_rank(
  p_user_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_xp integer;
  v_new_rank text;
BEGIN
  SELECT rank_score INTO v_current_xp
  FROM profiles
  WHERE id = p_user_id;

  IF v_current_xp >= 1500 THEN
    v_new_rank := 'warrior';
  ELSIF v_current_xp >= 700 THEN
    v_new_rank := 'peacekeeper';
  ELSIF v_current_xp >= 300 THEN
    v_new_rank := 'diplomat';
  ELSIF v_current_xp >= 100 THEN
    v_new_rank := 'academic';
  ELSE
    v_new_rank := 'worker';
  END IF;

  UPDATE profiles
  SET owl_rank = v_new_rank,
      updated_at = now()
  WHERE id = p_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION get_user_progress_summary(
  p_user_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_lessons_completed', COUNT(DISTINCT lesson_id) FILTER (WHERE completed = true),
    'total_tracks_started', COUNT(DISTINCT track_id),
    'total_xp', COALESCE((SELECT rank_score FROM profiles WHERE id = p_user_id), 0),
    'owl_rank', COALESCE((SELECT owl_rank FROM profiles WHERE id = p_user_id), 'worker'),
    'certificates_earned', 0
  ) INTO v_result
  FROM academy_user_progress
  WHERE user_id = p_user_id;

  RETURN v_result;
END;
$$;
