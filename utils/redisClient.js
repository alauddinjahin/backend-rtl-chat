const Redis = require('ioredis');

// ip addr | grep eth0 for wsl

const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined // /etc/redis/redis.conf -> requirepass yourStrongPassword then need it
});

module.exports = redis;
