/* eslint-env node */

const { quitRedis } = require('./redis');

// Global teardown - runs once after all test files complete
module.exports = async () => {
  console.log('Running global teardown...');

  try {
    // Ensure Redis connections are closed
    await quitRedis();

    // Force cleanup of any remaining handles
    if (global.gc) {
      global.gc();
    }

    console.log('Global teardown completed');
  } catch (error) {
    console.error('Global teardown error:', error);
  }

  // Force exit if still hanging after cleanup
  setTimeout(() => {
    console.log('orce exiting due to timeout');
    process.exit(0);
  }, 5000);
};
