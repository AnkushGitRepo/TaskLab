/**
 * @component Avatar
 * @desc      User avatar with image fallback to initials
 * @usage     <Avatar name="Ankush" src={user.avatar} size="sm" />
 */
const Avatar = ({ name = '', src = null, size = 'md', className = '' }) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const initials = name
    .split(' ')
    .map((part) => part[0]?.toUpperCase() || '')
    .slice(0, 2)
    .join('');

  // Color from name hash
  const colors = [
    'bg-primary-100 text-primary-700',
    'bg-blue-100 text-blue-700',
    'bg-green-100 text-green-700',
    'bg-orange-100 text-orange-700',
    'bg-pink-100 text-pink-700',
    'bg-purple-100 text-purple-700',
  ];
  const colorIndex = name.charCodeAt(0) % colors.length;

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover flex-shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} ${colors[colorIndex]} rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${className}`}
      title={name}
    >
      {initials}
    </div>
  );
};

export default Avatar;
