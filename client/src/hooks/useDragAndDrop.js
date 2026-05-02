import { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

/**
 * @desc    Drag-and-drop hook wrapping @dnd-kit/core
 * @usage   const { DndWrapper, activeId, handleDragEnd } = useDragAndDrop(onDrop);
 */
const useDragAndDrop = (onDrop) => {
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = useCallback(({ active }) => {
    setActiveId(active.id);
  }, []);

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      setActiveId(null);
      if (over && active.id !== over.id) {
        onDrop(active.id, over.id, event);
      }
    },
    [onDrop]
  );

  const handleDragCancel = useCallback(() => setActiveId(null), []);

  return { sensors, activeId, handleDragStart, handleDragEnd, handleDragCancel };
};

export default useDragAndDrop;
