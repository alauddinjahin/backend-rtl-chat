const { Server } = require('socket.io');
const allowedOrigins = require("../utils/allowedOrigins");
const socketAuth = require('../middleware/socketAuth');
const MessageHandlerFactory = require('../utils/socket/MessageHandlerFactory');
const TypingIndicatorManager = require('../utils/socket/TypingIndicatorManager');
const RoomManager = require('../utils/socket/RoomManager');


class SocketManager {
    constructor() {
        this.io = null;
        this.connectedUsers = new Map(); // userId -> socketId
        this.userSockets = new Map(); // socketId -> userId (for cleanup)
        
        // Initialize managers (Dependency Injection)
        this.messageHandlerFactory = new MessageHandlerFactory(this.connectedUsers);
        this.typingManager = new TypingIndicatorManager();
        this.roomManager = new RoomManager();

        this.cleanupInterval = null;
    }


    initialize(server) {
        const socketOptions = {
            cors: {
                origin: allowedOrigins,
                methods: ['GET', 'POST'],
                credentials: true
            },
            transports: ['websocket', 'polling'],
            allowEIO3: true,
            pingTimeout: 60000,
            pingInterval: 25000,
        };

        this.io = new Server(server, socketOptions);
        console.log("Socket init")
        return this;
    }

    load(){
        console.log("Socket loading ...");
        this._authenticate();
        this._setupEventHandlers();
        this._setupHealthCheck();

        console.log("Socket loaded");

    }
 
    _authenticate() {
        this.io.use(socketAuth);
    }

 
    _setupEventHandlers() {
        this.io.on('connection', (socket) => {
            console.log(`User connected: ${socket.id}`);

            // Register authenticated user
            this._registerUser(socket);

            // Setup message handlers
            this._setupMessageHandlers(socket);

            // Setup room handlers
            this._setupRoomHandlers(socket);

            // Setup typing handlers
            this._setupTypingHandlers(socket);

            // Setup disconnect handler
            this._setupDisconnectHandler(socket);

            // Setup error handler
            this._setupErrorHandler(socket);
        });
    }


    _setupHealthCheck() {

        // Clean up stale connections every 5 minutes
        // this.cleanupInterval = setInterval(() => {
        //     this._cleanupStaleConnections();
        // }, 5 * 60 * 1000);
    }

    stopHealthCheck() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
    }


    _cleanupStaleConnections() {
        // const now = new Date();
        // const staleThreshold = 10 * 60 * 1000; // 10 minutes

        // for (const [userId, session] of this.userSessions) {
        //     if (now - session.lastActivity > staleThreshold) {
        //         console.log(`Cleaning up stale session for user ${userId}`);
                
        //         // Force disconnect all user connections
        //         const connections = this.userConnections.get(userId);
        //         if (connections) {
        //             connections.forEach(socketId => {
        //                 const socket = this.io.sockets.sockets.get(socketId);
        //                 if (socket) {
        //                     socket.disconnect(true);
        //                 }
        //             });
        //         }
        //     }
        // }
    }

   
    _registerUser(socket) {
        if (socket.userId) {
            this.connectedUsers.set(socket.userId, socket.id);
            this.userSockets.set(socket.id, socket.userId);
            socket.join(`user_${socket.userId}`);
            console.log(`User authenticated and registered: ${socket.userId} (${socket.username})`);
        }
    }


    _setupMessageHandlers(socket) {
        // Handle different types of messages
        socket.on('send_message', (data) => {
            try {
                if (!data) {
                    socket.emit('error', { message: 'Message data is required' });
                    return;
                }

                // Determine message type and get appropriate handler
                const messageType = this._determineMessageType(data);
                const handler = this.messageHandlerFactory.getHandler(messageType);
                
                // Handle message with appropriate handler
                handler.handleMessage(socket, data);
                
            } catch (error) {
                console.error(`Message handling error:`, error);
                socket.emit('error', { message: 'Failed to process message' });
            }
        });
    }

  
    _setupRoomHandlers(socket) {
        socket.on('join_room', (roomId) => {
            this.roomManager.handleJoinRoom(socket, roomId);
        });

        socket.on('leave_room', (roomId) => {
            this.roomManager.handleLeaveRoom(socket, roomId);
        });

        socket.on('get_room_users', (roomId) => {
            const users = this.roomManager.getRoomUsers(roomId);
            socket.emit('room_users', { roomId, users });
        });
    }

   
    _setupTypingHandlers(socket) {
        socket.on('typing_start', (data) => {
            this.typingManager.handleTypingStart(socket, data);
        });

        socket.on('typing_stop', (data) => {
            this.typingManager.handleTypingStop(socket, data);
        });
    }


    _setupDisconnectHandler(socket) {
        socket.on('disconnect', (reason) => {
            console.log(`User disconnected: ${socket.id}, Reason: ${reason}`);

            if (socket.userId) {
                // Clean up user connections
                this.connectedUsers.delete(socket.userId);
                this.userSockets.delete(socket.id);
                
                // Clean up room memberships
                this.roomManager.handleUserDisconnect(socket.userId, this.io);
                
                // Clean up typing indicators
                this.typingManager.handleUserDisconnect(socket.userId, this.io);
                
                console.log(`User ${socket.userId} removed from connected users`);
            }
        });
    }


    _setupErrorHandler(socket) {
        socket.on('error', (error) => {
            console.error(`Socket error for ${socket.id}:`, error);
        });
    }

 
    _determineMessageType(data) {
        if (data.roomId) return 'room';
        if (data.recipientId) return 'private';
        return 'live';
    }

    // Public API methods

    getIO() {
        if (!this.io) {
            throw new Error('Socket.IO not initialized. Call initialize() first.');
        }
        return this.io;
    }

    getUserSocket(userId) {
        return this.connectedUsers.get(userId) || null;
    }

    sendToUser(userId, event, data) {
        const socketId = this.getUserSocket(userId);
        if (socketId) {
            this.io.to(socketId).emit(event, data);
            return true;
        }
        return false;
    }

   
    sendToRoom(roomId, event, data) {
        if (!roomId) {
            console.error('Room ID is required to send message to room');
            return false;
        }
        this.io.to(roomId).emit(event, data);
        return true;
    }


    getConnectedUsersCount() {
        return this.connectedUsers.size;
    }

    socketConnectionsUsers() {
        return this.userSockets.size;
    }
   
    getConnectedUsers() {
        return Array.from(this.connectedUsers.keys());
    }

    isUserConnected(userId) {
        return this.connectedUsers.has(userId);
    }


    getRoomUsers(roomId) {
        return this.roomManager.getRoomUsers(roomId);
    }

    getActiveRooms() {
        return this.roomManager.getActiveRooms();
    }

    broadcastToAll(event, data) {
        this.io.emit(event, data);
    }
}

module.exports = new SocketManager();