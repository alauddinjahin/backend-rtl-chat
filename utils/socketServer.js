const socketIo = require('socket.io');
const allowedOrigins = require('./allowedOrigins');

// Configure Socket.IO with CORS
const socketConnection = (server)=>{

    const socketOptions = {
        cors: {
            origin: allowedOrigins,
            methods: ['GET', 'POST'],
            credentials: true
        },
        // transports: ['websocket', 'polling'], // Specify transports
        // allowEIO3: true, // Allow Engine.IO v3 clients
        // pingTimeout: 60000, // Ping timeout
        // pingInterval: 25000, // Ping interval
    };

    return socketIo(server, socketOptions);

}

module.exports = socketConnection


