/*
  # Populate Parent Credentials from Existing Students with Bcrypt Hashing
  
  This script will:
  1. Create credentials for all existing parent-student relationships
  2. Use roll_number as username
  3. Hash ONLY the last 4 digits of roll_number using bcrypt (cost factor 10)
  4. Skip any that already exist (idempotent)
*/

-- Enable pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Populate parent_credentials from existing students with bcrypt hashing
INSERT INTO parent_credentials (parent_id, student_id, username, password_hash)
SELECT 
  s.parent_id,
  s.id,
  s.roll_number as username,
  -- Hash only the last 4 digits using bcrypt
  crypt(RIGHT(s.roll_number, 4), gen_salt('bf', 10)) as password_hash
FROM students s
WHERE s.parent_id IS NOT NULL
ON CONFLICT (username) DO NOTHING;

-- Verify the insertion - show what was inserted
SELECT 
  pc.id,
  u.name as parent_name,
  u.email,
  s.name as student_name,
  s.roll_number,
  pc.username,
  pc.created_at
FROM parent_credentials pc
JOIN users u ON pc.parent_id = u.id
JOIN students s ON pc.student_id = s.id
ORDER BY u.name, s.name;

-- Count total credentials created
SELECT COUNT(*) as total_parent_credentials FROM parent_credentials;

-- Count how many students have credentials
SELECT COUNT(DISTINCT parent_id) as parents_with_credentials FROM parent_credentials;
