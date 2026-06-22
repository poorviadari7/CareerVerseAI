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
  ChevronRight,
  User,
  Loader,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'astra';
  text: string;
  options?: { text: string; trait: string; value: string }[];
}

const ASTRA_REACTIONS: Record<string, string[]> = {
  analytical_thinking: [
    "That's a very analytical approach! You clearly enjoy breaking down complex problems.",
    "I love how you think things through logically. That's a strong analytical mindset.",
    "You have a natural gift for systematic thinking. That will serve you well in many careers!",
  ],
  leadership: [
    "Taking charge comes naturally to you! Leadership is a rare and valuable trait.",
    "I can see you stepping up when it matters. You have real leadership potential.",
    "You have a vision for bringing people together. That's the mark of a true leader!",
  ],
  creativity: [
    "What a creative perspective! Your imagination is truly a superpower.",
    "I love that you think outside the box. Creativity is at the heart of innovation.",
    "You see possibilities others might miss. That creative spark is special!",
  ],
  communication: [
    "You clearly value connecting with others. Strong communication is a career multiplier.",
    "I can tell you're someone who builds bridges between people. That's amazing!",
    "Your ability to express ideas clearly will open so many doors for you.",
  ],
  teamwork: [
    "You're a true collaborator! Working well with others is such an important skill.",
    "I love that you think about the team first. That collaborative spirit is rare.",
    "You bring people together. That teamwork instinct will make you invaluable anywhere.",
  ],
  adaptability: [
    "You handle change with grace. Adaptability is one of the most valuable traits today.",
    "I love how you roll with the punches. That flexibility is a real strength!",
    "You thrive when things get dynamic. That adaptability is future-proof!",
  ],
};

const ASTRA_TRANSITIONS = [
  "That's great to know! Let me ask you something else...",
  "Interesting! I'm learning so much about you. Here's my next question...",
  "I see! Let's keep going. I have another question for you...",
  "Thank you for sharing that! Now I'm curious about...",
  "That's really insightful! Moving on to the next question...",
  "I'm building a great picture of who you are! Next...",
];

function getAstraReaction(trait: string): string {
  const reactions = ASTRA_REACTIONS[trait] || ["Interesting! That tells me a lot about you."];
  return reactions[Math.floor(Math.random() * reactions.length)];
}

function getAstraTransition(): string {
  return ASTRA_TRANSITIONS[Math.floor(Math.random() * ASTRA_TRANSITIONS.length)];
}

function speak(text: string, onEnd?: () => void) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 1.0;
  utter.pitch = 1.05;
  utter.volume = 1;
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find((v) => v.name.includes('Google') && v.lang.startsWith('en'))
    || voices.find((v) => v.lang.startsWith('en'));
  if (preferred) utter.voice = preferred;
  if (onEnd) utter.onend = onEnd;
  window.speechSynthesis.speak(utter);
}

function stopSpeaking() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
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
    analytical_thinking: 0, leadership: 0, creativity: 0, communication: 0, teamwork: 0, adaptability: 0,
  });
  const [waitingForAnswer, setWaitingForAnswer] = useState(true);
  const [typingText, setTypingText] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingRef = useRef<number | null>(null);
  const isSpeakingRef = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingText]);

  useEffect(() => {
    if (!student?.id || messages.length > 0) return;
    // Pre-load voices
    if (window.speechSynthesis) window.speechSynthesis.getVoices();
    startInterview();
  }, [student?.id]);

  const startInterview = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('interview_sessions')
      .insert({ student_id: student!.id, status: 'in_progress' })
      .select()
      .single();
    if (data) {
      setSessionId(data.id);
      const welcomeText = `Hi ${student!.name}! I'm Astra, your AI career mentor. I'm excited to learn about you and help you discover your perfect career path. Let's chat for a few minutes!`;
      const firstQ = INTERVIEW_QUESTIONS[0];
      typeMessage(welcomeText, () => {
        setMessages([{ id: 'welcome', role: 'astra', text: welcomeText }]);
        setTimeout(() => typeQuestion(firstQ), 400);
      });
    }
    setLoading(false);
  };

  const typeMessage = (text: string, onComplete?: () => void) => {
    setShowOptions(false);
    setWaitingForAnswer(false);
    setTypingText('');
    setIsSpeaking(true);
    isSpeakingRef.current = true;
    if (voiceEnabled) speak(text);
    let i = 0;
    const speed = 28;
    const interval = setInterval(() => {
      i++;
      setTypingText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        typingRef.current = null;
        setIsSpeaking(false);
        isSpeakingRef.current = false;
        if (onComplete) onComplete();
      }
    }, speed);
    typingRef.current = interval as unknown as number;
  };

  const typeQuestion = (question: typeof INTERVIEW_QUESTIONS[0]) => {
    typeMessage(question.text, () => {
      setMessages((prev) => [
        ...prev,
        { id: question.id, role: 'astra', text: question.text, options: question.options },
      ]);
      setTypingText('');
      setShowOptions(true);
      setWaitingForAnswer(true);
    });
  };

  const handleAnswer = async (option: { text: string; trait: string; value: string }) => {
    if (!sessionId || !waitingForAnswer) return;
    setWaitingForAnswer(false);
    setShowOptions(false);
    setLoading(true);
    stopSpeaking();
    if (typingRef.current) clearInterval(typingRef.current);
    setTypingText('');
    setIsSpeaking(false);

    const question = INTERVIEW_QUESTIONS[currentQuestion];
    setMessages((prev) => [...prev, { id: `answer-${currentQuestion}`, role: 'user', text: option.text }]);

    await supabase.from('interview_responses').insert({
      session_id: sessionId, question: question.text, answer: option.text,
    });

    setTraitScores((prev) => ({ ...prev, [option.trait]: (prev[option.trait] || 0) + 1 }));

    const nextIndex = currentQuestion + 1;
    const reaction = getAstraReaction(option.trait);

    setTimeout(() => {
      typeMessage(reaction, () => {
        setMessages((prev) => [...prev, { id: `reaction-${currentQuestion}`, role: 'astra', text: reaction }]);
        setTypingText('');
        setTimeout(() => {
          if (nextIndex < INTERVIEW_QUESTIONS.length) {
            const transition = getAstraTransition();
            typeMessage(transition, () => {
              setMessages((prev) => [...prev, { id: `transition-${currentQuestion}`, role: 'astra', text: transition }]);
              setTypingText('');
              setTimeout(() => {
                typeQuestion(INTERVIEW_QUESTIONS[nextIndex]);
                setCurrentQuestion(nextIndex);
                setLoading(false);
              }, 500);
            });
          } else {
            finishInterview();
          }
        }, 400);
      });
    }, 600);
  };

  const finishInterview = async () => {
    if (!sessionId) return;
    const total = Object.values(traitScores).reduce((a, b) => a + b, 0);
    const normalized: Record<string, number> = {};
    Object.keys(traitScores).forEach((k) => {
      normalized[k] = Math.round((traitScores[k] / total) * 100);
    });

    const closingText = `Thank you for sharing all of that, ${student!.name}! I've analyzed your responses and identified your unique strengths. Let me show you what I've discovered...`;

    typeMessage(closingText, async () => {
      setMessages((prev) => [...prev, { id: 'closing', role: 'astra', text: closingText }]);
      setTypingText('');

      await supabase.from('interview_sessions').update({
        completed_at: new Date().toISOString(), status: 'completed',
        overall_summary: generateSummary(normalized),
      }).eq('id', sessionId);

      await supabase.from('talent_scores').insert({ student_id: student!.id, ...normalized });
      await supabase.from('achievements').insert({
        student_id: student!.id, badge_name: 'Interview Star',
        badge_description: 'Completed the AI Interview with Astra', skill_points: 100,
      });

      const recs = generateRecommendations(normalized);
      for (const rec of recs) {
        await supabase.from('career_recommendations').insert({ student_id: student!.id, ...rec });
      }

      setTimeout(() => { setCompleted(true); setLoading(false); }, 800);
    });
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
      career_title: c.title, suitability_score: Math.min(c.matchScore, 98),
      explanation: c.description, required_skills: c.skills,
      future_demand: c.demand, growth_opportunities: c.growth, rank: i + 1,
    }));
  };

  const toggleVoice = () => {
    const next = !voiceEnabled;
    setVoiceEnabled(next);
    if (!next) stopSpeaking();
  };

  if (!student?.id) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between py-4 px-4">
        <div>
          <h1 className="font-display text-xl font-bold text-neutral-900">AI Career Interview</h1>
          <p className="text-neutral-500 text-sm">Chat with Astra to discover your career path</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleVoice}
            className={`p-2 rounded-full transition-colors ${voiceEnabled ? 'bg-primary-100 text-primary-600' : 'bg-neutral-100 text-neutral-400'}`}
            title={voiceEnabled ? 'Astra voice is on' : 'Astra voice is off'}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              isSpeaking ? 'animate-pulse' : ''
            }`}>
              <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-neutral-900">Astra</p>
              <p className="text-xs text-neutral-500">
                {isSpeaking ? 'Speaking...' : voiceEnabled ? 'Voice on' : 'Voice off'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 pb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-neutral-500">
            Question {Math.min(currentQuestion + 1, INTERVIEW_QUESTIONS.length)} of {INTERVIEW_QUESTIONS.length}
          </span>
          <span className="text-xs font-medium text-primary-600">
            {Math.round((currentQuestion / INTERVIEW_QUESTIONS.length) * 100)}% complete
          </span>
        </div>
        <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-500"
            style={{ width: `${(currentQuestion / INTERVIEW_QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'astra'
                  ? 'bg-gradient-to-br from-primary-500 to-secondary-500'
                  : 'bg-neutral-200'
              }`}>
                {msg.role === 'astra' ? (
                  <Sparkles className="w-4 h-4 text-white" />
                ) : (
                  <User className="w-4 h-4 text-neutral-600" />
                )}
              </div>
              <div className={`max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'astra'
                    ? 'bg-white border border-neutral-200 text-neutral-800 rounded-tl-sm shadow-sm'
                    : 'bg-primary-600 text-white rounded-tr-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {typingText && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shrink-0 ${isSpeaking ? 'animate-pulse' : ''}`}>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-neutral-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm max-w-[80%]">
                <p className="text-sm text-neutral-800 leading-relaxed">{typingText}</p>
                <span className="inline-block w-1.5 h-4 ml-0.5 bg-primary-400 animate-pulse rounded-full align-middle" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Options area */}
      <div className="border-t border-neutral-200 bg-white px-4 py-4">
        {completed ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-success-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success-600" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-neutral-900">Interview Complete!</p>
                <p className="text-sm text-neutral-500">Astra has analyzed your responses</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => navigate('/recommendations')}
                className="flex-1 py-3 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                View Recommendations
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/talent')}
                className="flex-1 py-3 rounded-xl bg-white border border-neutral-200 text-neutral-700 font-semibold hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2"
              >
                See Talent Profile
                <Brain className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : showOptions && messages[messages.length - 1]?.options ? (
          <div className="space-y-2">
            <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">Choose your answer</p>
            <div className="grid grid-cols-1 gap-2">
              {messages[messages.length - 1].options?.map((opt) => (
                <motion.button
                  key={opt.value}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(opt)}
                  disabled={!waitingForAnswer}
                  className="w-full text-left p-4 rounded-xl bg-white border border-neutral-200 hover:border-primary-400 hover:bg-primary-50 transition-all text-sm text-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{opt.text}</span>
                    <ChevronRight className="w-4 h-4 text-neutral-300" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-neutral-400 text-sm">
            <Loader className="w-4 h-4 animate-spin" />
            <span>Astra is thinking...</span>
          </div>
        )}
      </div>
    </div>
  );
}
