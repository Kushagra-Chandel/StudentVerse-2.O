import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/Auth/LoginForm';
import { SignupForm } from './components/Auth/SignupForm';
import { Navbar } from './components/Layout/Navbar';
import { Hero } from './components/Landing/Hero';
import { Features } from './components/Landing/Features';
import { Stats } from './components/Landing/Stats';
import { CTA } from './components/Landing/CTA';
import { Dashboard } from './pages/Dashboard';
import { Notes } from './pages/Notes';
import { Practice } from './pages/Practice';
import { MockTests } from './pages/MockTests';
import { TechNews } from './pages/TechNews';
import { Opportunities } from './pages/Opportunities';
import { Bookmarks } from './pages/Bookmarks';
import { AdminPanel } from './pages/AdminPanel';

function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 flex items-center justify-center p-4">
      {isLogin ? (
        <LoginForm onToggle={() => setIsLogin(false)} />
      ) : (
        <SignupForm onToggle={() => setIsLogin(true)} />
      )}
    </div>
  );
}

function LandingScreen({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="min-h-screen bg-slate-700">
      <Hero onGetStarted={onGetStarted} />
      <Features />
      <Stats />
      <CTA onGetStarted={onGetStarted} />
    </div>
  );
}

function MainApp() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-700 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-cyan-400 rounded-full animate-rotate" />
          <p className="text-slate-400 text-lg">Loading your learning universe...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  if (currentPage === 'landing') {
    return <LandingScreen onGetStarted={() => setCurrentPage('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-600 via-slate-700 to-slate-600">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />

      <main className="pt-16">
        {currentPage === 'dashboard' && <Dashboard onNavigate={setCurrentPage} />}
        {currentPage === 'notes' && <Notes />}
        {currentPage === 'practice' && <Practice />}
        {currentPage === 'tests' && <MockTests />}
        {currentPage === 'news' && <TechNews />}
        {currentPage === 'opportunities' && <Opportunities />}
        {currentPage === 'bookmarks' && <Bookmarks />}
        {currentPage === 'admin' && <AdminPanel />}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
