const redisClient = require('../utils/redisClient');

let isRedisConnected = false;

const runRedis = async () => {
  try {
    if (!isRedisConnected) {
      await redisClient.ping();
      isRedisConnected = true;
      console.log('Redis connected successfully');
    }

    return true;
  } catch (err) {
    console.error('Redis connection failed:', err);
    isRedisConnected = false;
    throw err;
  }
};

const quitRedis = async () => {
  try {
    // Only quit if connection exists and is ready
    if (redisClient && redisClient.status === 'ready') {
      await redisClient.quit();
      console.log('Redis connection closed gracefully');
    } else if (redisClient && redisClient.status === 'connecting') {
      // If still connecting, wait a bit then disconnect
      await new Promise(resolve => setTimeout(resolve, 100));
      redisClient.disconnect();
      console.log('Redis connection forcefully disconnected');
    }
    isRedisConnected = false;
  } catch (err) {
    console.error('Redis quit failed:', err);
    try {
      // Force disconnect if quit fails
      if (redisClient) {
        redisClient.disconnect();
        console.log('Redis forcefully disconnected after quit failure');
      }
    } catch (disconnectErr) {
      console.error('Redis disconnect also failed:', disconnectErr);
    }
    isRedisConnected = false;
  }
};

// Ensure Redis is properly closed on process exit
process.on('exit', () => {
  if (isRedisConnected && redisClient) {
    try {
      redisClient.disconnect();
    } catch (err) {
      // Ignore errors during process exit
      console.error('Redis errors while disconnecting:', err);
    }
  }
});

module.exports = {
  runRedis,
  quitRedis
};

// // const Redis = require('ioredis');
// // const redis = new Redis('redis://localhost:6379');
// const redisClient = require('../utils/redisClient');

// const runRedis = () => {
//   redisClient
//     .ping()
//     .then(_result => {
//       /* eslint-env node */
//       // console.log('Redis says:', result); // "PONG"
//     })
//     .catch(_err => {
//       /* eslint-env node */
//       // console.error('Redis connection failed:', err);
//     });
// };

// const quitRedis = () => {
//   redisClient
//     .quit()
//     .then(_result => {
//       /* eslint-env node */
//       // console.log('Redis says:', result); // "PONG"
//     })
//     .catch(_err => {
//       /* eslint-env node */
//       // console.error('Redis connection failed:', err);
//     });
// };

// module.exports = {
//   runRedis,
//   quitRedis
// };
