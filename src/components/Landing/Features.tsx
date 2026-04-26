import { BookOpen, Code, Trophy, Newspaper, Briefcase, Bookmark, Zap, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Study Notes',
    description: 'Access comprehensive notes organized by subject, branch, and semester',
    gradient: 'from-blue-500 to-cyan-500',
    delay: 0,
  },
  {
    icon: Code,
    title: 'Practice Questions',
    description: 'Solve topic-wise problems with multiple difficulty levels and explanations',
    gradient: 'from-green-500 to-emerald-500',
    delay: 100,
  },
  {
    icon: Trophy,
    title: 'Mock Tests',
    description: 'Full-length timed tests with real-time feedback and performance tracking',
    gradient: 'from-orange-500 to-red-500',
    delay: 200,
  },
  {
    icon: Zap,
    title: 'AI Analytics',
    description: 'Get intelligent insights about your weak topics and personalized recommendations',
    gradient: 'from-purple-500 to-pink-500',
    delay: 300,
  },
  {
    icon: Newspaper,
    title: 'Tech News',
    description: 'Stay updated with the latest trends in technology and industry developments',
    gradient: 'from-red-500 to-orange-500',
    delay: 400,
  },
  {
    icon: Briefcase,
    title: 'Opportunities',
    description: 'Discover hackathons, internships, drives, and career opportunities',
    gradient: 'from-indigo-500 to-purple-500',
    delay: 500,
  },
  {
    icon: Bookmark,
    title: 'Bookmarks',
    description: 'Save your favorite resources for quick and easy access anytime',
    gradient: 'from-yellow-500 to-orange-500',
    delay: 600,
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    description: 'Visualize your growth with detailed performance dashboards and statistics',
    gradient: 'from-cyan-500 to-blue-500',
    delay: 700,
  },
];

export function Features() {
  return (
    <section className="py-20 bg-slate-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl opacity-50" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl opacity-50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              Everything You Need
            </span>
            <br />
            <span className="text-white">To Excel</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            A comprehensive platform designed for students, by understanding students' needs
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group glass rounded-2xl p-6 hover-lift animate-fadeInUp"
                style={{ animationDelay: `${feature.delay}ms` }}
              >
                {/* Icon */}
                <div className={`mb-4 inline-block p-4 rounded-xl bg-gradient-to-br ${feature.gradient} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-cyan-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                  {feature.description}
                </p>

                {/* Hover indicator */}
                <div className="mt-4 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 origin-left" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
