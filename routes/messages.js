const express = require('express');
const MessageController = require('../controllers/MessageController');
const auth = require('../middleware/auth'); // Assuming you have auth middleware

const router = express.Router();

// All routes require authentication
router.use(auth);

// Send a message
router.post('/send', MessageController.sendMessage);

// Get unread messages for current user
router.get('/unread', MessageController.getUnreadMessages);

// Mark message as read
router.patch('/:messageId/read', MessageController.markAsRead);

// Delete a specific message
router.delete('/:messageId', MessageController.deleteMessage);

// Delete entire conversation
router.delete('/conversation/:userId', MessageController.deleteConversation);

module.exports = router;
