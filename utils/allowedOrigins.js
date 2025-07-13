
const allowedOrigins = process.env.NODE_ENV === 'production' 
        ? [process.env.FRONTEND_URL] 
        : ['http://localhost:5000', 'http://localhost:3001'];

module.exports = allowedOrigins