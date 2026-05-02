/**
 * @component Button
 * @desc      Reusable button with primary, secondary, ghost, and icon variants
 * @usage     <Button variant="primary" onClick={...}>Save</Button>
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  leftIcon,
  rightIcon,
  ...props
}) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-pill bg-red-500 text-white font-semibold text-sm transition-all duration-200 hover:bg-red-600 active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-4 py-1.5 text-xs',
    md: '',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <button
      className={`${variants[variant]} ${sizes[size]} ${disabled || loading ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      ) : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
};

export default Button;
