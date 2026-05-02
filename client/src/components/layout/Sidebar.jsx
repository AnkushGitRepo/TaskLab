import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FolderOpen, CheckSquare,
  BarChart3, Plus, ChevronDown, ChevronRight, X, LogOut,
} from 'lucide-react';
import { useState } from 'react';
import Avatar from '../common/Avatar';
import useAuthStore from '../../store/authStore';
import useProjectStore from '../../store/projectStore';

const Sidebar = ({ mobileOpen = false, onMobileClose }) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { projects } = useProjectStore();
  const [topicsOpen, setTopicsOpen] = useState(true);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: FolderOpen,      label: 'Projects',  href: '/projects' },
    { icon: CheckSquare,     label: 'My Tasks',  href: '/tasks' },
    { icon: BarChart3,       label: 'Analytics', href: '/analytics' },
  ];

  const isActive = (href) =>
    location.pathname === href ||
    (href !== '/dashboard' && !href.includes('?') && location.pathname.startsWith(href));

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-outline-variant">
        <Link to="/dashboard" className="flex items-center gap-3" onClick={onMobileClose}>
          <div className="w-8 h-8 rounded-md bg-gradient-primary flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <rect x="3" y="5"    width="18" height="2.5" rx="1.25" fill="white" />
              <rect x="3" y="10.75" width="14" height="2.5" rx="1.25" fill="white" opacity="0.8" />
              <rect x="3" y="16.5" width="11" height="2.5" rx="1.25" fill="white" opacity="0.6" />
            </svg>
          </div>
          <span className="text-lg font-bold text-on-surface">Tasklab</span>
        </Link>
        {onMobileClose && (
          <button onClick={onMobileClose} className="btn-icon lg:hidden">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {navItems.map(({ icon: Icon, label, href }) => (
            <li key={href}>
              <Link
                to={href}
                onClick={onMobileClose}
                className={`sidebar-link ${isActive(href) ? 'sidebar-link-active' : ''}`}
              >
                <Icon size={18} className="flex-shrink-0" />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Projects / Topics */}
        <div className="mt-6">
          <button
            onClick={() => setTopicsOpen(!topicsOpen)}
            className="flex items-center justify-between w-full px-3 py-1.5 text-xs font-semibold text-on-surface-variant uppercase tracking-wider hover:text-on-surface transition-colors"
          >
            <span>Projects</span>
            {topicsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {topicsOpen && (
            <ul className="mt-1 space-y-0.5">
              {projects.slice(0, 7).map((project) => (
                <li key={project._id}>
                  <Link
                    to={`/tasks?project=${project._id}`}
                    onClick={onMobileClose}
                    className="sidebar-link"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: project.color || '#6B4EFF' }}
                    />
                    <span className="truncate">{project.name}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/projects"
                  onClick={onMobileClose}
                  className="sidebar-link text-primary-500 hover:bg-primary-50"
                >
                  <Plus size={14} />
                  <span>New Project</span>
                </Link>
              </li>
            </ul>
          )}
        </div>
      </nav>

      {/* User footer */}
      <div className="border-t border-outline-variant p-3">
        <div className="flex items-center gap-3 p-2 rounded-md hover:bg-surface-container-high transition-colors">
          <Avatar name={user?.name || 'User'} src={user?.avatar} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-on-surface truncate">{user?.name}</p>
            <p className="text-xs text-on-surface-variant truncate">{user?.email}</p>
          </div>
          <button
            onClick={() => logout()}
            className="btn-icon"
            title="Logout"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-64 h-screen bg-white border-r border-outline-variant flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={onMobileClose}
          />
          <aside className="fixed left-0 top-0 h-full w-72 z-50 bg-white shadow-modal flex flex-col lg:hidden animate-slide-in-left">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
};

export default Sidebar;
