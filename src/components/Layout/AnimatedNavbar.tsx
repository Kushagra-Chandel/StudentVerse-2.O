import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpen, LogOut, User, Shield, Menu, X } from 'lucide-react';

type NavbarProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
};

export function AnimatedNavbar({ currentPage, onNavigate }: NavbarProps) {
  const { profile, signOut, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Dashboard', value: 'dashboard', icon: '📊' },
    { label: 'Notes', value: 'notes', icon: '📚' },
    { label: 'Practice', value: 'practice', icon: '🧠' },
    { label: 'Tests', value: 'tests', icon: '🎯' },
    { label: 'News', value: 'news', icon: '📰' },
    { label: 'Opportunities', value: 'opportunities', icon: '💼' },
    { label: 'Bookmarks', value: 'bookmarks', icon: '🔖' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'glass rounded-b-2xl shadow-2xl shadow-blue-500/20' : 'glass rounded-b-3xl'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer hover-lift group"
            onClick={() => onNavigate('dashboard')}
          >
            <div className="relative">
              <BookOpen className="w-8 h-8 text-cyan-400 group-hover:text-blue-300 transition-colors" />
              <div className="absolute inset-0 bg-cyan-400/30 rounded-full blur group-hover:blur-md transition-all" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              StudentVerse
            </span>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => (
              <button
                key={item.value}
                onClick={() => onNavigate(item.value)}
                className={`px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                  currentPage === item.value
                    ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/50'
                    : 'text-slate-300 hover:text-cyan-300 hover:bg-white/5'
                }`}
              >
                <span className="mr-1">{item.icon}</span>
                {item.label}
              </button>
            ))}

            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className={`px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300 flex items-center space-x-1 ${
                  currentPage === 'admin'
                    ? 'bg-green-400/20 text-green-300 border border-green-400/50'
                    : 'text-slate-300 hover:text-green-300 hover:bg-white/5'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </button>
            )}
          </div>

          {/* User menu & mobile toggle */}
          <div className="flex items-center space-x-4">
            {/* Profile dropdown */}
            <div className="hidden md:flex items-center space-x-3 pl-4 border-l border-white/10">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-100">{profile?.full_name}</p>
                <p className="text-xs text-slate-400">{profile?.role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold hover-lift">
                <User className="w-5 h-5" />
              </div>
              <button
                onClick={signOut}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-cyan-400 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/10 animate-slideInDown">
            <div className="py-4 space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.value}
                  onClick={() => {
                    onNavigate(item.value);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-300 ${
                    currentPage === item.value
                      ? 'bg-cyan-400/20 text-cyan-300'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}

              {isAdmin && (
                <button
                  onClick={() => {
                    onNavigate('admin');
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 rounded-lg text-slate-300 hover:bg-white/5 transition-all"
                >
                  <Shield className="w-4 h-4 inline mr-2" />
                  Admin Panel
                </button>
              )}

              <div className="border-t border-white/10 pt-4 mt-4">
                <button
                  onClick={signOut}
                  className="w-full text-left px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
