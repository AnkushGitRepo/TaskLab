import { create } from 'zustand';
import * as authApi from '../api/authApi';

const TOKEN_KEY = 'tasklab_token';
const USER_KEY = 'tasklab_user';

const getStoredUser = () => {
  try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
};

const useAuthStore = create((set) => ({
  user: getStoredUser(),
  token: localStorage.getItem(TOKEN_KEY),
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const res = await authApi.login(credentials);
      const { token, user } = res.data.data;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      set({ user, token, loading: false });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      set({ error: msg, loading: false });
      return { success: false, error: msg };
    }
  },

  register: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await authApi.register(data);
      const { token, user } = res.data.data;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      set({ user, token, loading: false });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      set({ error: msg, loading: false });
      return { success: false, error: msg };
    }
  },

  logout: async () => {
    try { await authApi.logout(); } catch {}
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({ user: null, token: null });
  },

  updateProfile: async (data) => {
    try {
      const res = await authApi.updateMe(data);
      const user = res.data.data.user;
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      set({ user });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message };
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
