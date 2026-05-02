/**
 * Client-side form validators for Tasklab
 */

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!/^\S+@\S+\.\S+$/.test(email)) return 'Enter a valid email address';
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
    return 'Password must contain at least one letter and one number';
  }
  return null;
};

export const validateTaskTitle = (title) => {
  if (!title || !title.trim()) return 'Task title is required';
  if (title.trim().length > 200) return 'Title cannot exceed 200 characters';
  return null;
};

export const validateProjectName = (name) => {
  if (!name || !name.trim()) return 'Project name is required';
  if (name.trim().length > 100) return 'Project name cannot exceed 100 characters';
  return null;
};
