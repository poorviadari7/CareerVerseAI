import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import { supabase } from '../lib/supabase';

export function AuthGuard() {
  const student = useAppStore((s) => s.student);
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      if (!student) {
        const { data } = await supabase
          .from('student_profiles')
          .select('id,name,grade,school,interests')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (data) {
          useAppStore.setState({ student: data, onboardingComplete: true });
        } else {
          navigate('/');
        }
      }
      setChecking(false);
    };
    check();
  }, []);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full" />
      </div>
    );
  }

  if (!student) return null;
  return <Outlet />;
}

export function RedirectOnboarded() {
  const student = useAppStore((s) => s.student);
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      if (!student) {
        const { data } = await supabase
          .from('student_profiles')
          .select('id,name,grade,school,interests')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (data) {
          useAppStore.setState({ student: data, onboardingComplete: true });
          navigate('/dashboard');
        }
      } else {
        navigate('/dashboard');
      }
      setChecking(false);
    };
    check();
  }, []);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full" />
      </div>
    );
  }

  return <Outlet />;
}
