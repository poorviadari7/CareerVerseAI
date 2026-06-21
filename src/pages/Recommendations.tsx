import { useState, useEffect } from 'react';
import { useAppStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Zap,
  Map,
  Lightbulb,
  ChevronRight,
  Rocket,
  Sparkles,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Recommendation {
  id: string;
  career_title: string;
  suitability_score: number;
  explanation: string;
  required_skills: string[];
  future_demand: string;
  growth_opportunities: string;
  rank: number;
}

export default function Recommendations() {
  const student = useAppStore((s) => s.student);
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Recommendation | null>(null);

  useEffect(() => {
    if (!student?.id) return;
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('career_recommendations')
        .select('*')
        .eq('student_id', student.id)
        .order('rank', { ascending: true });
      if (data) {
        setRecs(data);
        if (data.length > 0) setSelected(data[0]);
      }
      setLoading(false);
    };
    load();
  }, [student?.id]);

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-primary-500 text-white';
    if (rank === 2) return 'bg-secondary-500 text-white';
    return 'bg-accent-500 text-white';
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return 'bg-primary-50 border-primary-200';
    if (rank === 2) return 'bg-secondary-50 border-secondary-200';
    return 'bg-accent-50 border-accent-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full" />
      </div>
    );
  }

  if (recs.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-neutral-400" />
        </div>
        <h2 className="font-display text-2xl font-bold text-neutral-900 mb-3">No Recommendations Yet</h2>
        <p className="text-neutral-600 mb-8 max-w-md mx-auto">
          Complete the AI Interview or Career Quest to generate your personalized career recommendations.
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
        <h1 className="font-display text-2xl font-bold text-neutral-900">Career Recommendations</h1>
        <p className="text-neutral-500 mt-1">AI-powered career matches based on your profile</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3">
          {recs.map((rec) => (
            <button
              key={rec.id}
              onClick={() => setSelected(rec)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selected?.id === rec.id
                  ? 'border-primary-300 bg-primary-50 shadow-sm'
                  : 'border-neutral-200 bg-white hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRankColor(rec.rank)}`}>
                  {rec.rank}
                </div>
                <div className="flex-1">
                  <p className={`font-semibold text-sm ${selected?.id === rec.id ? 'text-primary-900' : 'text-neutral-900'}`}>
                    {rec.career_title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-16 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${rec.rank === 1 ? 'bg-primary-500' : rec.rank === 2 ? 'bg-secondary-500' : 'bg-accent-500'}`}
                        style={{ width: `${rec.suitability_score}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-neutral-600">{rec.suitability_score}%</span>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 ${selected?.id === rec.id ? 'text-primary-500' : 'text-neutral-300'}`} />
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selected && (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-2xl border border-neutral-200 p-6 lg:p-8"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${getRankBg(selected.rank)}`}>
                    <Briefcase className={`w-7 h-7 ${selected.rank === 1 ? 'text-primary-600' : selected.rank === 2 ? 'text-secondary-600' : 'text-accent-600'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="font-display text-2xl font-bold text-neutral-900">{selected.career_title}</h2>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getRankColor(selected.rank)}`}>
                        #{selected.rank} Match
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-neutral-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${selected.rank === 1 ? 'bg-primary-500' : selected.rank === 2 ? 'bg-secondary-500' : 'bg-accent-500'}`}
                          style={{ width: `${selected.suitability_score}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-neutral-700">{selected.suitability_score}% Suitability</span>
                    </div>
                  </div>
                </div>

                <p className="text-neutral-700 mb-6 leading-relaxed">{selected.explanation}</p>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-primary-50 border border-primary-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-primary-600" />
                      <h4 className="font-semibold text-sm text-primary-900">Required Skills</h4>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.required_skills?.map((skill) => (
                        <span key={skill} className="px-2 py-1 rounded-md bg-white text-primary-700 text-xs font-medium border border-primary-100">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary-50 border border-secondary-100">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-secondary-600" />
                      <h4 className="font-semibold text-sm text-secondary-900">Future Demand</h4>
                    </div>
                    <p className="text-sm text-secondary-800">{selected.future_demand}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-accent-50 border border-accent-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Rocket className="w-4 h-4 text-accent-600" />
                      <h4 className="font-semibold text-sm text-accent-900">Growth Opportunities</h4>
                    </div>
                    <p className="text-sm text-accent-800">{selected.growth_opportunities}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-warning-50 border border-warning-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-warning-600" />
                      <h4 className="font-semibold text-sm text-warning-900">Why This Suits You</h4>
                    </div>
                    <p className="text-sm text-warning-800">
                      Your profile shows strong alignment with this career based on your interview responses and talent analysis.
                    </p>
                  </div>
                </div>

                <Link
                  to={`/roadmap/${encodeURIComponent(selected.career_title)}`}
                  className="w-full py-3 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Map className="w-5 h-5" />
                  Create Career Roadmap
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
