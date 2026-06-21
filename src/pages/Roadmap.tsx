import { useState, useEffect }  from 'react';
import { useParams } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Circle,
  BookOpen,
  Target,
  Award,
  Rocket,
  Zap,
  Plus,
  Trash2,
} from 'lucide-react';
import { CAREER_DATABASE } from '../lib/data';
import { Link } from 'react-router-dom';

interface RoadmapData {
  id: string;
  career_title: string;
  skills_to_learn: string[];
  educational_path: string;
  steps: { id: string; step_title: string; step_type: string; timeframe: string; completed: boolean }[];
}

const CAREER_ROADMAP_TEMPLATES: Record<string, { skills: string[]; path: string; shortTerm: string[]; longTerm: string[] }> = {
  'Data Scientist': {
    skills: ['Python', 'Statistics', 'Machine Learning', 'Data Visualization', 'SQL', 'R'],
    path: 'Bachelor in Mathematics/Statistics/CS, Masters in Data Science, Online certifications',
    shortTerm: ['Learn Python basics', 'Complete a statistics course', 'Build a Kaggle project', 'Learn SQL fundamentals'],
    longTerm: ['Earn a Data Science certification', 'Complete a Machine Learning specialization', 'Build a portfolio of 5 projects', 'Apply for internships'],
  },
  'Software Engineer': {
    skills: ['JavaScript', 'System Design', 'Problem Solving', 'Git', 'Testing', 'Cloud Basics'],
    path: 'Bachelor in Computer Science, Bootcamp, or self-taught with portfolio',
    shortTerm: ['Learn a programming language', 'Build a simple web app', 'Learn Git and GitHub', 'Practice coding problems'],
    longTerm: ['Contribute to open source', 'Build a complex full-stack project', 'Earn AWS certification', 'Apply for developer roles'],
  },
  'Cybersecurity Analyst': {
    skills: ['Network Security', 'Ethical Hacking', 'Risk Analysis', 'Incident Response', 'Linux', 'Python'],
    path: 'Bachelor in IT/CS, Security certifications (CompTIA, CEH, CISSP)',
    shortTerm: ['Learn Linux fundamentals', 'Study network basics', 'Complete a security course', 'Set up a home lab'],
    longTerm: ['Earn CompTIA Security+', 'Earn CEH certification', 'Complete a penetration testing course', 'Apply for security roles'],
  },
  'Product Manager': {
    skills: ['Strategy', 'User Research', 'Communication', 'Data Analysis', 'Agile', 'Stakeholder Management'],
    path: 'Bachelor in Business/Engineering, MBA optional, PM certifications',
    shortTerm: ['Learn Agile methodology', 'Read a product management book', 'Practice user research', 'Build a product spec'],
    longTerm: ['Earn a PM certification', 'Lead a product feature end-to-end', 'Build a product portfolio', 'Apply for PM roles'],
  },
  'UX Designer': {
    skills: ['Design Thinking', 'Prototyping', 'User Research', 'Visual Design', 'Figma', 'Accessibility'],
    path: 'Bachelor in Design/HCI, Bootcamp, or self-taught with strong portfolio',
    shortTerm: ['Learn Figma basics', 'Study design principles', 'Complete a UX course', 'Redesign a popular app'],
    longTerm: ['Build a UX portfolio', 'Earn a UX certification', 'Conduct a user research study', 'Apply for UX roles'],
  },
};

export default function Roadmap() {
  const student = useAppStore((s) => s.student);
  const { careerTitle } = useParams();
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCareer, setSelectedCareer] = useState(careerTitle || '');
  const [showCreate, setShowCreate] = useState(false);
  const [newStep, setNewStep] = useState({ title: '', type: 'short_term', timeframe: '' });

  const careers = CAREER_DATABASE.map((c) => c.title);

  useEffect(() => {
    if (!student?.id) return;
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('career_roadmaps')
        .select('*, roadmap_steps(*)')
        .eq('student_id', student.id)
        .order('generated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data) {
        setRoadmap(data);
        setSelectedCareer(data.career_title);
      } else {
        setShowCreate(true);
      }
      setLoading(false);
    };
    load();
  }, [student?.id]);

  const createRoadmap = async (career: string) => {
    if (!student?.id) return;
    setLoading(true);
    const template = CAREER_ROADMAP_TEMPLATES[career] || {
      skills: ['Research', 'Practice', 'Network', 'Build Portfolio'],
      path: 'Research educational requirements for this field',
      shortTerm: ['Research the field', 'Complete an introductory course', 'Connect with professionals', 'Build a basic project'],
      longTerm: ['Earn relevant certifications', 'Build a strong portfolio', 'Apply for internships', 'Secure a role in the field'],
    };

    const { data: roadmapData } = await supabase
      .from('career_roadmaps')
      .insert({
        student_id: student.id,
        career_title: career,
        skills_to_learn: template.skills,
        educational_path: template.path,
      })
      .select()
      .single();

    if (roadmapData) {
      const steps = [
        ...template.shortTerm.map((s) => ({
          roadmap_id: roadmapData.id,
          step_title: s,
          step_type: 'short_term',
          timeframe: '30-90 days',
        })),
        ...template.longTerm.map((s) => ({
          roadmap_id: roadmapData.id,
          step_title: s,
          step_type: 'long_term',
          timeframe: '1-2 years',
        })),
      ];
      await supabase.from('roadmap_steps').insert(steps);

      const { data: fullRoadmap } = await supabase
        .from('career_roadmaps')
        .select('*, roadmap_steps(*)')
        .eq('id', roadmapData.id)
        .single();
      if (fullRoadmap) {
        setRoadmap(fullRoadmap);
        setSelectedCareer(career);
        setShowCreate(false);
      }

      await supabase.from('achievements').insert({
        student_id: student.id,
        badge_name: 'Roadmap Ready',
        badge_description: 'Created a personalized career roadmap',
        skill_points: 150,
      });
    }
    setLoading(false);
  };

  const toggleStep = async (stepId: string, completed: boolean) => {
    await supabase.from('roadmap_steps').update({ completed: !completed }).eq('id', stepId);
    setRoadmap((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        steps: prev.steps.map((s) => (s.id === stepId ? { ...s, completed: !completed } : s)),
      };
    });
  };

  const addStep = async () => {
    if (!roadmap?.id || !newStep.title.trim()) return;
    const { data } = await supabase
      .from('roadmap_steps')
      .insert({
        roadmap_id: roadmap.id,
        step_title: newStep.title,
        step_type: newStep.type,
        timeframe: newStep.timeframe,
      })
      .select()
      .single();
    if (data) {
      setRoadmap((prev) => {
        if (!prev) return prev;
        return { ...prev, steps: [...prev.steps, data] };
      });
      setNewStep({ title: '', type: 'short_term', timeframe: '' });
    }
  };

  const deleteStep = async (stepId: string) => {
    await supabase.from('roadmap_steps').delete().eq('id', stepId);
    setRoadmap((prev) => {
      if (!prev) return prev;
      return { ...prev, steps: prev.steps.filter((s) => s.id !== stepId) };
    });
  };

  const completedSteps = roadmap?.steps.filter((s) => s.completed).length || 0;
  const totalSteps = roadmap?.steps.length || 0;
  const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full" />
      </div>
    );
  }

  if (showCreate || !roadmap) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">Career Roadmap</h1>
          <p className="text-neutral-500 mt-1">Create a step-by-step plan for your career goals</p>
        </div>
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <h3 className="font-semibold text-neutral-900 mb-4">Select a Career to Build Your Roadmap</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {careers.map((career) => (
              <button
                key={career}
                onClick={() => createRoadmap(career)}
                disabled={loading}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedCareer === career
                    ? 'border-primary-400 bg-primary-50'
                    : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-neutral-400" />
                  <span className="font-medium text-sm text-neutral-900">{career}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">Career Roadmap</h1>
          <p className="text-neutral-500 mt-1">Your personalized path to becoming a {roadmap.career_title}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-lg bg-primary-50 text-primary-700 text-sm font-medium">
            {completedSteps}/{totalSteps} Steps
          </div>
          <div className="px-3 py-2 rounded-lg bg-success-50 text-success-700 text-sm font-medium">
            {progress}% Complete
          </div>
        </div>
      </div>

      <div className="w-full h-3 bg-neutral-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full gradient-bg transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-neutral-900">Short-Term Goals (30-90 Days)</h3>
            </div>
            <div className="space-y-2">
              {roadmap.steps.filter((s) => s.step_type === 'short_term').map((step) => (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    step.completed ? 'bg-success-50 border-success-200' : 'bg-white border-neutral-200'
                  }`}
                >
                  <button
                    onClick={() => toggleStep(step.id, step.completed)}
                    className="shrink-0"
                  >
                    {step.completed ? (
                      <CheckCircle className="w-5 h-5 text-success-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-neutral-300" />
                    )}
                  </button>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${step.completed ? 'text-success-800 line-through' : 'text-neutral-900'}`}>
                      {step.step_title}
                    </p>
                    {step.timeframe && <p className="text-xs text-neutral-500">{step.timeframe}</p>}
                  </div>
                  <button
                    onClick={() => deleteStep(step.id)}
                    className="p-1 rounded-md hover:bg-neutral-100 text-neutral-400 hover:text-error-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {roadmap.steps.filter((s) => s.step_type === 'short_term').length === 0 && (
                <p className="text-sm text-neutral-500 italic py-4 text-center">No short-term goals yet. Add one below!</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Rocket className="w-5 h-5 text-secondary-600" />
              <h3 className="font-semibold text-neutral-900">Long-Term Goals (1-2 Years)</h3>
            </div>
            <div className="space-y-2">
              {roadmap.steps.filter((s) => s.step_type === 'long_term').map((step) => (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    step.completed ? 'bg-success-50 border-success-200' : 'bg-white border-neutral-200'
                  }`}
                >
                  <button
                    onClick={() => toggleStep(step.id, step.completed)}
                    className="shrink-0"
                  >
                    {step.completed ? (
                      <CheckCircle className="w-5 h-5 text-success-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-neutral-300" />
                    )}
                  </button>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${step.completed ? 'text-success-800 line-through' : 'text-neutral-900'}`}>
                      {step.step_title}
                    </p>
                    {step.timeframe && <p className="text-xs text-neutral-500">{step.timeframe}</p>}
                  </div>
                  <button
                    onClick={() => deleteStep(step.id)}
                    className="p-1 rounded-md hover:bg-neutral-100 text-neutral-400 hover:text-error-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {roadmap.steps.filter((s) => s.step_type === 'long_term').length === 0 && (
                <p className="text-sm text-neutral-500 italic py-4 text-center">No long-term goals yet. Add one below!</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">Add a New Step</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newStep.title}
                onChange={(e) => setNewStep((p) => ({ ...p, title: e.target.value }))}
                placeholder="What do you want to achieve?"
                className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
              />
              <select
                value={newStep.type}
                onChange={(e) => setNewStep((p) => ({ ...p, type: e.target.value }))}
                className="px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none bg-white"
              >
                <option value="short_term">Short-Term</option>
                <option value="long_term">Long-Term</option>
              </select>
              <input
                type="text"
                value={newStep.timeframe}
                onChange={(e) => setNewStep((p) => ({ ...p, timeframe: e.target.value }))}
                placeholder="Timeframe"
                className="px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none w-32"
              />
              <button
                onClick={addStep}
                disabled={!newStep.title.trim()}
                className="px-4 py-2.5 rounded-xl gradient-bg text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-neutral-900">Skills to Learn</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {roadmap.skills_to_learn?.map((skill) => (
                <span key={skill} className="px-3 py-1.5 rounded-full bg-primary-50 text-primary-700 text-sm font-medium border border-primary-100">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-secondary-600" />
              <h3 className="font-semibold text-neutral-900">Educational Path</h3>
            </div>
            <p className="text-sm text-neutral-700 leading-relaxed">{roadmap.educational_path}</p>
          </div>

          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5" />
              <h3 className="font-semibold">Keep Going!</h3>
            </div>
            <p className="text-white/80 text-sm leading-relaxed mb-4">
              You are {progress}% through your roadmap. Every step brings you closer to your goal of becoming a {roadmap.career_title}.
            </p>
            <Link to="/growth" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-primary-700 text-sm font-semibold hover:bg-white/90 transition-colors">
              <Award className="w-4 h-4" />
              View Growth Tracker
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
