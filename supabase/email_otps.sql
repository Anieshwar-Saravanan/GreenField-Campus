// Step 2: Supabase SQL for OTP table
-- Run this in Supabase SQL editor
CREATE TABLE email_otps (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  otp text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX email_otps_email_idx ON email_otps(email);
CREATE INDEX email_otps_expires_at_idx ON email_otps(expires_at);
