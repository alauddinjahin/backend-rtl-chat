const MessageService = require('../services/MessageService');
const HTTPStatusCode = require('../utils/statusCode');

class MessageController {
  static async sendMessage(req, res) {
    try {
      const { receiverId, content, type = 'text' } = req.body;
      const senderId = req.user.id;

      if (!receiverId || !content) {
        return res.status(HTTPStatusCode.BAD_REQUEST).json({
          message: 'Receiver ID and content are required'
        });
      }

      const message = await MessageService.createMessage(senderId, receiverId, content, type);

      res.status(HTTPStatusCode.CREATED).json({
        message: 'Message sent successfully',
        data: message
      });
    } catch (error) {
      console.error('Send message error:', error);
      res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json({
        message: 'Server error',
        error: error.message
      });
    }
  }


  static async getUnreadMessages(req, res) {
    try {
      const userId = req.user.id;
      const unreadMessages = await MessageService.getUnreadMessages(userId);

      res.json({
        message: 'Unread messages retrieved successfully',
        data: unreadMessages,
        count: unreadMessages.length
      });
    } catch (error) {
      console.error('Get unread messages error:', error);
      res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json({
        message: 'Server error',
        error: error.message
      });
    }
  }


  static async markAsRead(req, res) {
    try {
      const { messageId } = req.params;

      if (!messageId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(HTTPStatusCode.BAD_REQUEST).json({
          message: 'Invalid message ID format'
        });
      }

      const message = await MessageService.markMessageAsRead(messageId);

      res.json({
        message: 'Message marked as read',
        data: message
      });
    } catch (error) {
      console.error('Mark as read error:', error);
      if (error.message === 'Message not found') {
        return res.status(HTTPStatusCode.NOT_FOUND).json({
          message: error.message
        });
      }
      res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json({
        message: 'Server error',
        error: error.message
      });
    }
  }

  static async deleteMessage(req, res) {
    try {
      const { messageId } = req.params;
      const userId = req.user.id;

      if (!messageId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(HTTPStatusCode.BAD_REQUEST).json({
          message: 'Invalid message ID format'
        });
      }

      await MessageService.deleteMessage(messageId, userId);

      res.json({
        message: 'Message deleted successfully'
      });
    } catch (error) {
      console.error('Delete message error:', error);
      if (error.message === 'Message not found') {
        return res.status(HTTPStatusCode.NOT_FOUND).json({
          message: error.message
        });
      }
      if (error.message === 'Unauthorized to delete this message') {
        return res.status(HTTPStatusCode.FORBIDDEN).json({
          message: error.message
        });
      }
      res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json({
        message: 'Server error',
        error: error.message
      });
    }
  }

  static async deleteConversation(req, res) {
    try {
      const { userId } = req.params;
      const currentUserId = req.user.id;

      if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(HTTPStatusCode.BAD_REQUEST).json({
          message: 'Invalid user ID format'
        });
      }

      await MessageService.deleteConversation(currentUserId, userId);

      res.json({
        message: 'Conversation deleted successfully'
      });
    } catch (error) {
      console.error('Delete conversation error:', error);
      res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json({
        message: 'Server error',
        error: error.message
      });
    }
  }
}

module.exports = MessageController;

