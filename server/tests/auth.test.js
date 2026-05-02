const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');

const TEST_DB = process.env.MONGODB_URI || 'mongodb://localhost:27017/tasklab_test';

beforeAll(async () => {
  await mongoose.connect(TEST_DB);
});

afterAll(async () => {
  await User.deleteMany({ email: /test\.tasklab/ });
  await mongoose.connection.close();
});

describe('Auth - Registration', () => {
  it('should create user with valid data', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test.tasklab.register@example.com',
      password: 'Password1',
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

  it('should reject empty name', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: '',
      email: 'test.tasklab.noname@example.com',
      password: 'Password1',
    });
    expect(res.status).toBe(400);
  });

  it('should reject invalid email', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test',
      email: 'not-an-email',
      password: 'Password1',
    });
    expect(res.status).toBe(400);
  });

  it('should reject duplicate email', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Test',
      email: 'test.tasklab.dup@example.com',
      password: 'Password1',
    });
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test 2',
      email: 'test.tasklab.dup@example.com',
      password: 'Password1',
    });
    expect(res.status).toBe(400);
  });

  it('should reject short password', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test',
      email: 'test.tasklab.short@example.com',
      password: 'abc',
    });
    expect(res.status).toBe(400);
  });
});

describe('Auth - Login & Profile', () => {
  let token;

  beforeAll(async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Login Tester',
      email: 'test.tasklab.login@example.com',
      password: 'Password1',
    });
  });

  it('should return JWT on valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test.tasklab.login@example.com',
      password: 'Password1',
    });
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
    token = res.body.data.token;
  });

  it('should reject wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test.tasklab.login@example.com',
      password: 'WrongPassword1',
    });
    expect(res.status).toBe(401);
  });

  it('should return user when authenticated', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe('test.tasklab.login@example.com');
  });

  it('should reject unauthenticated request', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
