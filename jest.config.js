module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/tests/**/*.test.js', '**/tests/**/*.spec.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/playwright-report/',
    '/test-results/',
    '/tests/e2e/',
    'tests/redis.js'
  ],
  collectCoverageFrom: [
    'backend/**/*.js',
    'controllers/**/*.js',
    'middleware/**/*.js',
    'models/**/*.js',
    'routes/**/*.js',
    'services/**/*.js',
    'utils/**/*.js',
    '!**/utils/swagger/**',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/test-results/**',
    '!server.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  globalTeardown: '<rootDir>/tests/teardown.js',
  globals: {
    expect: 'readonly'
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  verbose: true,
  testTimeout: 30000,
  maxWorkers: '50%',
  // maxWorkers: 1,
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
  detectOpenHandles: true,
  detectLeaks: true,
  forceExit: true,
  cache: false,
  watchman: false,
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@backend/(.*)$': '<rootDir>/backend/$1',
    '^@controllers/(.*)$': '<rootDir>/controllers/$1',
    '^@middleware/(.*)$': '<rootDir>/middleware/$1',
    '^@models/(.*)$': '<rootDir>/models/$1',
    '^@routes/(.*)$': '<rootDir>/routes/$1',
    '^@services/(.*)$': '<rootDir>/services/$1',
    '^@utils/(.*)$': '<rootDir>/utils/$1',
    '^@/server$': '<rootDir>/backend/server.js' // optional override
  }
};
