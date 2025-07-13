const MessageHandler = require("./messageHandler");

class PrivateMessageHandler extends MessageHandler {
    constructor(connectedUsers) {
        super();
        this.connectedUsers = connectedUsers;
    }

    
    handleMessage(socket, data) {
        if (!data.recipientId) {
            socket.emit('error', { message: 'Recipient ID is required for private messages' });
            return;
        }

        const recipientSocketId = this.connectedUsers.get(data.recipientId);
        if (!recipientSocketId) {
            socket.emit('error', { message: 'Recipient not found or offline' });
            return;
        }

        // Send to specific user
        socket.to(recipientSocketId).emit('receive_message', {
            ...data,
            senderId: socket.userId,
            senderUsername: socket.username,
            timestamp: new Date().toISOString(),
            messageType: 'private'
        });
    }
}

module.exports = PrivateMessageHandler