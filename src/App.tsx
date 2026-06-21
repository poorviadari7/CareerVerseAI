import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Interview from './pages/Interview';
import TalentDetector from './pages/TalentDetector';
import AcademicAnalyzer from './pages/AcademicAnalyzer';
import CareerQuest from './pages/CareerQuest';
import Recommendations from './pages/Recommendations';
import Roadmap from './pages/Roadmap';
import GrowthTracker from './pages/GrowthTracker';
import Layout from './components/Layout';
import { AuthGuard, RedirectOnboarded } from './components/AuthGuard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RedirectOnboarded />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/onboarding" element={<Onboarding />} />
        </Route>
        <Route element={<AuthGuard />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/interview" element={<Interview />} />
            <Route path="/talent" element={<TalentDetector />} />
            <Route path="/academic" element={<AcademicAnalyzer />} />
            <Route path="/quest" element={<CareerQuest />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/roadmap/:careerTitle?" element={<Roadmap />} />
            <Route path="/growth" element={<GrowthTracker />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
