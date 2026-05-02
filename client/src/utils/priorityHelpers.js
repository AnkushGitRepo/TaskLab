/**
 * Priority color and label mapping for the Tasklab design system
 */

export const PRIORITY_CONFIG = {
  high: {
    label: 'High',
    color: '#EF4444',
    bgClass: 'bg-red-50',
    textClass: 'text-red-700',
    dotColor: '#EF4444',
  },
  medium: {
    label: 'Medium',
    color: '#F97316',
    bgClass: 'bg-orange-50',
    textClass: 'text-orange-700',
    dotColor: '#F97316',
  },
  low: {
    label: 'Low',
    color: '#22C55E',
    bgClass: 'bg-green-50',
    textClass: 'text-green-700',
    dotColor: '#22C55E',
  },
};

export const STATUS_CONFIG = {
  todo: {
    label: 'To Do',
    color: '#6B7280',
    bgClass: 'bg-gray-100',
    textClass: 'text-gray-600',
  },
  in_progress: {
    label: 'In Progress',
    color: '#3B82F6',
    bgClass: 'bg-blue-50',
    textClass: 'text-blue-700',
  },
  completed: {
    label: 'Completed',
    color: '#22C55E',
    bgClass: 'bg-green-50',
    textClass: 'text-green-700',
  },
  overdue: {
    label: 'Overdue',
    color: '#EF4444',
    bgClass: 'bg-red-50',
    textClass: 'text-red-700',
  },
};

export const getPriorityConfig = (priority) => PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;
export const getStatusConfig = (status) => STATUS_CONFIG[status] || STATUS_CONFIG.todo;

export const PROJECT_COLORS = [
  '#6B4EFF', '#FF6B6B', '#FFD84D', '#4ECDC4', '#45B7D1',
  '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
];
