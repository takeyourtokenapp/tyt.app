/*
  # Academy Quiz System

  1. New Tables
    - `academy_quiz_questions`
      - `id` (uuid, primary key)
      - `lesson_id` (uuid, foreign key to academy_lessons)
      - `question_text` (text)
      - `options` (jsonb array of answer options)
      - `correct_answer_index` (integer, 0-3)
      - `explanation` (text)
      - `display_order` (integer)
      - `created_at` (timestamptz)
      
    - `academy_quiz_attempts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `lesson_id` (uuid, foreign key to academy_lessons)
      - `score` (integer, 0-100)
      - `xp_earned` (integer)
      - `answers` (jsonb, user's selected answers)
      - `completed_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Users can read questions for published lessons
    - Users can only view their own quiz attempts
    - Users can insert their own quiz attempts
*/

CREATE TABLE IF NOT EXISTS academy_quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid REFERENCES academy_lessons(id) ON DELETE CASCADE NOT NULL,
  question_text text NOT NULL,
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  correct_answer_index integer NOT NULL CHECK (correct_answer_index >= 0 AND correct_answer_index <= 3),
  explanation text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS academy_quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  lesson_id uuid REFERENCES academy_lessons(id) ON DELETE CASCADE NOT NULL,
  score integer NOT NULL CHECK (score >= 0 AND score <= 100),
  xp_earned integer NOT NULL DEFAULT 0,
  answers jsonb NOT NULL DEFAULT '[]'::jsonb,
  completed_at timestamptz DEFAULT now()
);

ALTER TABLE academy_quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view quiz questions for published lessons"
  ON academy_quiz_questions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM academy_lessons
      WHERE academy_lessons.id = academy_quiz_questions.lesson_id
      AND academy_lessons.is_published = true
    )
  );

CREATE POLICY "Users can view own quiz attempts"
  ON academy_quiz_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz attempts"
  ON academy_quiz_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_quiz_questions_lesson ON academy_quiz_questions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON academy_quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_lesson ON academy_quiz_attempts(lesson_id);
