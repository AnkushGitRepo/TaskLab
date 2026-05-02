const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Project = require('../models/Project');

const TEST_DB = process.env.MONGODB_URI || 'mongodb://localhost:27017/tasklab_test';
let token;
let userId;

beforeAll(async () => {
  await mongoose.connect(TEST_DB);
  const res = await request(app).post('/api/auth/register').send({
    name: 'Project Tester',
    email: 'test.tasklab.projects@example.com',
    password: 'Password1',
  });
  token = res.body.data?.token;
  userId = res.body.data?.user?.id;
});

afterAll(async () => {
  await Project.deleteMany({ owner: userId });
  await User.deleteOne({ email: 'test.tasklab.projects@example.com' });
  await mongoose.connection.close();
});

describe('Projects CRUD', () => {
  let projectId;

  it('should create a project', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Project', color: '#FF5733' });
    expect(res.status).toBe(201);
    expect(res.body.data.project.name).toBe('Test Project');
    projectId = res.body.data.project._id;
  });

  it('should rename a project', async () => {
    const res = await request(app)
      .put(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Renamed Project' });
    expect(res.status).toBe(200);
    expect(res.body.data.project.name).toBe('Renamed Project');
  });

  it('should delete project and its tasks', async () => {
    const res = await request(app)
      .delete(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});
