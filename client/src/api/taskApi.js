import api from './axiosInstance';

export const getTasks = (params) => api.get('/tasks', { params });
export const getTask = (id) => api.get(`/tasks/${id}`);
export const createTask = (data) => api.post('/tasks', data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const updateTaskStatus = (id, status) => api.patch(`/tasks/${id}/status`, { status });
export const updateTaskOrder = (id, data) => api.patch(`/tasks/${id}/order`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const addComment = (id, text) => api.post(`/tasks/${id}/comments`, { text });
export const bulkUpdate = (taskIds, status) => api.post('/tasks/bulk', { taskIds, status });
export const getTaskStats = () => api.get('/tasks/stats');
