import { useState, useEffect, useRef } from 'react';
import { Bell, X, CheckCheck, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import useNotificationStore from '../../store/notificationStore';

/**
 * @component NotificationPanel
 * @desc      Bell icon + dropdown panel for all task events with unread badge
 */
const NotificationPanel = () => {
  const { notifications, unreadCount, markAllRead, markRead, clearAll } = useNotificationStore();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleToggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next && unreadCount > 0) {
      // Small delay so user sees badge before it clears
      setTimeout(markAllRead, 800);
    }
  };

  return (
    <div ref={panelRef} className="relative">
      {/* Bell button */}
      <button
        onClick={handleToggle}
        className="btn-icon relative"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        id="notification-bell"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-primary-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute right-0 top-11 w-80 sm:w-96 bg-white rounded-card shadow-modal border border-outline-variant/40 z-50 animate-fade-in-up">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/40">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-on-surface text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 bg-primary-100 text-primary-700 text-xs font-bold rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {notifications.length > 0 && (
                <>
                  <button
                    onClick={markAllRead}
                    className="btn-icon w-7 h-7"
                    title="Mark all read"
                  >
                    <CheckCheck size={14} />
                  </button>
                  <button
                    onClick={() => { clearAll(); }}
                    className="btn-icon w-7 h-7 hover:text-error"
                    title="Clear all notifications"
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              )}
              <button onClick={() => setIsOpen(false)} className="btn-icon w-7 h-7">
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Notifications list */}
          <div className="overflow-y-auto" style={{ maxHeight: 380 }}>
            {notifications.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell size={20} className="text-outline" />
                </div>
                <p className="text-sm font-semibold text-on-surface-variant">All caught up!</p>
                <p className="text-xs text-outline mt-1">Notifications appear here when tasks change</p>
              </div>
            ) : (
              <ul>
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={`flex items-start gap-3 px-4 py-3 border-b border-outline-variant/20 cursor-pointer transition-colors hover:bg-surface-container-low last:border-0 ${!n.read ? 'bg-primary-50/50' : ''}`}
                  >
                    {/* Emoji icon */}
                    <div className={`w-8 h-8 rounded-full ${n.icon?.bg || 'bg-gray-100'} flex items-center justify-center text-sm flex-shrink-0 mt-0.5`}>
                      {n.icon?.emoji || '📌'}
                    </div>

                    {/* Text content */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-snug ${!n.read ? 'font-semibold text-on-surface' : 'font-medium text-on-surface-variant'}`}>
                        {n.message}
                      </p>
                      <p className="text-xs text-outline mt-0.5">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </p>
                    </div>

                    {/* Unread dot */}
                    {!n.read && (
                      <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-2" aria-hidden />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
