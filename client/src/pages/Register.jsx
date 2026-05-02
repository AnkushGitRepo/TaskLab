import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import Button from '../components/common/Button';
import useAuthStore from '../store/authStore';
import { validateEmail, validatePassword } from '../utils/validators';

/**
 * @page Register
 * @desc  User registration page matching design system
 */
const Register = () => {
  const { register, login, loading, error } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    const emailErr = validateEmail(form.email);
    if (emailErr) newErrors.email = emailErr;
    const passErr = validatePassword(form.password);
    if (passErr) newErrors.password = passErr;
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    const result = await register(form);
    if (result.success) navigate('/dashboard');
    else setErrors({ submit: result.error });
  };

  const perks = [
    'Unlimited tasks & projects',
    'Kanban, Table & Calendar views',
    'Team collaboration tools',
    'Analytics & insights',
  ];

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left: Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-md bg-gradient-primary flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <rect x="3" y="5" width="18" height="2.5" rx="1.25" fill="white"/>
              </svg>
            </div>
            <span className="text-lg font-bold">Tasklab</span>
          </Link>

          <h1 className="text-3xl font-bold text-on-surface mb-2">Create your account</h1>
          <p className="text-on-surface-variant mb-8">
            Already have one?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
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
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5">Full Name</label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Your name"
                className={`input ${errors.name ? 'input-error' : ''}`}
                autoFocus
              />
              {errors.name && <p className="mt-1 text-xs text-error">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5">Email</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="you@example.com"
                className={`input ${errors.email ? 'input-error' : ''}`}
              />
              {errors.email && <p className="mt-1 text-xs text-error">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Min 8 chars, letters & numbers"
                  className={`input pr-10 ${errors.password ? 'input-error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-error">{errors.password}</p>}
            </div>

            {(errors.submit || error) && (
              <p className="text-sm text-error bg-error-container px-4 py-2 rounded-md">
                {errors.submit || error}
              </p>
            )}

            <Button type="submit" variant="primary" loading={loading} className="w-full justify-center py-3">
              Create Account
              <ArrowRight size={16} />
            </Button>

            <p className="text-xs text-on-surface-variant text-center">
              By signing up, you agree to our{' '}
              <a href="#" className="text-primary-600 hover:underline">Terms</a> &{' '}
              <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>
            </p>
          </form>
        </div>
      </div>

      {/* Right: Perks */}
      <div className="hidden lg:flex lg:w-5/12 bg-surface-container-low flex-col justify-center p-12">
        <h2 className="text-3xl font-bold text-on-surface mb-4">Everything you need to stay organized</h2>
        <p className="text-on-surface-variant mb-8">Free forever for individuals. Upgrade anytime for teams.</p>
        <ul className="space-y-4">
          {perks.map((perk) => (
            <li key={perk} className="flex items-center gap-3">
              <CheckCircle size={20} className="text-primary-500 flex-shrink-0" />
              <span className="text-on-surface font-medium">{perk}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Register;
