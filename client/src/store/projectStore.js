import { create } from 'zustand';
import * as projectApi from '../api/projectApi';

const useProjectStore = create((set, get) => ({
  projects: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true });
    try {
      const res = await projectApi.getProjects();
      set({ projects: res.data.data.projects, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message, loading: false });
    }
  },

  createProject: async (data) => {
    try {
      const res = await projectApi.createProject(data);
      const project = res.data.data.project;
      set((state) => ({ projects: [project, ...state.projects] }));
      return { success: true, project };
    } catch (err) {
      return { success: false, error: err.response?.data?.message };
    }
  },

  updateProject: async (id, data) => {
    try {
      const res = await projectApi.updateProject(id, data);
      const updated = res.data.data.project;
      set((state) => ({
        projects: state.projects.map((p) => (p._id === id ? updated : p)),
      }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message };
    }
  },

  deleteProject: async (id) => {
    set((state) => ({ projects: state.projects.filter((p) => p._id !== id) }));
    try {
      await projectApi.deleteProject(id);
      return { success: true };
    } catch (err) {
      get().fetchProjects();
      return { success: false, error: err.response?.data?.message };
    }
  },
}));

export default useProjectStore;
