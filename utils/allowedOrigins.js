
const allowedOrigins = process.env.NODE_ENV === 'production' 
        ? [process.env.FRONTEND_URL] 
        : ['http://localhost:5000', 'http://localhost:3001', 'redis://localhost:6379', 'redis://127.0.0.1:6379','redis://172.28.30.15:6379'];

module.exports = allowedOrigins