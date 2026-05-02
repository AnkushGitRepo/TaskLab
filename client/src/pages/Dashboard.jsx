import { useState, useCallback } from 'react';
import { CheckCircle, Clock, AlertTriangle, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import PageWrapper from '../components/layout/PageWrapper';
import TaskCard from '../components/tasks/TaskCard';
import useTasks from '../hooks/useTasks';
import useAuth from '../hooks/useAuth';

const StatCard = ({ icon: Icon, label, value, iconBg, iconColor }) => (
  <div className="card p-4 md:p-5 flex items-center gap-3 md:gap-4">
    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-card ${iconBg} flex items-center justify-center flex-shrink-0`}>
      <Icon size={20} className={iconColor} />
    </div>
    <div className="min-w-0">
      <p className="text-xl md:text-2xl font-bold text-on-surface">{value}</p>
      <p className="text-xs md:text-sm font-medium text-on-surface-variant truncate">{label}</p>
    </div>
  </div>
);

/**
 * @page Dashboard
 * @desc  Home — stat cards + recent tasks with live search
 */
const Dashboard = () => {
  useAuth({ requireAuth: true });
  const [searchQuery, setSearchQuery] = useState('');
  const { tasks, stats, loading } = useTasks({ limit: 50, search: searchQuery });

  const handleSearch = useCallback((val) => setSearchQuery(val), []);

  // If searching, show filtered; otherwise show most recent 6
  const displayed = searchQuery ? tasks : tasks.slice(0, 6);

  const statCards = [
    { icon: CheckCircle, label: 'Completed', value: stats?.byStatus?.completed || 0, iconBg: 'bg-green-100', iconColor: 'text-green-600' },
    { icon: Clock,       label: 'In Progress', value: stats?.byStatus?.in_progress || 0, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
    { icon: AlertTriangle, label: 'Overdue', value: stats?.overdue || stats?.byStatus?.overdue || 0, iconBg: 'bg-red-100', iconColor: 'text-red-600' },
    { icon: TrendingUp,  label: 'Total', value: stats?.total || 0, iconBg: 'bg-primary-100', iconColor: 'text-primary-600' },
  ];

  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 12 ? 'Good morning' : greetingHour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <PageWrapper title="Dashboard" onSearch={handleSearch}>
      {/* Welcome banner */}
      <div className="bg-gradient-primary rounded-card p-5 md:p-7 mb-5 md:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-1">{greeting}! 👋</h2>
          <p className="text-primary-100 text-sm md:text-base">{format(new Date(), 'EEEE, MMMM d')}</p>
        </div>
        <div className="px-3 py-1.5 bg-white/20 rounded-pill text-white text-sm font-semibold">
          {(stats?.byStatus?.todo || 0) + (stats?.byStatus?.in_progress || 0)} active tasks
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {statCards.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Task list */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base md:text-lg font-bold text-on-surface">
            {searchQuery ? `Results for "${searchQuery}"` : 'Recent Tasks'}
          </h2>
          {!searchQuery && (
            <Link to="/tasks" className="flex items-center gap-1 text-sm font-semibold text-primary-600 hover:underline">
              View all <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="h-4 bg-surface-container-high rounded mb-3" />
                <div className="h-3 bg-surface-container-high rounded w-2/3 mb-4" />
                <div className="h-5 bg-surface-container-high rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="card p-10 md:p-16 text-center">
            <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={24} className="text-primary-500" />
            </div>
            <h3 className="text-lg font-semibold text-on-surface mb-2">
              {searchQuery ? 'No tasks found' : 'No tasks yet'}
            </h3>
            <p className="text-on-surface-variant text-sm mb-5">
              {searchQuery ? `Try a different search term` : 'Create your first task to get started'}
            </p>
            {!searchQuery && (
              <Link to="/tasks" className="btn-primary inline-flex">
                <Plus size={16} />Go to Tasks
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayed.map(task => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
