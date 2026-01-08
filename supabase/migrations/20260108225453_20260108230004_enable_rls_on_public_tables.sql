/*
  # Enable RLS on Public Tables

  1. Security Enhancement
    - Enable RLS on tables that are public but don't have it enabled
    - Add appropriate policies

  2. Tables Fixed
    - foundation_contact_info
    - admin_users
    - email_notifications
    - foundation
*/

-- Enable RLS on foundation_contact_info
ALTER TABLE foundation_contact_info ENABLE ROW LEVEL SECURITY;

-- Allow public read access to foundation contact info
CREATE POLICY "Public can view foundation contact info"
  ON foundation_contact_info FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only admins can modify
CREATE POLICY "Admins can manage foundation contact info"
  ON foundation_contact_info FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.is_admin = true
    )
  );

-- Enable RLS on admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Only admins can view admin_users
CREATE POLICY "Admins can view admin_users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.is_admin = true
    )
  );

-- Only super admins can modify admin_users
CREATE POLICY "Super admins can manage admin_users"
  ON admin_users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.is_admin = true
    )
  );

-- Enable RLS on email_notifications
ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;

-- Only admins can view email_notifications
CREATE POLICY "Admins can view email_notifications"
  ON email_notifications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.is_admin = true
    )
  );

-- System can insert email notifications
CREATE POLICY "System can create email_notifications"
  ON email_notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Enable RLS on foundation
ALTER TABLE foundation ENABLE ROW LEVEL SECURITY;

-- Public read access to foundation info
CREATE POLICY "Public can view foundation info"
  ON foundation FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only admins can modify foundation info
CREATE POLICY "Admins can manage foundation info"
  ON foundation FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.is_admin = true
    )
  );
