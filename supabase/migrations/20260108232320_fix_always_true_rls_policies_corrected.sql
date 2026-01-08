/*
  # Fix Always-True RLS Policies
  
  1. Changes
    - Replace unrestricted INSERT policies with validated versions
    - Add validation checks for contact form submissions
    - Restrict email_notifications to service_role only
  
  2. Security
    - Prevents abuse of contact forms through validation
    - Ensures email notifications can only be created by backend
    - Maintains functionality while adding security controls
  
  3. Notes
    - Contact forms are public but should have basic validation
    - Validation is enforced at database level
*/

-- Fix contact_messages table
DROP POLICY IF EXISTS "Anyone can create messages" ON contact_messages;

CREATE POLICY "Validated contact message creation"
  ON contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    -- Basic validation: ensure required fields are not empty
    name IS NOT NULL AND TRIM(name) != ''
    AND email IS NOT NULL AND TRIM(email) != ''
    AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    AND subject IS NOT NULL AND TRIM(subject) != ''
    AND message IS NOT NULL AND TRIM(message) != ''
    -- Reasonable length limits
    AND LENGTH(name) <= 100
    AND LENGTH(email) <= 255
    AND LENGTH(subject) <= 200
    AND LENGTH(message) <= 5000
  );

-- Fix contact_submissions table
DROP POLICY IF EXISTS "Anyone can submit contact form" ON contact_submissions;

CREATE POLICY "Validated contact submission creation"
  ON contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    -- Basic validation: ensure required fields are not empty
    sender_name IS NOT NULL AND TRIM(sender_name) != ''
    AND sender_email IS NOT NULL AND TRIM(sender_email) != ''
    AND sender_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    AND message IS NOT NULL AND TRIM(message) != ''
    -- Reasonable length limits
    AND LENGTH(sender_name) <= 100
    AND LENGTH(sender_email) <= 255
    AND LENGTH(message) <= 5000
  );

-- Fix email_notifications table - only service_role should create these
DROP POLICY IF EXISTS "System can create email_notifications" ON email_notifications;

CREATE POLICY "Only service role can create email notifications"
  ON email_notifications
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Fix foundation_contact_submissions table
DROP POLICY IF EXISTS "Allow anonymous inserts" ON foundation_contact_submissions;

CREATE POLICY "Validated foundation contact submissions"
  ON foundation_contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    -- Basic validation: ensure required fields are not empty
    sender_name IS NOT NULL AND TRIM(sender_name) != ''
    AND sender_email IS NOT NULL AND TRIM(sender_email) != ''
    AND sender_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    AND message IS NOT NULL AND TRIM(message) != ''
    -- Reasonable length limits
    AND LENGTH(sender_name) <= 100
    AND LENGTH(sender_email) <= 255
    AND LENGTH(message) <= 5000
  );
