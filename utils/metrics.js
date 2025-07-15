const Metrics = (req, socketManager) => {
  return {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    activeUsers: socketManager.getConnectedUsersCount(),
    requestId: req.id
  };
};

module.exports = Metrics;
