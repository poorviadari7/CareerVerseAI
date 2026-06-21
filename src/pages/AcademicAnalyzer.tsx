import { useState } from 'react';
import { useAppStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Brain,
  CheckCircle,
  Calculator,
  BookOpen,
  FlaskConical,
  Globe,
  Palette,
  Code,
  Music,
  Dumbbell,
  History,
  Award,
} from 'lucide-react';

interface SubjectEntry {
  name: string;
  score: number;
  maxScore: number;
}

const SUBJECT_ICONS: Record<string, any> = {
  'Mathematics': Calculator,
  'Science': FlaskConical,
  'English': BookOpen,
  'History': History,
  'Geography': Globe,
  'Computer Science': Code,
  'Art': Palette,
  'Music': Music,
  'Physical Education': Dumbbell,
};

const DEFAULT_SUBJECTS = [
  'Mathematics',
  'Science',
  'English',
  'History',
  'Geography',
  'Computer Science',
  'Art',
  'Music',
  'Physical Education',
];

function analyzeAcademicPerformance(subjects: SubjectEntry[]) {
  const total = subjects.reduce((sum, s) => sum + (s.score / s.maxScore) * 100, 0);
  const avg = Math.round(total / subjects.length);

  const strengths = subjects.filter((s) => (s.score / s.maxScore) * 100 >= 80);
  const weaknesses = subjects.filter((s) => (s.score / s.maxScore) * 100 < 60);
  const moderate = subjects.filter((s) => {
    const pct = (s.score / s.maxScore) * 100;
    return pct >= 60 && pct < 80;
  });

  const subjectMap: Record<string, string[]> = {
    'Mathematics': ['Data Scientist', 'Software Engineer', 'Actuary', 'Engineer'],
    'Science': ['Research Scientist', 'Doctor', 'Environmental Scientist', 'Pharmacist'],
    'English': ['Writer', 'Journalist', 'Teacher', 'Marketing Strategist'],
    'History': ['Historian', 'Archaeologist', 'Museum Curator', 'Lawyer'],
    'Geography': ['Urban Planner', 'Cartographer', 'Environmental Consultant', 'Geologist'],
    'Computer Science': ['Software Engineer', 'Cybersecurity Analyst', 'AI Engineer', 'Web Developer'],
    'Art': ['UX Designer', 'Graphic Designer', 'Animator', 'Art Director'],
    'Music': ['Musician', 'Music Producer', 'Sound Engineer', 'Music Therapist'],
    'Physical Education': ['Sports Coach', 'Physical Therapist', 'Fitness Trainer', 'Sports Manager'],
  };

  const careerSuggestions: string[] = [];
  strengths.forEach((s) => {
    const careers = subjectMap[s.name] || [];
    careers.forEach((c) => { if (!careerSuggestions.includes(c)) careerSuggestions.push(c); });
  });
  if (careerSuggestions.length === 0 && moderate.length > 0) {
    moderate.forEach((s) => {
      const careers = subjectMap[s.name] || [];
      careers.forEach((c) => { if (!careerSuggestions.includes(c)) careerSuggestions.push(c); });
    });
  }

  return { avg, strengths, weaknesses, moderate, careerSuggestions: careerSuggestions.slice(0, 5) };
}

export default function AcademicAnalyzer() {
  const student = useAppStore((s) => s.student);
  const [subjects, setSubjects] = useState<SubjectEntry[]>(
    DEFAULT_SUBJECTS.map((name) => ({ name, score: 0, maxScore: 100 }))
  );
  const [result, setResult] = useState<ReturnType<typeof analyzeAcademicPerformance> | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateScore = (index: number, field: 'score' | 'maxScore', value: number) => {
    setSubjects((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: Math.max(0, Math.min(value, field === 'maxScore' ? 200 : 200)) };
      return next;
    });
  };

  const handleAnalyze = async () => {
    const validSubjects = subjects.filter((s) => s.maxScore > 0 && s.score >= 0);
    if (validSubjects.length === 0) return;
    setLoading(true);
    const analysis = analyzeAcademicPerformance(validSubjects);
    setResult(analysis);
    setSaved(false);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!student?.id || !result) return;
    setLoading(true);
    const subjectsJson = subjects.reduce((acc, s) => {
      acc[s.name] = { score: s.score, maxScore: s.maxScore, percentage: Math.round((s.score / s.maxScore) * 100) };
      return acc;
    }, {} as Record<string, unknown>);
    await supabase.from('academic_records').insert({
      student_id: student.id,
      record_name: 'Academic Analysis',
      subjects: subjectsJson,
      overall_score: result.avg,
    });
    await supabase.from('achievements').insert({
      student_id: student.id,
      badge_name: 'Academic Analyzer',
      badge_description: 'Analyzed academic performance',
      skill_points: 75,
    });
    setSaved(true);
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-neutral-900">Academic Report Analyzer</h1>
        <p className="text-neutral-500 mt-1">Enter your grades to get career insights</p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-neutral-900">Enter Your Subject Scores</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject, i) => {
            const Icon = SUBJECT_ICONS[subject.name] || BookOpen;
            return (
              <div key={subject.name} className="p-4 rounded-xl border border-neutral-200 bg-neutral-50">
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-4 h-4 text-neutral-500" />
                  <span className="font-medium text-sm text-neutral-900">{subject.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-xs text-neutral-500">Score</label>
                    <input
                      type="number"
                      value={subject.score || ''}
                      onChange={(e) => updateScore(i, 'score', Number(e.target.value))}
                      className="w-full mt-1 px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
                      placeholder="0"
                    />
                  </div>
                  <div className="text-neutral-400 text-sm">/</div>
                  <div className="w-20">
                    <label className="text-xs text-neutral-500">Max</label>
                    <input
                      type="number"
                      value={subject.maxScore || ''}
                      onChange={(e) => updateScore(i, 'maxScore', Number(e.target.value))}
                      className="w-full mt-1 px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
                      placeholder="100"
                    />
                  </div>
                </div>
                {subject.maxScore > 0 && (
                  <div className="mt-2">
                    <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary-500"
                        style={{ width: `${Math.min((subject.score / subject.maxScore) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      {Math.round((subject.score / subject.maxScore) * 100)}%
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="px-6 py-3 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            {loading ? 'Analyzing...' : 'Analyze Performance'}
          </button>
          {saved && (
            <span className="flex items-center gap-1 text-sm text-success-600">
              <CheckCircle className="w-4 h-4" />
              Saved to database
            </span>
          )}
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Brain className="w-5 h-5 text-secondary-600" />
                <h3 className="font-semibold text-neutral-900">Analysis Results</h3>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-primary-50 text-center">
                  <p className="text-3xl font-bold text-primary-700">{result.avg}%</p>
                  <p className="text-sm text-primary-600 mt-1">Overall Average</p>
                </div>
                <div className="p-4 rounded-xl bg-success-50 text-center">
                  <p className="text-3xl font-bold text-success-700">{result.strengths.length}</p>
                  <p className="text-sm text-success-600 mt-1">Strong Subjects</p>
                </div>
                <div className="p-4 rounded-xl bg-error-50 text-center">
                  <p className="text-3xl font-bold text-error-700">{result.weaknesses.length}</p>
                  <p className="text-sm text-error-600 mt-1">Areas to Improve</p>
                </div>
              </div>

              {result.strengths.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-success-700 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Your Strengths
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.strengths.map((s) => (
                      <span key={s.name} className="px-3 py-1.5 rounded-full bg-success-100 text-success-700 text-sm font-medium">
                        {s.name} ({Math.round((s.score / s.maxScore) * 100)}%)
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.weaknesses.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-error-700 mb-3 flex items-center gap-2">
                    <TrendingDown className="w-4 h-4" />
                    Areas to Improve
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.weaknesses.map((s) => (
                      <span key={s.name} className="px-3 py-1.5 rounded-full bg-error-100 text-error-700 text-sm font-medium">
                        {s.name} ({Math.round((s.score / s.maxScore) * 100)}%)
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-primary-700 mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Suggested Career Paths
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.careerSuggestions.map((career) => (
                    <span key={career} className="px-3 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
                      {career}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={loading || saved}
                className="px-6 py-3 rounded-xl bg-success-600 text-white font-semibold hover:bg-success-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                {saved ? 'Saved!' : 'Save to My Profile'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
