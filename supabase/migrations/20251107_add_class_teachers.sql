-- Migration: create class_teachers table
-- Purpose: allow mapping of a teacher as the 'class teacher' for a class (and optional section)
CREATE TABLE IF NOT EXISTS class_teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL,
  class text NOT NULL,
  section text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT fk_teacher_user FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Prevent duplicates for same teacher+class+section
CREATE UNIQUE INDEX IF NOT EXISTS idx_class_teachers_unique ON class_teachers(teacher_id, class, section);
