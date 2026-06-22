import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import { INTERVIEW_QUESTIONS, CAREER_DATABASE } from '../lib/data';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  CheckCircle,
  Brain,
  MessageCircle,
  ChevronRight,
  User,
  Loader,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'astra';
  text: string;
  options?: { text: string; trait: string; value: string }[];
}

export default function Interview() {
  const student = useAppStore((s) => s.student);
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [traitScores, setTraitScores] = useState<Record<string, number>>({
    analytical_thinking: 0,
    leadership: 0,
    creativity: 0,
    communication: 0,
    teamwork: 0,
    adaptability: 0,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!student?.id) return;
    startInterview();
  }, [student?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startInterview = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('interview_sessions')
      .insert({ student_id: student!.id, status: 'in_progress' })
      .select()
      .single();
    if (data) {
      setSessionId(data.id);
      const firstQ = INTERVIEW_QUESTIONS[0];
      setMessages([
        {
          id: 'welcome',
          role: 'astra',
          text: `Hi ${student!.name}! I'm Astra, your AI career mentor. I'm excited to learn about you and help you discover your perfect career path. Let's start with a few questions!`,
        },
        {
          id: firstQ.id,
          role: 'astra',
          text: firstQ.text,
          options: firstQ.options,
        },
      ]);
    }
    setLoading(false);
  };

  const handleAnswer = async (option: { text: string; trait: string; value: string }) => {
    if (!sessionId || loading) return;
    setLoading(true);

    const question = INTERVIEW_QUESTIONS[currentQuestion];
    setMessages((prev) => [
      ...prev,
      { id: `answer-${currentQuestion}`, role: 'user', text: option.text },
    ]);

    await supabase.from('interview_responses').insert({
      session_id: sessionId,
      question: question.text,
      answer: option.text,
    });

    setTraitScores((prev) => ({
      ...prev,
      [option.trait]: (prev[option.trait] || 0) + 1,
    }));

    const nextIndex = currentQuestion + 1;
    if (nextIndex < INTERVIEW_QUESTIONS.length) {
      setTimeout(() => {
        const nextQ = INTERVIEW_QUESTIONS[nextIndex];
        setMessages((prev) => [
          ...prev,
          {
            id: nextQ.id,
            role: 'astra',
            text: nextQ.text,
            options: nextQ.options,
          },
        ]);
        setCurrentQuestion(nextIndex);
        setLoading(false);
      }, 600);
    } else {
      setTimeout(() => {
        finishInterview();
      }, 600);
    }
  };

  const finishInterview = async () => {
    if (!sessionId) return;

    const total = Object.values(traitScores).reduce((a, b) => a + b, 0);
    const normalized: Record<string, number> = {};
    Object.keys(traitScores).forEach((k) => {
      normalized[k] = Math.round((traitScores[k] / total) * 100);
    });

    await supabase.from('interview_sessions').update({
      completed_at: new Date().toISOString(),
      status: 'completed',
      overall_summary: generateSummary(normalized),
    }).eq('id', sessionId);

    await supabase.from('talent_scores').insert({
      student_id: student!.id,
      ...normalized,
    });

    await supabase.from('achievements').insert({
      student_id: student!.id,
      badge_name: 'Interview Star',
      badge_description: 'Completed the AI Interview with Astra',
      skill_points: 100,
    });

    const recs = generateRecommendations(normalized);
    for (const rec of recs) {
      await supabase.from('career_recommendations').insert({
        student_id: student!.id,
        ...rec,
      });
    }

    setCompleted(true);
    setLoading(false);
  };

  const generateSummary = (scores: Record<string, number>) => {
    const top = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    const topTrait = top[0].replace('_', ' ');
    return `Student showed strong ${topTrait} with balanced development across other dimensions.`;
  };

  const generateRecommendations = (scores: Record<string, number>) => {
    const careers = CAREER_DATABASE.map((c) => {
      const matchScore = c.traits.reduce((sum, t) => sum + (scores[t] || 0), 0) / c.traits.length;
      return { ...c, matchScore: Math.round(matchScore) };
    });
    careers.sort((a, b) => b.matchScore - a.matchScore);
    return careers.slice(0, 3).map((c, i) => ({
      career_title: c.title,
      suitability_score: Math.min(c.matchScore, 98),
      explanation: c.description,
      required_skills: c.skills,
      future_demand: c.demand,
      growth_opportunities: c.growth,
      rank: i + 1,
    }));
  };

  if (!student?.id) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">AI Career Interview</h1>
          <p className="text-neutral-500 mt-1">Chat with Astra to discover your career path</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-neutral-900">Astra</p>
            <p className="text-xs text-neutral-500">AI Mentor</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        {completed ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-success-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-success-600" />
            </div>
            <h2 className="font-display text-2xl font-bold text-neutral-900 mb-3">
              Interview Complete!
            </h2>
            <p className="text-neutral-600 mb-6 max-w-md mx-auto leading-relaxed">
              Great job, {student.name}! Astra has analyzed your responses and generated your personalized career recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/recommendations')}
                className="px-6 py-3 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                View Recommendations
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/talent')}
                className="px-6 py-3 rounded-xl bg-white border border-neutral-200 text-neutral-700 font-semibold hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2"
              >
                See Talent Profile
                <Brain className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Question {currentQuestion + 1} of {INTERVIEW_QUESTIONS.length}
                </span>
              </div>
              <div className="w-24 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${((currentQuestion + 1) / INTERVIEW_QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>
            <div className="h-[400px] overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'astra' ? 'gradient-bg' : 'bg-neutral-200'
                  }`}>
                    {msg.role === 'astra' ? (
                      <Sparkles className="w-4 h-4 text-white" />
                    ) : (
                      <User className="w-4 h-4 text-neutral-600" />
                    )}
                  </div>
                  <div className={`max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block rounded-2xl px-4 py-3 text-sm ${
                      msg.role === 'astra'
                        ? 'bg-primary-50 text-neutral-800 rounded-tl-sm'
                        : 'bg-neutral-100 text-neutral-800 rounded-tr-sm'
                    }`}>
                      {msg.text}
                    </div>
                    {msg.options && (
                      <div className="mt-3 space-y-2">
                        {msg.options.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => handleAnswer(opt)}
                            disabled={loading}
                            className="w-full text-left p-3 rounded-xl bg-white border border-neutral-200 hover:border-primary-400 hover:bg-primary-50 transition-all text-sm text-neutral-700 disabled:opacity-50"
                          >
                            <div className="flex items-center justify-between">
                              <span>{opt.text}</span>
                              <ChevronRight className="w-4 h-4 text-neutral-300" />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-primary-50 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader className="w-4 h-4 animate-spin text-primary-500" />
                      <span className="text-sm text-neutral-500">Astra is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
