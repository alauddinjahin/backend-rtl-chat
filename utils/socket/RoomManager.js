class RoomManager {
  constructor() {
    this.rooms = new Map(); // roomId -> Set of userIds
  }

  handleJoinRoom(socket, roomId) {
    if (!roomId) {
      socket.emit('error', { message: 'Room ID is required' });
      return;
    }

    // Add user to room tracking
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }

    this.rooms.get(roomId).add(socket.userId);

    // Join socket.io room
    socket.join(roomId);

    // Notify room about new user
    socket.to(roomId).emit('user_joined', {
      userId: socket.userId,
      username: socket.username,
      roomId: roomId
    });

    console.log(
      `User ${socket.userId} (${socket.username}) joined room: ${roomId}`
    );
  }

  handleLeaveRoom(socket, roomId) {
    if (!roomId) {
      socket.emit('error', { message: 'Room ID is required' });
      return;
    }

    // Remove user from room tracking
    if (this.rooms.has(roomId)) {
      this.rooms.get(roomId).delete(socket.userId);

      // Clean up empty rooms
      if (this.rooms.get(roomId).size === 0) {
        this.rooms.delete(roomId);
      }
    }

    // Leave socket.io room
    socket.leave(roomId);

    // Notify room about user leaving
    socket.to(roomId).emit('user_left', {
      userId: socket.userId,
      username: socket.username,
      roomId: roomId
    });

    console.log(
      `User ${socket.userId} (${socket.username}) left room: ${roomId}`
    );
  }

  handleUserDisconnect(userId, io) {
    // Remove user from all rooms
    for (const [roomId, users] of this.rooms) {
      if (users.has(userId)) {
        users.delete(userId);

        // Notify room about user disconnection
        io.to(roomId).emit('user_disconnected', {
          userId: userId,
          roomId: roomId
        });

        // Clean up empty rooms
        if (users.size === 0) {
          this.rooms.delete(roomId);
        }
      }
    }
  }

  getRoomUsers(roomId) {
    return this.rooms.has(roomId) ? Array.from(this.rooms.get(roomId)) : [];
  }

  getActiveRooms() {
    return Array.from(this.rooms.keys());
  }
}

module.exports = RoomManager;
