import { useEffect, useState } from 'react';
import { supabase, TestAttempt } from '../../lib/supabase';
import { Trophy, Clock, Target, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

type ResultDashboardProps = {
  attemptId: string;
  onBack: () => void;
};

type AIAnalysis = {
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  weakTopics: string[];
  suggestions: string[];
};

export function ResultDashboard({ attemptId, onBack }: ResultDashboardProps) {
  const [attempt, setAttempt] = useState<TestAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);

  useEffect(() => {
    loadAttempt();
  }, [attemptId]);

  const loadAttempt = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('test_attempts')
      .select('*')
      .eq('id', attemptId)
      .single();

    if (data) {
      setAttempt(data);
      generateAIAnalysis(data);
    }
    setLoading(false);
  };

  const generateAIAnalysis = (attemptData: TestAttempt) => {
    const accuracy = attemptData.accuracy;
    const topicPerf = attemptData.topic_performance as Record<string, { correct: number; total: number }> || {};

    let riskLevel: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
    if (accuracy < 50) riskLevel = 'HIGH';
    else if (accuracy < 75) riskLevel = 'MEDIUM';

    const weakTopics: string[] = [];
    Object.entries(topicPerf).forEach(([topic, perf]) => {
      const topicAccuracy = (perf.correct / perf.total) * 100;
      if (topicAccuracy < 60) {
        weakTopics.push(topic);
      }
    });

    const suggestions: string[] = [];
    if (riskLevel === 'HIGH') {
      suggestions.push('Focus on fundamentals and revisit core concepts');
      suggestions.push('Spend at least 2 hours daily on practice questions');
    } else if (riskLevel === 'MEDIUM') {
      suggestions.push('Review concepts in weak topics identified below');
      suggestions.push('Practice more problems to improve speed and accuracy');
    } else {
      suggestions.push('Maintain consistency with daily practice');
      suggestions.push('Challenge yourself with harder difficulty problems');
    }

    if (weakTopics.length > 0) {
      suggestions.push(`Prioritize studying: ${weakTopics.join(', ')}`);
    }

    if (attemptData.time_taken_minutes < attemptData.total_marks / 2) {
      suggestions.push('Good time management! Focus on accuracy now');
    } else {
      suggestions.push('Work on improving your solving speed');
    }

    setAiAnalysis({ riskLevel, weakTopics, suggestions });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading results...</div>
      </div>
    );
  }

  if (!attempt || !aiAnalysis) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">No results found</div>
      </div>
    );
  }

  const scorePercentage = Math.round((attempt.score / attempt.total_marks) * 100);
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'HIGH': return 'bg-red-100 text-red-700 border-red-300';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'LOW': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="mb-6 text-blue-600 hover:text-blue-700 font-semibold"
      >
        ← Back to Tests
      </button>

      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-8 text-white mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Test Complete!</h1>
            <p className="text-blue-100">Here's your detailed performance analysis</p>
          </div>
          <Trophy className="w-20 h-20" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/20 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5" />
              <span className="text-sm font-medium">Score</span>
            </div>
            <p className="text-3xl font-bold">{scorePercentage}%</p>
            <p className="text-sm text-blue-100">{attempt.score}/{attempt.total_marks} marks</p>
          </div>

          <div className="bg-white/20 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">Accuracy</span>
            </div>
            <p className="text-3xl font-bold">{attempt.accuracy}%</p>
          </div>

          <div className="bg-white/20 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium">Time Taken</span>
            </div>
            <p className="text-3xl font-bold">{attempt.time_taken_minutes}</p>
            <p className="text-sm text-blue-100">minutes</p>
          </div>

          <div className="bg-white/20 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Date</span>
            </div>
            <p className="text-lg font-bold">{new Date(attempt.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-purple-100 p-3 rounded-lg">
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">AI Performance Analysis</h2>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Risk Assessment</h3>
            <div className={`inline-flex items-center space-x-2 px-6 py-3 rounded-lg border-2 ${getRiskColor(aiAnalysis.riskLevel)}`}>
              {aiAnalysis.riskLevel === 'HIGH' && <AlertCircle className="w-6 h-6" />}
              {aiAnalysis.riskLevel === 'MEDIUM' && <AlertCircle className="w-6 h-6" />}
              {aiAnalysis.riskLevel === 'LOW' && <CheckCircle className="w-6 h-6" />}
              <span className="text-xl font-bold">{aiAnalysis.riskLevel} RISK</span>
            </div>
          </div>

          {aiAnalysis.weakTopics.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Weak Topics Identified</h3>
              <div className="flex flex-wrap gap-2">
                {aiAnalysis.weakTopics.map((topic, index) => (
                  <span key={index} className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Personalized Suggestions</h3>
            <div className="space-y-3">
              {aiAnalysis.suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-900">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Topic-wise Performance</h2>
        <div className="space-y-4">
          {Object.entries((attempt.topic_performance as Record<string, { correct: number; total: number }>) || {}).map(([topic, perf]) => {
            const topicAccuracy = Math.round((perf.correct / perf.total) * 100);
            return (
              <div key={topic} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">{topic}</span>
                  <span className="text-gray-600">{perf.correct}/{perf.total} correct ({topicAccuracy}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      topicAccuracy >= 75 ? 'bg-green-500' : topicAccuracy >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${topicAccuracy}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
