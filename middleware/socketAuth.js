const jwt = require('jsonwebtoken');
const UserService = require('../services/UserService');

const socketAuth = async (socket, next) => {
    
    try {
      const token = socket.handshake.auth.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await UserService.getUserById(decoded.userId);
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      socket.username = user.username;
      next();

    } catch (error) {
      next(new Error('Authentication error'));
    }
}

module.exports = socketAuth;