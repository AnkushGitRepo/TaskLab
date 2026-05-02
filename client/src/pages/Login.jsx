import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';
import useAuthStore from '../store/authStore';
import { validateEmail, validatePassword } from '../utils/validators';

/**
 * @page Login
 * @desc  User login page matching design system
 */
const Login = () => {
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailErr = validateEmail(form.email);
    if (emailErr) { setErrors({ email: emailErr }); return; }

    const result = await login(form);
    if (result.success) navigate('/dashboard');
    else setErrors({ submit: result.error });
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left: Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-primary flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full border-2 border-white" />
          <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full border-2 border-white" />
        </div>
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
            <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9">
              <rect x="3" y="5" width="18" height="2.5" rx="1.25" fill="white"/>
              <rect x="3" y="10.75" width="14" height="2.5" rx="1.25" fill="white" opacity="0.8"/>
              <rect x="3" y="16.5" width="11" height="2.5" rx="1.25" fill="white" opacity="0.6"/>
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Welcome back</h2>
          <p className="text-primary-100 text-lg max-w-sm">
            Your organized life awaits. Sign in to continue where you left off.
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-md bg-gradient-primary flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <rect x="3" y="5" width="18" height="2.5" rx="1.25" fill="white"/>
              </svg>
            </div>
            <span className="text-lg font-bold">Tasklab</span>
          </Link>

          <h1 className="text-3xl font-bold text-on-surface mb-2">Sign in</h1>
          <p className="text-on-surface-variant mb-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">
              Get started
            </Link>
          </p>

          {/* Quick login for demo */}
          <button
            type="button"
            onClick={async () => {
              const result = await login({ email: 'testuser@tasklab.com', password: 'Password1' });
              if (result.success) navigate('/dashboard');
            }}
            className="w-full mb-6 flex items-center justify-between gap-3 p-4 rounded-card border-2 border-dashed border-primary-300 bg-primary-50 hover:bg-primary-100 hover:border-primary-500 transition-all group"
          >
            <div className="text-left">
              <p className="text-sm font-bold text-primary-700">🚀 Try as Test User</p>
              <p className="text-xs text-primary-500 mt-0.5">testuser@tasklab.com · Password1</p>
            </div>
            <ArrowRight size={16} className="text-primary-500 group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </button>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5">Email</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="you@example.com"
                className={`input ${errors.email ? 'input-error' : ''}`}
                autoComplete="email"
              />
              {errors.email && <p className="mt-1 text-xs text-error">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-on-surface">Password</label>
                <a href="#" className="text-xs text-primary-600 font-medium hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="••••••••"
                  className={`input pr-10 ${errors.password ? 'input-error' : ''}`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {(errors.submit || error) && (
              <p className="text-sm text-error bg-error-container px-4 py-2 rounded-md">
                {errors.submit || error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full justify-center py-3"
            >
              Sign in
              <ArrowRight size={16} />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
