const { default: RedisStore } = require('rate-limit-redis');
const redisClient = require('../utils/redisClient');
const HTTPStatusCode = require('../utils/statusCode');

const WINDOW_MINUTES = 15;
const WINDOW_MS = WINDOW_MINUTES * 60 * 1000;



const getCommonOptions = () => ({
  windowMs: WINDOW_MS,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({ sendCommand: (...args) => redisClient.call(...args) })
});

const getMessage = (retryAfter) => ({
  error: 'Too many requests, please try again later.',
  retryAfter: `${retryAfter} minutes`
});

// ip or use req.user.id after login
const conditionalKeyGenerator = (req) => req?.user?.id || req.ip;

module.exports = {
  authLimiterOptions: {
    ...getCommonOptions(),
    max: 50, // allow to do 50 requests within 15mins
    message: getMessage(WINDOW_MINUTES),
    keyGenerator: conditionalKeyGenerator, // or use req.user.id after login
    handler: (req, res, next, options) => {
      res.status(HTTPStatusCode.TOO_MANY_REQUESTS).json(options.message);
    }
  },

  generalLimiterOptions: {
    ...getCommonOptions(),
    max: 1000,
    message: getMessage(WINDOW_MINUTES),
    keyGenerator: (req) => req.ip
  }
};
