import { ArrowRight, CheckCircle } from 'lucide-react';

type CTAProps = {
  onGetStarted: () => void;
};

export function CTA({ onGetStarted }: CTAProps) {
  const benefits = [
    'Comprehensive study materials',
    'AI-powered performance insights',
    'Mock tests with instant feedback',
    'Track your progress over time',
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,.1)_1px,transparent_1px)] bg-[size:100px_100px] opacity-50" />

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="glass rounded-3xl p-12 md:p-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left side */}
            <div className="animate-fadeInLeft">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                  Ready to Transform
                </span>
                <br />
                <span className="text-white">Your Learning?</span>
              </h2>

              <p className="text-slate-300 text-lg mb-8">
                Join thousands of students already using StudentVerse to ace their exams and land their dream opportunities.
              </p>

              <div className="space-y-4 mb-8">
                {benefits.map((benefit, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-3 animate-fadeInUp"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                    <span className="text-slate-300">{benefit}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={onGetStarted}
                className="group w-full md:w-auto px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-cyan-500/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Right side - Animated graphic */}
            <div className="hidden md:block animate-fadeInRight">
              <div className="relative h-80">
                {/* Floating cards */}
                <div className="absolute top-0 right-0 w-40 h-32 glass rounded-2xl p-4 animate-float transform -rotate-6 z-20">
                  <div className="text-3xl mb-2">🎓</div>
                  <p className="text-sm text-cyan-300 font-semibold">Perfect Score</p>
                  <p className="text-xs text-slate-400">95% Accuracy</p>
                </div>

                <div className="absolute top-24 left-0 w-40 h-32 glass rounded-2xl p-4 animate-float transform rotate-6 z-10" style={{ animationDelay: '1s' }}>
                  <div className="text-3xl mb-2">📈</div>
                  <p className="text-sm text-cyan-300 font-semibold">Fast Progress</p>
                  <p className="text-xs text-slate-400">+25% Improvement</p>
                </div>

                <div className="absolute bottom-0 right-10 w-40 h-32 glass rounded-2xl p-4 animate-float transform -rotate-3 z-20" style={{ animationDelay: '2s' }}>
                  <div className="text-3xl mb-2">🚀</div>
                  <p className="text-sm text-cyan-300 font-semibold">Ready for Success</p>
                  <p className="text-xs text-slate-400">Dream Placement</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
