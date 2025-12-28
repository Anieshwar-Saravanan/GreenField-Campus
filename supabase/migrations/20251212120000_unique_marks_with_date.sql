-- Enforce uniqueness of marks per student, subject, exam_type, and date
BEGIN;

-- Drop any previous unique constraint (safe if none exists)
ALTER TABLE marks DROP CONSTRAINT IF EXISTS uniq_mark;

-- Add composite unique constraint including date
ALTER TABLE marks ADD CONSTRAINT uniq_mark UNIQUE (student_id, subject, exam_type, date);

COMMIT;
