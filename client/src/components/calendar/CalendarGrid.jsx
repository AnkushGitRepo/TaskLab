import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { toDateKey, formatDate } from '../../utils/dateHelpers';
import Badge from '../common/Badge';

/**
 * @component CalendarGrid
 * @desc      Monthly calendar grid with task count badges and day popups
 * @usage     <CalendarGrid tasks={tasks} onDayClick={handleDayClick} />
 */
const CalendarGrid = ({ tasks = [], onDayClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [popupTasks, setPopupTasks] = useState([]);

  // Group tasks by date key
  const tasksByDate = useMemo(() => {
    const map = {};
    tasks.forEach((task) => {
      if (task.dueDate) {
        const key = toDateKey(task.dueDate);
        if (!map[key]) map[key] = [];
        map[key].push(task);
      }
    });
    return map;
  }, [tasks]);

  // Calendar days
  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const handleDayClick = (day) => {
    const key = toDateKey(day);
    const dayTasks = tasksByDate[key] || [];
    setSelectedDay(day);
    setPopupTasks(dayTasks);
    onDayClick?.(day, dayTasks);
  };

  const prevMonth = () => setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-h3 font-bold text-on-surface">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="btn-icon">
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1.5 text-xs font-semibold rounded-pill bg-surface-container-high text-on-surface hover:bg-primary-50 hover:text-primary-600 transition-colors"
          >
            Today
          </button>
          <button onClick={nextMonth} className="btn-icon">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-on-surface-variant py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar cells */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day) => {
          const key = toDateKey(day);
          const dayTasks = tasksByDate[key] || [];
          const inCurrentMonth = isSameMonth(day, currentDate);
          const today = isToday(day);
          const selected = selectedDay && isSameDay(day, selectedDay);
          const hasOverdue = dayTasks.some((t) => t.status === 'overdue');
          const hasMany = dayTasks.length >= 3;

          return (
            <button
              key={key}
              onClick={() => handleDayClick(day)}
              className={`
                relative min-h-[72px] p-2 rounded-md text-left transition-all duration-150
                ${inCurrentMonth ? 'hover:bg-primary-50' : 'opacity-40'}
                ${selected ? 'bg-primary-50 ring-2 ring-primary-300' : ''}
                ${!selected && !today ? 'hover:bg-surface-container-high' : ''}
              `}
            >
              {/* Day number */}
              <span className={`
                inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold mb-1
                ${today ? 'bg-primary-500 text-white' : 'text-on-surface'}
              `}>
                {format(day, 'd')}
              </span>

              {/* Task badges */}
              {dayTasks.length > 0 && (
                <div className="space-y-0.5">
                  {dayTasks.slice(0, 2).map((task) => (
                    <div
                      key={task._id}
                      className={`text-xs px-1.5 py-0.5 rounded font-medium truncate ${
                        task.status === 'overdue'
                          ? 'bg-red-100 text-red-700'
                          : task.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-primary-100 text-primary-700'
                      }`}
                    >
                      {task.title}
                    </div>
                  ))}
                  {dayTasks.length > 2 && (
                    <div className="text-xs text-on-surface-variant font-medium px-1">
                      +{dayTasks.length - 2} more
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Day popup */}
      {selectedDay && popupTasks.length > 0 && (
        <div className="mt-4 p-4 bg-surface-container-low rounded-card animate-fade-in-up">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-on-surface">{formatDate(selectedDay)}</h3>
            <button onClick={() => setSelectedDay(null)} className="btn-icon w-7 h-7">
              <X size={14} />
            </button>
          </div>
          <div className="space-y-2">
            {popupTasks.map((task) => (
              <div key={task._id} className="flex items-center gap-3 p-2 bg-white rounded-md shadow-card">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-on-surface truncate">{task.title}</p>
                  {task.project && (
                    <p className="text-xs text-on-surface-variant">{task.project.name}</p>
                  )}
                </div>
                <Badge type="status" value={task.status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarGrid;
