import { Outlet, useLocation, Link } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import {
  LayoutDashboard,
  MessageCircle,
  Sparkles,
  FileText,
  Gamepad2,
  Compass,
  Map,
  Trophy,
  User,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: MessageCircle, label: 'AI Interview', path: '/interview' },
  { icon: Sparkles, label: 'Talent Detector', path: '/talent' },
  { icon: FileText, label: 'Academic Analyzer', path: '/academic' },
  { icon: Gamepad2, label: 'Career Quest', path: '/quest' },
  { icon: Compass, label: 'Recommendations', path: '/recommendations' },
  { icon: Map, label: 'Roadmap', path: '/roadmap' },
  { icon: Trophy, label: 'Growth Tracker', path: '/growth' },
];

export default function Layout() {
  const location = useLocation();
  const student = useAppStore((s) => s.student);
  const setStudent = useAppStore((s) => s.setStudent);
  const setOnboarding = useAppStore((s) => s.setOnboardingComplete);

  const handleLogout = () => {
    setStudent(null);
    setOnboarding(false);
  };

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-neutral-200 z-50 hidden lg:flex flex-col">
        <div className="p-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-neutral-900">
              CareerVerse
            </span>
          </Link>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-neutral-400'}`} />
                {item.label}
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <User className="w-4 h-4 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">
                {student?.name || 'Student'}
              </p>
              <p className="text-xs text-neutral-500 truncate">{student?.grade || ''}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors"
              title="Reset"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:ml-64 flex-1 flex flex-col">
        <header className="lg:hidden bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg">CareerVerse</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-neutral-700">{student?.name}</span>
            <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center">
              <User className="w-4 h-4 text-primary-600" />
            </div>
          </div>
        </header>

        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50 px-2 py-1">
          <div className="flex justify-around overflow-x-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center gap-0.5 py-2 px-2 min-w-[4rem] rounded-lg text-xs font-medium transition-colors ${
                    isActive ? 'text-primary-600' : 'text-neutral-500'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-[10px]">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
