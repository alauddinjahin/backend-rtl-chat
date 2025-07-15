const DB = require('../config/database');
const serverConfig = require('./../config/server');
const startServer = async (server, cb = () => {}) => {
  try {
    await DB.connect();

    const listener = server.listen(serverConfig.PORT, _ => cb(serverConfig));

    // Handle port in use error
    listener.on('error', e => {
      if (e.code === 'EADDRINUSE') {
        /* eslint-env node */
        setTimeout(() => {
          server.close();
          // server.listen(serverConfig.PORT);
        }, 1000);
      }
    });
  } catch (error) {
    /* eslint-env node */
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

module.exports = startServer;

// curl -X POST http://localhost:5000/api/v1/register \
//   -H "Content-Type: application/json" \
//   -d '{
//     "username": "john_doe34",
//     "email": "john.doe34@example.com",
//     "password": "my@Apassword123",
//     "confirmPassword": "my@Apassword123"
//   }'

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODczZjY3OWNlOTk0NGFjMDQyN2Q5ZTEiLCJpYXQiOjE3NTI0MzAyMDEsImV4cCI6MTc1MzAzNTAwMX0.M9eaczkJdsOLLHNXdPJc_heaRYzUIhTcwUUvQVn_xaU
