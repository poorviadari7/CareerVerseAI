import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface StudentProfile {
  id: string;
  name: string;
  grade?: string;
  school?: string;
  interests?: string[];
}

interface AppState {
  student: StudentProfile | null;
  setStudent: (student: StudentProfile | null) => void;
  onboardingComplete: boolean;
  setOnboardingComplete: (v: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      student: null,
      setStudent: (student) => set({ student }),
      onboardingComplete: false,
      setOnboardingComplete: (v) => set({ onboardingComplete: v }),
    }),
    { name: 'careerverse-store' }
  )
);
