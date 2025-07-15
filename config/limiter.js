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


module.exports = configLimiter;
