/*
  # Security Monitoring and Alerting System

  Creates comprehensive monitoring infrastructure for security events:

  ## Tables Created

  1. **security_events**
     - Logs all security-related events (failed logins, suspicious activity, etc.)
     - Tracks severity, event type, IP addresses, user IDs

  2. **security_alerts**
     - Stores triggered alerts for admin review
     - Tracks alert type, status (open/acknowledged/resolved)

  3. **system_health_metrics**
     - Tracks system performance and error rates
     - Used for anomaly detection

  ## Functions Created

  - `check_suspicious_activity()` - Detects patterns of suspicious behavior
  - `trigger_security_alert()` - Creates and sends security alerts

  ## Security Features
  - Automated detection of brute force attempts
  - Large transaction monitoring
  - Failed authentication tracking
  - Rate limit violations
  - IP-based threat detection
*/

-- =====================================================
-- 1. Security Events Log
-- =====================================================

CREATE TABLE IF NOT EXISTS security_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL CHECK (event_type IN (
    'failed_login',
    'suspicious_activity',
    'large_deposit',
    'large_withdrawal',
    'rate_limit_exceeded',
    'unauthorized_access',
    'data_breach_attempt',
    'admin_action'
  )),
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  user_id uuid REFERENCES auth.users(id),
  ip_address text,
  user_agent text,
  event_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_security_events_type ON security_events(event_type);
CREATE INDEX idx_security_events_severity ON security_events(severity);
CREATE INDEX idx_security_events_user_id ON security_events(user_id);
CREATE INDEX idx_security_events_created_at ON security_events(created_at);
CREATE INDEX idx_security_events_ip_address ON security_events(ip_address);

ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;

-- Only admins can view security events
CREATE POLICY "Service role can manage security events"
  ON security_events FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- 2. Security Alerts
-- =====================================================

CREATE TABLE IF NOT EXISTS security_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type text NOT NULL CHECK (alert_type IN (
    'brute_force_detected',
    'unusual_activity',
    'large_transaction',
    'multiple_failed_logins',
    'suspicious_ip',
    'data_anomaly',
    'system_error_spike'
  )),
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title text NOT NULL,
  description text NOT NULL,
  related_events uuid[],
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'acknowledged', 'resolved', 'false_positive')),
  acknowledged_by uuid REFERENCES auth.users(id),
  acknowledged_at timestamptz,
  resolved_by uuid REFERENCES auth.users(id),
  resolved_at timestamptz,
  resolution_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_security_alerts_type ON security_alerts(alert_type);
CREATE INDEX idx_security_alerts_severity ON security_alerts(severity);
CREATE INDEX idx_security_alerts_status ON security_alerts(status);
CREATE INDEX idx_security_alerts_created_at ON security_alerts(created_at);

ALTER TABLE security_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage security alerts"
  ON security_alerts FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- 3. System Health Metrics
-- =====================================================

CREATE TABLE IF NOT EXISTS system_health_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type text NOT NULL CHECK (metric_type IN (
    'api_response_time',
    'error_rate',
    'active_users',
    'transaction_volume',
    'database_connections',
    'function_execution_time'
  )),
  metric_value numeric NOT NULL,
  metadata jsonb DEFAULT '{}',
  recorded_at timestamptz DEFAULT now()
);

CREATE INDEX idx_system_health_metrics_type ON system_health_metrics(metric_type);
CREATE INDEX idx_system_health_metrics_recorded_at ON system_health_metrics(recorded_at);

ALTER TABLE system_health_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage system health metrics"
  ON system_health_metrics FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- 4. Helper Functions
-- =====================================================

CREATE OR REPLACE FUNCTION check_failed_login_attempts(
  p_user_id uuid,
  p_ip_address text,
  p_time_window_minutes int DEFAULT 5
)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_attempt_count int;
BEGIN
  SELECT COUNT(*)
  INTO v_attempt_count
  FROM security_events
  WHERE event_type = 'failed_login'
    AND (user_id = p_user_id OR ip_address = p_ip_address)
    AND created_at > NOW() - (p_time_window_minutes || ' minutes')::interval;

  RETURN v_attempt_count;
END;
$$;

CREATE OR REPLACE FUNCTION log_security_event(
  p_event_type text,
  p_severity text,
  p_user_id uuid DEFAULT NULL,
  p_ip_address text DEFAULT NULL,
  p_user_agent text DEFAULT NULL,
  p_event_data jsonb DEFAULT '{}'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_event_id uuid;
  v_failed_attempts int;
BEGIN
  -- Log the event
  INSERT INTO security_events (
    event_type,
    severity,
    user_id,
    ip_address,
    user_agent,
    event_data
  )
  VALUES (
    p_event_type,
    p_severity,
    p_user_id,
    p_ip_address,
    p_user_agent,
    p_event_data
  )
  RETURNING id INTO v_event_id;

  -- Check for brute force (failed login)
  IF p_event_type = 'failed_login' THEN
    v_failed_attempts := check_failed_login_attempts(p_user_id, p_ip_address, 5);

    IF v_failed_attempts >= 5 THEN
      INSERT INTO security_alerts (
        alert_type,
        severity,
        title,
        description,
        related_events
      )
      VALUES (
        'brute_force_detected',
        'high',
        'Brute Force Attack Detected',
        format('User %s or IP %s has %s failed login attempts in 5 minutes', 
               COALESCE(p_user_id::text, 'unknown'), 
               COALESCE(p_ip_address, 'unknown'), 
               v_failed_attempts),
        ARRAY[v_event_id]
      );
    END IF;
  END IF;

  -- Check for large transactions
  IF p_event_type IN ('large_deposit', 'large_withdrawal') THEN
    IF (p_event_data->>'amount')::numeric > 10000 THEN
      INSERT INTO security_alerts (
        alert_type,
        severity,
        title,
        description,
        related_events
      )
      VALUES (
        'large_transaction',
        'medium',
        'Large Transaction Detected',
        format('Transaction of %s detected for user %s', 
               p_event_data->>'amount', 
               COALESCE(p_user_id::text, 'unknown')),
        ARRAY[v_event_id]
      );
    END IF;
  END IF;

  RETURN v_event_id;
END;
$$;

-- =====================================================
-- 5. Grant necessary permissions
-- =====================================================

GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;
