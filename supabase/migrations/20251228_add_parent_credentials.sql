/*
  # Parent Credentials Table with Bcrypt Password Hashing

  1. New Table
    - `parent_credentials`
      - `id` (uuid, primary key)
      - `parent_id` (uuid, foreign key to users)
      - `student_id` (uuid, foreign key to students)
      - `username` (text, unique) - roll_number of the student
      - `password_hash` (text) - bcrypt hash of last 4 digits of roll_number
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Indexes
    - Index on parent_id for quick lookup
    - Index on username for login

  3. Constraints
    - Unique username
    - Foreign key constraints with CASCADE delete

  4. Security
    - Passwords hashed using bcrypt (cost factor 10)
    - RLS enabled for data protection
*/

-- Enable pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create parent_credentials table
CREATE TABLE IF NOT EXISTS parent_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  username text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_parent_credentials_parent_id ON parent_credentials(parent_id);
CREATE INDEX idx_parent_credentials_username ON parent_credentials(username);
CREATE INDEX idx_parent_credentials_student_id ON parent_credentials(student_id);

-- Enable Row Level Security
ALTER TABLE parent_credentials ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Parents can read their own credentials
CREATE POLICY "Parents can read own credentials"
  ON parent_credentials FOR SELECT
  USING (parent_id = auth.uid());

-- Parents can update their own credentials
CREATE POLICY "Parents can update own credentials"
  ON parent_credentials FOR UPDATE
  USING (parent_id = auth.uid());

-- Only admins can delete credentials
CREATE POLICY "Admins can delete credentials"
  ON parent_credentials FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Auto-insert credentials for existing students with bcrypt hashing
INSERT INTO parent_credentials (parent_id, student_id, username, password_hash)
SELECT 
  s.parent_id,
  s.id,
  s.roll_number as username,
  -- Hash only the last 4 digits using bcrypt (cost factor 10)
  crypt(RIGHT(s.roll_number, 4), gen_salt('bf', 10)) as password_hash
FROM students s
WHERE s.parent_id IS NOT NULL
ON CONFLICT (username) DO NOTHING;
