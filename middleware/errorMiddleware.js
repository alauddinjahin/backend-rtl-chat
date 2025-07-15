const HTTPStatusCode = require('./../utils/statusCode'); // Adjust path as needed
const logger = require('./../utils/logger');

class AppError extends Error {
  constructor(
    message,
    statusCode = HTTPStatusCode.INTERNAL_SERVER_ERROR,
    isOperational = true
  ) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();

    Error.captureStackTrace(this, this.constructor);
  }
}

// Enhanced global error handling middleware
const errorHandler = (err, req, res, _next) => {
  let error = { ...err };
  error.message = err?.message || 'Something wents wrong';
  error.statusCode = err?.statusCode || HTTPStatusCode.INTERNAL_SERVER_ERROR;

  // Log error details with request context
  const logError = (error, req) => {
    const logData = {
      timestamp: new Date().toISOString(),
      requestId: req.id || `req_${Date.now()}`,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id || 'anonymous',
      body: req.method !== 'GET' ? req.body : undefined,
      params: req.params,
      query: req.query,
      error: {
        name: error.name,
        message: error.message,
        statusCode: error.statusCode,
        stack: error.stack,
        isOperational: error.isOperational
      }
    };

    if (HTTPStatusCode.isServerError(error.statusCode)) {
      console.error('SERVER ERROR:', JSON.stringify(logData, null, 2));
    } else if (HTTPStatusCode.isClientError(error.statusCode)) {
      console.warn('CLIENT ERROR:', JSON.stringify(logData, null, 2));
    } else {
      console.log('ERROR:', JSON.stringify(logData, null, 2));
    }
  };

  // Handle specific error types
  const handleSpecificErrors = err => {
    // Mongoose CastError (Invalid ObjectId)
    if (err.name === 'CastError') {
      const message = `Invalid ${err.path}: ${err.value}`;
      return new AppError(message, HTTPStatusCode.BAD_REQUEST);
    }

    // Mongoose Duplicate Key Error
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      const value = err.keyValue[field];
      const message = `Duplicate ${field}: ${value}. Please use another value.`;
      return new AppError(message, HTTPStatusCode.CONFLICT);
    }

    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      const message = `Invalid input data: ${errors.join('. ')}`;
      return new AppError(message, HTTPStatusCode.UNPROCESSABLE_ENTITY);
    }

    // JWT Errors
    if (err.name === 'JsonWebTokenError') {
      return new AppError(
        'Invalid token. Please log in again.',
        HTTPStatusCode.UNAUTHORIZED
      );
    }

    if (err.name === 'TokenExpiredError') {
      return new AppError(
        'Your token has expired. Please log in again.',
        HTTPStatusCode.UNAUTHORIZED
      );
    }

    // Multer Errors (File Upload)
    if (err.code === 'LIMIT_FILE_SIZE') {
      return new AppError(
        'File too large. Please upload a smaller file.',
        HTTPStatusCode.PAYLOAD_TOO_LARGE
      );
    }

    if (err.code === 'LIMIT_FILE_COUNT') {
      return new AppError(
        'Too many files. Please upload fewer files.',
        HTTPStatusCode.BAD_REQUEST
      );
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return new AppError(
        'Unexpected file field. Please check your file upload.',
        HTTPStatusCode.BAD_REQUEST
      );
    }

    // Syntax Error (Invalid JSON)
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      return new AppError('Invalid JSON payload.', HTTPStatusCode.BAD_REQUEST);
    }

    // Rate Limiting Error
    if (err.statusCode === HTTPStatusCode.TOO_MANY_REQUESTS) {
      return new AppError(
        'Too many requests. Please try again later.',
        HTTPStatusCode.TOO_MANY_REQUESTS
      );
    }

    // Database Connection Error
    if (
      err.name === 'MongoNetworkError' ||
      err.name === 'MongooseServerSelectionError'
    ) {
      return new AppError(
        'Database connection failed. Please try again later.',
        HTTPStatusCode.SERVICE_UNAVAILABLE
      );
    }

    return err;
  };

  // Process the error
  error = handleSpecificErrors(error);

  // Log the error
  logError(error, req);

  const getCleanMessage = error => {
    // For operational errors (our custom AppError), use the message
    if (error.isOperational) {
      return error.message;
    }

    // For server errors, use generic messages
    if (HTTPStatusCode.isServerError(error.statusCode)) {
      return 'An unexpected error occurred. Please try again later.';
    }

    // For client errors, use the message (usually safe)
    return error.message;
  };

  // Prepare clean response
  const errorResponse = {
    success: false,
    error: {
      message: getCleanMessage(error),
      statusCode: error.statusCode,
      timestamp: new Date().toISOString()
    }
  };

  // Add request ID for support purposes
  if (req.id) {
    errorResponse.requestId = req.id;
  }

  if (process.env.NODE_ENV === 'development') {
    errorResponse.debug = {
      originalMessage: err.message,
      // stack: error.stack,
      name: error.name,
      path: req.originalUrl,
      method: req.method
    };
  }

  // Send error response
  // console.log(errorResponse)
  return res.status(error.statusCode).json(errorResponse);
};

const notFoundHandler = (req, res) => {
  // Log the 404 warning
  logger.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    requestId: req.id
  });

  // Return 404 response directly
  return res.status(HTTPStatusCode.NOT_FOUND).json({
    error: 'Route not found',
    message: `The requested endpoint ${req.method} ${req.originalUrl} does not exist`,
    requestId: req.id,
    timestamp: new Date().toISOString()
  });
};

const asyncHandler = fn => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

const handleUncaughtException = () => {
  process.on('uncaughtException', err => {
    console.error('UNCAUGHT EXCEPTION! Shutting down...');
    console.error('Error:', err.name, err.message);
    console.error('Stack:', err.stack);
    process.exit(1);
  });
};

const handleUnhandledRejection = server => {
  process.on('unhandledRejection', err => {
    console.error('UNHANDLED REJECTION! Shutting down...');
    console.error('Error:', err.name, err.message);
    console.error('Stack:', err.stack);

    server.close(() => {
      process.exit(1);
    });
  });
};

const handleGracefulShutdown = server => {
  const shutdown = signal => {
    console.log(`\n${signal} received. Shutting down gracefully...`);

    server.close(() => {
      console.log('Process terminated');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

const initializeErrorHandlers = server => {
  handleUncaughtException();
  handleUnhandledRejection(server);
  handleGracefulShutdown(server);
};

module.exports = {
  AppError,
  errorHandler,
  notFoundHandler,
  asyncHandler,
  initializeErrorHandlers
};
