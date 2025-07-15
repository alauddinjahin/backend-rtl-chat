// const Redis = require('ioredis');
// const redis = new Redis('redis://localhost:6379');
const redisClient = require('../utils/redisClient');

const runRedis = () => {
  redisClient
    .ping()
    .then(result => {
      /* eslint-env node */
      console.log('Redis says:', result); // "PONG"
    })
    .catch(err => {
      /* eslint-env node */
      console.error('Redis connection failed:', err);
    });
};

module.exports = runRedis;
