import { useAuth } from '../../contexts/AuthContext';
import { BookOpen, LogOut, User, Shield } from 'lucide-react';

type NavbarProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
};

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { profile, signOut, isAdmin } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <BookOpen className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">StudentVerse</span>
          </div>

          <div className="flex items-center space-x-6">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentPage === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('notes')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentPage === 'notes' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Notes
            </button>
            <button
              onClick={() => onNavigate('practice')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentPage === 'practice' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Practice
            </button>
            <button
              onClick={() => onNavigate('tests')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentPage === 'tests' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Mock Tests
            </button>
            <button
              onClick={() => onNavigate('news')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentPage === 'news' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Tech News
            </button>
            <button
              onClick={() => onNavigate('opportunities')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentPage === 'opportunities' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Opportunities
            </button>
            <button
              onClick={() => onNavigate('bookmarks')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentPage === 'bookmarks' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Bookmarks
            </button>

            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 ${
                  currentPage === 'admin' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </button>
            )}

            <div className="flex items-center space-x-3 border-l pl-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{profile?.full_name}</span>
              </div>
              <button
                onClick={signOut}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
