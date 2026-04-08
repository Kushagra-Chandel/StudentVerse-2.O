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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome back, {profile?.full_name}!
        </h1>
        <p className="text-gray-600">
          {profile?.branch && profile?.semester && `${profile.branch} - Semester ${profile.semester}`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Trophy className="w-12 h-12" />
            <span className="text-3xl font-bold">{stats.totalTests}</span>
          </div>
          <h3 className="text-xl font-semibold">Tests Attempted</h3>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-12 h-12" />
            <span className="text-3xl font-bold">{stats.avgScore}%</span>
          </div>
          <h3 className="text-xl font-semibold">Average Score</h3>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Code className="w-12 h-12" />
            <span className="text-3xl font-bold">{stats.totalPractice}</span>
          </div>
          <h3 className="text-xl font-semibold">Practice Sessions</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div
          onClick={() => onNavigate('notes')}
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-blue-500"
        >
          <BookOpen className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Study Notes</h3>
          <p className="text-gray-600">Access notes by subject, branch, and semester</p>
        </div>

        <div
          onClick={() => onNavigate('practice')}
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-green-500"
        >
          <Code className="w-12 h-12 text-green-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Practice</h3>
          <p className="text-gray-600">Solve topic-wise questions and improve</p>
        </div>

        <div
          onClick={() => onNavigate('tests')}
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-orange-500"
        >
          <Trophy className="w-12 h-12 text-orange-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Mock Tests</h3>
          <p className="text-gray-600">Test your knowledge with timed exams</p>
        </div>

        <div
          onClick={() => onNavigate('news')}
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-red-500"
        >
          <Newspaper className="w-12 h-12 text-red-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Tech News</h3>
          <p className="text-gray-600">Stay updated with latest tech trends</p>
        </div>

        <div
          onClick={() => onNavigate('opportunities')}
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-purple-500"
        >
          <Briefcase className="w-12 h-12 text-purple-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Opportunities</h3>
          <p className="text-gray-600">Hackathons, internships, and more</p>
        </div>
      </div>

      {recentAttempts.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Test Attempts</h2>
          <div className="space-y-4">
            {recentAttempts.map((attempt) => (
              <div key={attempt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">Test Attempt</p>
                  <p className="text-sm text-gray-600">
                    {new Date(attempt.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round((attempt.score / attempt.total_marks) * 100)}%
                  </p>
                  <p className="text-sm text-gray-600">{attempt.accuracy}% accuracy</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
