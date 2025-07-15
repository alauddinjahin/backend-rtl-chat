/* eslint-env node */

// const { expect } = require('@jest/globals');

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
