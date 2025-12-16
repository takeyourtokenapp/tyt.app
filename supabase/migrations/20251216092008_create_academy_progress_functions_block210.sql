/*
  # Academy Progress Functions - Block 2.10

  ## Summary
  Course management and progress tracking functions for the TYT Academy.
  Supports track completion calculation, lesson completion, and certificate issuance.

  ## Functions
    - get_track_progress - Calculate user's progress through a track
    - complete_lesson - Mark lesson complete and award XP
    - check_track_completion - Check if user completed all lessons
    - get_user_lessons_by_track - Get all lessons for a track with progress

  ## Integration
    Works with existing academy_progress, academy_lessons, academy_tracks tables.
*/

-- Get track progress
CREATE OR REPLACE FUNCTION get_track_progress(
  p_user_id uuid,
  p_track_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
  v_total integer;
  v_completed integer;
  v_percentage integer;
  v_total_xp integer;
BEGIN
  -- Count total lessons in track
  SELECT COUNT(*) INTO v_total
  FROM academy_lessons
  WHERE track_id = p_track_id AND is_published = true;

  -- Count completed lessons
  SELECT COUNT(*) INTO v_completed
  FROM academy_progress ap
  JOIN academy_lessons al ON ap.lesson_id = al.id
  WHERE ap.user_id = p_user_id
    AND al.track_id = p_track_id
    AND ap.is_completed = true;

  -- Calculate percentage
  IF v_total > 0 THEN
    v_percentage := (v_completed * 100) / v_total;
  ELSE
    v_percentage := 0;
  END IF;

  -- Calculate total XP earned from this track
  SELECT COALESCE(SUM(ap.xp_earned), 0)::integer INTO v_total_xp
  FROM academy_progress ap
  JOIN academy_lessons al ON ap.lesson_id = al.id
  WHERE ap.user_id = p_user_id
    AND al.track_id = p_track_id
    AND ap.is_completed = true;

  RETURN jsonb_build_object(
    'total_lessons', v_total,
    'completed_lessons', v_completed,
    'completion_percentage', v_percentage,
    'total_xp_earned', v_total_xp,
    'is_complete', v_percentage = 100
  );
END;
$$;

-- Complete lesson with quiz score
CREATE OR REPLACE FUNCTION complete_lesson(
  p_user_id uuid,
  p_lesson_id uuid,
  p_quiz_score numeric DEFAULT NULL,
  p_time_spent_seconds integer DEFAULT 0
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_lesson_xp integer;
  v_quiz_passed boolean := false;
  v_already_completed boolean;
  v_result jsonb;
BEGIN
  -- Get lesson XP reward
  SELECT completion_xp INTO v_lesson_xp
  FROM academy_lessons
  WHERE id = p_lesson_id;

  -- Check if already completed
  SELECT is_completed INTO v_already_completed
  FROM academy_progress
  WHERE user_id = p_user_id AND lesson_id = p_lesson_id;

  -- Determine if quiz passed (70% threshold)
  IF p_quiz_score IS NOT NULL THEN
    v_quiz_passed := p_quiz_score >= 70;
  ELSE
    v_quiz_passed := true;  -- No quiz means auto-pass
  END IF;

  -- Only complete if quiz passed
  IF v_quiz_passed THEN
    -- Insert or update progress
    INSERT INTO academy_progress (
      user_id,
      lesson_id,
      is_completed,
      completed_at,
      time_spent_seconds,
      quiz_score,
      quiz_passed,
      xp_earned
    ) VALUES (
      p_user_id,
      p_lesson_id,
      true,
      now(),
      p_time_spent_seconds,
      p_quiz_score,
      v_quiz_passed,
      CASE WHEN v_already_completed THEN 0 ELSE v_lesson_xp END
    )
    ON CONFLICT (user_id, lesson_id)
    DO UPDATE SET
      is_completed = true,
      completed_at = now(),
      time_spent_seconds = EXCLUDED.time_spent_seconds,
      quiz_score = COALESCE(EXCLUDED.quiz_score, academy_progress.quiz_score),
      quiz_passed = v_quiz_passed,
      updated_at = now();

    -- Award XP only if first completion
    IF NOT COALESCE(v_already_completed, false) THEN
      UPDATE profiles
      SET rank_score = rank_score + v_lesson_xp,
          updated_at = now()
      WHERE id = p_user_id;

      -- Update owl rank
      PERFORM update_owl_rank(p_user_id);
    END IF;

    -- Record quiz attempt
    IF p_quiz_score IS NOT NULL THEN
      INSERT INTO academy_quiz_attempts (user_id, lesson_id, score, passed)
      VALUES (p_user_id, p_lesson_id, p_quiz_score, v_quiz_passed);
    END IF;

    v_result := jsonb_build_object(
      'success', true,
      'completed', true,
      'quiz_passed', v_quiz_passed,
      'xp_earned', CASE WHEN v_already_completed THEN 0 ELSE v_lesson_xp END,
      'already_completed', COALESCE(v_already_completed, false)
    );
  ELSE
    -- Quiz failed
    INSERT INTO academy_quiz_attempts (user_id, lesson_id, score, passed)
    VALUES (p_user_id, p_lesson_id, p_quiz_score, false);

    v_result := jsonb_build_object(
      'success', false,
      'completed', false,
      'quiz_passed', false,
      'message', 'Quiz score must be 70% or higher to complete lesson'
    );
  END IF;

  RETURN v_result;
END;
$$;

-- Check if track is complete
CREATE OR REPLACE FUNCTION check_track_completion(
  p_user_id uuid,
  p_track_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
  v_progress jsonb;
BEGIN
  v_progress := get_track_progress(p_user_id, p_track_id);
  RETURN (v_progress->>'is_complete')::boolean;
END;
$$;

-- Get user's lessons for a track with progress
CREATE OR REPLACE FUNCTION get_user_lessons_by_track(
  p_user_id uuid,
  p_track_id uuid
)
RETURNS TABLE (
  lesson_id uuid,
  lesson_slug text,
  lesson_title text,
  lesson_description text,
  sort_order integer,
  difficulty text,
  estimated_minutes integer,
  completion_xp integer,
  is_completed boolean,
  quiz_score numeric,
  completed_at timestamptz
)
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    al.id,
    al.slug,
    al.title,
    al.description,
    al.sort_order,
    al.difficulty::text,
    al.estimated_minutes,
    al.completion_xp,
    COALESCE(ap.is_completed, false),
    ap.quiz_score,
    ap.completed_at
  FROM academy_lessons al
  LEFT JOIN academy_progress ap
    ON al.id = ap.lesson_id AND ap.user_id = p_user_id
  WHERE al.track_id = p_track_id
    AND al.is_published = true
  ORDER BY al.sort_order;
END;
$$;

-- Get all tracks with user progress
CREATE OR REPLACE FUNCTION get_tracks_with_progress(
  p_user_id uuid
)
RETURNS TABLE (
  track_id uuid,
  track_slug text,
  track_title text,
  track_description text,
  difficulty text,
  estimated_hours numeric,
  total_lessons integer,
  completed_lessons integer,
  completion_percentage integer,
  total_xp_earned integer,
  is_complete boolean
)
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    at.id,
    at.slug,
    at.title,
    at.description,
    at.difficulty::text,
    at.estimated_hours,
    (get_track_progress(p_user_id, at.id)->>'total_lessons')::integer,
    (get_track_progress(p_user_id, at.id)->>'completed_lessons')::integer,
    (get_track_progress(p_user_id, at.id)->>'completion_percentage')::integer,
    (get_track_progress(p_user_id, at.id)->>'total_xp_earned')::integer,
    (get_track_progress(p_user_id, at.id)->>'is_complete')::boolean
  FROM academy_tracks at
  WHERE at.is_published = true
  ORDER BY at.sort_order;
END;
$$;

-- Get user's academy statistics
CREATE OR REPLACE FUNCTION get_user_academy_stats(
  p_user_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
  v_total_lessons_completed integer;
  v_total_xp integer;
  v_certificates_count integer;
  v_current_rank text;
  v_tracks_started integer;
  v_tracks_completed integer;
BEGIN
  -- Get total completed lessons
  SELECT COUNT(*) INTO v_total_lessons_completed
  FROM academy_progress
  WHERE user_id = p_user_id AND is_completed = true;

  -- Get total XP
  SELECT COALESCE(rank_score, 0) INTO v_total_xp
  FROM profiles
  WHERE id = p_user_id;

  -- Get current rank
  SELECT COALESCE(rank, 'worker') INTO v_current_rank
  FROM profiles
  WHERE id = p_user_id;

  -- Get certificates count
  SELECT COUNT(*) INTO v_certificates_count
  FROM academy_certificates
  WHERE user_id = p_user_id;

  -- Get tracks started (at least one lesson completed)
  SELECT COUNT(DISTINCT al.track_id) INTO v_tracks_started
  FROM academy_progress ap
  JOIN academy_lessons al ON ap.lesson_id = al.id
  WHERE ap.user_id = p_user_id;

  -- Get tracks completed (certificates earned)
  SELECT COUNT(*) INTO v_tracks_completed
  FROM academy_certificates
  WHERE user_id = p_user_id;

  v_result := jsonb_build_object(
    'total_lessons_completed', v_total_lessons_completed,
    'total_xp', v_total_xp,
    'current_rank', v_current_rank,
    'certificates_earned', v_certificates_count,
    'tracks_started', v_tracks_started,
    'tracks_completed', v_tracks_completed
  );

  RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION get_track_progress TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION complete_lesson TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION check_track_completion TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_user_lessons_by_track TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_tracks_with_progress TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_user_academy_stats TO authenticated, service_role;
