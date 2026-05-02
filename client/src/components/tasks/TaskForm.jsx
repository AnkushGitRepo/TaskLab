import { useState, useEffect } from 'react';
import { Plus, Trash2, Flag } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import useTaskStore from '../../store/taskStore';
import useProjectStore from '../../store/projectStore';
import { validateTaskTitle } from '../../utils/validators';

/**
 * @component TaskForm
 * @desc      Create/edit task modal with all fields
 * @usage     <TaskForm isOpen={open} onClose={close} task={task} onSave={onSave} />
 */
const TaskForm = ({ isOpen, onClose, task = null, onSave }) => {
  const { createTask, updateTask } = useTaskStore();
  const { projects } = useProjectStore();

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    project: '',
    tags: '',
    subtasks: [],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [newSubtask, setNewSubtask] = useState('');

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        project: task.project?._id || task.project || '',
        tags: (task.tags || []).join(', '),
        subtasks: task.subtasks || [],
      });
    } else {
      setForm({ title: '', description: '', status: 'todo', priority: 'medium', dueDate: '', project: '', tags: '', subtasks: [] });
    }
    setErrors({});
  }, [task, isOpen]);

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const titleError = validateTaskTitle(form.title);
    if (titleError) { setErrors({ title: titleError }); return; }

    setLoading(true);
    const data = {
      ...form,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      project: form.project || null,
      dueDate: form.dueDate || null,
    };

    const result = task
      ? await updateTask(task._id, data)
      : await createTask(data);

    setLoading(false);
    if (result.success) {
      onSave?.(result.task);
      onClose();
    } else {
      setErrors({ submit: result.error });
    }
  };

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    set('subtasks', [...form.subtasks, { title: newSubtask.trim(), completed: false }]);
    setNewSubtask('');
  };

  const removeSubtask = (index) =>
    set('subtasks', form.subtasks.filter((_, i) => i !== index));

  const priorityOptions = [
    { value: 'low', label: '🟢 Low' },
    { value: 'medium', label: '🟠 Medium' },
    { value: 'high', label: '🔴 High' },
  ];

  const statusOptions = [
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'overdue', label: 'Overdue' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task ? 'Edit Task' : 'Create New Task'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-1.5">
            Title <span className="text-error">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="What needs to be done?"
            className={`input ${errors.title ? 'input-error' : ''}`}
            autoFocus
          />
          {errors.title && <p className="mt-1 text-xs text-error">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={3}
            placeholder="Add more details..."
            className="input rounded-md resize-none"
          />
        </div>

        {/* Status + Priority row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-1.5">Status</label>
            <select
              value={form.status}
              onChange={(e) => set('status', e.target.value)}
              className="input"
            >
              {statusOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-1.5">
              <Flag size={14} className="inline mr-1" />Priority
            </label>
            <select
              value={form.priority}
              onChange={(e) => set('priority', e.target.value)}
              className="input"
            >
              {priorityOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Due Date + Project row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-1.5">Due Date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => set('dueDate', e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-1.5">Project</label>
            <select
              value={form.project}
              onChange={(e) => set('project', e.target.value)}
              className="input"
            >
              <option value="">No Project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-1.5">Tags</label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => set('tags', e.target.value)}
            placeholder="design, urgent, backend (comma-separated)"
            className="input"
          />
        </div>

        {/* Subtasks */}
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-1.5">Subtasks</label>
          <div className="space-y-1.5 mb-2">
            {form.subtasks.map((st, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-surface-container-low rounded-md">
                <input type="checkbox" checked={st.completed} className="accent-primary-500" readOnly />
                <span className="flex-1 text-sm">{st.title}</span>
                <button type="button" onClick={() => removeSubtask(i)} className="text-error hover:text-red-700">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
              placeholder="Add subtask..."
              className="input flex-1"
            />
            <button type="button" onClick={addSubtask} className="btn-secondary py-2 px-3">
              <Plus size={16} />
            </button>
          </div>
        </div>

        {errors.submit && (
          <p className="text-sm text-error bg-error-container px-4 py-2 rounded-md">{errors.submit}</p>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" loading={loading}>
            {task ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskForm;
