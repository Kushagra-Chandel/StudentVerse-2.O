import { useEffect, useState } from 'react';
import { supabase, PracticeQuestion } from '../lib/supabase';
import { Code, Filter, CheckCircle, XCircle, Bookmark } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Practice() {
  const { profile } = useAuth();
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<PracticeQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<PracticeQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  const [filters, setFilters] = useState({
    topic: '',
    difficulty: '',
  });

  const topics = ['Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming', 'Sorting', 'Searching', 'Other'];
  const difficulties = ['easy', 'medium', 'hard'];

  useEffect(() => {
    loadQuestions();
    loadBookmarks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, questions]);

  const loadQuestions = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('practice_questions')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setQuestions(data);
    }
    setLoading(false);
  };

  const loadBookmarks = async () => {
    if (!profile) return;
    const { data } = await supabase
      .from('bookmarks')
      .select('item_id')
      .eq('user_id', profile.id)
      .eq('item_type', 'practice');

    if (data) {
      setBookmarkedIds(new Set(data.map(b => b.item_id)));
    }
  };

  const applyFilters = () => {
    let filtered = questions;

    if (filters.topic) {
      filtered = filtered.filter(q => q.topic === filters.topic);
    }
    if (filters.difficulty) {
      filtered = filtered.filter(q => q.difficulty === filters.difficulty);
    }

    setFilteredQuestions(filtered);
  };

  const toggleBookmark = async (questionId: string) => {
    if (!profile) return;

    if (bookmarkedIds.has(questionId)) {
      await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', profile.id)
        .eq('item_type', 'practice')
        .eq('item_id', questionId);

      setBookmarkedIds(prev => {
        const next = new Set(prev);
        next.delete(questionId);
        return next;
      });
    } else {
      await supabase
        .from('bookmarks')
        .insert({
          user_id: profile.id,
          item_type: 'practice',
          item_id: questionId,
        });

      setBookmarkedIds(prev => new Set(prev).add(questionId));
    }
  };

  const handlePracticeQuestion = (question: PracticeQuestion) => {
    setSelectedQuestion(question);
    setSelectedAnswer('');
    setShowResult(false);
  };

  const handleSubmitAnswer = () => {
    setShowResult(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading questions...</div>
      </div>
    );
  }

  if (selectedQuestion) {
    const isCorrect = showResult && selectedAnswer === selectedQuestion.correct_answer;

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => setSelectedQuestion(null)}
          className="mb-6 text-blue-600 hover:text-blue-700 font-semibold"
        >
          ← Back to Questions
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedQuestion.difficulty)}`}>
                {selectedQuestion.difficulty}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {selectedQuestion.topic}
              </span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">{selectedQuestion.title}</h2>
          <p className="text-lg text-gray-700 mb-8 whitespace-pre-wrap">{selectedQuestion.question_text}</p>

          <div className="space-y-4 mb-8">
            {(selectedQuestion.options as string[]).map((option, index) => (
              <button
                key={index}
                onClick={() => !showResult && setSelectedAnswer(option)}
                disabled={showResult}
                className={`w-full text-left p-4 rounded-lg border-2 transition ${
                  selectedAnswer === option
                    ? showResult
                      ? option === selectedQuestion.correct_answer
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                      : 'border-blue-500 bg-blue-50'
                    : showResult && option === selectedQuestion.correct_answer
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-900">{option}</span>
                  {showResult && option === selectedQuestion.correct_answer && (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  )}
                  {showResult && selectedAnswer === option && option !== selectedQuestion.correct_answer && (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {!showResult ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Answer
            </button>
          ) : (
            <div className={`p-6 rounded-lg ${isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
              <div className="flex items-center space-x-3 mb-4">
                {isCorrect ? (
                  <>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <h3 className="text-2xl font-bold text-green-900">Correct!</h3>
                  </>
                ) : (
                  <>
                    <XCircle className="w-8 h-8 text-red-600" />
                    <h3 className="text-2xl font-bold text-red-900">Incorrect</h3>
                  </>
                )}
              </div>
              {selectedQuestion.explanation && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Explanation:</h4>
                  <p className="text-gray-700">{selectedQuestion.explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center space-x-3 mb-8">
        <Code className="w-10 h-10 text-green-600" />
        <h1 className="text-4xl font-bold text-gray-900">Practice Questions</h1>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
            <select
              value={filters.topic}
              onChange={(e) => setFilters({ ...filters, topic: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Topics</option>
              {topics.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Difficulties</option>
              {difficulties.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
            </select>
          </div>
        </div>
      </div>

      {filteredQuestions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No questions found</h3>
          <p className="text-gray-600">Try adjusting your filters or check back later</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredQuestions.map((question) => (
            <div key={question.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(question.difficulty)}`}>
                    {question.difficulty}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {question.topic}
                  </span>
                </div>
                <button
                  onClick={() => toggleBookmark(question.id)}
                  className={`p-2 rounded-lg transition ${
                    bookmarkedIds.has(question.id)
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-gray-100 text-gray-400 hover:text-yellow-600'
                  }`}
                >
                  <Bookmark className="w-5 h-5" fill={bookmarkedIds.has(question.id) ? 'currentColor' : 'none'} />
                </button>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">{question.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{question.question_text}</p>

              <button
                onClick={() => handlePracticeQuestion(question)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Start Practice
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
