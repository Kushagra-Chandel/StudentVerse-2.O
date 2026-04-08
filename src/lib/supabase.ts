import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  role: 'user' | 'admin';
  branch?: string;
  semester?: number;
  created_at: string;
};

export type Note = {
  id: string;
  title: string;
  subject: string;
  branch: string;
  semester: number;
  file_url: string;
  description?: string;
  uploaded_by?: string;
  created_at: string;
};

export type PracticeQuestion = {
  id: string;
  title: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question_text: string;
  options: string[];
  correct_answer: string;
  explanation?: string;
  created_at: string;
};

export type MockTest = {
  id: string;
  title: string;
  description?: string;
  duration_minutes: number;
  total_questions: number;
  topics?: string[];
  difficulty_level: string;
  created_by?: string;
  created_at: string;
};

export type TestQuestion = {
  id: string;
  test_id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  topic: string;
  marks: number;
};

export type TestAttempt = {
  id: string;
  test_id: string;
  user_id: string;
  start_time: string;
  end_time?: string;
  score: number;
  total_marks: number;
  accuracy: number;
  time_taken_minutes: number;
  answers?: Record<string, string>;
  topic_performance?: Record<string, { correct: number; total: number }>;
  created_at: string;
};

export type TechNews = {
  id: string;
  title: string;
  content: string;
  category: string;
  image_url?: string;
  source_url?: string;
  posted_by?: string;
  created_at: string;
};

export type Opportunity = {
  id: string;
  title: string;
  type: 'hackathon' | 'internship' | 'drive' | 'course';
  company?: string;
  description: string;
  deadline?: string;
  apply_url?: string;
  posted_by?: string;
  created_at: string;
};

export type Bookmark = {
  id: string;
  user_id: string;
  item_type: 'note' | 'practice' | 'test' | 'news' | 'opportunity';
  item_id: string;
  created_at: string;
};
