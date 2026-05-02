import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

/**
 * @desc    Auth hook — provides login/register/logout with redirect logic
 * @usage   const { user, login, logout, loading } = useAuth();
 */
const useAuth = ({ requireAuth = false, redirectTo = '/login' } = {}) => {
  const navigate = useNavigate();
  const { user, token, loading, error, login, register, logout, updateProfile, clearError } =
    useAuthStore();

  useEffect(() => {
    if (requireAuth && !token) {
      navigate(redirectTo);
    }
  }, [requireAuth, token, navigate, redirectTo]);

  return { user, token, loading, error, login, register, logout, updateProfile, clearError, isAuthenticated: !!token };
};

export default useAuth;
