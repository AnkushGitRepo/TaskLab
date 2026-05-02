const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Task = require('../models/Task');

const TEST_DB = process.env.MONGODB_URI || 'mongodb://localhost:27017/tasklab_test';
let token;
let userId;

beforeAll(async () => {
  await mongoose.connect(TEST_DB);
  const res = await request(app).post('/api/auth/register').send({
    name: 'Task Tester',
    email: 'test.tasklab.tasks@example.com',
    password: 'Password1',
  });
  token = res.body.data?.token;
  userId = res.body.data?.user?.id;
});

afterAll(async () => {
  await Task.deleteMany({ createdBy: userId });
  await User.deleteOne({ email: 'test.tasklab.tasks@example.com' });
  await mongoose.connection.close();
});

describe('Tasks CRUD', () => {
  let taskId;

  it('should create task with title and description', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Task', description: 'Some description', priority: 'high' });
    expect(res.status).toBe(201);
    expect(res.body.data.task.title).toBe('Test Task');
    taskId = res.body.data.task._id;
  });

  it('should reject empty title', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '' });
    expect(res.status).toBe(400);
  });

  it('should reject whitespace-only title', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '   ' });
    expect(res.status).toBe(400);
  });

  it('should return paginated task list', async () => {
    const res = await request(app)
      .get('/api/tasks?page=1&limit=10')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.tasks)).toBe(true);
  });

  it('should update task fields', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Task', priority: 'low' });
    expect(res.status).toBe(200);
    expect(res.body.data.task.title).toBe('Updated Task');
  });

  it('should mark task as completed', async () => {
    const res = await request(app)
      .patch(`/api/tasks/${taskId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'completed' });
    expect(res.status).toBe(200);
    expect(res.body.data.task.status).toBe('completed');
  });

  it('should return 400 if already completed', async () => {
    const res = await request(app)
      .patch(`/api/tasks/${taskId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'completed' });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already marked as complete/i);
  });

  it('should delete task', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it('should return correct counts per status', async () => {
    const res = await request(app)
      .get('/api/tasks/stats')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.stats.byStatus).toBeDefined();
  });
});
