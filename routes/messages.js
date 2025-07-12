const express = require('express');
const Message = require('../models/Message');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Send message
router.post('/', auth, async (req, res) => {
  try {
    const { receiverId, content, messageType = 'text' } = req.body;

    // Validate receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    // Create message
    const message = new Message({
      sender: req.user._id,
      receiver: receiverId,
      content,
      messageType,
      delivered: receiver.isOnline
    });

    await message.save();

    // Populate sender and receiver info
    await message.populate('sender', 'username');
    await message.populate('receiver', 'username');

    res.status(201).json({
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get undelivered messages for a user
router.get('/undelivered', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      receiver: req.user._id,
      delivered: false
    })
    .populate('sender', 'username')
    .sort({ createdAt: 1 });

    // Mark as delivered
    await Message.updateMany(
      { receiver: req.user._id, delivered: false },
      { delivered: true }
    );

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;