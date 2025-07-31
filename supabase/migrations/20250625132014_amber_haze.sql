/*
  # Initial Database Schema for Greenfield Campus Parent Portal

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `phone` (text, unique)
      - `password_hash` (text)
      - `name` (text)
      - `role` (enum: parent, teacher, admin)
      - `is_verified` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `students`
      - `id` (uuid, primary key)
      - `name` (text)
      - `class` (text)
      - `section` (text)
      - `roll_number` (text, unique)
      - `parent_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `marks`
      - `id` (uuid, primary key)
      - `student_id` (uuid, foreign key)
      - `subject` (text)
      - `exam_type` (enum: class-test, unit-test, quarterly, half-yearly, annual)
      - `marks` (integer)
      - `total_marks` (integer)
      - `date` (date)
      - `teacher_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Users can only access their own data
    - Teachers can access their students' data
    - Admins have full access

  3. Indexes
    - Add indexes for frequently queried columns
    - Optimize for performance
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('parent', 'teacher', 'admin');
CREATE TYPE exam_type AS ENUM ('class-test', 'unit-test', 'quarterly', 'half-yearly', 'annual');

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  phone text UNIQUE,
  password_hash text NOT NULL,
  name text NOT NULL,
  role user_role NOT NULL DEFAULT 'parent',
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  class text NOT NULL,
  section text NOT NULL,
  roll_number text UNIQUE NOT NULL,
  parent_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Marks table
CREATE TABLE IF NOT EXISTS marks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  subject text NOT NULL,
  exam_type exam_type NOT NULL,
  marks integer NOT NULL CHECK (marks >= 0),
  total_marks integer NOT NULL CHECK (total_marks > 0),
  date date NOT NULL,
  teacher_id uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_marks CHECK (marks <= total_marks)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE marks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- RLS Policies for students table
CREATE POLICY "Parents can read own students"
  ON students
  FOR SELECT
  TO authenticated
  USING (
    parent_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Admins can manage students"
  ON students
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- RLS Policies for marks table
CREATE POLICY "Parents can read their children's marks"
  ON marks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM students 
      WHERE students.id = marks.student_id 
      AND students.parent_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Teachers can insert marks"
  ON marks
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Teachers can update marks"
  ON marks
  FOR UPDATE
  TO authenticated
  USING (
    teacher_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_parent_id ON students(parent_id);
CREATE INDEX IF NOT EXISTS idx_marks_student_id ON marks(student_id);
CREATE INDEX IF NOT EXISTS idx_marks_teacher_id ON marks(teacher_id);
CREATE INDEX IF NOT EXISTS idx_marks_date ON marks(date);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at 
  BEFORE UPDATE ON students 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marks_updated_at 
  BEFORE UPDATE ON marks 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();