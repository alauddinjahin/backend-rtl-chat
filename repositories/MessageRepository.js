const Message = require("../models/Message");

class MessageRepository {
    
    static async findById(id) {
        return await Message.findById(id);
    }

    static async findByMessagesByType(type = "text") {
        return await Message.find({ type }); 
    }

    static async getReadMessages(userId) {
        return await Message.find({ 
            $or: [
                { sender: userId, read: true },
                { receiver: userId, read: true }
            ]
        });
    }

    static async getUnreadMessages(userId) {
        return await Message.find({ 
            receiver: userId, 
            read: false 
        });
    }

    static async getMessagesBetweenUsers(userId1, userId2, page = 1, limit = 50) {
        return await Message.find({
            $or: [
                { sender: userId1, receiver: userId2 },
                { sender: userId2, receiver: userId1 }
            ]
        })
        .populate('sender', 'username')
        .populate('receiver', 'username')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);
    }

    static async create(data) {
        const message = new Message(data);
        await message.save();
        // await message.populate('sender', 'username');
        // await message.populate('receiver', 'username');
        await message.populate([
            { path: 'sender', select: 'username' },
            { path: 'receiver', select: 'username' }
        ]);

        return message;
    }

    static async updateById(id, updateData) {
        return await Message.findByIdAndUpdate(id, updateData, { new: true });
    }

    static async markAsDelivered(senderId, receiverId) {
        return await Message.updateMany(
            { 
                sender: senderId, 
                receiver: receiverId, 
                delivered: false 
            },
            { delivered: true }
        );
    }

    static async markAsRead(messageId) {
        return await Message.findByIdAndUpdate(messageId, { read: true }, { new: true });
    }

    static async deleteById(id) {
        return await Message.findByIdAndDelete(id);
    }

    static async deleteMessagesBetweenUsers(userId1, userId2) {
        return await Message.deleteMany({
            $or: [
                { sender: userId1, receiver: userId2 },
                { sender: userId2, receiver: userId1 }
            ]
        });
    }
}

module.exports = MessageRepository;