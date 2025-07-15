const MessageHandler = require('./messageHandler');

class RoomMessageHandler extends MessageHandler {
  handleMessage(socket, data) {
    if (!data.roomId) {
      socket.emit('error', {
        message: 'Room ID is required for room messages'
      });
      return;
    }

    // Broadcast to all users in the room except sender
    socket.to(data.roomId).emit('receive_message', {
      ...data,
      senderId: socket.userId,
      senderUsername: socket.username,
      timestamp: new Date().toISOString(),
      messageType: 'room'
    });
  }
}

module.exports = RoomMessageHandler;
