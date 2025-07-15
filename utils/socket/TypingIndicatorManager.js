class TypingIndicatorManager {
  constructor() {
    this.typingUsers = new Map(); // roomId -> Set of typing users
  }

  handleTypingStart(socket, data) {
    if (!data?.roomId) {
      socket.emit('error', {
        message: 'Room ID is required for typing indicator'
      });
      return;
    }

    // Add user to typing users for this room
    if (!this.typingUsers.has(data.roomId)) {
      this.typingUsers.set(data.roomId, new Set());
    }

    this.typingUsers.get(data.roomId).add(socket.userId);

    // Broadcast typing indicator to room
    socket.to(data.roomId).emit('user_typing', {
      userId: socket.userId,
      username: socket.username,
      isTyping: true,
      roomId: data.roomId
    });
  }

  handleTypingStop(socket, data) {
    if (!data?.roomId) {
      socket.emit('error', {
        message: 'Room ID is required for typing indicator'
      });
      return;
    }

    // Remove user from typing users for this room
    if (this.typingUsers.has(data.roomId)) {
      this.typingUsers.get(data.roomId).delete(socket.userId);

      // Clean up empty rooms
      if (this.typingUsers.get(data.roomId).size === 0) {
        this.typingUsers.delete(data.roomId);
      }
    }

    // Broadcast typing stop to room
    socket.to(data.roomId).emit('user_typing', {
      userId: socket.userId,
      username: socket.username,
      isTyping: false,
      roomId: data.roomId
    });
  }

  handleUserDisconnect(userId, io) {
    // Remove user from all typing rooms
    for (const [roomId, typingUsers] of this.typingUsers) {
      if (typingUsers.has(userId)) {
        typingUsers.delete(userId);

        // Broadcast typing stop to room
        io.to(roomId).emit('user_typing', {
          userId: userId,
          isTyping: false,
          roomId: roomId
        });

        // Clean up empty rooms
        if (typingUsers.size === 0) {
          this.typingUsers.delete(roomId);
        }
      }
    }
  }
}

module.exports = TypingIndicatorManager;
