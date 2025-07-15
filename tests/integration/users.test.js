const request = require('supertest');
const mongoose = require('mongoose');
const app = require('@/server');
const { BASE_PATH } = require('@/config/api');

// Test data
const testUser = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'Test@1234'
};

describe('User API Integration Tests', () => {
  let authToken;
  let testUserId;
  let server;

  beforeAll(async () => {
    // Start server on random port
    server = app.listen(0);

    // Clear database and create test user
    await mongoose.connection.dropDatabase();

    // Register test user
    const registerResponse = await request(app)
      .post(`${BASE_PATH}/register`)
      .send(testUser);

    // Verify registration response structure
    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body).toHaveProperty('user');
    expect(registerResponse.body.user).toHaveProperty('id');
    testUserId = registerResponse.body.user.id;

    // Login to get valid token
    const loginResponse = await request(app).post(`${BASE_PATH}/login`).send({
      email: testUser.email,
      password: testUser.password
    });

    // Verify login response structure
    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty('token');
    expect(loginResponse.body).toHaveProperty('user');
    authToken = loginResponse.body.token;

    console.log('Test Setup Complete - User ID:', testUserId);
  }, 30000);

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await server.close();
    await mongoose.disconnect();
  }, 30000);

  describe('Authentication', () => {
    test('POST /api/v1/register should create user', async () => {
      const newUser = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'New@1234'
      };

      const response = await request(app)
        .post(`${BASE_PATH}/register`)
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(newUser.email);
    }, 15000);

    test('POST /api/v1/login should authenticate', async () => {
      const response = await request(app).post(`${BASE_PATH}/login`).send({
        email: testUser.email,
        password: testUser.password
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.id).toBe(testUserId);
    }, 15000);
  });

  describe('User Management', () => {
    test('GET /api/v1/users should list users', async () => {
      const response = await request(app)
        .get(`${BASE_PATH}/users`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('users');
      expect(Array.isArray(response.body.users)).toBe(true);
    }, 15000);

    test('GET /api/v1/users/:id should return user', async () => {
      const response = await request(app)
        .get(`${BASE_PATH}/users/${testUserId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id', testUserId);
      expect(response.body.user.username).toBe(testUser.username);
    }, 15000);
  });
});
