import { create } from 'zustand';
import * as taskApi from '../api/taskApi';
import useNotificationStore from './notificationStore';

const notify = (type, message, meta) =>
  useNotificationStore.getState().push(type, message, meta);

const useTaskStore = create((set, get) => ({
  tasks: [],
  stats: null,
  loading: false,
  error: null,
  filters: { status: '', priority: '', project: '', search: '' },

  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),

  fetchTasks: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const res = await taskApi.getTasks({ ...get().filters, ...params });
      set({ tasks: res.data.data.tasks, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to load tasks', loading: false });
    }
  },

  fetchStats: async () => {
    try {
      const res = await taskApi.getTaskStats();
      set({ stats: res.data.data.stats });
    } catch {}
  },

  createTask: async (data) => {
    try {
      const res = await taskApi.createTask(data);
      const task = res.data.data.task;
      set((state) => ({ tasks: [task, ...state.tasks] }));
      get().fetchStats();
      notify('task_created', `Task "${task.title}" created`, { taskId: task._id, taskTitle: task.title });
      return { success: true, task };
    } catch (err) {
      return { success: false, error: err.response?.data?.message };
    }
  },

  updateTask: async (id, data) => {
    try {
      const res = await taskApi.updateTask(id, data);
      const updated = res.data.data.task;
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === id ? updated : t)),
      }));
      get().fetchStats();
      if (data.status === 'completed') {
        notify('task_completed', `"${updated.title}" marked as completed 🎉`, { taskId: id, taskTitle: updated.title });
      } else {
        notify('task_updated', `Task "${updated.title}" updated`, { taskId: id, taskTitle: updated.title });
      }
      return { success: true, task: updated };
    } catch (err) {
      return { success: false, error: err.response?.data?.message };
    }
  },

  updateTaskStatus: async (id, status) => {
    const task = get().tasks.find(t => t._id === id);
    set((state) => ({
      tasks: state.tasks.map((t) => (t._id === id ? { ...t, status } : t)),
    }));
    try {
      await taskApi.updateTaskStatus(id, status);
      get().fetchStats();
      if (status === 'completed') {
        notify('task_completed', `"${task?.title}" marked as completed 🎉`, { taskId: id, taskTitle: task?.title });
      }
      return { success: true };
    } catch (err) {
      get().fetchTasks();
      return { success: false, error: err.response?.data?.message };
    }
  },

  reorderTasks: async (id, order, status) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t._id === id ? { ...t, order, status: status || t.status } : t
      ),
    }));
    try {
      await taskApi.updateTaskOrder(id, { order, status });
    } catch {}
  },

  deleteTask: async (id) => {
    const task = get().tasks.find(t => t._id === id);
    set((state) => ({ tasks: state.tasks.filter((t) => t._id !== id) }));
    try {
      await taskApi.deleteTask(id);
      get().fetchStats();
      notify('task_deleted', `Task "${task?.title}" deleted`, { taskId: id, taskTitle: task?.title });
      return { success: true };
    } catch (err) {
      get().fetchTasks();
      return { success: false, error: err.response?.data?.message };
    }
  },
}));

export default useTaskStore;
