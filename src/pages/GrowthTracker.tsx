import { useState, useEffect } from 'react';
import { useAppStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import {
  Trophy,
  Award,
  Zap,
  TrendingUp,
  Flame,
  Target,
  Sparkles,
  AlertCircle,
  Crown,
  Brain,
  Users,
  MessageCircle,
  Palette,
  RefreshCw,
  Gamepad2,
  FileText,
  Map,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Achievement {
  id: string;
  badge_name: string;
  badge_description: string;
  skill_points: number;
  earned_at: string;
}

interface TalentData {
  analytical_thinking: number;
  leadership: number;
  creativity: number;
  communication: number;
  teamwork: number;
  adaptability: number;
}

const BADGE_ICONS: Record<string, any> = {
  'Communication Explorer': MessageCircle,
  'Problem Solver': Brain,
  'Creative Thinker': Palette,
  'Future Leader': Crown,
  'Team Player': Users,
  'Adaptable Ace': RefreshCw,
  'Career Quest Champion': Gamepad2,
  'Interview Star': Sparkles,
  'Academic Analyzer': FileText,
  'Roadmap Ready': Map,
};

const BADGE_COLORS: Record<string, string> = {
  'Communication Explorer': 'bg-teal-100 text-teal-700',
  'Problem Solver': 'bg-blue-100 text-blue-700',
  'Creative Thinker': 'bg-amber-100 text-amber-700',
  'Future Leader': 'bg-purple-100 text-purple-700',
  'Team Player': 'bg-indigo-100 text-indigo-700',
  'Adaptable Ace': 'bg-rose-100 text-rose-700',
  'Career Quest Champion': 'bg-orange-100 text-orange-700',
  'Interview Star': 'bg-primary-100 text-primary-700',
  'Academic Analyzer': 'bg-success-100 text-success-700',
  'Roadmap Ready': 'bg-secondary-100 text-secondary-700',
};

export default function GrowthTracker() {
  const student = useAppStore((s) => s.student);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [talent, setTalent] = useState<TalentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!student?.id) return;
    const load = async () => {
      setLoading(true);
      const [achieveRes, talentRes] = await Promise.all([
        supabase.from('achievements').select('*').eq('student_id', student.id).order('earned_at', { ascending: false }),
        supabase.from('talent_scores').select('*').eq('student_id', student.id).order('calculated_at', { ascending: false }).limit(1).maybeSingle(),
      ]);
      if (achieveRes.data) setAchievements(achieveRes.data);
      if (talentRes.data) setTalent(talentRes.data);
      setLoading(false);
    };
    load();
  }, [student?.id]);

  const totalPoints = achievements.reduce((s, a) => s + a.skill_points, 0);
  const level = Math.floor(totalPoints / 200) + 1;
  const pointsToNext = 200 - (totalPoints % 200);
  const progress = ((totalPoints % 200) / 200) * 100;

  const skillDimensions = talent ? [
    { name: 'Analytical Thinking', score: talent.analytical_thinking, color: 'bg-blue-500', icon: Brain },
    { name: 'Leadership', score: talent.leadership, color: 'bg-purple-500', icon: Crown },
    { name: 'Creativity', score: talent.creativity, color: 'bg-amber-500', icon: Palette },
    { name: 'Communication', score: talent.communication, color: 'bg-teal-500', icon: MessageCircle },
    { name: 'Teamwork', score: talent.teamwork, color: 'bg-indigo-500', icon: Users },
    { name: 'Adaptability', score: talent.adaptability, color: 'bg-rose-500', icon: RefreshCw },
  ] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-neutral-900">Growth Tracker</h1>
        <p className="text-neutral-500 mt-1">Track your progress, badges, and skill development</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Points', value: totalPoints, icon: Zap, color: 'text-warning-600', bg: 'bg-warning-50' },
          { label: 'Level', value: level, icon: Trophy, color: 'text-primary-600', bg: 'bg-primary-50' },
          { label: 'Badges', value: achievements.length, icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Points to Next', value: pointsToNext, icon: Target, color: 'text-secondary-600', bg: 'bg-secondary-50' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl p-4 border border-neutral-200"
          >
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
            <p className="text-xs text-neutral-500 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900">Level Progress</h3>
          <span className="text-sm font-bold text-primary-700">Level {level}</span>
        </div>
        <div className="w-full h-4 bg-neutral-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full gradient-bg transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-sm text-neutral-500 mt-2">
          {pointsToNext} points to reach Level {level + 1}
        </p>
      </div>

      {talent && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-neutral-900">Skill Dimensions</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillDimensions.map((skill) => {
              const Icon = skill.icon;
              return (
                <div key={skill.name} className="p-4 rounded-xl border border-neutral-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-8 h-8 rounded-lg ${skill.color} bg-opacity-10 flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${skill.color.replace('bg-', 'text-')}`} />
                    </div>
                    <span className="font-medium text-sm text-neutral-900">{skill.name}</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden mb-1">
                    <div className={`h-full rounded-full ${skill.color}`} style={{ width: `${skill.score}%` }} />
                  </div>
                  <p className="text-xs text-neutral-500">{skill.score}/100</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Award className="w-5 h-5 text-amber-600" />
          <h3 className="font-semibold text-neutral-900">Achievements & Badges</h3>
        </div>
        {achievements.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((a, i) => {
              const Icon = BADGE_ICONS[a.badge_name] || Award;
              const colorClass = BADGE_COLORS[a.badge_name] || 'bg-neutral-100 text-neutral-700';
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 p-4 rounded-xl border border-neutral-200 hover:border-neutral-300 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-neutral-900">{a.badge_name}</p>
                    <p className="text-xs text-neutral-500">{a.badge_description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Zap className="w-3 h-3 text-warning-500" />
                      <span className="text-xs text-neutral-600 font-medium">+{a.skill_points} points</span>
                    </div>
                  </div>
                  <span className="text-xs text-neutral-400 shrink-0">
                    {new Date(a.earned_at).toLocaleDateString()}
                  </span>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-neutral-400" />
            </div>
            <p className="text-neutral-600 mb-6">No achievements yet. Complete activities to earn badges!</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link to="/interview" className="px-4 py-2 rounded-lg bg-primary-50 text-primary-700 text-sm font-medium hover:bg-primary-100 transition-colors">
                AI Interview
              </Link>
              <Link to="/quest" className="px-4 py-2 rounded-lg bg-warning-50 text-warning-700 text-sm font-medium hover:bg-warning-100 transition-colors">
                Career Quest
              </Link>
              <Link to="/academic" className="px-4 py-2 rounded-lg bg-success-50 text-success-700 text-sm font-medium hover:bg-success-100 transition-colors">
                Academic Analyzer
              </Link>
              <Link to="/roadmap" className="px-4 py-2 rounded-lg bg-secondary-50 text-secondary-700 text-sm font-medium hover:bg-secondary-100 transition-colors">
                Roadmap
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
