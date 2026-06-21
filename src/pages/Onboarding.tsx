import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, User, School, BookOpen, Heart, CheckCircle } from 'lucide-react';

const STEPS = [
  { title: 'Welcome', desc: 'Let\'s get to know you', icon: Sparkles },
  { title: 'Basic Info', desc: 'Tell us about yourself', icon: User },
  { title: 'Interests', desc: 'What excites you?', icon: Heart },
  { title: 'Ready', desc: 'You\'re all set!', icon: CheckCircle },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [school, setSchool] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setStudent = useAppStore((s) => s.setStudent);
  const setOnboarding = useAppStore((s) => s.setOnboardingComplete);

  const interestOptions = [
    'Technology', 'Science', 'Arts', 'Music', 'Sports',
    'Writing', 'Business', 'Helping Others', 'Nature', 'Building Things',
  ];

  const toggleInterest = (i: string) => {
    setInterests((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('student_profiles')
      .insert({ name, grade, school, interests })
      .select()
      .single();
    if (!error && data) {
      setStudent({ id: data.id, name, grade, school, interests });
      setOnboarding(true);
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                i <= step ? 'gradient-bg text-white' : 'bg-neutral-200 text-neutral-400'
              }`}>
                <s.icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-medium ${i <= step ? 'text-neutral-900' : 'text-neutral-400'}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl shadow-xl border border-neutral-200 p-8 text-center"
            >
              <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="font-display text-2xl font-bold text-neutral-900 mb-3">
                Welcome to CareerVerse AI
              </h1>
              <p className="text-neutral-600 mb-8 leading-relaxed">
                We are going to help you discover your strengths, interests, and the perfect career path for you. It will only take a few minutes.
              </p>
              <button
                onClick={() => setStep(1)}
                className="w-full py-3 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                Let's Begin
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl shadow-xl border border-neutral-200 p-8"
            >
              <h2 className="font-display text-xl font-bold text-neutral-900 mb-6">Tell us about yourself</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Your Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-neutral-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Grade / Year</label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-3 w-5 h-5 text-neutral-400" />
                    <input
                      type="text"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      placeholder="e.g., Grade 11, Year 2"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">School Name</label>
                  <div className="relative">
                    <School className="absolute left-3 top-3 w-5 h-5 text-neutral-400" />
                    <input
                      type="text"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      placeholder="Enter your school name"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={() => name.trim() && setStep(2)}
                disabled={!name.trim()}
                className="w-full mt-6 py-3 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl shadow-xl border border-neutral-200 p-8"
            >
              <h2 className="font-display text-xl font-bold text-neutral-900 mb-2">What are you interested in?</h2>
              <p className="text-sm text-neutral-500 mb-6">Select all that apply. You can always change this later.</p>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map((i) => (
                  <button
                    key={i}
                    onClick={() => toggleInterest(i)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      interests.includes(i)
                        ? 'gradient-bg text-white shadow-md'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(3)}
                className="w-full mt-6 py-3 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl shadow-xl border border-neutral-200 p-8 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-success-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-success-600" />
              </div>
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-3">
                You're All Set!
              </h2>
              <p className="text-neutral-600 mb-8 leading-relaxed">
                Welcome aboard, <span className="font-semibold text-neutral-900">{name}</span>! Your profile is ready. Let's explore your career possibilities together.
              </p>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Creating your profile...' : (
                  <>
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
