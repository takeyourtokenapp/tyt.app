/*
  # Create add_user_xp function

  This function safely adds XP to a user's profile and updates their rank based on XP thresholds.

  ## Parameters:
  - p_user_id: UUID of the user
  - p_xp_amount: Amount of XP to add

  ## Rank Thresholds:
  - Worker: 0-99 XP
  - Academic: 100-299 XP
  - Diplomat: 300-699 XP
  - Peacekeeper: 700-1499 XP
  - Warrior: 1500+ XP
*/

CREATE OR REPLACE FUNCTION add_user_xp(p_user_id uuid, p_xp_amount integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_score integer;
  v_new_rank text;
BEGIN
  -- Add XP to user's rank_score
  UPDATE profiles
  SET 
    rank_score = COALESCE(rank_score, 0) + p_xp_amount,
    updated_at = now()
  WHERE id = p_user_id
  RETURNING rank_score INTO v_new_score;

  -- Determine new rank based on XP
  IF v_new_score >= 1500 THEN
    v_new_rank := 'warrior';
  ELSIF v_new_score >= 700 THEN
    v_new_rank := 'peacekeeper';
  ELSIF v_new_score >= 300 THEN
    v_new_rank := 'diplomat';
  ELSIF v_new_score >= 100 THEN
    v_new_rank := 'academic';
  ELSE
    v_new_rank := 'worker';
  END IF;

  -- Update rank if it changed
  UPDATE profiles
  SET 
    rank = v_new_rank,
    rank_updated_at = CASE 
      WHEN rank != v_new_rank THEN now() 
      ELSE rank_updated_at 
    END
  WHERE id = p_user_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION add_user_xp(uuid, integer) TO authenticated;
