const Project = require('../models/Project');
const Task = require('../models/Task');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { asyncHandler } = require('../middleware/errorMiddleware');

/**
 * @desc    Get all projects for current user
 * @route   GET /api/projects
 * @access  Private
 */
const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({
    $or: [{ owner: req.user._id }, { members: req.user._id }],
  })
    .populate('members', 'name avatar')
    .sort({ createdAt: -1 });

  ApiResponse.send(res, { projects });
});

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private
 */
const createProject = asyncHandler(async (req, res) => {
  const { name, color, icon, workspace } = req.body;
  if (!name) throw new ApiError('Project name is required', 400);

  const project = await Project.create({
    name,
    color: color || '#6B4EFF',
    icon: icon || '📁',
    owner: req.user._id,
    workspace: workspace || 'Main Workspace',
  });

  ApiResponse.send(res, { project }, 'Project created', 201);
});

/**
 * @desc    Update a project
 * @route   PUT /api/projects/:id
 * @access  Private
 */
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
  if (!project) throw new ApiError('Project not found', 404);

  const { name, color, icon, workspace } = req.body;
  if (name) project.name = name;
  if (color) project.color = color;
  if (icon) project.icon = icon;
  if (workspace) project.workspace = workspace;

  await project.save();
  ApiResponse.send(res, { project }, 'Project updated');
});

/**
 * @desc    Delete a project and cascade delete its tasks
 * @route   DELETE /api/projects/:id
 * @access  Private
 */
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
  if (!project) throw new ApiError('Project not found', 404);

  // Cascade soft-delete all tasks belonging to this project
  await Task.updateMany(
    { project: project._id, deletedAt: null },
    { deletedAt: new Date() }
  );

  await project.deleteOne();
  ApiResponse.send(res, null, 'Project and its tasks deleted');
});

/**
 * @desc    Add a member to a project
 * @route   POST /api/projects/:id/members
 * @access  Private
 */
const addMember = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) throw new ApiError('userId is required', 400);

  const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
  if (!project) throw new ApiError('Project not found', 404);

  if (project.members.includes(userId)) {
    throw new ApiError('User is already a member', 400);
  }

  project.members.push(userId);
  await project.save();
  ApiResponse.send(res, { project }, 'Member added');
});

module.exports = { getProjects, createProject, updateProject, deleteProject, addMember };
