const winston = require('winston');
const { defaultMeta, is_printable_console, level, logs } = require('./../config/logger');

class Logger {
  constructor() {
    if (Logger.instance) {
      return Logger.instance;
    }

    this.logger = winston.createLogger({
      level,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta,
      transports: [
        new winston.transports.File(logs.error),
        new winston.transports.File(logs.combined),
        ...(is_printable_console ? [
          new winston.transports.Console({
            format: winston.format.simple()
          })
        ] : [])
      ]
    });

    Logger.instance = this;
  }


  getLogger() {
    return this.logger;
  }

  // Proxy winston methods for convenience
  error(message, meta = {}) {
    return this.logger.error(message, meta);
  }

  warn(message, meta = {}) {
    return this.logger.warn(message, meta);
  }

  info(message, meta = {}) {
    return this.logger.info(message, meta);
  }

  debug(message, meta = {}) {
    return this.logger.debug(message, meta);
  }

  log(level, message, meta = {}) {
    return this.logger.log(level, message, meta);
  }
}

// Create and export singleton instance
const loggerInstance = new Logger();
module.exports = loggerInstance.getLogger();