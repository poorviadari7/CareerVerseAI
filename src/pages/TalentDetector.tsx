import { useState, useEffect } from 'react';
import { useAppStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import {
  Brain,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Equal,
  Zap,
  Target,
  Lightbulb,
  Users,
  MessageCircle,
  Palette,
  Shield,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface TalentData {
  analytical_thinking: number;
  leadership: number;
  creativity: number;
  communication: number;
  teamwork: number;
  adaptability: number;
  calculated_at: string;
}

const traitInfo: Record<string, { icon: any; color: string; label: string; description: string }> = {
  analytical_thinking: {
    icon: Brain,
    color: '#3b82f6',
    label: 'Analytical Thinking',
    description: 'Ability to solve logical and technical problems.',
  },
  leadership: {
    icon: Target,
    color: '#d946ef',
    label: 'Leadership',
    description: 'Ability to organize, motivate, and guide others.',
  },
  creativity: {
    icon: Palette,
    color: '#f59e0b',
    label: 'Creativity',
    description: 'Ability to generate innovative ideas and solutions.',
  },
  communication: {
    icon: MessageCircle,
    color: '#14b8a6',
    label: 'Communication',
    description: 'Ability to express thoughts effectively.',
  },
  teamwork: {
    icon: Users,
    color: '#8b5cf6',
    label: 'Teamwork',
    description: 'Ability to collaborate with others.',
  },
  adaptability: {
    icon: RefreshCw,
    color: '#ef4444',
    label: 'Adaptability',
    description: 'Ability to learn and adjust to new situations.',
  },
};

export default function TalentDetector() {
  const student = useAppStore((s) => s.student);
  const [talent, setTalent] = useState<TalentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<TalentData[]>([]);

  useEffect(() => {
    if (!student?.id) return;
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('talent_scores')
        .select('*')
        .eq('student_id', student.id)
        .order('calculated_at', { ascending: false });
      if (data && data.length > 0) {
        setTalent(data[0]);
        setHistory(data.slice(0, 5));
      }
      setLoading(false);
    };
    load();
  }, [student?.id]);

  const radarData = talent
    ? Object.entries(traitInfo).map(([key, info]) => ({
        subject: info.label,
        A: (talent as any)[key] || 0,
        fullMark: 100,
      }))
    : [];

  const barData = talent
    ? Object.entries(traitInfo).map(([key, info]) => ({
        name: info.label,
        value: (talent as any)[key] || 0,
        color: info.color,
      }))
    : [];

  const getStrength = (score: number) => {
    if (score >= 70) return 'strong';
    if (score >= 40) return 'moderate';
    return 'developing';
  };

  const getStrengthLabel = (score: number) => {
    if (score >= 70) return 'Strong';
    if (score >= 40) return 'Moderate';
    return 'Developing';
  };

  const getStrengthIcon = (score: number) => {
    if (score >= 70) return <TrendingUp className="w-4 h-4" />;
    if (score >= 40) return <Equal className="w-4 h-4" />;
    return <TrendingDown className="w-4 h-4" />;
  };

  const getStrengthColor = (score: number) => {
    if (score >= 70) return 'text-success-600 bg-success-50';
    if (score >= 40) return 'text-warning-600 bg-warning-50';
    return 'text-error-600 bg-error-50';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full" />
      </div>
    );
  }

  if (!talent) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-neutral-400" />
        </div>
        <h2 className="font-display text-2xl font-bold text-neutral-900 mb-3">No Talent Data Yet</h2>
        <p className="text-neutral-600 mb-8 max-w-md mx-auto">
          Complete the AI Interview or Career Quest to generate your talent profile.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/interview" className="px-6 py-3 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            Start AI Interview
          </Link>
          <Link to="/quest" className="px-6 py-3 rounded-xl bg-white border border-neutral-200 text-neutral-700 font-semibold hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2">
            <Zap className="w-5 h-5" />
            Play Career Quest
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-neutral-900">Hidden Talent Detector</h1>
        <p className="text-neutral-500 mt-1">Your personalized skill profile based on AI analysis</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <h3 className="font-semibold text-neutral-900 mb-4">Skill Radar</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Radar name="Skills" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <h3 className="font-semibold text-neutral-900 mb-4">Skill Breakdown</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(traitInfo).map(([key, info]) => {
          const score = (talent as any)[key] || 0;
          const Icon = info.icon;
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-neutral-200 p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${info.color}15` }}>
                  <Icon className="w-5 h-5" style={{ color: info.color }} />
                </div>
                <div>
                  <p className="font-semibold text-sm text-neutral-900">{info.label}</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStrengthColor(score)}`}>
                    {getStrengthIcon(score)}
                    {getStrengthLabel(score)}
                  </span>
                </div>
              </div>
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden mb-2">
                <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, backgroundColor: info.color }} />
              </div>
              <p className="text-xs text-neutral-500">{info.description}</p>
              <p className="text-xs text-neutral-400 mt-1">Score: {score}/100</p>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-warning-500" />
          <h3 className="font-semibold text-neutral-900">Your Strengths & Growth Areas</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-success-700 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Strong Areas
            </h4>
            <div className="space-y-2">
              {Object.entries(traitInfo)
                .filter(([key]) => (talent as any)[key] >= 70)
                .map(([key, info]) => (
                  <div key={key} className="flex items-center gap-2 p-2 rounded-lg bg-success-50 text-sm text-success-800">
                    <info.icon className="w-4 h-4" />
                    {info.label}
                  </div>
                ))}
              {Object.entries(traitInfo).filter(([key]) => (talent as any)[key] >= 70).length === 0 && (
                <p className="text-sm text-neutral-500 italic">No strong areas detected yet. Complete more activities!</p>
              )}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-primary-700 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Areas to Develop
            </h4>
            <div className="space-y-2">
              {Object.entries(traitInfo)
                .filter(([key]) => (talent as any)[key] < 50)
                .map(([key, info]) => (
                  <div key={key} className="flex items-center gap-2 p-2 rounded-lg bg-primary-50 text-sm text-primary-800">
                    <info.icon className="w-4 h-4" />
                    {info.label}
                  </div>
                ))}
              {Object.entries(traitInfo).filter(([key]) => (talent as any)[key] < 50).length === 0 && (
                <p className="text-sm text-neutral-500 italic">Great job! All your skills are well-developed.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
