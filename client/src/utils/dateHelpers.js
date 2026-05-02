import { format, formatDistanceToNow, isAfter, isBefore, startOfDay, parseISO } from 'date-fns';

/**
 * Format a date for display (e.g., "May 2, 2026")
 */
export const formatDate = (date) => {
  if (!date) return '—';
  return format(new Date(date), 'MMM d, yyyy');
};

/**
 * Format a date as short form (e.g., "May 2")
 */
export const formatDateShort = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM d');
};

/**
 * Format as relative time (e.g., "3 days ago")
 */
export const formatRelative = (date) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

/**
 * Check if a date is overdue (past today and not completed)
 */
export const isOverdue = (dueDate, status) => {
  if (!dueDate || status === 'completed') return false;
  return isBefore(new Date(dueDate), startOfDay(new Date()));
};

/**
 * Format date for calendar cell (e.g., "2026-05-02")
 */
export const toDateKey = (date) => {
  if (!date) return '';
  return format(new Date(date), 'yyyy-MM-dd');
};

/**
 * Get days in a month for calendar grid
 */
export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

/**
 * Get first day of month (0=Sun, 1=Mon...)
 */
export const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};
