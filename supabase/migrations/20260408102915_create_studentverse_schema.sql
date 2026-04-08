/*
  # StudentVerse Database Schema

  ## Overview
  Complete database schema for StudentVerse - an all-in-one student platform with authentication,
  notes, practice questions, mock tests, AI performance analysis, and admin features.

  ## New Tables

  ### 1. user_profiles
  - `id` (uuid, primary key, references auth.users)
  - `full_name` (text)
  - `email` (text)
  - `role` (text) - 'user' or 'admin'
  - `branch` (text) - Engineering branch
  - `semester` (integer)
  - `created_at` (timestamptz)

  ### 2. notes
  - `id` (uuid, primary key)
  - `title` (text)
  - `subject` (text)
  - `branch` (text)
  - `semester` (integer)
  - `file_url` (text)
  - `description` (text)
  - `uploaded_by` (uuid, references user_profiles)
  - `created_at` (timestamptz)

  ### 3. practice_questions
  - `id` (uuid, primary key)
  - `title` (text)
  - `topic` (text)
  - `difficulty` (text) - 'easy', 'medium', 'hard'
  - `question_text` (text)
  - `options` (jsonb) - array of options
  - `correct_answer` (text)
  - `explanation` (text)
  - `created_at` (timestamptz)

  ### 4. mock_tests
  - `id` (uuid, primary key)
  - `title` (text)
  - `description` (text)
  - `duration_minutes` (integer)
  - `total_questions` (integer)
  - `topics` (text[])
  - `difficulty_level` (text)
  - `created_by` (uuid, references user_profiles)
  - `created_at` (timestamptz)

  ### 5. test_questions
  - `id` (uuid, primary key)
  - `test_id` (uuid, references mock_tests)
  - `question_text` (text)
  - `options` (jsonb)
  - `correct_answer` (text)
  - `topic` (text)
  - `marks` (integer)

  ### 6. test_attempts
  - `id` (uuid, primary key)
  - `test_id` (uuid, references mock_tests)
  - `user_id` (uuid, references user_profiles)
  - `start_time` (timestamptz)
  - `end_time` (timestamptz)
  - `score` (integer)
  - `total_marks` (integer)
  - `accuracy` (numeric)
  - `time_taken_minutes` (integer)
  - `answers` (jsonb)
  - `topic_performance` (jsonb)
  - `created_at` (timestamptz)

  ### 7. tech_news
  - `id` (uuid, primary key)
  - `title` (text)
  - `content` (text)
  - `category` (text) - 'AI', 'Tech Trends', 'Industry'
  - `image_url` (text)
  - `source_url` (text)
  - `posted_by` (uuid, references user_profiles)
  - `created_at` (timestamptz)

  ### 8. opportunities
  - `id` (uuid, primary key)
  - `title` (text)
  - `type` (text) - 'hackathon', 'internship', 'drive', 'course'
  - `company` (text)
  - `description` (text)
  - `deadline` (timestamptz)
  - `apply_url` (text)
  - `posted_by` (uuid, references user_profiles)
  - `created_at` (timestamptz)

  ### 9. bookmarks
  - `id` (uuid, primary key)
  - `user_id` (uuid, references user_profiles)
  - `item_type` (text) - 'note', 'practice', 'test', 'news', 'opportunity'
  - `item_id` (uuid)
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Users can read their own data
  - Admins can create/update content
  - Public read access for notes, news, opportunities
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  branch text,
  semester integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subject text NOT NULL,
  branch text NOT NULL,
  semester integer NOT NULL,
  file_url text NOT NULL,
  description text,
  uploaded_by uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read notes"
  ON notes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert notes"
  ON notes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update notes"
  ON notes FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Create practice_questions table
CREATE TABLE IF NOT EXISTS practice_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  topic text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  question_text text NOT NULL,
  options jsonb NOT NULL,
  correct_answer text NOT NULL,
  explanation text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE practice_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read practice questions"
  ON practice_questions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert practice questions"
  ON practice_questions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Create mock_tests table
CREATE TABLE IF NOT EXISTS mock_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  duration_minutes integer NOT NULL DEFAULT 60,
  total_questions integer NOT NULL DEFAULT 0,
  topics text[],
  difficulty_level text DEFAULT 'medium',
  created_by uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE mock_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read mock tests"
  ON mock_tests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert mock tests"
  ON mock_tests FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Create test_questions table
CREATE TABLE IF NOT EXISTS test_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id uuid REFERENCES mock_tests(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  options jsonb NOT NULL,
  correct_answer text NOT NULL,
  topic text NOT NULL,
  marks integer DEFAULT 1
);

ALTER TABLE test_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read test questions"
  ON test_questions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert test questions"
  ON test_questions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Create test_attempts table
CREATE TABLE IF NOT EXISTS test_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id uuid REFERENCES mock_tests(id) ON DELETE CASCADE,
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  start_time timestamptz DEFAULT now(),
  end_time timestamptz,
  score integer DEFAULT 0,
  total_marks integer DEFAULT 0,
  accuracy numeric DEFAULT 0,
  time_taken_minutes integer DEFAULT 0,
  answers jsonb,
  topic_performance jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE test_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own test attempts"
  ON test_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own test attempts"
  ON test_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own test attempts"
  ON test_attempts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create tech_news table
CREATE TABLE IF NOT EXISTS tech_news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text DEFAULT 'Tech Trends',
  image_url text,
  source_url text,
  posted_by uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tech_news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read tech news"
  ON tech_news FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert tech news"
  ON tech_news FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Create opportunities table
CREATE TABLE IF NOT EXISTS opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('hackathon', 'internship', 'drive', 'course')),
  company text,
  description text NOT NULL,
  deadline timestamptz,
  apply_url text,
  posted_by uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read opportunities"
  ON opportunities FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert opportunities"
  ON opportunities FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  item_type text NOT NULL CHECK (item_type IN ('note', 'practice', 'test', 'news', 'opportunity')),
  item_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, item_type, item_id)
);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own bookmarks"
  ON bookmarks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks"
  ON bookmarks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notes_branch_semester ON notes(branch, semester);
CREATE INDEX IF NOT EXISTS idx_practice_questions_topic ON practice_questions(topic);
CREATE INDEX IF NOT EXISTS idx_test_attempts_user_id ON test_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_deadline ON opportunities(deadline);
