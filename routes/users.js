const express = require('express');
const User = require('../models/User');
const Message = require('../models/Message');
const auth = require('../middleware/auth');
const UserController = require('../controllers/UserController');

const router = express.Router();

// router.use(auth);
// User routes
router.get('/', auth, UserController.getAllUsers);
router.get('/:id', UserController.getUserById);

// Get messages for a specific user
router.get('/:id/messages', UserController.getAllMessagesByUserId);

module.exports = router;