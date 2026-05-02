import { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import TaskForm from '../tasks/TaskForm';

/**
 * @component PageWrapper
 * @desc      App shell — sidebar drawer on mobile, search wired to onSearch prop
 */
const PageWrapper = ({ children, title, onSearch }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [taskFormOpen, setTaskFormOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <TopBar
          title={title}
          onCreateTask={() => setTaskFormOpen(true)}
          onMenuToggle={() => setMobileSidebarOpen(true)}
          onSearch={onSearch}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>

      <TaskForm
        isOpen={taskFormOpen}
        onClose={() => setTaskFormOpen(false)}
        onSave={() => setTaskFormOpen(false)}
      />
    </div>
  );
};

export default PageWrapper;
