const MessageHandler = require("./messageHandler");

class LiveChatHandler extends MessageHandler {

    handleMessage(socket, data) {
        // Broadcast to all connected users except sender
        socket.broadcast.emit('receive_message', {
            ...data,
            senderId: socket.userId,
            senderUsername: socket.username,
            timestamp: new Date().toISOString(),
            messageType: 'live'
        });
    }
}

module.exports = LiveChatHandler