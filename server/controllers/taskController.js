const Task = require('../models/Task');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { asyncHandler } = require('../middleware/errorMiddleware');

/**
 * @desc    Get all tasks for current user (with filters, auto-overdue, and pagination)
 * @route   GET /api/tasks
 * @access  Private
 */
const getTasks = asyncHandler(async (req, res) => {
  const { status, priority, project, search, page = 1, limit = 50, startDate, endDate } = req.query;

  // ── Auto-mark overdue: only tasks NOT manually moved by the user ─────────
  await Task.updateMany(
    {
      createdBy: req.user._id,
      dueDate: { $lt: new Date() },
      status: { $nin: ['completed', 'overdue'] },
      statusLockedByUser: { $ne: true },
      deletedAt: null,
    },
    { status: 'overdue' }
  );

  const query = { createdBy: req.user._id, deletedAt: null };

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (project) query.project = project;
  if (search) query.title = { $regex: search, $options: 'i' };
  if (startDate || endDate) {
    query.dueDate = {};
    if (startDate) query.dueDate.$gte = new Date(startDate);
    if (endDate) query.dueDate.$lte = new Date(endDate);
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [tasks, total] = await Promise.all([
    Task.find(query)
      .populate('project', 'name color icon')
      .populate('assignees', 'name avatar')
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Task.countDocuments(query),
  ]);

  ApiResponse.send(res, { tasks, total, page: Number(page), limit: Number(limit) });
});

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private
 */
const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate, project, assignees, tags, subtasks, order } = req.body;

  const task = await Task.create({
    title,
    description,
    status,
    priority,
    dueDate,
    project: project || null,
    assignees: assignees || [],
    createdBy: req.user._id,
    tags: tags || [],
    subtasks: subtasks || [],
    order: order || 0,
  });

  const populated = await task.populate([
    { path: 'project', select: 'name color icon' },
    { path: 'assignees', select: 'name avatar' },
  ]);

  ApiResponse.send(res, { task: populated }, 'Task created', 201);
});

/**
 * @desc    Get a single task by ID
 * @route   GET /api/tasks/:id
 * @access  Private
 */
const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, createdBy: req.user._id, deletedAt: null })
    .populate('project', 'name color icon')
    .populate('assignees', 'name avatar')
    .populate('comments.user', 'name avatar');

  if (!task) throw new ApiError('Task not found', 404);
  ApiResponse.send(res, { task });
});

/**
 * @desc    Update a task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, createdBy: req.user._id, deletedAt: null });
  if (!task) throw new ApiError('Task not found', 404);

  const allowedFields = ['title', 'description', 'status', 'priority', 'dueDate', 'project', 'assignees', 'tags', 'subtasks', 'category'];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) task[field] = req.body[field];
  });

  // If status was explicitly provided, lock it against auto-overdue
  if (req.body.status !== undefined) task.statusLockedByUser = true;
  if (req.body.status === 'completed') task.completedAt = new Date();

  await task.save();
  await task.populate([
    { path: 'project', select: 'name color icon' },
    { path: 'assignees', select: 'name avatar' },
  ]);

  ApiResponse.send(res, { task }, 'Task updated');
});

/**
 * @desc    Update task status
 * @route   PATCH /api/tasks/:id/status
 * @access  Private
 */
const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const task = await Task.findOne({ _id: req.params.id, createdBy: req.user._id, deletedAt: null });
  if (!task) throw new ApiError('Task not found', 404);

  if (task.status === 'completed' && status === 'completed') {
    throw new ApiError('Task is already marked as complete', 400);
  }

  task.status = status;
  task.statusLockedByUser = true;  // Prevent auto-overdue from reverting this
  if (status === 'completed') task.completedAt = new Date();
  await task.save();
  ApiResponse.send(res, { task }, 'Task status updated');
});

/**
 * @desc    Update task order for drag-and-drop
 * @route   PATCH /api/tasks/:id/order
 * @access  Private
 */
const updateTaskOrder = asyncHandler(async (req, res) => {
  const { order, status } = req.body;
  const task = await Task.findOne({ _id: req.params.id, createdBy: req.user._id });
  if (!task) throw new ApiError('Task not found', 404);

  task.order = order;
  if (status) {
    task.status = status;
    task.statusLockedByUser = true; // respect user's drag choice over auto-overdue
  }
  await task.save();
  ApiResponse.send(res, { task }, 'Task order updated');
});

/**
 * @desc    Delete a task (soft delete)
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, createdBy: req.user._id });
  if (!task) throw new ApiError('Task not found', 404);

  task.deletedAt = new Date();
  await task.save();
  ApiResponse.send(res, null, 'Task deleted');
});

/**
 * @desc    Add a comment to a task
 * @route   POST /api/tasks/:id/comments
 * @access  Private
 */
const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) throw new ApiError('Comment text is required', 400);

  const task = await Task.findOne({ _id: req.params.id, createdBy: req.user._id, deletedAt: null });
  if (!task) throw new ApiError('Task not found', 404);

  task.comments.push({ user: req.user._id, text: text.trim() });
  await task.save();
  ApiResponse.send(res, { comments: task.comments }, 'Comment added', 201);
});

/**
 * @desc    Bulk update task statuses
 * @route   POST /api/tasks/bulk
 * @access  Private
 */
const bulkUpdate = asyncHandler(async (req, res) => {
  const { taskIds, status } = req.body;
  if (!taskIds || !Array.isArray(taskIds) || !status) {
    throw new ApiError('taskIds array and status are required', 400);
  }

  await Task.updateMany(
    { _id: { $in: taskIds }, createdBy: req.user._id },
    { status, ...(status === 'completed' ? { completedAt: new Date() } : {}) }
  );

  ApiResponse.send(res, null, 'Tasks updated');
});

/**
 * @desc    Get task stats (count by status and priority)
 * @route   GET /api/tasks/stats
 * @access  Private
 */
const getStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Also auto-mark overdue when fetching stats (respects manual overrides)
  await Task.updateMany(
    {
      createdBy: userId,
      dueDate: { $lt: new Date() },
      status: { $nin: ['completed', 'overdue'] },
      statusLockedByUser: { $ne: true },
      deletedAt: null,
    },
    { status: 'overdue' }
  );

  const [byStatus, byPriority] = await Promise.all([
    Task.aggregate([
      { $match: { createdBy: userId, deletedAt: null } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Task.aggregate([
      { $match: { createdBy: userId, deletedAt: null } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]),
  ]);

  const stats = {
    byStatus: byStatus.reduce((acc, { _id, count }) => ({ ...acc, [_id]: count }), {}),
    byPriority: byPriority.reduce((acc, { _id, count }) => ({ ...acc, [_id]: count }), {}),
    total: byStatus.reduce((sum, { count }) => sum + count, 0),
    overdue: (byStatus.find(s => s._id === 'overdue') || { count: 0 }).count,
  };

  ApiResponse.send(res, { stats });
});

module.exports = {
  getTasks,
  createTask,
  getTask,
  updateTask,
  updateTaskStatus,
  updateTaskOrder,
  deleteTask,
  addComment,
  bulkUpdate,
  getStats,
};
