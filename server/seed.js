/**
 * @file   seed.js
 * @desc   Seeds the database with a test user + sample projects + tasks
 *
 * Usage:
 *   cd server && node seed.js
 *
 * Test credentials:
 *   Email:    testuser@tasklab.com
 *   Password: Password1
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ─── Import models ──────────────────────────────────────────────────────────
const User    = require('./models/User');
const Project = require('./models/Project');
const Task    = require('./models/Task');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tasklab';

const run = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('✅ MongoDB connected');

  // ── 1. Wipe existing seed data ──────────────────────────────────────────
  await User.deleteMany({ email: 'testuser@tasklab.com' });

  // ── 2. Create test user ─────────────────────────────────────────────────
  const user = await User.create({
    name: 'Test User',
    email: 'testuser@tasklab.com',
    password: 'Password1',          // hashed by User model pre-save hook
  });
  console.log(`👤 Created user: ${user.email}`);

  // ── 3. Wipe any existing projects/tasks for this user ──────────────────
  await Project.deleteMany({ owner: user._id });
  await Task.deleteMany({ createdBy: user._id });

  // ── 4. Create projects ──────────────────────────────────────────────────
  const [design, backend, marketing] = await Project.insertMany([
    { name: 'Design Sprint',  color: '#6B4EFF', icon: '🎨', owner: user._id, workspace: 'Tasklab HQ' },
    { name: 'Backend API',    color: '#3B82F6', icon: '🚀', owner: user._id, workspace: 'Tasklab HQ' },
    { name: 'Marketing Q2',   color: '#22C55E', icon: '📣', owner: user._id, workspace: 'Tasklab HQ' },
  ]);
  console.log(`📁 Created 3 projects`);

  // ── 5. Helper: dates ────────────────────────────────────────────────────
  const daysFromNow = (n) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);

  // ── 6. Create tasks ─────────────────────────────────────────────────────
  const tasks = [
    // — Design Sprint tasks —
    {
      title: 'Redesign onboarding flow',
      description: 'Update the 3-step user onboarding to match the new brand guidelines.',
      status: 'in_progress',
      priority: 'high',
      project: design._id,
      createdBy: user._id,
      dueDate: daysFromNow(3),
      tags: ['ui', 'design', 'onboarding'],
      subtasks: [
        { title: 'Wireframes', completed: true },
        { title: 'High-fidelity mockups', completed: true },
        { title: 'Developer handoff', completed: false },
      ],
    },
    {
      title: 'Update component library',
      description: 'Migrate all UI components to the new design token system.',
      status: 'todo',
      priority: 'medium',
      project: design._id,
      createdBy: user._id,
      dueDate: daysFromNow(7),
      tags: ['design', 'components'],
    },
    {
      title: 'Create icon set for v2',
      description: 'Design 40 new icons in SVG format following our icon guidelines.',
      status: 'completed',
      priority: 'low',
      project: design._id,
      createdBy: user._id,
      dueDate: daysFromNow(-2),
      tags: ['icons', 'design'],
    },
    {
      title: 'Dark mode implementation',
      description: 'Implement system-preference-aware dark mode across all screens.',
      status: 'todo',
      priority: 'high',
      project: design._id,
      createdBy: user._id,
      dueDate: daysFromNow(10),
      tags: ['dark-mode', 'ui'],
    },

    // — Backend API tasks —
    {
      title: 'Implement JWT refresh tokens',
      description: 'Add refresh token rotation and silent re-auth before token expiry.',
      status: 'in_progress',
      priority: 'high',
      project: backend._id,
      createdBy: user._id,
      dueDate: daysFromNow(2),
      tags: ['auth', 'security', 'jwt'],
      subtasks: [
        { title: 'Create refresh token model', completed: true },
        { title: 'Rotation endpoint', completed: false },
        { title: 'Client-side interceptor', completed: false },
      ],
    },
    {
      title: 'Add WebSocket support',
      description: 'Real-time task updates via Socket.io for collaborative editing.',
      status: 'todo',
      priority: 'medium',
      project: backend._id,
      createdBy: user._id,
      dueDate: daysFromNow(14),
      tags: ['websocket', 'realtime'],
    },
    {
      title: 'Rate limiting review',
      description: 'Review and tighten rate limits on public endpoints post-load test.',
      status: 'overdue',
      priority: 'high',
      project: backend._id,
      createdBy: user._id,
      dueDate: daysFromNow(-3),
      tags: ['security', 'backend'],
    },
    {
      title: 'Write OpenAPI documentation',
      description: 'Document all 14 REST endpoints using Swagger/OpenAPI 3.0.',
      status: 'completed',
      priority: 'medium',
      project: backend._id,
      createdBy: user._id,
      dueDate: daysFromNow(-5),
      tags: ['docs', 'api'],
    },
    {
      title: 'Set up CI/CD pipeline',
      description: 'GitHub Actions workflow for automated tests + deployment to production.',
      status: 'todo',
      priority: 'medium',
      project: backend._id,
      createdBy: user._id,
      dueDate: daysFromNow(20),
      tags: ['devops', 'ci-cd'],
    },

    // — Marketing Q2 tasks —
    {
      title: 'Launch Product Hunt page',
      description: 'Prepare assets, tagline, and schedule launch for Tuesday 12:01am PST.',
      status: 'todo',
      priority: 'high',
      project: marketing._id,
      createdBy: user._id,
      dueDate: daysFromNow(5),
      tags: ['launch', 'marketing'],
    },
    {
      title: 'Write Q2 blog posts (x4)',
      description: '4 thought-leadership articles targeting productivity and async work.',
      status: 'in_progress',
      priority: 'medium',
      project: marketing._id,
      createdBy: user._id,
      dueDate: daysFromNow(12),
      tags: ['content', 'seo'],
      subtasks: [
        { title: 'Blog post 1: Async work guide', completed: true },
        { title: 'Blog post 2: Remote team productivity', completed: false },
        { title: 'Blog post 3: Kanban for designers', completed: false },
        { title: 'Blog post 4: Task management ROI', completed: false },
      ],
    },
    {
      title: 'Design Q2 email campaign',
      description: 'Create email sequence for new trial users — 3 emails over 7 days.',
      status: 'overdue',
      priority: 'high',
      project: marketing._id,
      createdBy: user._id,
      dueDate: daysFromNow(-1),
      tags: ['email', 'marketing'],
    },
    {
      title: 'Competitor analysis report',
      description: 'Benchmark Tasklab against Linear, Notion, and Asana across 15 features.',
      status: 'completed',
      priority: 'medium',
      project: marketing._id,
      createdBy: user._id,
      dueDate: daysFromNow(-7),
      tags: ['research', 'analysis'],
    },

    // — No project (general tasks) —
    {
      title: 'Team weekly sync prep',
      description: 'Prepare agenda and shared doc for Friday all-hands.',
      status: 'todo',
      priority: 'low',
      createdBy: user._id,
      dueDate: daysFromNow(1),
      tags: ['meeting', 'team'],
    },
    {
      title: 'Review contractor invoices',
      description: 'Approve 3 pending invoices in the billing portal.',
      status: 'overdue',
      priority: 'high',
      createdBy: user._id,
      dueDate: daysFromNow(-2),
      tags: ['finance', 'admin'],
    },
    {
      title: 'User interview — 5 participants',
      description: 'Schedule and run 30-min sessions with beta users to get product feedback.',
      status: 'in_progress',
      priority: 'high',
      createdBy: user._id,
      dueDate: daysFromNow(6),
      tags: ['research', 'ux'],
      subtasks: [
        { title: 'Send calendar invites', completed: true },
        { title: 'Prepare interview script', completed: true },
        { title: 'Run sessions', completed: false },
        { title: 'Synthesize notes', completed: false },
      ],
    },
    {
      title: 'Update privacy policy',
      description: 'Revise privacy policy to comply with new EU AI Act requirements.',
      status: 'todo',
      priority: 'medium',
      createdBy: user._id,
      dueDate: daysFromNow(30),
      tags: ['legal', 'compliance'],
    },
    {
      title: 'Quarterly board report',
      description: 'Compile Q1 metrics: MAU, MRR, churn, and NPS.',
      status: 'completed',
      priority: 'high',
      createdBy: user._id,
      dueDate: daysFromNow(-10),
      tags: ['reporting', 'finance'],
    },
  ];

  // Add order and insert
  const tasksWithOrder = tasks.map((t, i) => ({ ...t, order: i }));
  const created = await Task.insertMany(tasksWithOrder);
  console.log(`✅ Created ${created.length} tasks`);

  // ── 7. Print summary ────────────────────────────────────────────────────
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🌱 Seed complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  URL:      http://localhost:5173');
  console.log('  Email:    testuser@tasklab.com');
  console.log('  Password: Password1');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
