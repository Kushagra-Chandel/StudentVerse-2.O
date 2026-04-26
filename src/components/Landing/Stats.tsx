import { useEffect, useState } from 'react';

const stats = [
  { number: '500+', label: 'Study Materials', icon: '📚' },
  { number: '1000+', label: 'Practice Questions', icon: '🧠' },
  { number: '50+', label: 'Mock Tests', icon: '🎯' },
  { number: '10K+', label: 'Active Students', icon: '👥' },
];

function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepValue = target / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setCount(Math.min(Math.floor(currentStep * stepValue), target));

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target]);

  return <span>{count}</span>;
}

export function Stats() {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="glass p-8 rounded-2xl text-center hover-lift group animate-fadeInUp"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <span className="text-4xl mb-4 block group-hover:scale-125 transition-transform">{stat.icon}</span>
              <div className="text-4xl font-bold text-cyan-400 mb-2">
                <AnimatedCounter target={parseInt(stat.number)} />
                {stat.number.match(/\D/g)?.join('') || ''}
              </div>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
