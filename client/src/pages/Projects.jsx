import { useState, useEffect } from 'react';
import { Plus, Folder, Trash2, Edit3, MoreHorizontal, ArrowRight, CheckSquare, Users, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import useAuth from '../hooks/useAuth';
import useProjects from '../hooks/useProjects';
import useTaskStore from '../store/taskStore';
import { PROJECT_COLORS } from '../utils/priorityHelpers';

// ─── Project Card ─────────────────────────────────────────────────────────────
const ProjectCard = ({ project, taskCount, onEdit, onDelete, onClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenu = (e) => { e.stopPropagation(); setMenuOpen(!menuOpen); };
  const handleEdit = (e) => { e.stopPropagation(); onEdit(project); setMenuOpen(false); };
  const handleDelete = (e) => { e.stopPropagation(); onDelete(project._id); setMenuOpen(false); };

  return (
    <div
      className="card-hover p-5 relative group cursor-pointer"
      onClick={onClick}
    >
      {/* Top row: icon + menu */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-card flex items-center justify-center text-2xl flex-shrink-0"
          style={{ backgroundColor: project.color + '22' }}
        >
          {project.icon || '📁'}
        </div>

        <div className="relative" onClick={e => e.stopPropagation()}>
          <button
            onClick={handleMenu}
            className="btn-icon opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal size={16} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 bg-white rounded-card shadow-modal border border-outline-variant/40 z-20 py-1 w-36">
                <button onClick={handleEdit} className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-surface-container-low text-on-surface">
                  <Edit3 size={14} />Edit
                </button>
                <button onClick={handleDelete} className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-red-50 text-error">
                  <Trash2 size={14} />Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Name + workspace */}
      <h3 className="font-bold text-on-surface mb-0.5 truncate">{project.name}</h3>
      <p className="text-xs text-on-surface-variant mb-3">{project.workspace || 'Personal'}</p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-outline-variant/40">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: project.color }} />
          <span className="text-xs font-medium text-on-surface-variant">
            {taskCount} task{taskCount !== 1 ? 's' : ''}
          </span>
        </div>
        <ArrowRight size={14} className="text-outline opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
};

// ─── Project Form (create/edit) ───────────────────────────────────────────────
const ICONS = ['📁', '🚀', '💼', '🎨', '📊', '🔬', '💡', '🌟', '🏆', '🎯', '🛠️', '📱'];

const ProjectFormModal = ({ isOpen, onClose, onSave, editProject }) => {
  const [form, setForm] = useState({ name: '', color: '#6B4EFF', icon: '📁', members: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editProject) {
      setForm({
        name: editProject.name,
        color: editProject.color || '#6B4EFF',
        icon: editProject.icon || '📁',
        members: (editProject.members || []).join(', '),
      });
    } else {
      setForm({ name: '', color: '#6B4EFF', icon: '📁', members: '' });
    }
  }, [editProject, isOpen]);

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    const members = form.members
      ? form.members.split(',').map(m => m.trim()).filter(Boolean)
      : [];
    await onSave({ name: form.name, color: form.color, icon: form.icon, members });
    setSaving(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editProject ? 'Edit Project' : 'New Project'}>
      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-1.5">
            Project Name <span className="text-error">*</span>
          </label>
          <input
            autoFocus
            type="text"
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            placeholder="e.g. Design Sprint, Backend API"
            className="input"
          />
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-2">Color</label>
          <div className="flex gap-2 flex-wrap">
            {PROJECT_COLORS.map(color => (
              <button
                key={color}
                onClick={() => setForm(p => ({ ...p, color }))}
                className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${form.color === color ? 'border-on-surface scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Icon */}
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-2">Icon</label>
          <div className="flex gap-2 flex-wrap">
            {ICONS.map(icon => (
              <button
                key={icon}
                onClick={() => setForm(p => ({ ...p, icon }))}
                className={`w-9 h-9 rounded-md text-lg flex items-center justify-center transition-all ${form.icon === icon ? 'bg-primary-100 ring-2 ring-primary-400' : 'hover:bg-surface-container-high'}`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Members */}
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-1.5">
            <Users size={14} className="inline mr-1" />
            Members <span className="text-on-surface-variant font-normal">(email addresses, comma-separated)</span>
          </label>
          <input
            type="text"
            value={form.members}
            onChange={e => setForm(p => ({ ...p, members: e.target.value }))}
            placeholder="alice@example.com, bob@example.com"
            className="input"
          />
          <p className="text-xs text-on-surface-variant mt-1">
            Add collaborators by email. They'll see this project in their workspace.
          </p>
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" loading={saving} onClick={handleSave}>
            {editProject ? 'Save Changes' : 'Create Project'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

/**
 * @page Projects
 * @desc  Project cards — clickable, task count, member input, delete confirm
 */
const Projects = () => {
  useAuth({ requireAuth: true });
  const navigate = useNavigate();
  const { projects, loading, createProject, updateProject, deleteProject } = useProjects();
  const { tasks } = useTaskStore();

  const [formOpen, setFormOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const openCreate = () => { setEditProject(null); setFormOpen(true); };
  const openEdit = (p) => { setEditProject(p); setFormOpen(true); };

  const handleSave = async (data) => {
    if (editProject) {
      await updateProject(editProject._id, data);
    } else {
      await createProject(data);
    }
    setFormOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteProject(deleteTarget._id);
    setDeleteTarget(null);
  };

  // Count tasks per project
  const taskCountByProject = tasks.reduce((acc, t) => {
    const pid = t.project?._id || t.project;
    if (pid) acc[pid] = (acc[pid] || 0) + 1;
    return acc;
  }, {});

  return (
    <PageWrapper title="Projects">
      <div className="flex items-center justify-between mb-6">
        <p className="text-on-surface-variant text-sm">
          {projects.length} project{projects.length !== 1 ? 's' : ''}
        </p>
        <Button variant="primary" onClick={openCreate}>
          <Plus size={16} />New Project
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-5 animate-pulse h-44">
              <div className="w-12 h-12 bg-surface-container-high rounded-card mb-4" />
              <div className="h-4 bg-surface-container-high rounded w-2/3 mb-2" />
              <div className="h-3 bg-surface-container-high rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Folder size={28} className="text-primary-500" />
          </div>
          <h3 className="text-lg font-bold mb-2">No projects yet</h3>
          <p className="text-on-surface-variant text-sm mb-6">Group your tasks into projects for better organization</p>
          <Button variant="primary" onClick={openCreate}><Plus size={16} />Create First Project</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {projects.map(project => (
            <ProjectCard
              key={project._id}
              project={project}
              taskCount={taskCountByProject[project._id] || 0}
              onEdit={openEdit}
              onDelete={(id) => setDeleteTarget(projects.find(p => p._id === id))}
              onClick={() => navigate(`/tasks?project=${project._id}`)}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <ProjectFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        editProject={editProject}
      />

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-card shadow-modal p-6 w-full max-w-sm animate-fade-in-up">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-error" />
            </div>
            <h3 className="text-center font-bold text-on-surface mb-1">Delete Project?</h3>
            <p className="text-center text-sm text-on-surface-variant mb-5">
              "{deleteTarget.name}" and its tasks will be removed.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="btn-secondary flex-1 py-2.5">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 rounded-pill bg-error text-white font-semibold text-sm hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default Projects;
