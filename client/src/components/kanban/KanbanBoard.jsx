import { useState, useMemo, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from '../tasks/TaskCard';
import useTaskStore from '../../store/taskStore';

const COLUMNS = [
  { id: 'todo', label: 'To Do', borderClass: 'border-t-gray-300' },
  { id: 'overdue', label: 'Overdue', borderClass: 'border-t-red-400' },
  { id: 'in_progress', label: 'Doing', borderClass: 'border-t-blue-400' },
  { id: 'completed', label: 'Completed', borderClass: 'border-t-green-400' },
];

const SortableCard = ({ task, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.3 : 1 };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onClick={onClick} isDragging={isDragging} />
    </div>
  );
};

const DroppableColumn = ({ column, tasks, onTaskClick, onAddTask }) => {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  return (
    <div className="flex flex-col w-[285px] flex-shrink-0">
      <div className={`card p-4 mb-3 border-t-4 ${column.borderClass}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-on-surface">{column.label}</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-surface-container-high text-on-surface-variant">
              {tasks.length}
            </span>
          </div>
          <button onClick={() => onAddTask?.(column.id)} className="btn-icon w-7 h-7 text-lg leading-none">+</button>
        </div>
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 space-y-3 min-h-32 rounded-card p-1.5 transition-colors duration-150 ${isOver ? 'bg-primary-50 ring-2 ring-primary-200' : ''}`}
      >
        <SortableContext items={tasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => <SortableCard key={task._id} task={task} onClick={onTaskClick} />)}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-20 rounded-card border-2 border-dashed border-outline-variant text-sm text-on-surface-variant">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * @component KanbanBoard
 * @desc      Full kanban board with 4 columns and DnD support
 */
const KanbanBoard = ({ tasks, onTaskClick, onAddTask }) => {
  const { reorderTasks, updateTaskStatus } = useTaskStore();
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const tasksByColumn = useMemo(() => {
    const map = {};
    COLUMNS.forEach((c) => { map[c.id] = []; });
    tasks.forEach((t) => {
      const col = t.status === 'in_progress' ? 'in_progress' : (map[t.status] ? t.status : 'todo');
      map[col]?.push(t);
    });
    Object.keys(map).forEach((k) => map[k].sort((a, b) => a.order - b.order));
    return map;
  }, [tasks]);

  const handleDragStart = useCallback(({ active }) => {
    const task = tasks.find((t) => t._id === active.id);
    setActiveTask(task || null);
  }, [tasks]);

  const handleDragEnd = useCallback(({ active, over }) => {
    setActiveTask(null);
    if (!over) return;

    const taskId = active.id;
    const overId = over.id;

    // If dropped on a column id
    const targetColumn = COLUMNS.find((c) => c.id === overId);
    if (targetColumn) {
      const newStatus = targetColumn.id;
      reorderTasks(taskId, Date.now(), newStatus);
      return;
    }

    // If dropped on another card — find which column it belongs to
    for (const [colId, colTasks] of Object.entries(tasksByColumn)) {
      const overIndex = colTasks.findIndex((t) => t._id === overId);
      if (overIndex !== -1) {
        reorderTasks(taskId, overIndex, colId);
        return;
      }
    }
  }, [tasksByColumn, reorderTasks]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveTask(null)}
    >
      <div className="flex gap-5 overflow-x-auto pb-4">
        {COLUMNS.map((col) => (
          <DroppableColumn
            key={col.id}
            column={col}
            tasks={tasksByColumn[col.id] || []}
            onTaskClick={onTaskClick}
            onAddTask={onAddTask}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask && (
          <div className="rotate-2 scale-105">
            <TaskCard task={activeTask} isDragging />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
