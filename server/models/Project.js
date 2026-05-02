const mongoose = require('mongoose');

/**
 * @desc    Project/folder schema for organizing tasks
 */
const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      maxlength: [100, 'Project name cannot exceed 100 characters'],
    },
    color: {
      type: String,
      default: '#6B4EFF',
      match: [/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex code'],
    },
    icon: {
      type: String,
      default: '📁',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    workspace: {
      type: String,
      default: 'Main Workspace',
      trim: true,
    },
  },
  { timestamps: true }
);

projectSchema.index({ owner: 1 });

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
