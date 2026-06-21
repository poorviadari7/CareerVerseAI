import { Link } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  Sparkles,
  FileText,
  Gamepad2,
  Compass,
  Map,
  Trophy,
  ArrowRight,
  Award,
  ChevronRight,
  Flame,
  Brain,
  Rocket,
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';

const quickActions = [
  { icon: MessageCircle, title: 'AI Interview', desc: 'Chat with Astra', path: '/interview', color: 'bg-primary-50 text-primary-600' },
  { icon: Sparkles, title: 'Talent Detector', desc: 'Discover strengths', path: '/talent', color: 'bg-secondary-50 text-secondary-600' },
  { icon: FileText, title: 'Academic Analyzer', desc: 'Analyze grades', path: '/academic', color: 'bg-success-50 text-success-600' },
  { icon: Gamepad2, title: 'Career Quest', desc: 'Play & explore', path: '/quest', color: 'bg-warning-50 text-warning-600' },
  { icon: Compass, title: 'Recommendations', desc: 'Your matches', path: '/recommendations', color: 'bg-accent-50 text-accent-600' },
  { icon: Map, title: 'Roadmap', desc: 'Your plan', path: '/roadmap', color: 'bg-blue-50 text-blue-600' },
  { icon: Trophy, title: 'Growth Tracker', desc: 'Badges & points', path: '/growth', color: 'bg-amber-50 text-amber-600' },
];

interface TalentData {
  analytical_thinking: number;
  leadership: number;
  creativity: number;
  communication: number;
  teamwork: number;
  adaptability: number;
}

interface Achievement {
  badge_name: string;
  skill_points: number;
  earned_at: string;
}

interface Recommendation {
  career_title: string;
  suitability_score: number;
  rank: number;
}

interface CareerQuest {
  id: string;
  scenario_name: string;
  score: number;
  completed_at: string | null;
}

export default function Dashboard() {
  const student = useAppStore((s) => s.student);
  const [talent, setTalent] = useState<TalentData | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [quests, setQuests] = useState<CareerQuest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!student?.id) return;
    const load = async () => {
      setLoading(true);
      const [talentRes, achieveRes, recRes, questRes] = await Promise.all([
        supabase.from('talent_scores').select('*').eq('student_id', student.id).order('calculated_at', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('achievements').select('*').eq('student_id', student.id).order('earned_at', { ascending: false }).limit(5),
        supabase.from('career_recommendations').select('*').eq('student_id', student.id).order('rank', { ascending: true }).limit(3),
        supabase.from('career_quest_sessions').select('*').eq('student_id', student.id).order('started_at', { ascending: false }).limit(3),
      ]);
      if (talentRes.data) setTalent(talentRes.data);
      if (achieveRes.data) setAchievements(achieveRes.data);
      if (recRes.data) setRecommendations(recRes.data);
      if (questRes.data) setQuests(questRes.data);
      setLoading(false);
    };
    load();
  }, [student?.id]);

  const radarData = talent ? [
    { subject: 'Analytical', A: talent.analytical_thinking, fullMark: 100 },
    { subject: 'Leadership', A: talent.leadership, fullMark: 100 },
    { subject: 'Creativity', A: talent.creativity, fullMark: 100 },
    { subject: 'Communication', A: talent.communication, fullMark: 100 },
    { subject: 'Teamwork', A: talent.teamwork, fullMark: 100 },
    { subject: 'Adaptability', A: talent.adaptability, fullMark: 100 },
  ] : [];

  const totalPoints = achievements.reduce((s, a) => s + a.skill_points, 0);
  const totalQuests = quests.length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">
            Welcome back, {student?.name || 'Student'}!
          </h1>
          <p className="text-neutral-500 mt-1">Here's what's happening with your career journey.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-warning-50 text-warning-700 text-sm font-medium">
            <Flame className="w-4 h-4" />
            <span>{totalPoints} Points</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-50 text-primary-700 text-sm font-medium">
            <Award className="w-4 h-4" />
            <span>{achievements.length} Badges</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'AI Interviews', value: '1', icon: MessageCircle, color: 'text-primary-600', bg: 'bg-primary-50' },
          { label: 'Quests Played', value: String(totalQuests), icon: Gamepad2, color: 'text-warning-600', bg: 'bg-warning-50' },
          { label: 'Career Matches', value: String(recommendations.length), icon: Compass, color: 'text-accent-600', bg: 'bg-accent-50' },
          { label: 'Badges Earned', value: String(achievements.length), icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50' },
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

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-900">Talent Profile</h3>
            <Link to="/talent" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              View Details <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-neutral-400">Loading...</div>
          ) : talent ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Radar name="Skills" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center gap-3 text-neutral-400">
              <Brain className="w-12 h-12" />
              <p className="text-sm">Complete the AI Interview or Career Quest to see your talent profile</p>
              <Link to="/interview" className="text-sm text-primary-600 font-medium hover:underline">
                Start Interview
              </Link>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <h3 className="font-semibold text-neutral-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <Link
                key={action.path}
                to={action.path}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors group"
              >
                <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center shrink-0`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-neutral-900 group-hover:text-primary-700 transition-colors">{action.title}</p>
                  <p className="text-xs text-neutral-500">{action.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-900">Top Career Recommendations</h3>
            <Link to="/recommendations" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {recommendations.length > 0 ? (
            <div className="space-y-3">
              {recommendations.map((rec, i) => (
                <div key={rec.career_title} className="flex items-center gap-4 p-3 rounded-xl bg-neutral-50">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    i === 0 ? 'bg-primary-100 text-primary-700' :
                    i === 1 ? 'bg-secondary-100 text-secondary-700' :
                    'bg-accent-100 text-accent-700'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-neutral-900">{rec.career_title}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary-500"
                        style={{ width: `${rec.suitability_score}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-neutral-700">{rec.suitability_score}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-400">
              <Compass className="w-10 h-10 mx-auto mb-2" />
              <p className="text-sm">Complete the AI Interview to get career recommendations</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-900">Recent Achievements</h3>
            <Link to="/growth" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {achievements.length > 0 ? (
            <div className="space-y-3">
              {achievements.map((a) => (
                <div key={a.badge_name} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-neutral-900">{a.badge_name}</p>
                    <p className="text-xs text-neutral-500">+{a.skill_points} points</p>
                  </div>
                  <span className="text-xs text-neutral-400">
                    {new Date(a.earned_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-400">
              <Trophy className="w-10 h-10 mx-auto mb-2" />
              <p className="text-sm">Complete activities to earn badges and skill points</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Continue Your Journey</h3>
              <p className="text-white/80 text-sm">You have more to explore. Complete another activity to unlock new insights.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/interview" className="px-4 py-2 rounded-lg bg-white text-primary-700 text-sm font-semibold hover:bg-white/90 transition-colors">
              AI Interview
            </Link>
            <Link to="/quest" className="px-4 py-2 rounded-lg bg-white/20 text-white text-sm font-semibold hover:bg-white/30 transition-colors">
              Career Quest
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
