/*
  # Create Blockchain Monitoring Infrastructure

  ## Summary
  Sets up infrastructure for blockchain monitoring:
  1. Cron job logs table for monitoring execution history
  2. App settings table for configuration
  3. Helper functions

  Note: Actual cron job scheduling must be done via Supabase Dashboard
  or external cron service (GitHub Actions, etc.)

  ## Security
  - RLS enabled on all tables
  - Service role has full access
  - Authenticated users have read access
*/

-- Create app_settings table first
CREATE TABLE IF NOT EXISTS app_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage app settings"
  ON app_settings FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view app settings"
  ON app_settings FOR SELECT
  TO authenticated
  USING (true);

-- Create cron job logs table
CREATE TABLE IF NOT EXISTS cron_job_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name text NOT NULL,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  status text DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed')),
  result jsonb DEFAULT '{}'::jsonb,
  error_message text,
  execution_time_ms integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cron_job_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage cron job logs"
  ON cron_job_logs FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view cron job logs"
  ON cron_job_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_cron_job_logs_job_name ON cron_job_logs(job_name);
CREATE INDEX IF NOT EXISTS idx_cron_job_logs_started ON cron_job_logs(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_cron_job_logs_status ON cron_job_logs(status);

-- Function to log cron job execution
CREATE OR REPLACE FUNCTION log_cron_execution(
  p_job_name text,
  p_status text,
  p_result jsonb DEFAULT '{}'::jsonb,
  p_error_message text DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_log_id uuid;
BEGIN
  INSERT INTO cron_job_logs (job_name, status, result, error_message, completed_at)
  VALUES (p_job_name, p_status, p_result, p_error_message, now())
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;

GRANT EXECUTE ON FUNCTION log_cron_execution(text, text, jsonb, text) TO service_role;

-- Clean up old cron logs (keep last 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_cron_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM cron_job_logs
  WHERE created_at < now() - interval '30 days';
END;
$$;

GRANT EXECUTE ON FUNCTION cleanup_old_cron_logs() TO service_role;

-- Function to get app setting
CREATE OR REPLACE FUNCTION get_app_setting(p_key text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_value text;
BEGIN
  SELECT value INTO v_value
  FROM app_settings
  WHERE key = p_key;
  
  RETURN v_value;
END;
$$;

GRANT EXECUTE ON FUNCTION get_app_setting(text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_app_setting(text) TO service_role;

-- View for cron job statistics
CREATE OR REPLACE VIEW cron_job_stats AS
SELECT
  job_name,
  COUNT(*) as total_executions,
  COUNT(*) FILTER (WHERE status = 'completed') as successful_executions,
  COUNT(*) FILTER (WHERE status = 'failed') as failed_executions,
  AVG(execution_time_ms) FILTER (WHERE execution_time_ms IS NOT NULL) as avg_execution_time_ms,
  MAX(started_at) as last_execution,
  MIN(started_at) as first_execution
FROM cron_job_logs
WHERE started_at > now() - interval '7 days'
GROUP BY job_name
ORDER BY job_name;
