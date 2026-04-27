import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserPlus } from 'lucide-react';

export function SignupForm({ onToggle }: { onToggle: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const branches = ['CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Other'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password || !fullName) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const semesterNum = semester ? parseInt(semester) : undefined;
    const { error: signUpError } = await signUp(email, password, fullName, branch || undefined, semesterNum);

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fadeInUp">
      <div className="glass rounded-3xl p-8 hover:glass-light transition-all duration-500">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-gradient-to-br from-emerald-500 to-green-500 p-3 rounded-full shadow-lg shadow-emerald-500/50">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-white mb-2">Create Account</h2>
        <p className="text-center text-slate-400 mb-8">Join StudentVerse today</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm animate-fadeInUp">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-slate-200 mb-2">
              Full Name *
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
             className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition text-white placeholder-gray-300"
              placeholder="John Doe"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition text-white placeholder-gray-300"
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-2">
              Password *
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition text-white placeholder-white/70"
              placeholder="Minimum 6 characters"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="branch" className="block text-sm font-medium text-slate-200 mb-2">
                Branch
              </label>
             <select
  id="branch"
  value={branch}
  onChange={(e) => setBranch(e.target.value)}
  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition text-white"
  disabled={loading}
>
  <option value="" className="text-black bg-white">Select Branch</option>

  {branches.map((b) => (
    <option key={b} value={b} className="text-black bg-white">
      {b}
    </option>
  ))}
</select>
            </div>

            <div>
              <label htmlFor="semester" className="block text-sm font-medium text-slate-200 mb-2">
                Semester
              </label>
              <select
  id="semester"
  value={semester}
  onChange={(e) => setSemester(e.target.value)}
  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition text-white"
  disabled={loading}
>
  <option value="" className="text-black bg-white">Select</option>

  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
    <option key={s} value={s} className="text-black bg-white">
      {s}
    </option>
  ))}
</select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-400 to-green-500 hover:shadow-2xl hover:shadow-emerald-500/50 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-400">
            Already have an account?{' '}
            <button
              onClick={onToggle}
              className="text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
