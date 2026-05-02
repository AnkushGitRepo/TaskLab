const express = require('express');
const router = express.Router();
const {
  getTasks, createTask, getTask, updateTask, updateTaskStatus,
  updateTaskOrder, deleteTask, addComment, bulkUpdate, getStats,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validateMiddleware');
const { createTaskValidators, updateTaskValidators } = require('../validators/taskValidators');

// All task routes require authentication
router.use(protect);

router.get('/stats', getStats);
router.post('/bulk', bulkUpdate);

router.route('/')
  .get(getTasks)
  .post(createTaskValidators, validate, createTask);

router.route('/:id')
  .get(getTask)
  .put(updateTaskValidators, validate, updateTask)
  .delete(deleteTask);

router.patch('/:id/status', updateTaskStatus);
router.patch('/:id/order', updateTaskOrder);
router.post('/:id/comments', addComment);

module.exports = router;
