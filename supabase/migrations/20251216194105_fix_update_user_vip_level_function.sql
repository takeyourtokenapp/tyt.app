/*
  # Fix update_user_vip_level function
  
  Fix search_path issue by explicitly qualifying table names.
*/

CREATE OR REPLACE FUNCTION public.update_user_vip_level()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    v_user_id uuid;
    v_total_hashrate numeric;
    v_voting_power numeric;
    v_new_vip_level integer;
BEGIN
    v_user_id := COALESCE(NEW.id, OLD.id);
    
    SELECT COALESCE(total_hashrate, 0) INTO v_total_hashrate
    FROM public.profiles
    WHERE id = v_user_id;
    
    SELECT COALESCE(SUM(voting_power), 0) INTO v_voting_power
    FROM public.ve_tyt_locks
    WHERE user_id = v_user_id AND unlock_at > now();
    
    SELECT level INTO v_new_vip_level
    FROM public.vip_tiers
    WHERE 
        (requirement_type = 'hashrate' AND v_total_hashrate >= COALESCE(min_hashrate, 0))
        OR (requirement_type = 'voting_power' AND v_voting_power >= COALESCE(min_voting_power, 0))
        OR (requirement_type = 'either' AND (v_total_hashrate >= COALESCE(min_hashrate, 0) OR v_voting_power >= COALESCE(min_voting_power, 0)))
    ORDER BY level DESC
    LIMIT 1;
    
    UPDATE public.profiles
    SET vip_level = COALESCE(v_new_vip_level, 0)
    WHERE id = v_user_id;
    
    RETURN COALESCE(NEW, OLD);
END;
$$;
