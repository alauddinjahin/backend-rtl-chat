const rateLimit = require('express-rate-limit');
const {
  authLimiterOptions,
  generalLimiterOptions
} = require('../config/rateLimitRedis');

const authLimiterRedis = rateLimit(authLimiterOptions);
const generalLimiterRedis = rateLimit(generalLimiterOptions);

module.exports = {
  authLimiterRedis,
  generalLimiterRedis
};
