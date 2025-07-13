require('dotenv').config()
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const winston = require('winston');
const { body, validationResult } = require('express-validator');

// Import configurations and routes
const connectDB = require('./config/database');
// const configureSocket = require('./config/socket');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');
// const socketConnection = require('./utils/socketServer');
const allowedOrigins = require('./utils/allowedOrigins');
const SocketManager = require('./config/SocketManager');
const { initializeErrorHandlers } = require('./middleware/errorMiddleware');


// Enhanced logging configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'rtl-chat-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    ...(process.env.NODE_ENV !== 'production' ? [
      new winston.transports.Console({
        format: winston.format.simple()
      })
    ] : [])
  ]
});


// Create Express app
const app = express();
const server = http.createServer(app);

// Configure Socket.IO with CORS
// const io = socketConnection(server);
const manager = SocketManager.initialize(server);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));


// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // limit each IP
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Stricter limit for auth endpoints
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: '15 minutes'
  }
});



// Middleware stack
app.use(compression());
app.use(limiter);


// Enhanced CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`Blocked request from unauthorized origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count']
}));



// Request logging
app.use(morgan('combined', { 
  stream: { write: message => logger.info(message.trim()) }
}));


// Body parsing with size limits
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));


// Request ID middleware for tracing
app.use((req, res, next) => {
  req.id = require('crypto').randomUUID();
  res.setHeader('X-Request-ID', req.id);
  next();
});


// Request validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
      requestId: req.id
    });
  }
  next();
};

// Middleware
// app.use(cors({
//   origin: allowedOrigins,
//   credentials: true
// }));



// app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API versioning
const API_VERSION = process.env.API_VERSION || "v1";

// Routes
app.use(`/api/${API_VERSION}`, authLimiter, authRoutes);
app.use(`/api/${API_VERSION}/users`, userRoutes);
app.use(`/api/${API_VERSION}/messages`, messageRoutes);


// Enhanced health check endpoint
app.get(`/api/${API_VERSION}/health`, async (req, res) => {
  try {
    const healthCheck = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.APP_VERSION || '1.0.0',
      requestId: req.id,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      dependencies: {
        database: 'connected', // Add actual DB health check
        redis: 'connected',    // Add Redis health check if used
        socketConnections: manager.getConnectionCount()
      }
    };
    
    res.json(healthCheck);
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: 'Service temporarily unavailable',
      requestId: req.id
    });
  }
});

// Metrics endpoint for monitoring
app.get(`/api/${API_VERSION}/metrics`, (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    // In production, protect this endpoint
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${process.env.METRICS_TOKEN}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }
  
  res.json({
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    socketConnections: manager.getConnectionCount(),
    activeUsers: manager.getActiveUserCount(),
    requestId: req.id
  });
});


// Configure Socket.IO
// configureSocket(io);
manager.load();


// Enhanced error handling middleware
app.use((err, req, res, next) => {
  logger.error('Application error:', {
    error: err.message,
    stack: err.stack,
    requestId: req.id,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Don't expose sensitive error details in production
  if (process.env.NODE_ENV === 'production') {
    res.status(err.status || 500).json({
      error: 'Internal server error',
      message: 'Something went wrong on our end',
      requestId: req.id,
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(err.status || 500).json({
      error: err.message,
      stack: err.stack,
      requestId: req.id,
      timestamp: new Date().toISOString()
    });
  }
});


// 404 handler
app.use('*', (req, res) => {
  logger.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    requestId: req.id
  });
  
  res.status(404).json({
    error: 'Route not found',
    message: `The requested endpoint ${req.method} ${req.originalUrl} does not exist`,
    requestId: req.id,
    timestamp: new Date().toISOString()
  });
});


// Server startup
const startServer = async () => {
  try {

    await connectDB();
    
    const PORT = process.env.PORT || 5000;
    
    server.listen(PORT, () => {

      logger.info(`Server started successfully`, {
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version,
        pid: process.pid
      });
      
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`API URL: http://localhost:${PORT}/${API_VERSION}`);
      console.log(`Health check: http://localhost:${PORT}/${API_VERSION}/health`);
    });
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};




// Graceful shutdown
initializeErrorHandlers(server)


// Start the server
startServer();