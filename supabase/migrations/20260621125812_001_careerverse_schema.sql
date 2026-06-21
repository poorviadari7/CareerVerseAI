/*
# CareerVerse AI - Initial Schema

1. New Tables
- `student_profiles`: Stores student information (name, grade, interests, etc.)
- `interview_sessions`: Tracks AI career interview sessions with Astra
- `interview_responses`: Individual question-answer pairs from interviews
- `talent_scores`: Skill dimension scores from talent analysis
- `academic_records`: Uploaded academic performance records
- `career_quest_sessions`: Tracks game session sessions
- `career_quest_answers`: Student choices in career quest scenarios
- `career_recommendations`: Top career recommendations with scores
- `career_roadmaps`: Personalized step-by-step plans
- `roadmap_steps`: Individual milestones within roadmaps
- `achievements`: Earned badges and skill points

2. Security
- Enable RLS on all tables.
- Single-tenant app: allow anon + authenticated CRUD since data is
  intentionally public/shared for this demo guidance tool.
*/

CREATE TABLE IF NOT EXISTS student_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  grade text,
  school text,
  interests text[],
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS interview_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES student_profiles(id) ON DELETE CASCADE,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  overall_summary text,
  status text DEFAULT 'in_progress'
);

CREATE TABLE IF NOT EXISTS interview_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES interview_sessions(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text,
  asked_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS talent_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES student_profiles(id) ON DELETE CASCADE,
  analytical_thinking integer DEFAULT 0 CHECK (analytical_thinking BETWEEN 0 AND 100),
  leadership integer DEFAULT 0 CHECK (leadership BETWEEN 0 AND 100),
  creativity integer DEFAULT 0 CHECK (creativity BETWEEN 0 AND 100),
  communication integer DEFAULT 0 CHECK (communication BETWEEN 0 AND 100),
  teamwork integer DEFAULT 0 CHECK (teamwork BETWEEN 0 AND 100),
  adaptability integer DEFAULT 0 CHECK (adaptability BETWEEN 0 AND 100),
  calculated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS academic_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES student_profiles(id) ON DELETE CASCADE,
  record_name text NOT NULL,
  subjects jsonb NOT NULL,
  overall_score numeric,
  analyzed_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS career_quest_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES student_profiles(id) ON DELETE CASCADE,
  scenario_name text NOT NULL,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  score integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS career_quest_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES career_quest_sessions(id) ON DELETE CASCADE,
  question text NOT NULL,
  choice text NOT NULL,
  trait_revealed text,
  answered_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS career_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES student_profiles(id) ON DELETE CASCADE,
  career_title text NOT NULL,
  suitability_score integer NOT NULL CHECK (suitability_score BETWEEN 0 AND 100),
  explanation text,
  required_skills text[],
  future_demand text,
  growth_opportunities text,
  rank integer NOT NULL,
  generated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS career_roadmaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES student_profiles(id) ON DELETE CASCADE,
  career_title text NOT NULL,
  skills_to_learn text[],
  educational_path text,
  generated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS roadmap_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id uuid REFERENCES career_roadmaps(id) ON DELETE CASCADE,
  step_title text NOT NULL,
  step_type text NOT NULL DEFAULT 'short_term',
  timeframe text,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES student_profiles(id) ON DELETE CASCADE,
  badge_name text NOT NULL,
  badge_description text,
  skill_points integer NOT NULL DEFAULT 0,
  earned_at timestamptz DEFAULT now()
);

ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_quest_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_quest_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_student_profiles" ON student_profiles;
CREATE POLICY "anon_select_student_profiles" ON student_profiles FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_student_profiles" ON student_profiles;
CREATE POLICY "anon_insert_student_profiles" ON student_profiles FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_student_profiles" ON student_profiles;
CREATE POLICY "anon_update_student_profiles" ON student_profiles FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_student_profiles" ON student_profiles;
CREATE POLICY "anon_delete_student_profiles" ON student_profiles FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_interview_sessions" ON interview_sessions;
CREATE POLICY "anon_select_interview_sessions" ON interview_sessions FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_interview_sessions" ON interview_sessions;
CREATE POLICY "anon_insert_interview_sessions" ON interview_sessions FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_interview_sessions" ON interview_sessions;
CREATE POLICY "anon_update_interview_sessions" ON interview_sessions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_interview_sessions" ON interview_sessions;
CREATE POLICY "anon_delete_interview_sessions" ON interview_sessions FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_interview_responses" ON interview_responses;
CREATE POLICY "anon_select_interview_responses" ON interview_responses FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_interview_responses" ON interview_responses;
CREATE POLICY "anon_insert_interview_responses" ON interview_responses FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_interview_responses" ON interview_responses;
CREATE POLICY "anon_update_interview_responses" ON interview_responses FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_interview_responses" ON interview_responses;
CREATE POLICY "anon_delete_interview_responses" ON interview_responses FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_talent_scores" ON talent_scores;
CREATE POLICY "anon_select_talent_scores" ON talent_scores FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_talent_scores" ON talent_scores;
CREATE POLICY "anon_insert_talent_scores" ON talent_scores FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_talent_scores" ON talent_scores;
CREATE POLICY "anon_update_talent_scores" ON talent_scores FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_talent_scores" ON talent_scores;
CREATE POLICY "anon_delete_talent_scores" ON talent_scores FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_academic_records" ON academic_records;
CREATE POLICY "anon_select_academic_records" ON academic_records FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_academic_records" ON academic_records;
CREATE POLICY "anon_insert_academic_records" ON academic_records FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_academic_records" ON academic_records;
CREATE POLICY "anon_update_academic_records" ON academic_records FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_academic_records" ON academic_records;
CREATE POLICY "anon_delete_academic_records" ON academic_records FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_career_quest_sessions" ON career_quest_sessions;
CREATE POLICY "anon_select_career_quest_sessions" ON career_quest_sessions FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_career_quest_sessions" ON career_quest_sessions;
CREATE POLICY "anon_insert_career_quest_sessions" ON career_quest_sessions FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_career_quest_sessions" ON career_quest_sessions;
CREATE POLICY "anon_update_career_quest_sessions" ON career_quest_sessions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_career_quest_sessions" ON career_quest_sessions;
CREATE POLICY "anon_delete_career_quest_sessions" ON career_quest_sessions FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_career_quest_answers" ON career_quest_answers;
CREATE POLICY "anon_select_career_quest_answers" ON career_quest_answers FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_career_quest_answers" ON career_quest_answers;
CREATE POLICY "anon_insert_career_quest_answers" ON career_quest_answers FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_career_quest_answers" ON career_quest_answers;
CREATE POLICY "anon_update_career_quest_answers" ON career_quest_answers FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_career_quest_answers" ON career_quest_answers;
CREATE POLICY "anon_delete_career_quest_answers" ON career_quest_answers FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_career_recommendations" ON career_recommendations;
CREATE POLICY "anon_select_career_recommendations" ON career_recommendations FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_career_recommendations" ON career_recommendations;
CREATE POLICY "anon_insert_career_recommendations" ON career_recommendations FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_career_recommendations" ON career_recommendations;
CREATE POLICY "anon_update_career_recommendations" ON career_recommendations FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_career_recommendations" ON career_recommendations;
CREATE POLICY "anon_delete_career_recommendations" ON career_recommendations FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_career_roadmaps" ON career_roadmaps;
CREATE POLICY "anon_select_career_roadmaps" ON career_roadmaps FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_career_roadmaps" ON career_roadmaps;
CREATE POLICY "anon_insert_career_roadmaps" ON career_roadmaps FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_career_roadmaps" ON career_roadmaps;
CREATE POLICY "anon_update_career_roadmaps" ON career_roadmaps FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_career_roadmaps" ON career_roadmaps;
CREATE POLICY "anon_delete_career_roadmaps" ON career_roadmaps FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_roadmap_steps" ON roadmap_steps;
CREATE POLICY "anon_select_roadmap_steps" ON roadmap_steps FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_roadmap_steps" ON roadmap_steps;
CREATE POLICY "anon_insert_roadmap_steps" ON roadmap_steps FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_roadmap_steps" ON roadmap_steps;
CREATE POLICY "anon_update_roadmap_steps" ON roadmap_steps FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_roadmap_steps" ON roadmap_steps;
CREATE POLICY "anon_delete_roadmap_steps" ON roadmap_steps FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_achievements" ON achievements;
CREATE POLICY "anon_select_achievements" ON achievements FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_achievements" ON achievements;
CREATE POLICY "anon_insert_achievements" ON achievements FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_achievements" ON achievements;
CREATE POLICY "anon_update_achievements" ON achievements FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_achievements" ON achievements;
CREATE POLICY "anon_delete_achievements" ON achievements FOR DELETE TO anon, authenticated USING (true);
