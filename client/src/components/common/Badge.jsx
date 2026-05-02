import { getPriorityConfig, getStatusConfig } from '../../utils/priorityHelpers';

/**
 * @component Badge
 * @desc      Pill-shaped badge for task priority and status display
 * @usage     <Badge type="priority" value="high" />
 *            <Badge type="status" value="in_progress" />
 */
const Badge = ({ type, value, className = '' }) => {
  const config = type === 'priority' ? getPriorityConfig(value) : getStatusConfig(value);

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill text-xs font-semibold ${config.bgClass} ${config.textClass} ${className}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: config.color }}
      />
      {config.label}
    </span>
  );
};

export default Badge;
