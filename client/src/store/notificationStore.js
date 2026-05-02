/**
 * @file   notificationStore.js
 * @desc   In-memory + localStorage notification store
 *         Events: task_created | task_updated | task_deleted | task_completed | task_overdue
 */
import { create } from 'zustand';

const STORAGE_KEY = 'tasklab_notifications';
const MAX = 50;

const load = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
};

const save = (notifications) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications.slice(0, MAX))); }
  catch {}
};

const ICONS = {
  task_created:   { emoji: '✅', color: 'text-green-600', bg: 'bg-green-50' },
  task_updated:   { emoji: '✏️', color: 'text-blue-600',  bg: 'bg-blue-50'  },
  task_deleted:   { emoji: '🗑️', color: 'text-red-600',   bg: 'bg-red-50'   },
  task_completed: { emoji: '🎉', color: 'text-primary-600', bg: 'bg-primary-50' },
  task_overdue:   { emoji: '⚠️', color: 'text-orange-600', bg: 'bg-orange-50' },
};

const useNotificationStore = create((set, get) => ({
  notifications: load(),
  unreadCount: load().filter(n => !n.read).length,

  /**
   * Add a new notification
   * @param {'task_created'|'task_updated'|'task_deleted'|'task_completed'|'task_overdue'} type
   * @param {string} message  Human-readable message
   * @param {object} [meta]   Extra metadata (taskId, taskTitle, etc.)
   */
  push: (type, message, meta = {}) => {
    const notification = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type,
      message,
      meta,
      icon: ICONS[type] || ICONS.task_updated,
      read: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [notification, ...get().notifications].slice(0, MAX);
    save(updated);
    set({ notifications: updated, unreadCount: updated.filter(n => !n.read).length });
  },

  markAllRead: () => {
    const updated = get().notifications.map(n => ({ ...n, read: true }));
    save(updated);
    set({ notifications: updated, unreadCount: 0 });
  },

  markRead: (id) => {
    const updated = get().notifications.map(n => n.id === id ? { ...n, read: true } : n);
    save(updated);
    set({ notifications: updated, unreadCount: updated.filter(n => !n.read).length });
  },

  clearAll: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ notifications: [], unreadCount: 0 });
  },
}));

export default useNotificationStore;
