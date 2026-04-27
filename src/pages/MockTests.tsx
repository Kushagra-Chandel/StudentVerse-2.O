import { useEffect, useState } from 'react';
import { supabase, MockTest, TestQuestion } from '../lib/supabase';
import { Trophy, Clock, Target, Bookmark } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { TestInterface } from '../components/Test/TestInterface';
import { ResultDashboard } from '../components/Test/ResultDashboard';

export function MockTests() {
  const { profile } = useAuth();
  const [tests, setTests] = useState<MockTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState<MockTest | null>(null);
  const [testQuestions, setTestQuestions] = useState<TestQuestion[]>([]);
  const [testStarted, setTestStarted] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadTests();
    loadBookmarks();
  }, []);

  const loadTests = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('mock_tests')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setTests(data);
    }
    setLoading(false);
  };

  const loadBookmarks = async () => {
    if (!profile) return;
    const { data } = await supabase
      .from('bookmarks')
      .select('item_id')
      .eq('user_id', profile.id)
      .eq('item_type', 'test');

    if (data) {
      setBookmarkedIds(new Set(data.map(b => b.item_id)));
    }
  };

  const toggleBookmark = async (testId: string) => {
    if (!profile) return;

    if (bookmarkedIds.has(testId)) {
      await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', profile.id)
        .eq('item_type', 'test')
        .eq('item_id', testId);

      setBookmarkedIds(prev => {
        const next = new Set(prev);
        next.delete(testId);
        return next;
      });
    } else {
      await supabase
        .from('bookmarks')
        .insert({
          user_id: profile.id,
          item_type: 'test',
          item_id: testId,
        });

      setBookmarkedIds(prev => new Set(prev).add(testId));
    }
  };

  const handleStartTest = async (test: MockTest) => {
    if (!profile) return;

    const { data: questions } = await supabase
      .from('test_questions')
      .select('*')
      .eq('test_id', test.id);

    if (questions && questions.length > 0) {
      setSelectedTest(test);
      setTestQuestions(questions);

      const { data: attempt } = await supabase
        .from('test_attempts')
        .insert({
          test_id: test.id,
          user_id: profile.id,
          start_time: new Date().toISOString(),
          total_marks: questions.reduce((sum, q) => sum + q.marks, 0),
        })
        .select()
        .single();

      if (attempt) {
        setAttemptId(attempt.id);
        setTestStarted(true);
      }
    }
  };

  const handleTestComplete = () => {
    setTestStarted(false);
    setShowResults(true);
  };

  const handleBackToTests = () => {
    setSelectedTest(null);
    setTestStarted(false);
    setShowResults(false);
    setAttemptId(null);
    loadTests();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading tests...</div>
      </div>
    );
  }

  if (showResults && attemptId) {
    return <ResultDashboard attemptId={attemptId} onBack={handleBackToTests} />;
  }

  if (testStarted && selectedTest && attemptId) {
    return (
      <TestInterface
        test={selectedTest}
        questions={testQuestions}
        attemptId={attemptId}
        onComplete={handleTestComplete}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center space-x-3 mb-8">
        <Trophy className="w-10 h-10 text-orange-600" />
        <h1 className="text-4xl font-bold text-white-900">Mock Tests</h1>
      </div>

      {tests.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No tests available</h3>
          <p className="text-gray-600">Check back later for new mock tests</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <div key={test.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Trophy className="w-6 h-6 text-orange-600" />
                </div>
                <button
                  onClick={() => toggleBookmark(test.id)}
                  className={`p-2 rounded-lg transition ${
                    bookmarkedIds.has(test.id)
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-gray-100 text-gray-400 hover:text-yellow-600'
                  }`}
                >
                  <Bookmark className="w-5 h-5" fill={bookmarkedIds.has(test.id) ? 'currentColor' : 'none'} />
                </button>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">{test.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{test.description || 'Test your knowledge'}</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2 text-gray-700">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">{test.duration_minutes} minutes</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <Target className="w-5 h-5 text-green-600" />
                  <span className="text-sm">{test.total_questions} questions</span>
                </div>
              </div>

              <button
                onClick={() => handleStartTest(test)}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Start Test
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
