import { useEffect, useState } from 'react';
import { BookOpen, Sparkles, ArrowRight } from 'lucide-react';

type HeroProps = {
  onGetStarted: () => void;
};

export function Hero({ onGetStarted }: HeroProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-float opacity-20" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-float opacity-20" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-float opacity-20" style={{ animationDelay: '4s' }} />
      </div>

      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div
            className={`inline-flex items-center space-x-2 px-4 py-2 mb-8 glass rounded-full transition-all duration-500 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-sm font-medium text-cyan-300">Welcome to StudentVerse</span>
          </div>

          {/* Main heading */}
          <h1
            className={`text-6xl lg:text-7xl font-bold mb-6 transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Master Your Learning
            </span>
            <br />
            <span className="text-white">With Intelligence</span>
          </h1>

          {/* Subheading */}
          <p
            className={`text-xl text-slate-300 mb-12 max-w-2xl mx-auto transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            The all-in-one platform combining notes, practice, mock tests, and AI-powered performance analysis to help you excel in your studies.
          </p>

          {/* Feature highlights */}
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            {[
              { icon: '📚', text: 'Complete Study Materials' },
              { icon: '🧠', text: 'AI Performance Analysis' },
              { icon: '🎯', text: 'Mock Tests & Practice' },
            ].map((feature, idx) => (
              <div key={idx} className="glass p-4 rounded-xl hover-lift group">
                <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">{feature.icon}</span>
                <p className="text-slate-300 text-sm font-medium">{feature.text}</p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '500ms' }}
          >
            <button
              onClick={onGetStarted}
              className="group px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-cyan-500/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onGetStarted}
              className="px-8 py-4 glass hover:glass-light text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <BookOpen className="w-5 h-5" />
              <span>Explore Features</span>
            </button>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="flex flex-col items-center space-y-2">
              <p className="text-slate-400 text-sm">Scroll to explore</p>
              <svg
                className="w-5 h-5 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
