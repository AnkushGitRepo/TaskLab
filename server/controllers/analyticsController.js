const Task = require('../models/Task');
const ApiResponse = require('../utils/ApiResponse');
const { asyncHandler } = require('../middleware/errorMiddleware');

/**
 * @desc    Get overview analytics (totals, by status, by priority)
 * @route   GET /api/analytics/overview
 * @access  Private
 */
const getOverview = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [byStatus, byPriority, overdueCount] = await Promise.all([
    Task.aggregate([
      { $match: { createdBy: userId, deletedAt: null } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Task.aggregate([
      { $match: { createdBy: userId, deletedAt: null } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]),
    Task.countDocuments({
      createdBy: userId,
      deletedAt: null,
      status: { $ne: 'completed' },
      dueDate: { $lt: new Date() },
    }),
  ]);

  const statusMap = byStatus.reduce((acc, { _id, count }) => ({ ...acc, [_id]: count }), {});
  const priorityMap = byPriority.reduce((acc, { _id, count }) => ({ ...acc, [_id]: count }), {});

  const overview = {
    total: byStatus.reduce((sum, { count }) => sum + count, 0),
    completed: statusMap.completed || 0,
    inProgress: statusMap.in_progress || 0,
    todo: statusMap.todo || 0,
    overdue: overdueCount,
    byPriority: {
      high: priorityMap.high || 0,
      medium: priorityMap.medium || 0,
      low: priorityMap.low || 0,
    },
  };

  ApiResponse.send(res, { overview });
});

/**
 * @desc    Get tasks grouped by due date for calendar view
 * @route   GET /api/analytics/timeline
 * @access  Private
 */
const getTimeline = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const query = {
    createdBy: req.user._id,
    deletedAt: null,
    dueDate: { $ne: null },
  };

  if (startDate) query.dueDate.$gte = new Date(startDate);
  if (endDate) query.dueDate.$lte = new Date(endDate);

  const tasks = await Task.find(query)
    .populate('project', 'name color')
    .select('title status priority dueDate project')
    .sort({ dueDate: 1 });

  // Group by date string
  const timeline = tasks.reduce((acc, task) => {
    const dateKey = task.dueDate.toISOString().split('T')[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(task);
    return acc;
  }, {});

  ApiResponse.send(res, { timeline });
});

module.exports = { getOverview, getTimeline };
