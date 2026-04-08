import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircle, Plus, X } from 'lucide-react';

type TestQuestion = {
  question_text: string;
  options: string[];
  correct_answer: string;
  topic: string;
  marks: number;
};

export function AddTestForm() {
  const { profile } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration_minutes: 60,
    difficulty_level: 'medium',
  });
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<TestQuestion>({
    question_text: '',
    options: ['', '', '', ''],
    correct_answer: '',
    topic: '',
    marks: 1,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const topics = ['Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming', 'Sorting', 'Searching', 'Other'];

  const addQuestion = () => {
    if (currentQuestion.question_text && currentQuestion.correct_answer && currentQuestion.topic) {
      setQuestions([...questions, { ...currentQuestion, options: currentQuestion.options.filter(o => o.trim() !== '') }]);
      setCurrentQuestion({
        question_text: '',
        options: ['', '', '', ''],
        correct_answer: '',
        topic: '',
        marks: 1,
      });
    }
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || questions.length === 0) return;

    setLoading(true);
    setSuccess(false);

    const uniqueTopics = [...new Set(questions.map(q => q.topic))];

    const { data: testData, error: testError } = await supabase
      .from('mock_tests')
      .insert({
        title: formData.title,
        description: formData.description,
        duration_minutes: formData.duration_minutes,
        total_questions: questions.length,
        topics: uniqueTopics,
        difficulty_level: formData.difficulty_level,
        created_by: profile.id,
      })
      .select()
      .single();

    if (!testError && testData) {
      const questionsWithTestId = questions.map(q => ({
        ...q,
        test_id: testData.id,
      }));

      await supabase.from('test_questions').insert(questionsWithTestId);

      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        duration_minutes: 60,
        difficulty_level: 'medium',
      });
      setQuestions([]);
      setTimeout(() => setSuccess(false), 3000);
    }

    setLoading(false);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <CheckCircle className="w-5 h-5" />
          <span>Mock test created successfully!</span>
        </div>
      )}

      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Test Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Test Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes) *</label>
            <input
              type="number"
              required
              min="1"
              value={formData.duration_minutes}
              onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Add Question ({questions.length} added)</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Question Text *</label>
          <textarea
            value={currentQuestion.question_text}
            onChange={(e) => setCurrentQuestion({ ...currentQuestion, question_text: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Topic *</label>
            <select
              value={currentQuestion.topic}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, topic: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Topic</option>
              {topics.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Marks *</label>
            <input
              type="number"
              min="1"
              value={currentQuestion.marks}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, marks: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Options *</label>
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <input
                key={index}
                type="text"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer *</label>
          <select
            value={currentQuestion.correct_answer}
            onChange={(e) => setCurrentQuestion({ ...currentQuestion, correct_answer: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Select Correct Answer</option>
            {currentQuestion.options.filter(o => o.trim() !== '').map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={addQuestion}
          disabled={!currentQuestion.question_text || !currentQuestion.correct_answer || !currentQuestion.topic}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
        >
          <Plus className="w-5 h-5 inline mr-2" />
          Add Question to Test
        </button>
      </div>

      {questions.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Added Questions ({questions.length})</h3>
          <div className="space-y-3">
            {questions.map((q, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{q.question_text.substring(0, 60)}...</p>
                  <p className="text-sm text-gray-600">{q.topic} - {q.marks} marks</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || questions.length === 0}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50"
      >
        {loading ? 'Creating Test...' : 'Create Mock Test'}
      </button>
    </form>
  );
}
