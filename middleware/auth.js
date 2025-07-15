const jwt = require('jsonwebtoken');
const HTTPStatusCode = require('../utils/statusCode');
const UserService = require('../services/UserService');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res
        .status(HTTPStatusCode.UNAUTHORIZED)
        .json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserService.getUserById(decoded.userId);

    if (!user) {
      return res
        .status(HTTPStatusCode.UNAUTHORIZED)
        .json({ message: 'User not found' });
    }

    req.user = user;

    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = auth;
