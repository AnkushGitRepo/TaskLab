import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from 'recharts';
import PageWrapper from '../components/layout/PageWrapper';
import useAuth from '../hooks/useAuth';
import useTasks from '../hooks/useTasks';

const PRIORITY_COLORS = { high: '#EF4444', medium: '#F97316', low: '#22C55E' };
const STATUS_COLORS = { todo: '#9CA3AF', in_progress: '#3B82F6', completed: '#22C55E', overdue: '#EF4444' };

/**
 * @page Analytics
 * @desc  Charts dashboard showing task aggregations using Recharts
 */
const Analytics = () => {
  useAuth({ requireAuth: true });
  const { tasks, stats, loading } = useTasks();

  // Build chart data from tasks
  const byStatusData = Object.entries(stats?.byStatus || {}).map(([key, value]) => ({
    name: key.replace('_', ' '),
    count: value,
    fill: STATUS_COLORS[key] || '#6B4EFF',
  }));

  const byPriorityData = Object.entries(stats?.byPriority || {}).map(([key, value]) => ({
    name: key,
    value,
    fill: PRIORITY_COLORS[key] || '#6B4EFF',
  }));

  // Weekly completion trend (tasks completed each day of the week)
  const weeklyData = (() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const counts = Array(7).fill(0);
    tasks.forEach((t) => {
      if (t.status === 'completed' && t.completedAt) {
        const d = new Date(t.completedAt).getDay();
        counts[d === 0 ? 6 : d - 1]++;
      }
    });
    return days.map((day, i) => ({ day, completed: counts[i] }));
  })();

  return (
    <PageWrapper title="Analytics">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Tasks', value: stats?.total || 0, color: 'text-primary-600', bg: 'bg-primary-100' },
          { label: 'Completed', value: stats?.byStatus?.completed || 0, color: 'text-green-600', bg: 'bg-green-100' },
          { label: 'In Progress', value: stats?.byStatus?.in_progress || 0, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Overdue', value: stats?.overdue || 0, color: 'text-red-600', bg: 'bg-red-100' },
        ].map((s) => (
          <div key={s.label} className="card p-5">
            <p className={`text-3xl font-bold ${s.color} mb-1`}>{s.value}</p>
            <p className="text-sm text-on-surface-variant font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Tasks by Status bar chart */}
        <div className="card p-6">
          <h3 className="text-h3 font-bold mb-6">Tasks by Status</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={byStatusData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E0EF" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#474556' }} />
              <YAxis tick={{ fontSize: 12, fill: '#474556' }} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {byStatusData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Priority pie chart */}
        <div className="card p-6">
          <h3 className="text-h3 font-bold mb-6">Priority Breakdown</h3>
          {byPriorityData.length === 0 ? (
            <div className="flex items-center justify-center h-[240px] text-on-surface-variant">No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={byPriorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {byPriorityData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Weekly completion trend */}
      <div className="card p-6">
        <h3 className="text-h3 font-bold mb-6">Weekly Completion Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={weeklyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E0EF" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#474556' }} />
            <YAxis tick={{ fontSize: 12, fill: '#474556' }} />
            <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
            <Line
              type="monotone"
              dataKey="completed"
              stroke="#6B4EFF"
              strokeWidth={2.5}
              dot={{ r: 5, fill: '#6B4EFF' }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </PageWrapper>
  );
};

export default Analytics;
