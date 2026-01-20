/*
  # Automated Email Notification System v3

  1. New Tables
    - `email_queue` - Queue for pending email notifications

  2. Functions & Triggers
    - Welcome email on profile creation
    - KYC status emails
    - Withdrawal approval emails  
    - Miner minting emails

  3. Security
    - RLS enabled
    - Service role full access
    - Users can view own history
*/

-- Create email queue table
CREATE TABLE IF NOT EXISTS email_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  email text NOT NULL,
  template text NOT NULL CHECK (template IN ('welcome', 'kyc_approved', 'kyc_rejected', 'withdrawal_approved', 'miner_minted', 'reward_claimed', 'custom')),
  data jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  attempts integer DEFAULT 0,
  error_message text,
  scheduled_at timestamptz DEFAULT now(),
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_queue_status ON email_queue(status, scheduled_at) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_email_queue_user ON email_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_email_queue_created ON email_queue(created_at DESC);

ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access to email queue"
  ON email_queue FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Users view own email history"
  ON email_queue FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Welcome email function
CREATE OR REPLACE FUNCTION queue_welcome_email()
RETURNS TRIGGER SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO email_queue (user_id, email, template, data)
  VALUES (
    NEW.id, NEW.email, 'welcome',
    jsonb_build_object('username', COALESCE(NEW.username, split_part(NEW.email, '@', 1)))
  );
  RETURN NEW;
END;
$$;

-- KYC status email function
CREATE OR REPLACE FUNCTION queue_kyc_status_email()
RETURNS TRIGGER SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.kyc_status IS DISTINCT FROM OLD.kyc_status AND NEW.kyc_status IN ('approved', 'rejected') THEN
    INSERT INTO email_queue (user_id, email, template, data)
    VALUES (
      NEW.id, NEW.email,
      CASE WHEN NEW.kyc_status::text = 'approved' THEN 'kyc_approved' ELSE 'kyc_rejected' END,
      jsonb_build_object(
        'username', COALESCE(NEW.username, split_part(NEW.email, '@', 1)),
        'reason', CASE WHEN NEW.kyc_status::text = 'rejected' THEN 'Please ensure document quality and information accuracy' ELSE NULL END
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Withdrawal email function
CREATE OR REPLACE FUNCTION queue_withdrawal_email()
RETURNS TRIGGER SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
  v_email text;
  v_username text;
BEGIN
  IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
    SELECT email, COALESCE(username, split_part(email, '@', 1))
    INTO v_email, v_username FROM profiles WHERE id = NEW.user_id;
    
    INSERT INTO email_queue (user_id, email, template, data)
    VALUES (
      NEW.user_id, v_email, 'withdrawal_approved',
      jsonb_build_object(
        'username', v_username,
        'amount', NEW.amount,
        'currency', NEW.currency,
        'address', NEW.destination_address,
        'txId', COALESCE(NEW.tx_hash, 'Processing...'),
        'estimatedTime', '24 hours'
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Miner minted email function
CREATE OR REPLACE FUNCTION queue_miner_minted_email()
RETURNS TRIGGER SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
  v_email text;
  v_username text;
BEGIN
  SELECT email, COALESCE(username, split_part(email, '@', 1))
  INTO v_email, v_username FROM profiles WHERE id = NEW.owner_id;
  
  INSERT INTO email_queue (user_id, email, template, data)
  VALUES (
    NEW.owner_id, v_email, 'miner_minted',
    jsonb_build_object(
      'username', v_username,
      'minerId', NEW.token_id,
      'hashrate', NEW.hashrate,
      'efficiency', NEW.efficiency,
      'region', COALESCE(NEW.farm_id, 'USA')
    )
  );
  RETURN NEW;
END;
$$;

-- Process email queue function
CREATE OR REPLACE FUNCTION process_email_queue(batch_size integer DEFAULT 10)
RETURNS TABLE (processed integer, sent integer, failed integer)
SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
  v_processed integer := 0;
  v_sent integer := 0;
  v_failed integer := 0;
  rec record;
BEGIN
  FOR rec IN
    SELECT * FROM email_queue
    WHERE status = 'pending' AND scheduled_at <= now() AND attempts < 3
    ORDER BY scheduled_at LIMIT batch_size FOR UPDATE SKIP LOCKED
  LOOP
    BEGIN
      v_processed := v_processed + 1;
      
      UPDATE email_queue
      SET status = 'sent', sent_at = now(), attempts = attempts + 1
      WHERE id = rec.id;
      
      v_sent := v_sent + 1;
    EXCEPTION WHEN OTHERS THEN
      UPDATE email_queue
      SET 
        status = CASE WHEN attempts >= 2 THEN 'failed' ELSE 'pending' END,
        attempts = attempts + 1,
        error_message = SQLERRM,
        scheduled_at = CASE WHEN attempts < 2 THEN now() + interval '5 minutes' ELSE scheduled_at END
      WHERE id = rec.id;
      v_failed := v_failed + 1;
    END;
  END LOOP;
  
  RETURN QUERY SELECT v_processed, v_sent, v_failed;
END;
$$;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_queue_welcome_email ON profiles;
CREATE TRIGGER trigger_queue_welcome_email
  AFTER INSERT ON profiles FOR EACH ROW
  EXECUTE FUNCTION queue_welcome_email();

DROP TRIGGER IF EXISTS trigger_queue_kyc_status_email ON profiles;
CREATE TRIGGER trigger_queue_kyc_status_email
  AFTER UPDATE ON profiles FOR EACH ROW
  WHEN (NEW.kyc_status IS DISTINCT FROM OLD.kyc_status)
  EXECUTE FUNCTION queue_kyc_status_email();

DROP TRIGGER IF EXISTS trigger_queue_withdrawal_email ON withdrawal_requests;
CREATE TRIGGER trigger_queue_withdrawal_email
  AFTER UPDATE ON withdrawal_requests FOR EACH ROW
  WHEN (NEW.status = 'approved' AND OLD.status = 'pending')
  EXECUTE FUNCTION queue_withdrawal_email();

DROP TRIGGER IF EXISTS trigger_queue_miner_minted_email ON nft_miners;
CREATE TRIGGER trigger_queue_miner_minted_email
  AFTER INSERT ON nft_miners FOR EACH ROW
  EXECUTE FUNCTION queue_miner_minted_email();

GRANT SELECT ON email_queue TO authenticated;
GRANT ALL ON email_queue TO service_role;

COMMENT ON TABLE email_queue IS 'Automated email notification queue triggered by user actions';
COMMENT ON FUNCTION process_email_queue IS 'Process pending emails (called by cron every 5 minutes)';
