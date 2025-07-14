const Redis = require('ioredis');
// const redis = new Redis('redis://localhost:6379');
const redisClient = require('../utils/redisClient');

const runRedis = ()=>{
    redisClient.ping()
    .then(result => {
        console.log('Redis says:', result); // "PONG"
    })
    .catch(err => {
        console.error('Redis connection failed:', err);
    });
}


module.exports = runRedis