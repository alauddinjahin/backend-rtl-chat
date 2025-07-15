/* eslint-disable no-redeclare */
const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');
const { BASE_PATH } = require('@/config/api');

// Configure API tests
test.use({
  baseURL: process.env.API_BASE_URL || 'http://localhost:5000',
  extraHTTPHeaders: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// // Test data

const date = Date.now().toString();

const uniqueRef = ()=> (Math.floor(Math.random() * 3) + date.substring(3, date.length));

const testUser = {
  username: `ser${uniqueRef()}`,
  email: `test${uniqueRef()}@example.com`,
  password: 'Test@1234'
};

let authToken = '';
const testUserId = '';
const testMessageId = '';
let registeredUser = null;

test.describe.configure({ mode: 'serial' });

test.describe('API Endpoints', () => {
  // Health Check
  test(`GET ${BASE_PATH}/health should return 200`, async ({ request }) => {
    const response = await request.get(`${BASE_PATH}/health`);
    expect(response.status()).toBe(200);
    expect(await response.json()).toHaveProperty('status', 'OK');
  });

  // Auth Tests
  test.describe('Authentication', () => {
    test(`POST ${BASE_PATH}/register should create user`, async ({ request }) => {
      const response = await request.post(`${BASE_PATH}/register`, {
        data: testUser
      });
      const data = await response.json();

      expect(response.status()).toBe(201);
      expect(data).toHaveProperty('token');
      expect(data.user.email).toBe(testUser.email);

      registeredUser = data.user;
    });

    test(`POST ${BASE_PATH}/login should authenticate`, async ({ request }) => {
      const response = await request.post(`${BASE_PATH}/login`, {
        data: {
          email: testUser.email,
          password: testUser.password
        }
      });

      const data = await response.json();
      console.log(response.status(),'response.status()');

      expect(response.status()).toBe(200);
      expect(data).toHaveProperty('token');
      authToken = data.token;
    });
  });

  // User Tests
  test.describe('User Management', () => {
    test(`GET ${BASE_PATH}/users should list users`, async ({ request }) => {
      const response = await request.get(`${BASE_PATH}/users`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      const data = await response.json();

      expect(response.status()).toBe(200);
      expect(Array.isArray(data.users)).toBeTruthy();
    });

    test(`GET ${BASE_PATH}/users/:id should return user`, async ({ request }) => {
      const response = await request.get(`${BASE_PATH}/users/${registeredUser.id}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await response.json();
      expect(response.status()).toBe(200);
      expect(data.user).toHaveProperty('id', registeredUser.id);
    });
  });

  // Message Tests
  test.describe('Message System', () => {
    test(`POST ${BASE_PATH}/messages/send should create message`, async ({ request }) => {
      const testMessage = faker.lorem.sentence();

      const response = await request.post(`${BASE_PATH}/messages/send`, {
        headers: { 'Authorization': `Bearer ${authToken}` },
        data: {
          content: testMessage,
          receiverId: registeredUser.id
        }
      });

      const { message, data } = await response.json();

      //   console.log(data.content, data)

      expect(response.status()).toBe(201);
      expect(data).toHaveProperty('content', testMessage);

      expect(typeof data.sender).toBe('object');
      expect(data.sender).toHaveProperty('username');

      expect(typeof data.receiver).toBe('object');
      expect(data.receiver).toHaveProperty('username');
    });

    test(`GET ${BASE_PATH}/messages/unread should list messages`, async ({ request }) => {
      const response = await request.get(`${BASE_PATH}/messages/unread`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const {  data } = await response.json();
      //   console.log(data,'messages')

      expect(response.status()).toBe(200);
    });
  });

  // Error Cases
  test.describe('Error Handling', () => {
    test('GET /nonexistent should 404', async ({ request }) => {
      const response = await request.get('/nonexistent');
      expect(response.status()).toBe(404);
    });

    test('Unauthorized access should 401', async ({ request }) => {
      const response = await request.get(`${BASE_PATH}/users`);
      expect(response.status()).toBe(401);
    });
  });
});


