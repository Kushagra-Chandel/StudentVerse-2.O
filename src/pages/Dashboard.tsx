import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, TestAttempt } from '../lib/supabase';
import { BookOpen, Code, Trophy, Newspaper, Briefcase, TrendingUp } from 'lucide-react';

type DashboardProps = {
  onNavigate: (page: string) => void;
};

export function Dashboard({ onNavigate }: DashboardProps) {
  const { profile } = useAuth();
  const [recentAttempts, setRecentAttempts] = useState<TestAttempt[]>([]);
  const [stats, setStats] = useState({
    totalTests: 0,
    avgScore: 0,
    totalPractice: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    if (!profile) return;

    const { data: attempts } = await supabase
      .from('test_attempts')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (attempts) {
      setRecentAttempts(attempts);
      const avgScore = attempts.length > 0
        ? attempts.reduce((sum, a) => sum + (a.score / a.total_marks * 100), 0) / attempts.length
        : 0;
      setStats({
        totalTests: attempts.length,
        avgScore: Math.round(avgScore),
        totalPractice: 0,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12 animate-fadeInUp">
          <h1 className="text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              Welcome back, {profile?.full_name}!
            </span>
          </h1>
          <p className="text-slate-400 text-lg">
            {profile?.branch && profile?.semester && `${profile.branch} - Semester ${profile.semester}`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass rounded-2xl shadow-lg shadow-blue-500/20 p-8 hover-lift group animate-fadeInUp" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-4">
              <Trophy className="w-12 h-12 text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="text-4xl font-bold text-cyan-300">{stats.totalTests}</span>
            </div>
            <h3 className="text-xl font-semibold text-white group-hover:text-cyan-300 transition-colors">Tests Attempted</h3>
          </div>

          <div className="glass rounded-2xl shadow-lg shadow-emerald-500/20 p-8 hover-lift group animate-fadeInUp" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-12 h-12 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="text-4xl font-bold text-emerald-300">{stats.avgScore}%</span>
            </div>
            <h3 className="text-xl font-semibold text-white group-hover:text-emerald-300 transition-colors">Average Score</h3>
          </div>

          <div className="glass rounded-2xl shadow-lg shadow-orange-500/20 p-8 hover-lift group animate-fadeInUp" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between mb-4">
              <Code className="w-12 h-12 text-orange-400 group-hover:scale-110 transition-transform" />
              <span className="text-4xl font-bold text-orange-300">{stats.totalPractice}</span>
            </div>
            <h3 className="text-xl font-semibold text-white group-hover:text-orange-300 transition-colors">Practice Sessions</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[
          { icon: BookOpen, title: 'Study Notes', desc: 'Access notes by subject, branch, and semester', page: 'notes', color: 'blue', delay: 400 },
          { icon: Code, title: 'Practice', desc: 'Solve topic-wise questions and improve', page: 'practice', color: 'green', delay: 500 },
          { icon: Trophy, title: 'Mock Tests', desc: 'Test your knowledge with timed exams', page: 'tests', color: 'orange', delay: 600 },
          { icon: Newspaper, title: 'Tech News', desc: 'Stay updated with latest tech trends', page: 'news', color: 'red', delay: 700 },
          { icon: Briefcase, title: 'Opportunities', desc: 'Hackathons, internships, and more', page: 'opportunities', color: 'purple', delay: 800 },
        ].map((item, idx) => {
          const Icon = item.icon;
          const colorClasses = {
            blue: 'shadow-blue-500/20 text-blue-400 hover:text-blue-300',
            green: 'shadow-green-500/20 text-green-400 hover:text-green-300',
            orange: 'shadow-orange-500/20 text-orange-400 hover:text-orange-300',
            red: 'shadow-red-500/20 text-red-400 hover:text-red-300',
            purple: 'shadow-purple-500/20 text-purple-400 hover:text-purple-300',
          };
          return (
            <div
              key={idx}
              onClick={() => onNavigate(item.page as any)}
              className={`glass rounded-2xl shadow-lg ${colorClasses[item.color as keyof typeof colorClasses]} p-6 hover-lift cursor-pointer group animate-fadeInUp`}
              style={{ animationDelay: `${item.delay}ms` }}
            >
              <Icon className="w-12 h-12 mb-4 transition-transform group-hover:scale-110" />
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">{item.title}</h3>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors">{item.desc}</p>
            </div>
          );
        })}
        </div>

        {recentAttempts.length > 0 && (
        <div className="glass rounded-2xl shadow-lg shadow-blue-500/20 p-8 animate-fadeInUp">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Test Attempts</h2>
          <div className="space-y-4">
            {recentAttempts.map((attempt, idx) => (
              <div key={attempt.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all border border-white/10 hover:border-cyan-400/30" style={{ animationDelay: `${idx * 50}ms` }}>
                <div>
                  <p className="font-semibold text-white">Test Attempt</p>
                  <p className="text-sm text-slate-400">
                    {new Date(attempt.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-cyan-400">
                    {Math.round((attempt.score / attempt.total_marks) * 100)}%
                  </p>
                  <p className="text-sm text-slate-400">{attempt.accuracy}% accuracy</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
