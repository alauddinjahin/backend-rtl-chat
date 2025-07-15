const request = require('supertest');
const mongoose = require('mongoose');
const app = require('@/server');
const { BASE_PATH } = require('@/config/api');

describe('API Status check', () => {
  let server;

  beforeAll(async () => {
    console.log('Starting test setup...');

    // Start server
    server = app.listen(0);
    console.log('Server started on port:', server.address().port);

    // Check initial DB state
    console.log('Initial DB state:', mongoose.connection.readyState);

    // Wait for DB connection if needed
    if (mongoose.connection.readyState !== 1) {
      console.log('Waiting for DB connection...');
      await mongoose.connection.asPromise();
    }

    console.log('Final DB state:', mongoose.connection.readyState);

    // Test basic server response
    try {
      const testResponse = await request(app).get(BASE_PATH);
      console.log('Test response status:', testResponse.status);
      console.log('Test response body:', testResponse.body);
    } catch (error) {
      console.error('Test response error:', error.message);
    }

    console.log('Setup complete');
  }, 30000);

  afterAll(async () => {
    console.log('Cleaning up...');
    if (server) {
      await server.close();
    }
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    console.log('Cleanup complete');
  }, 30000);

  test('should return welcome message', async () => {
    console.log('Testing welcome message...');
    const response = await request(app).get(BASE_PATH);

    console.log('Welcome response status:', response.status);
    console.log('Welcome response body:', response.body);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  }, 15000);

  test('should return health status', async () => {
    console.log('Testing health status...');
    const response = await request(app).get(`${BASE_PATH}/health`);

    console.log('Health response status:', response.status);
    console.log('Health response body:', response.body);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
  }, 15000);
});
