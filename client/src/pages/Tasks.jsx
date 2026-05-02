import { useState, useEffect, useCallback } from 'react';
import { LayoutGrid, Table, Calendar, List, SlidersHorizontal, Plus, X, Trash2, Edit2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import KanbanBoard from '../components/kanban/KanbanBoard';
import CalendarGrid from '../components/calendar/CalendarGrid';
import TaskForm from '../components/tasks/TaskForm';
import Badge from '../components/common/Badge';
import useAuth from '../hooks/useAuth';
import useTasks from '../hooks/useTasks';
import useProjectStore from '../store/projectStore';
import { formatDate, isOverdue } from '../utils/dateHelpers';

// ─── Confirm Delete Dialog ───────────────────────────────────────────────────
const DeleteConfirm = ({ task, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
    <div className="relative bg-white rounded-card shadow-modal p-6 w-full max-w-sm animate-fade-in-up">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Trash2 size={22} className="text-error" />
      </div>
      <h3 className="text-center font-bold text-on-surface mb-1">Delete Task?</h3>
      <p className="text-center text-sm text-on-surface-variant mb-5">
        "{task.title}" will be permanently removed.
      </p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="btn-secondary flex-1 py-2.5">Cancel</button>
        <button onClick={onConfirm} className="flex-1 py-2.5 rounded-pill bg-error text-white font-semibold text-sm hover:bg-red-700 transition-colors">
          Delete
        </button>
      </div>
    </div>
  </div>
);

// ─── Advanced Filter Panel ───────────────────────────────────────────────────
const FilterPanel = ({ filters, onChange, projects, onClose }) => {
  const [local, setLocal] = useState(filters);

  const apply = () => { onChange(local); onClose(); };
  const reset = () => { const cleared = { status: '', priority: '', project: '', startDate: '', endDate: '' }; setLocal(cleared); onChange(cleared); onClose(); };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:w-auto sm:min-w-[380px] rounded-t-2xl sm:rounded-card shadow-modal p-6 animate-fade-in-up">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-on-surface flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-primary-500" />
            Advanced Filters
          </h3>
          <button onClick={onClose} className="btn-icon"><X size={16} /></button>
        </div>

        <div className="space-y-4">
          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Status</label>
            <div className="flex flex-wrap gap-2">
              {['todo', 'in_progress', 'completed', 'overdue'].map(s => (
                <button
                  key={s}
                  onClick={() => setLocal(p => ({ ...p, status: p.status === s ? '' : s }))}
                  className={`px-3 py-1.5 rounded-pill text-xs font-semibold border transition-all ${
                    local.status === s
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'border-outline-variant text-on-surface-variant hover:border-primary-300'
                  }`}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Priority</label>
            <div className="flex flex-wrap gap-2">
              {['low', 'medium', 'high'].map(p => (
                <button
                  key={p}
                  onClick={() => setLocal(prev => ({ ...prev, priority: prev.priority === p ? '' : p }))}
                  className={`px-3 py-1.5 rounded-pill text-xs font-semibold border transition-all ${
                    local.priority === p
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'border-outline-variant text-on-surface-variant hover:border-primary-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Project */}
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Project</label>
            <select
              value={local.project}
              onChange={e => setLocal(p => ({ ...p, project: e.target.value }))}
              className="input"
            >
              <option value="">All Projects</option>
              {projects.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Date range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">From Date</label>
              <input type="date" value={local.startDate} onChange={e => setLocal(p => ({ ...p, startDate: e.target.value }))} className="input" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">To Date</label>
              <input type="date" value={local.endDate} onChange={e => setLocal(p => ({ ...p, endDate: e.target.value }))} className="input" />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={reset} className="btn-secondary flex-1 py-2.5 text-sm">Reset</button>
          <button onClick={apply} className="btn-primary flex-1 py-2.5 text-sm">Apply Filters</button>
        </div>
      </div>
    </div>
  );
};

// ─── Table Row ───────────────────────────────────────────────────────────────
const TaskTableRow = ({ task, onEdit, onDelete }) => {
  const over = isOverdue(task.dueDate, task.status);
  return (
    <tr className="group hover:bg-surface-container-low transition-colors border-b border-outline-variant/40 last:border-0">
      <td className="py-3 px-4">
        <p className={`text-sm font-semibold text-on-surface truncate max-w-xs ${task.status === 'completed' ? 'line-through opacity-50' : ''}`}>
          {task.title}
        </p>
        {task.project && (
          <div className="flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: task.project.color || '#6B4EFF' }} />
            <span className="text-xs text-on-surface-variant">{task.project.name}</span>
          </div>
        )}
      </td>
      <td className="py-3 px-4 hidden sm:table-cell"><Badge type="status" value={task.status} /></td>
      <td className="py-3 px-4 hidden md:table-cell"><Badge type="priority" value={task.priority} /></td>
      <td className={`py-3 px-4 text-xs font-medium hidden lg:table-cell ${over ? 'text-error' : 'text-on-surface-variant'}`}>
        {task.dueDate ? formatDate(task.dueDate) : '—'}
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <button onClick={() => onEdit(task)} className="p-1 rounded hover:bg-primary-50 text-on-surface-variant hover:text-primary-600 transition-colors" title="Edit">
            <Edit2 size={14} />
          </button>
          <button onClick={() => onDelete(task)} className="p-1 rounded hover:bg-red-50 text-on-surface-variant hover:text-error transition-colors" title="Delete">
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
};

// ─── List Row ────────────────────────────────────────────────────────────────
const TaskListRow = ({ task, onToggle, onEdit, onDelete }) => (
  <div className="flex items-center gap-3 p-4 bg-white rounded-card shadow-card mb-2 hover:shadow-hover transition-all">
    <button
      onClick={() => onToggle(task._id, task.status === 'completed' ? 'todo' : 'completed')}
      className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
        task.status === 'completed' ? 'bg-primary-500 border-primary-500' : 'border-outline-variant hover:border-primary-400'
      }`}
    >
      {task.status === 'completed' && (
        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>

    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onEdit(task)}>
      <p className={`text-sm font-semibold text-on-surface truncate ${task.status === 'completed' ? 'line-through opacity-50' : ''}`}>
        {task.title}
      </p>
      {task.dueDate && (
        <p className={`text-xs mt-0.5 ${isOverdue(task.dueDate, task.status) ? 'text-error' : 'text-on-surface-variant'}`}>
          {formatDate(task.dueDate)}
        </p>
      )}
    </div>

    <div className="flex items-center gap-2 flex-shrink-0">
      <Badge type="priority" value={task.priority} />
      <button onClick={() => onEdit(task)} className="btn-icon w-7 h-7 hidden sm:flex">
        <Edit2 size={13} />
      </button>
      <button onClick={() => onDelete(task)} className="btn-icon w-7 h-7 hover:text-error">
        <Trash2 size={13} />
      </button>
    </div>
  </div>
);

// ─── Views ────────────────────────────────────────────────────────────────────
const VIEWS = [
  { id: 'board',    icon: LayoutGrid, label: 'Board' },
  { id: 'table',   icon: Table,      label: 'Table' },
  { id: 'calendar',icon: Calendar,   label: 'Calendar' },
  { id: 'list',    icon: List,       label: 'List' },
];

/**
 * @page Tasks
 * @desc  Multi-view task manager — Board / Table / Calendar / List
 *        with advanced filters, search, delete confirm, and auto-overdue
 */
const Tasks = () => {
  useAuth({ requireAuth: true });
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeView, setActiveView] = useState(searchParams.get('view') || 'board');
  const [editTask, setEditTask] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const [advFilters, setAdvFilters] = useState({
    status: searchParams.get('status') || '',
    priority: '',
    project: searchParams.get('project') || '',
    startDate: '',
    endDate: '',
  });

  // ── Sync filters from URL whenever sidebar/nav changes the URL ────────────
  useEffect(() => {
    setAdvFilters(prev => ({
      ...prev,
      project: searchParams.get('project') || '',
      status:  searchParams.get('status')  || '',
    }));
    const s = searchParams.get('search') || '';
    setSearchQuery(s);
  }, [searchParams.toString()]);

  const { projects } = useProjectStore();
  const { tasks, loading, updateTaskStatus, deleteTask, fetchTasks } = useTasks({
    project: advFilters.project,
    status: advFilters.status,
    priority: advFilters.priority,
    search: searchQuery,
    startDate: advFilters.startDate,
    endDate: advFilters.endDate,
  });

  // Sync search from URL
  useEffect(() => {
    const s = searchParams.get('search') || '';
    setSearchQuery(s);
  }, [searchParams]);

  const activeFilterCount = [advFilters.status, advFilters.priority, advFilters.project, advFilters.startDate, advFilters.endDate].filter(Boolean).length;

  const switchView = (view) => {
    setActiveView(view);
    setSearchParams(prev => { const p = new URLSearchParams(prev); p.set('view', view); return p; });
  };

  const openForm = (task = null) => { setEditTask(task); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setEditTask(null); };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteTask(deleteTarget._id);
    setDeleteTarget(null);
  };

  const handleSearch = useCallback((val) => {
    setSearchQuery(val);
    setSearchParams(prev => {
      const p = new URLSearchParams(prev);
      val ? p.set('search', val) : p.delete('search');
      return p;
    });
  }, []);

  return (
    <PageWrapper title="My Tasks" onSearch={handleSearch}>
      {/* View switcher + filter */}
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        {/* View tabs */}
        <div className="flex items-center gap-0.5 p-1 bg-surface-container-high rounded-pill overflow-x-auto no-scrollbar">
          {VIEWS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => switchView(id)}
              className={`flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-pill text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
                activeView === id
                  ? 'bg-white shadow-card text-on-surface'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Icon size={14} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterOpen(true)}
            className={`btn-secondary py-2 text-sm relative ${activeFilterCount > 0 ? 'border-primary-400 text-primary-600' : ''}`}
          >
            <SlidersHorizontal size={14} />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-primary-500 text-white text-[10px] font-bold rounded-full">{activeFilterCount}</span>
            )}
          </button>
          <button onClick={() => openForm()} className="btn-primary py-2 text-sm">
            <Plus size={14} />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </div>
      </div>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {advFilters.status && <Chip label={`Status: ${advFilters.status}`} onRemove={() => setAdvFilters(p => ({ ...p, status: '' }))} />}
          {advFilters.priority && <Chip label={`Priority: ${advFilters.priority}`} onRemove={() => setAdvFilters(p => ({ ...p, priority: '' }))} />}
          {advFilters.project && <Chip label={`Project filter`} onRemove={() => setAdvFilters(p => ({ ...p, project: '' }))} />}
          {advFilters.startDate && <Chip label={`From: ${advFilters.startDate}`} onRemove={() => setAdvFilters(p => ({ ...p, startDate: '' }))} />}
          {advFilters.endDate && <Chip label={`To: ${advFilters.endDate}`} onRemove={() => setAdvFilters(p => ({ ...p, endDate: '' }))} />}
          <button onClick={() => setAdvFilters({ status: '', priority: '', project: '', startDate: '', endDate: '' })} className="text-xs text-error font-semibold hover:underline">
            Clear all
          </button>
        </div>
      )}

      {/* ── Board ── */}
      {activeView === 'board' && (
        <div className="-mx-4 md:mx-0 px-4 md:px-0 overflow-x-auto">
          <div className="min-w-max md:min-w-0">
            <KanbanBoard
              tasks={tasks}
              onTaskClick={openForm}
              onDeleteTask={(t) => setDeleteTarget(t)}
              onAddTask={(status) => { setEditTask({ status }); setFormOpen(true); }}
            />
          </div>
        </div>
      )}

      {/* ── Table ── */}
      {activeView === 'table' && (
        <div className="card overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[480px]">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                {['Task', 'Status', 'Priority', 'Due Date', 'Actions'].map((h, i) => (
                  <th key={h} className={`text-left py-3 px-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider ${i === 1 ? 'hidden sm:table-cell' : ''} ${i === 2 ? 'hidden md:table-cell' : ''} ${i === 3 ? 'hidden lg:table-cell' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="py-10 text-center text-on-surface-variant text-sm">Loading…</td></tr>
              ) : tasks.length === 0 ? (
                <tr><td colSpan={5} className="py-10 text-center text-on-surface-variant text-sm">No tasks match your filters.</td></tr>
              ) : (
                tasks.map(task => (
                  <TaskTableRow key={task._id} task={task} onEdit={openForm} onDelete={setDeleteTarget} />
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Calendar ── */}
      {activeView === 'calendar' && <CalendarGrid tasks={tasks} />}

      {/* ── List ── */}
      {activeView === 'list' && (
        <div>
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="card p-4 animate-pulse flex gap-3">
                  <div className="w-5 h-5 bg-surface-container-high rounded-full" />
                  <div className="flex-1"><div className="h-4 bg-surface-container-high rounded w-3/4 mb-2" /><div className="h-3 bg-surface-container-high rounded w-1/3" /></div>
                </div>
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="text-on-surface-variant mb-4">No tasks match your filters.</p>
              <button onClick={() => openForm()} className="btn-primary"><Plus size={16} />Add Task</button>
            </div>
          ) : (
            tasks.map(task => (
              <TaskListRow key={task._id} task={task} onToggle={updateTaskStatus} onEdit={openForm} onDelete={setDeleteTarget} />
            ))
          )}
        </div>
      )}

      {/* ── Filter Panel ── */}
      {filterOpen && (
        <FilterPanel
          filters={advFilters}
          onChange={setAdvFilters}
          projects={projects}
          onClose={() => setFilterOpen(false)}
        />
      )}

      {/* ── Delete Confirm ── */}
      {deleteTarget && (
        <DeleteConfirm
          task={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* ── Task Form ── */}
      <TaskForm
        isOpen={formOpen}
        onClose={closeForm}
        task={editTask?._id ? editTask : null}
        onSave={closeForm}
      />
    </PageWrapper>
  );
};

// Small filter chip
const Chip = ({ label, onRemove }) => (
  <span className="flex items-center gap-1 px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-pill">
    {label}
    <button onClick={onRemove}><X size={11} /></button>
  </span>
);

export default Tasks;
