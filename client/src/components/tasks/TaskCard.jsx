import { Calendar, MessageSquare, Edit2, Trash2, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import Badge from '../common/Badge';
import Avatar from '../common/Avatar';
import { formatDateShort, isOverdue } from '../../utils/dateHelpers';
import useTaskStore from '../../store/taskStore';

/**
 * @component TaskCard
 * @desc      Task card used in Kanban and Dashboard views — with edit/delete menu
 */
const TaskCard = ({ task, onClick, onDelete, isDragging = false, className = '' }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { deleteTask } = useTaskStore();
  const overdue = isOverdue(task.dueDate, task.status);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setMenuOpen(false);
    setConfirmDelete(false);
    if (onDelete) { onDelete(task); }
    else { await deleteTask(task._id); }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    onClick?.(task);
  };

  return (
    <div
      className={`card-hover p-4 cursor-pointer select-none relative group ${isDragging ? 'rotate-2 scale-105 shadow-modal' : ''} ${className}`}
      onClick={() => { if (!menuOpen) onClick?.(task); }}
    >
      {/* ⋯ Menu button — visible on hover */}
      <div className="absolute top-3 right-3 z-10" onClick={e => e.stopPropagation()}>
        <button
          onClick={() => { setMenuOpen(!menuOpen); setConfirmDelete(false); }}
          className="btn-icon w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreHorizontal size={15} />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => { setMenuOpen(false); setConfirmDelete(false); }} />
            <div className="absolute right-0 top-8 bg-white rounded-card shadow-modal border border-outline-variant/40 z-20 py-1 w-36 animate-fade-in-up">
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-surface-container-low text-on-surface"
              >
                <Edit2 size={13} />Edit Task
              </button>
              <button
                onClick={handleDelete}
                className={`flex items-center gap-2 w-full px-4 py-2 text-sm transition-colors ${
                  confirmDelete
                    ? 'bg-red-50 text-error font-semibold'
                    : 'hover:bg-red-50 text-error'
                }`}
              >
                <Trash2 size={13} />
                {confirmDelete ? 'Confirm Delete' : 'Delete'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Project tag */}
      {task.project && (
        <div className="flex items-center gap-1.5 mb-2 pr-8">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: task.project.color || '#6B4EFF' }} />
          <span className="text-xs font-medium text-on-surface-variant truncate">{task.project.name}</span>
        </div>
      )}

      {/* Title */}
      <h3 className={`text-sm font-semibold text-on-surface mb-2 line-clamp-2 pr-6 ${task.status === 'completed' ? 'line-through opacity-50' : ''}`}>
        {task.title}
      </h3>

      {/* Tags */}
      {task.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-pill text-xs font-medium bg-primary-50 text-primary-700">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Badges */}
      <div className="flex items-center gap-2 mb-3">
        <Badge type="priority" value={task.priority} />
        {task.status === 'overdue' && <Badge type="status" value="overdue" />}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {task.dueDate ? (
          <div className={`flex items-center gap-1 text-xs font-medium ${overdue ? 'text-error' : 'text-on-surface-variant'}`}>
            <Calendar size={12} />
            <span>{formatDateShort(task.dueDate)}</span>
          </div>
        ) : <div />}

        <div className="flex items-center gap-2">
          {task.comments?.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-on-surface-variant">
              <MessageSquare size={12} />
              <span>{task.comments.length}</span>
            </div>
          )}
          {task.assignees?.length > 0 && (
            <div className="flex -space-x-1.5">
              {task.assignees.slice(0, 3).map(a => (
                <Avatar key={a._id || a} name={a.name || '?'} src={a.avatar} size="xs" className="ring-2 ring-white" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
