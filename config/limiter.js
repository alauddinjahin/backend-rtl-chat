const configLimiter = {
  _windowMs() {
    return 15 * 60 * 1000;
  },
  _getMessage() {
    return {
      error: 'Too many authentication attempts, please try again later.',
      retryAfter: '15 minutes'
    };
  },
  get generalLimiter() {
    return {
      max: 1000, // limit each IP
      standardHeaders: true,
      legacyHeaders: false,
      ...this._getMessage(),
      windowMs: this._windowMs()
    };
  },
  get authLimiter() {
    return {
      max: 50,
      ...this._getMessage(),
      windowMs: this._windowMs()
    };
  }
};

// const createLimiterConfig = () => {
//     const windowMs = 15 * 60 * 1000; // 15 minutes

//     const getMessage = () => ({
//         error: 'Too many authentication attempts, please try again later.',
//         retryAfter: '15 minutes'
//     });

//     return {
//         generalLimiter: {
//             max: 1000, // limit each IP
//             standardHeaders: true,
//             legacyHeaders: false,
//             windowMs,
//             ...getMessage()
//         },
//         authLimiter: {
//             max: 5,
//             windowMs,
//             ...getMessage()
//         }
//     };
// };

module.exports = configLimiter;
