require('dotenv').config()
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

// const configureSocket = require('./config/socket');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');
const swaggerRoutes = require('./routes/swagger');
// const socketConnection = require('./utils/socketServer');
const SocketManager = require('./config/SocketManager');
const { initializeErrorHandlers } = require('./middleware/errorMiddleware');
const logger = require('./utils/logger');
const helmetConfig = require("./config/helmet");
const corsConfig = require("./config/cors");
const {generalLimiter, authLimiter:authLimiterConfig } = require('./config/limiter');
const { requestIdGenerator } = require('./middleware/request');
const healthCheck = require('./utils/healthCheck');
const Metrics = require('./utils/metrics');
const applicationLogger = require('./utils/applicationLogger');
const HTTPStatusCode = require('./utils/statusCode');
const startServer = require('./utils/serverSetup');

// need to add swagger


// Create Express app
const app = express();
const server = http.createServer(app);

// Configure Socket.IO with CORS
// const io = socketConnection(server);
const manager = SocketManager.initialize(server);

// Security middleware
app.use(helmet(helmetConfig));


// Rate limiting
// console.log(authLimiterConfig, 'authLimiterConfig')
const limiter = rateLimit(generalLimiter);
const authLimiter = rateLimit(authLimiterConfig);


// Middleware stack
app.use(compression());
app.use(limiter);


// Enhanced CORS configuration
app.use(cors(corsConfig));



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
app.use(requestIdGenerator);


// app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API versioning
const API_VERSION = process.env.API_VERSION || "v1";

// Routes
app.use(`/api/${API_VERSION}`, authRoutes);
// app.use(`/api/${API_VERSION}`, authLimiter, authRoutes);
app.use(`/api/${API_VERSION}/users`, userRoutes);
app.use(`/api/${API_VERSION}/messages`, messageRoutes);



app.use(`/api/${API_VERSION}/docs`, swaggerRoutes)


// Enhanced health check endpoint
app.get(`/api/${API_VERSION}/health`, async (req, res) => {
  try {
    return res.json(healthCheck(req, manager));
  } catch (error) {
    logger.error('Health check failed:', error);
    return res.status(HTTPStatusCode.NOT_IMPLEMENTED).json({
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
      return res.status(HTTPStatusCode.UNAUTHORIZED).json({ error: 'Unauthorized' });
    }
  }
  
  res.json(Metrics(req, manager));

});


// Configure Socket.IO
// configureSocket(io);
manager.load();


// Enhanced error handling middleware
app.use((err, req, res, next) => {

  const {body, production, dev} = applicationLogger(err, req);
  logger.error('Application error:', body);

  // Don't expose sensitive error details in production
  if (process.env.NODE_ENV === 'production') {
    return res.status(err.status || HTTPStatusCode.INTERNAL_SERVER_ERROR).json(production);
  } else {
    return res.status(err.status || HTTPStatusCode.INTERNAL_SERVER_ERROR).json(dev);
  }
});


// 404 handler
app.use('*', (req, res) => {
  logger.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    requestId: req.id
  });
  
  return res.status(HTTPStatusCode.NOT_FOUND).json({
    error: 'Route not found',
    message: `The requested endpoint ${req.method} ${req.originalUrl} does not exist`,
    requestId: req.id,
    timestamp: new Date().toISOString()
  });
});


// Graceful shutdown
initializeErrorHandlers(server, manager)


// Start the server
startServer(server, ({ PORT, NODE_ENV, NODE_VERSION, PID })=>{

  logger.info(`Server started successfully`, {
    port: PORT,
    environment: NODE_ENV,
    nodeVersion: NODE_VERSION,
    pid: PID
  });
  
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV || 'development'}`);
  console.log(`API URL: http://localhost:${PORT}/${API_VERSION}`);
  console.log(`Health check: http://localhost:${PORT}/${API_VERSION}/health`);
})