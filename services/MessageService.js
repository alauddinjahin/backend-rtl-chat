const MessageRepository = require('../repositories/MessageRepository');
const UserRepository = require('../repositories/UserRepository');
const { IdValidator } = require('../utils/validator');

class MessageService {
  static async createMessage(senderId, receiverId, content, type = 'text') {
    if (!content) {
      throw new Error('Message content is required');
    }

    // Check if receiver exists
    const receiver = await UserRepository.findById(receiverId);
    if (!receiver) {
      throw new Error('Receiver not found');
    }

    const messageData = {
      sender: senderId,
      receiver: receiverId,
      content: content?.trim(),
      type,
      read: false,
      delivered: false,
      createdAt: new Date()
    };

    return await MessageRepository.create(messageData);
  }

  static async getMessagesBetweenUsers(userId1, userId2, page = 1, limit = 50) {
    if (!IdValidator(userId1) || !IdValidator(userId2)) {
      throw new Error('Invalid user ID format');
    }

    const messages = await MessageRepository.getMessagesBetweenUsers(
      userId1,
      userId2,
      page,
      limit
    );

    // Mark messages as delivered
    await MessageRepository.markAsDelivered(userId2, userId1);

    return messages.reverse(); // Return chronological order
  }

  static async getUnreadMessages(userId) {
    return await MessageRepository.getUnreadMessages(userId);
  }

  static async markMessageAsRead(messageId) {
    const message = await MessageRepository.findById(messageId);
    if (!message) {
      throw new Error('Message not found');
    }

    return await MessageRepository.markAsRead(messageId);
  }

  static async deleteMessage(messageId, userId) {
    const message = await MessageRepository.findById(messageId);
    if (!message) {
      throw new Error('Message not found');
    }

    // Check if user is authorized to delete (sender or receiver)
    if (
      message.sender.toString() !== userId &&
      message.receiver.toString() !== userId
    ) {
      throw new Error('Unauthorized to delete this message');
    }

    return await MessageRepository.deleteById(messageId);
  }

  static async deleteConversation(userId1, userId2) {
    return await MessageRepository.deleteMessagesBetweenUsers(userId1, userId2);
  }
}

module.exports = MessageService;
