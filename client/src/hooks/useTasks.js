import { useEffect, useCallback } from 'react';
import useTaskStore from '../store/taskStore';

/**
 * @desc    Tasks hook — fetching + CRUD operations
 * @usage   const { tasks, loading, createTask } = useTasks();
 */
const useTasks = (params = {}) => {
  const store = useTaskStore();

  const refresh = useCallback(() => {
    store.fetchTasks(params);
  }, [JSON.stringify(params)]);

  useEffect(() => {
    store.fetchTasks(params);
    store.fetchStats();
  }, [JSON.stringify(params)]);

  return {
    tasks: store.tasks,
    stats: store.stats,
    loading: store.loading,
    error: store.error,
    filters: store.filters,
    setFilters: store.setFilters,
    createTask: store.createTask,
    updateTask: store.updateTask,
    updateTaskStatus: store.updateTaskStatus,
    reorderTasks: store.reorderTasks,
    deleteTask: store.deleteTask,
    refresh,
  };
};

export default useTasks;
