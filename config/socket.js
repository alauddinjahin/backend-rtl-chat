/* eslint-env node */
const User = require('../models/User');
const Message = require('../models/Message');
const socketAuth = require('../middleware/socketAuth');

const configureSocket = (io) => {
  // Socket authentication middleware
  io.use(socketAuth);

  io.on('connection', async (socket) => {
    console.log(`User ${socket.username} connected`);

    // Update user online status
    await User.findByIdAndUpdate(socket.userId, {
      isOnline: true,
      socketId: socket.id,
      lastSeen: new Date()
    });

    // Join user to their personal room
    socket.join(socket.userId);

    // Broadcast user online status
    socket.broadcast.emit('userOnline', {
      userId: socket.userId,
      username: socket.username
    });

    // Send undelivered messages
    const undeliveredMessages = await Message.find({
      receiver: socket.userId,
      delivered: false
    })
      .populate('sender', 'username')
      .sort({ createdAt: 1 });

    if (undeliveredMessages.length > 0) {
      socket.emit('undeliveredMessages', undeliveredMessages);

      // Mark messages as delivered
      await Message.updateMany(
        { receiver: socket.userId, delivered: false },
        { delivered: true }
      );
    }

    // Handle sending messages
    socket.on('sendMessage', async (data) => {
      try {
        const { receiverId, content, messageType = 'text' } = data;

        // Create message
        const message = new Message({
          sender: socket.userId,
          receiver: receiverId,
          content,
          messageType,
          delivered: false
        });

        await message.save();
        await message.populate('sender', 'username');
        await message.populate('receiver', 'username');

        // Check if receiver is online
        const receiver = await User.findById(receiverId);

        if (receiver && receiver.isOnline && receiver.socketId) {
          // Send to receiver
          io.to(receiver.socketId).emit('newMessage', message);

          // Mark as delivered
          message.delivered = true;
          await message.save();
        }

        // Send confirmation to sender
        socket.emit('messageConfirmation', {
          tempId: data.tempId,
          message
        });
      } catch (error) {
        socket.emit('messageError', {
          tempId: data.tempId,
          error: error.message
        });
      }
    });

    // Handle typing indicators
    socket.on('typing', (data) => {
      socket.to(data.receiverId).emit('userTyping', {
        userId: socket.userId,
        username: socket.username,
        isTyping: true
      });
    });

    socket.on('stopTyping', (data) => {
      socket.to(data.receiverId).emit('userTyping', {
        userId: socket.userId,
        username: socket.username,
        isTyping: false
      });
    });

    // Handle message read receipts
    socket.on('markAsRead', async (data) => {
      try {
        const { messageId } = data;
        await Message.findByIdAndUpdate(messageId, { read: true });

        const message = await Message.findById(messageId);
        if (message) {
          const sender = await User.findById(message.sender);
          if (sender && sender.socketId) {
            io.to(sender.socketId).emit('messageRead', { messageId });
          }
        }
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`User ${socket.username} disconnected`);

      // Update user offline status
      await User.findByIdAndUpdate(socket.userId, {
        isOnline: false,
        socketId: null,
        lastSeen: new Date()
      });

      // Broadcast user offline status
      socket.broadcast.emit('userOffline', {
        userId: socket.userId,
        username: socket.username
      });
    });
  });
};

module.exports = configureSocket;