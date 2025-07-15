/* eslint-env node */
const { quitRedis, runRedis } = require('./redis');

// Global test setup
process.env.NODE_ENV = 'test';

// Global test utilities
/* eslint-env node, jest */
global.testUtils = {
  createMockUser: (overrides = {}) => ({
    username: 'Test User',
    email: 'test@example.com',
    ...overrides
  }),

  createMockUserWithId: (id = '1', overrides = {}) => ({
    id,
    username: 'Test User',
    email: 'test@example.com',
    ...overrides
  })
};

expect.extend({
  toBeValidUser(received) {
    const isValid =
      received &&
      typeof received.username === 'string' &&
      typeof received.email === 'string';
    return {
      pass: isValid,
      message: () =>
        isValid
          ? 'Expected user not to be valid'
          : 'Expected user to have valid name and email'
    };
  }
});

// Override console to reduce noise
const originalConsole = { ...console };
beforeAll(async () => {
  console.log = jest.fn();
  console.info = jest.fn();
  console.warn = jest.fn();
  console.debug = jest.fn();
  // Keep error for debugging
  console.error = originalConsole.error;
  await runRedis();
}, 30000);

afterAll(() => {
  // Restore console
  Object.assign(console, originalConsole);
});

// Global teardown - runs once after all tests
afterAll(async () => {
  console.log('Cleaning up test suite...');

  try {
    // Close Redis connections
    await quitRedis();

    // Give a moment for cleanup
    await new Promise(resolve => setTimeout(resolve, 100));

    console.log('Test cleanup completed');
  } catch (error) {
    console.error('Test cleanup error:', error);
  }
}, 30000);

// Handle unhandled promise rejections in tests
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions in tests
process.on('uncaughtException', error => {
  console.error('Uncaught Exception:', error);
});

// Graceful shutdown on test interruption
process.on('SIGINT', async () => {
  console.log('Test interrupted, cleaning up...');
  try {
    await quitRedis();
  } catch (error) {
    console.error('Cleanup error during interruption:', error);
  }
  process.exit(0);
});

// Set default timeout for all tests
jest.setTimeout(30000);
