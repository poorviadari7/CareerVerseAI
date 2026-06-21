import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  MessageCircle,
  Brain,
  FileText,
  Gamepad2,
  Compass,
  Map,
  Trophy,
  ArrowRight,
  Star,
  Users,
  Award,
  Zap,
  Target,
  Heart,
  CheckCircle,
  Shield,
  Palette,
  Code,
  Stethoscope,
  FlaskConical,
  Megaphone,
  GraduationCap,
  FolderKanban,
  Leaf,
  Blocks,
  X,
  Menu,
  ChevronDown,
  ChevronUp,
  Rocket,
  BrainCircuit,
} from 'lucide-react';
import { useState, useEffect } from 'react';

const features = [
  { icon: MessageCircle, title: 'AI Career Interviewer', desc: 'Chat with Astra, your AI mentor, for personalized career discovery.' },
  { icon: Brain, title: 'Hidden Talent Detector', desc: 'Uncover your natural strengths and abilities you never knew you had.' },
  { icon: FileText, title: 'Academic Report Analyzer', desc: 'Turn your grades into actionable career insights.' },
  { icon: Gamepad2, title: 'Career Quest Game', desc: 'Explore career scenarios through fun, interactive challenges.' },
  { icon: Compass, title: 'Smart Recommendations', desc: 'Get data-driven career matches with detailed explanations.' },
  { icon: Map, title: 'Personalized Roadmap', desc: 'Follow a step-by-step plan to achieve your career goals.' },
  { icon: Trophy, title: 'Growth Tracker', desc: 'Earn badges and track your progress as you grow.' },
];

const careers = [
  { icon: Code, title: 'Software Engineer', color: 'bg-blue-100 text-blue-700' },
  { icon: BrainCircuit, title: 'Data Scientist', color: 'bg-indigo-100 text-indigo-700' },
  { icon: Shield, title: 'Cybersecurity Analyst', color: 'bg-emerald-100 text-emerald-700' },
  { icon: Stethoscope, title: 'Healthcare Admin', color: 'bg-rose-100 text-rose-700' },
  { icon: FlaskConical, title: 'Research Scientist', color: 'bg-amber-100 text-amber-700' },
  { icon: Megaphone, title: 'Marketing Strategist', color: 'bg-orange-100 text-orange-700' },
  { icon: Palette, title: 'UX Designer', color: 'bg-fuchsia-100 text-fuchsia-700' },
  { icon: GraduationCap, title: 'Teacher / Educator', color: 'bg-teal-100 text-teal-700' },
  { icon: FolderKanban, title: 'Project Manager', color: 'bg-slate-100 text-slate-700' },
  { icon: Leaf, title: 'Environmental Scientist', color: 'bg-green-100 text-green-700' },
  { icon: Blocks, title: 'Product Manager', color: 'bg-cyan-100 text-cyan-700' },
  { icon: Heart, title: 'Social Worker', color: 'bg-pink-100 text-pink-700' },
];

const stats = [
  { label: 'Students Guided', value: '12,000+', icon: Users },
  { label: 'Career Matches', value: '45,000+', icon: Target },
  { label: 'Skills Identified', value: '200+', icon: Zap },
  { label: 'Success Rate', value: '94%', icon: Award },
];

const testimonials = [
  {
    name: 'Sarah M.',
    role: 'Grade 11 Student',
    text: 'CareerVerse helped me discover my passion for data science. I never knew I was good at analytical thinking until the talent detector showed me!',
    stars: 5,
  },
  {
    name: 'James K.',
    role: 'Grade 10 Student',
    text: 'The Career Quest game was so fun! It made me think about what I actually enjoy doing, and the recommendations were spot on.',
    stars: 5,
  },
  {
    name: 'Priya R.',
    role: 'Grade 12 Student',
    text: 'I uploaded my academic report and got such detailed insights. Now I have a clear roadmap for my college applications.',
    stars: 5,
  },
];

const faqs = [
  {
    q: 'How does CareerVerse AI work?',
    a: 'CareerVerse AI combines AI-driven interviews, talent analysis, academic performance review, and interactive career quests to build a comprehensive profile of your strengths and interests. This data is used to generate personalized career recommendations and roadmaps.',
  },
  {
    q: 'Is it free for students?',
    a: 'Yes! CareerVerse AI is completely free for students. Our mission is to democratize career guidance and help every student discover their potential.',
  },
  {
    q: 'How accurate are the career recommendations?',
    a: 'Our recommendations are based on a multi-dimensional analysis of your interview responses, game choices, academic performance, and talent scores. While no system is perfect, our 94% student satisfaction rate speaks to the quality of our guidance.',
  },
  {
    q: 'Can I use it multiple times?',
    a: 'Absolutely! You can retake the interview, play different career quests, and update your academic records as you grow. Your profile evolves with you.',
  },
  {
    q: 'What age group is this for?',
    a: 'CareerVerse AI is designed for students in grades 8 through 12, but anyone exploring career options can benefit from the platform.',
  },
  {
    q: 'How do I track my progress?',
    a: 'The Growth Tracker feature lets you earn badges, collect skill points, and see your improvement over time across all six talent dimensions.',
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-neutral-200 rounded-xl bg-white overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-neutral-50 transition-colors"
      >
        <span className="font-semibold text-neutral-900 text-sm md:text-base">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-neutral-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-neutral-400 shrink-0" />}
      </button>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="px-5 pb-5 text-neutral-600 text-sm leading-relaxed"
        >
          {a}
        </motion.div>
      )}
    </div>
  );
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-neutral-200' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-neutral-900">CareerVerse</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">Features</a>
              <a href="#careers" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">Careers</a>
              <a href="#testimonials" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">Stories</a>
              <a href="#faq" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">FAQ</a>
              <Link to="/onboarding" className="px-4 py-2 rounded-lg gradient-bg text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                Get Started
              </Link>
            </div>
            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white border-b border-neutral-200 px-4 py-4 space-y-3">
            <a href="#features" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-neutral-600">Features</a>
            <a href="#careers" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-neutral-600">Careers</a>
            <a href="#testimonials" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-neutral-600">Stories</a>
            <a href="#faq" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-neutral-600">FAQ</a>
            <Link to="/onboarding" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded-lg gradient-bg text-white text-sm font-semibold text-center">Get Started</Link>
          </div>
        )}
      </nav>

      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-secondary-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur border border-neutral-200 shadow-sm mb-6">
                <Sparkles className="w-4 h-4 text-secondary-500" />
                <span className="text-sm font-medium text-neutral-700">AI-Powered Career Guidance</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight mb-6">
                Discover Your{' '}
                <span className="gradient-text">True Potential</span>
                <br />
                With AI Mentorship
              </h1>
              <p className="text-lg text-neutral-600 mb-8 leading-relaxed max-w-2xl mx-auto">
                CareerVerse AI is your intelligent career companion. Through AI interviews, talent analysis, and gamified quests, we help you find the career path that truly fits you.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/onboarding" className="px-8 py-4 rounded-xl gradient-bg text-white font-semibold text-lg hover:opacity-90 transition-all shadow-lg shadow-primary-500/20 flex items-center gap-2">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a href="#features" className="px-8 py-4 rounded-xl bg-white text-neutral-700 font-semibold text-lg border border-neutral-200 hover:border-neutral-300 transition-all shadow-sm">
                  Explore Features
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary-500" />
                <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
                <p className="text-sm text-neutral-500 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">Everything You Need to Find Your Path</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">A complete suite of AI-powered tools designed to guide you from discovery to action.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white rounded-2xl p-6 border border-neutral-200 card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-lg text-neutral-900 mb-2">{f.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mb-6">Meet Astra, Your AI Career Mentor</h2>
              <p className="text-lg text-neutral-600 mb-6 leading-relaxed">
                Astra is not just a chatbot. She is a supportive AI friend who asks the right questions, listens to your answers, and adapts the conversation to uncover what makes you unique.
              </p>
              <ul className="space-y-4">
                {[
                  'Personalized questions based on your responses',
                  'Friendly, conversational experience',
                  'Deep insights into your interests and values',
                  'No forms. No pressure. Just a conversation.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 shrink-0" />
                    <span className="text-neutral-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/onboarding" className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors">
                Chat with Astra
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-200/50 to-secondary-200/50 rounded-3xl blur-2xl" />
              <div className="relative bg-white rounded-3xl shadow-xl border border-neutral-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">Astra</p>
                    <p className="text-xs text-neutral-500">AI Career Mentor</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-primary-50 rounded-2xl rounded-tl-sm p-4 max-w-[85%]">
                    <p className="text-sm text-neutral-700">Hi there! I'm Astra, your career companion. What subjects do you enjoy the most in school?</p>
                  </div>
                  <div className="bg-neutral-100 rounded-2xl rounded-tr-sm p-4 ml-auto max-w-[85%]">
                    <p className="text-sm text-neutral-700">I really love Mathematics and Science! I enjoy solving puzzles and understanding how things work.</p>
                  </div>
                  <div className="bg-primary-50 rounded-2xl rounded-tl-sm p-4 max-w-[85%]">
                    <p className="text-sm text-neutral-700">That's wonderful! Your analytical mindset is a great asset. What kind of problems do you like solving?</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="careers" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">Careers You Could Discover</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">CareerVerse AI covers a wide range of career paths. Here are just some of the possibilities.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {careers.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className={`flex items-center gap-3 p-4 rounded-xl ${c.color} hover:shadow-md transition-all`}
              >
                <c.icon className="w-5 h-5" />
                <span className="font-medium text-sm">{c.title}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 lg:py-28 bg-gradient-to-br from-secondary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">Student Success Stories</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">Real students, real discoveries, real growth.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-warning-400 fill-warning-400" />
                  ))}
                </div>
                <p className="text-neutral-700 mb-4 leading-relaxed text-sm">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-700">{t.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-neutral-900">{t.name}</p>
                    <p className="text-xs text-neutral-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 lg:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-neutral-600">Everything you need to know about CareerVerse AI.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-gradient-to-br from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Find Your Career Path?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of students who have discovered their true potential with CareerVerse AI. Your journey starts with a single conversation.
            </p>
            <Link to="/onboarding" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-primary-700 font-bold text-lg hover:bg-white/90 transition-all shadow-xl">
              <Rocket className="w-5 h-5" />
              Start Your Journey Now
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="bg-neutral-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl">CareerVerse AI</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-neutral-400">
              <span>SDG 4 - Quality Education</span>
              <span>SDG 8 - Decent Work & Economic Growth</span>
            </div>
            <p className="text-sm text-neutral-500">
              Empowering students through AI-driven career guidance.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
