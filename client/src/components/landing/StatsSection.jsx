import { useEffect, useRef, useState } from 'react';

const Counter = ({ target, suffix = '', label }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current = Math.min(current + increment, target);
            setCount(Math.floor(current));
            if (current >= target) clearInterval(timer);
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-bold text-on-surface mb-1">
        {count.toLocaleString()}{suffix}
      </div>
      <p className="text-on-surface-variant text-sm font-medium">{label}</p>
    </div>
  );
};

/**
 * @component StatsSection
 * @desc      Animated counter section that triggers on scroll
 */
const StatsSection = () => {
  const stats = [
    { target: 12000, suffix: '+', label: 'Active Teams' },
    { target: 98, suffix: '%', label: 'Customer Satisfaction' },
    { target: 500000, suffix: '+', label: 'Tasks Completed' },
    { target: 4.9, suffix: '★', label: 'Average Rating' },
  ];

  return (
    <section className="bg-white py-16">
      <div className="max-w-container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <Counter key={i} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
