// Server startup

module.exports = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    NODE_VERSION: process.version,
    PID: process.pid
}



