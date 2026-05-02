const { body } = require('express-validator');

const createTaskValidators = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('description')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('status')
    .optional()
    .isIn(['todo', 'in_progress', 'completed', 'overdue'])
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('dueDate').optional({ nullable: true }).isISO8601().withMessage('Invalid due date format'),
];

const updateTaskValidators = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 200 }),
  body('status')
    .optional()
    .isIn(['todo', 'in_progress', 'completed', 'overdue'])
    .withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('dueDate').optional({ nullable: true }).isISO8601(),
];

module.exports = { createTaskValidators, updateTaskValidators };
