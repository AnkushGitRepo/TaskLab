import { Brain, Clock, BarChart3, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Brain,
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-600',
    title: 'Smart Tasking',
    description: 'AI-driven prioritization that helps you tackle the most important things first.',
    badge: 'Intelligent',
    badgeBg: 'bg-primary-50 text-primary-700',
  },
  {
    icon: Clock,
    iconBg: 'bg-secondary-100',
    iconColor: 'text-secondary-600',
    title: 'Time Blocking',
    description: 'Visualize your day with integrated calendar blocks and deep work sessions.',
    badge: 'Focused',
    badgeBg: 'bg-secondary-50 text-secondary-700',
  },
  {
    icon: BarChart3,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    title: 'Progress Insights',
    description: 'Beautiful, actionable analytics on how you spend your time and complete tasks.',
    badge: 'Analytics',
    badgeBg: 'bg-green-50 text-green-700',
  },
];

/**
 * @component FeaturesSection
 * @desc      3-column feature cards section
 */
const FeaturesSection = () => (
  <section className="py-20 bg-surface-container-low">
    <div className="max-w-container mx-auto px-6">
      <div className="text-center mb-14">
        <p className="text-label text-primary-600 font-semibold uppercase tracking-wider mb-3">Why Tasklab</p>
        <h2 className="text-h2 text-on-surface mb-4">
          Streamlining Your Daily Tasks
        </h2>
        <p className="text-body-lg text-on-surface-variant max-w-xl mx-auto">
          We strip away the clutter so you can focus on what actually matters.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} className="card-hover p-7 group">
              <div className={`w-12 h-12 rounded-card ${feature.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200`}>
                <Icon size={24} className={feature.iconColor} />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2.5 py-0.5 rounded-pill text-xs font-semibold ${feature.badgeBg}`}>
                  {feature.badge}
                </span>
              </div>
              <h3 className="text-h3 text-on-surface mb-2">{feature.title}</h3>
              <p className="text-body-md text-on-surface-variant">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
