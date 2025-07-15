const loggerConfig = {
  level: process.env.LOG_LEVEL || 'info',
  defaultMeta: { service: 'rtl-chat-api' },
  logs: {
    error: {
      filename: 'logs/error.log',
      level: 'error'
    },
    combined: {
      filename: 'logs/combined.log'
    }
  },
  is_printable_console: process.env.NODE_ENV !== 'production'
};

module.exports = loggerConfig;
