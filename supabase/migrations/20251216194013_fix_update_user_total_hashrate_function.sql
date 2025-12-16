/*
  # Fix update_user_total_hashrate function
  
  The function has empty search_path which causes it to not find the profiles table.
  Fix by explicitly qualifying table names with schema.
*/

CREATE OR REPLACE FUNCTION public.update_user_total_hashrate()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.profiles
  SET total_hashrate = (
    SELECT COALESCE(SUM(hashrate), 0)
    FROM public.nft_miners
    WHERE owner_id = COALESCE(NEW.owner_id, OLD.owner_id)
    AND status = 'active'
  )
  WHERE id = COALESCE(NEW.owner_id, OLD.owner_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;
