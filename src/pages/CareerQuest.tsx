import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import { QUEST_SCENARIOS } from '../lib/data';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gamepad2,
  ArrowRight,
  Trophy,
  Target,
  Zap,
  Brain,
  RotateCcw,
  ChevronRight,
} from 'lucide-react';

interface QuestState {
  scenarioIndex: number;
  questionIndex: number;
  answers: { question: string; choice: string; trait: string }[];
  sessionId: string | null;
}

export default function CareerQuest() {
  const student = useAppStore((s) => s.student);
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'select' | 'playing' | 'complete'>('select');
  const [quest, setQuest] = useState<QuestState>({
    scenarioIndex: 0,
    questionIndex: 0,
    answers: [],
    sessionId: null,
  });
  const [traitScores, setTraitScores] = useState<Record<string, number>>({
    analytical_thinking: 0,
    leadership: 0,
    creativity: 0,
    communication: 0,
    teamwork: 0,
    adaptability: 0,
  });
  const selectScenario = async (index: number) => {
    if (!student?.id) return;
    const { data } = await supabase
      .from('career_quest_sessions')
      .insert({
        student_id: student.id,
        scenario_name: QUEST_SCENARIOS[index].title,
      })
      .select()
      .single();
    if (data) {
      setQuest({
        scenarioIndex: index,
        questionIndex: 0,
        answers: [],
        sessionId: data.id,
      });
      setPhase('playing');
    }
  };

  const handleChoice = async (choice: { text: string; trait: string }) => {
    if (!quest.sessionId) return;
    const scenario = QUEST_SCENARIOS[quest.scenarioIndex];
    const question = scenario.questions[quest.questionIndex];

    setQuest((prev) => ({
      ...prev,
      answers: [...prev.answers, { question: question.text, choice: choice.text, trait: choice.trait }],
    }));

    setTraitScores((prev) => ({
      ...prev,
      [choice.trait]: (prev[choice.trait] || 0) + 1,
    }));

    await supabase.from('career_quest_answers').insert({
      session_id: quest.sessionId,
      question: question.text,
      choice: choice.text,
      trait_revealed: choice.trait,
    });

    if (quest.questionIndex + 1 < scenario.questions.length) {
      setTimeout(() => {
        setQuest((prev) => ({ ...prev, questionIndex: prev.questionIndex + 1 }));
      }, 400);
    } else {
      setTimeout(() => {
        finishQuest();
      }, 400);
    }
  };

  const finishQuest = async () => {
    if (!quest.sessionId || !student?.id) return;
    const score = quest.answers.length * 10;
    await supabase
      .from('career_quest_sessions')
      .update({ completed_at: new Date().toISOString(), score })
      .eq('id', quest.sessionId);

    const total = Object.values(traitScores).reduce((a, b) => a + b, 0);
    const normalized: Record<string, number> = {};
    Object.keys(traitScores).forEach((k) => {
      normalized[k] = Math.round((traitScores[k] / total) * 100);
    });

    await supabase.from('talent_scores').insert({
      student_id: student.id,
      ...normalized,
    });

    await supabase.from('achievements').insert({
      student_id: student.id,
      badge_name: 'Career Quest Champion',
      badge_description: 'Completed a Career Quest game',
      skill_points: 100,
    });

    setPhase('complete');
  };

  const reset = () => {
    setPhase('select');
    setQuest({ scenarioIndex: 0, questionIndex: 0, answers: [], sessionId: null });
    setTraitScores({
      analytical_thinking: 0,
      leadership: 0,
      creativity: 0,
      communication: 0,
      teamwork: 0,
      adaptability: 0,
    });
  };

  if (phase === 'select') {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">Career Quest</h1>
          <p className="text-neutral-500 mt-1">Explore career scenarios through fun, interactive challenges</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {QUEST_SCENARIOS.map((scenario, i) => (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl border border-neutral-200 p-6 card-hover cursor-pointer"
              onClick={() => selectScenario(i)}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-warning-400 to-error-500 flex items-center justify-center mb-4">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg text-neutral-900 mb-2">{scenario.title}</h3>
              <p className="text-sm text-neutral-600 mb-4 leading-relaxed">{scenario.description}</p>
              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <Target className="w-4 h-4" />
                <span>{scenario.questions.length} questions</span>
              </div>
              <button className="w-full mt-4 py-2.5 rounded-xl bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2">
                Start Quest
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (phase === 'playing') {
    const scenario = QUEST_SCENARIOS[quest.scenarioIndex];
    const question = scenario.questions[quest.questionIndex];
    const progress = ((quest.questionIndex + 1) / scenario.questions.length) * 100;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-neutral-900">{scenario.title}</h1>
            <p className="text-neutral-500 mt-1">Question {quest.questionIndex + 1} of {scenario.questions.length}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-warning-400 to-error-500 flex items-center justify-center">
            <Gamepad2 className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-warning-400 to-error-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${quest.scenarioIndex}-${quest.questionIndex}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl border border-neutral-200 p-6 lg:p-8"
          >
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning-50 text-warning-700 text-xs font-medium mb-4">
                <Zap className="w-3 h-3" />
                Scenario Challenge
              </div>
              <h2 className="text-lg font-semibold text-neutral-900 leading-relaxed">{question.text}</h2>
            </div>
            <div className="space-y-3">
              {question.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleChoice(option)}
                  className="w-full text-left p-4 rounded-xl border border-neutral-200 hover:border-warning-400 hover:bg-warning-50 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-neutral-100 group-hover:bg-warning-100 flex items-center justify-center text-sm font-bold text-neutral-500 group-hover:text-warning-600 transition-colors">
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className="text-sm text-neutral-700 font-medium">{option.text}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-warning-500 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  const topTrait = Object.entries(traitScores).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="text-center py-12">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-warning-400 to-error-500 flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h2 className="font-display text-3xl font-bold text-neutral-900 mb-3">Quest Complete!</h2>
        <p className="text-neutral-600 mb-8 max-w-md mx-auto leading-relaxed">
          You scored {quest.answers.length * 10} points! Your choices revealed your natural
          {topTrait && (
            <span className="font-semibold text-neutral-900"> {topTrait[0].replace('_', ' ')}</span>
          )} tendencies.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Play Another Quest
          </button>
          <button
            onClick={() => navigate('/talent')}
            className="px-6 py-3 rounded-xl bg-white border border-neutral-200 text-neutral-700 font-semibold hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2"
          >
            <Brain className="w-5 h-5" />
            View Talent Profile
          </button>
        </div>
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 max-w-md mx-auto">
          <h3 className="font-semibold text-neutral-900 mb-4">Traits Revealed</h3>
          <div className="space-y-2">
            {Object.entries(traitScores)
              .sort((a, b) => b[1] - a[1])
              .map(([trait, score]) => (
                <div key={trait} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-neutral-700 capitalize w-32 text-left">
                    {trait.replace('_', ' ')}
                  </span>
                  <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary-500"
                      style={{ width: `${Math.min((score / quest.answers.length) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm text-neutral-500 w-10 text-right">{score}</span>
                </div>
              ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
