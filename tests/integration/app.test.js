const request = require('supertest');
const app = require('@/server');
const { BASE_PATH } = require('@/config/api');

describe('App Integration Tests', () => {
  describe('GET /', () => {
    it('should return welcome message', async () => {
      const response = await request(app)
        .get(BASE_PATH)
        .expect(200);

      expect(response.body).toBeDefined();
      // Add your specific assertions here
    });
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      // Adjust endpoint based on your app
      const response = await request(app)
        .get(`${BASE_PATH}/health`)
        .expect(200);

      expect(response.body.status).toBe('OK');
    });
  });

  // Add more integration tests for your specific routes
});


// "lint": "eslint src tests",
// "lint:fix": "eslint src tests --fix",
// "format": "prettier --write src tests",
// "format:check": "prettier --check src tests",