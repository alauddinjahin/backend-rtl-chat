const healthCheck = (req, socketManager)=> {
  return {
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.APP_VERSION || '1.0.0',
    requestId: req.id,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    dependencies: {
      database: 'connected', // will be added actual DB health check
      redis: 'connected',    // will be added Redis health check if used
      activeUsers: socketManager.getConnectedUsersCount()
      // socketConnections: manager.getConnectedUsersCount()
    }
  };
};

module.exports = healthCheck;