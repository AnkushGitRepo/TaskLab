import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskCard from '../tasks/TaskCard';

/**
 * @component KanbanCard
 * @desc      Draggable task card using @dnd-kit/sortable
 */
export const KanbanCard = ({ task, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onClick={onClick} isDragging={isDragging} />
    </div>
  );
};

/**
 * @component KanbanColumn
 * @desc      Kanban board column with droppable area
 */
const KanbanColumn = ({ column, tasks, onTaskClick, onAddTask }) => {
  const { SortableContext, verticalListSortingStrategy } = require('@dnd-kit/sortable');
  const { useDroppable } = require('@dnd-kit/core');

  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  const colBorderClass = {
    todo: 'border-t-gray-300',
    overdue: 'border-t-red-400',
    in_progress: 'border-t-blue-400',
    completed: 'border-t-green-400',
  }[column.id] || 'border-t-gray-300';

  return (
    <div className="flex flex-col w-72 flex-shrink-0">
      {/* Column header */}
      <div className={`card p-4 mb-3 border-t-4 ${colBorderClass}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-on-surface">{column.label}</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-surface-container-high text-on-surface-variant">
              {tasks.length}
            </span>
          </div>
          <button
            onClick={() => onAddTask?.(column.id)}
            className="btn-icon w-7 h-7 text-xs"
          >
            +
          </button>
        </div>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`flex-1 space-y-3 min-h-32 rounded-card p-1 transition-colors ${isOver ? 'bg-primary-50' : ''}`}
      >
        <SortableContext items={tasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanCard key={task._id} task={task} onClick={onTaskClick} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-24 rounded-card border-2 border-dashed border-outline-variant text-on-surface-variant text-sm">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
