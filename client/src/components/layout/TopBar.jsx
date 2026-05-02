import { Search, Plus, Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../common/Avatar';
import NotificationPanel from '../notifications/NotificationPanel';
import useAuthStore from '../../store/authStore';

/**
 * @component TopBar
 * @desc      App top nav — mobile hamburger, live search, notification bell, create task
 */
const TopBar = ({ title = 'Dashboard', onCreateTask, onMenuToggle, onSearch }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  // ⌘K shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleSearch = (val) => {
    setSearchVal(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (onSearch) {
        onSearch(val);
      } else if (val.trim()) {
        // Default: navigate to tasks with search param
        navigate(`/tasks?search=${encodeURIComponent(val.trim())}`);
      }
    }, 400);
  };

  const clearSearch = () => {
    setSearchVal('');
    onSearch?.('');
    setSearchOpen(false);
  };

  return (
    <header className="flex items-center gap-3 px-4 md:px-6 py-3 md:py-4 bg-white border-b border-outline-variant sticky top-0 z-30">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuToggle}
        className="btn-icon lg:hidden flex-shrink-0"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Page title */}
      <h1 className={`text-base md:text-xl font-bold text-on-surface flex-1 min-w-0 truncate ${searchOpen ? 'hidden sm:block' : ''}`}>
        {title}
      </h1>

      {/* Desktop search */}
      <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-pill border transition-all duration-200 ${
        searchFocused
          ? 'border-primary-500 ring-2 ring-primary-100 bg-white w-72'
          : 'border-outline-variant bg-surface-container-low w-56'
      }`}>
        <Search size={15} className="text-on-surface-variant flex-shrink-0" />
        <input
          ref={searchRef}
          type="text"
          value={searchVal}
          placeholder="Search tasks…"
          className="flex-1 bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant outline-none min-w-0"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {searchVal ? (
          <button onClick={clearSearch}><X size={13} className="text-on-surface-variant" /></button>
        ) : (
          !searchFocused && (
            <kbd className="hidden lg:block text-xs text-on-surface-variant bg-surface-container-highest px-1.5 py-0.5 rounded font-mono flex-shrink-0">⌘K</kbd>
          )
        )}
      </div>

      {/* Mobile search (expands) */}
      {searchOpen ? (
        <div className="flex md:hidden flex-1 items-center gap-2 px-3 py-2 rounded-pill border border-primary-500 bg-white ring-2 ring-primary-100">
          <Search size={15} className="text-primary-500 flex-shrink-0" />
          <input
            autoFocus
            type="text"
            value={searchVal}
            placeholder="Search tasks…"
            className="flex-1 text-sm outline-none bg-transparent min-w-0"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <button onClick={clearSearch}><X size={15} className="text-on-surface-variant" /></button>
        </div>
      ) : (
        <button className="btn-icon md:hidden" onClick={() => setSearchOpen(true)}>
          <Search size={18} />
        </button>
      )}

      {/* Right actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Create task */}
        <button
          onClick={onCreateTask}
          className="btn-primary py-2 px-3 md:px-5 text-sm"
          id="create-task-btn"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">New Task</span>
        </button>

        {/* Notifications */}
        <NotificationPanel />

        {/* Avatar */}
        <Avatar
          name={user?.name || 'User'}
          src={user?.avatar}
          size="sm"
          className="cursor-pointer flex-shrink-0"
        />
      </div>
    </header>
  );
};

export default TopBar;
