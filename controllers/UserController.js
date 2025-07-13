const MessageService = require('../services/MessageService');
const UserService = require('../services/UserService');
const HTTPStatusCode = require('../utils/statusCode');
const { IdValidator } = require('../utils/validator');

class UserController {

    static async getAllUsers(req, res) {
        try {
            const users = await UserService.getAllUsers(req.user.id);
            res.json({ users });
        } catch (error) {
            console.error('Get users error:', error);
            res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json({ 
                message: error.message || 'Failed to get users'
            });
        }
    }

    static async getUserById(req, res) {
        try {
            const user = await UserService.getUserById(req.params.id);
            res.json({ user });
        } catch (error) {
            console.error('Get user error:', error);
            res.status(HTTPStatusCode.NOT_FOUND).json({ 
                message: error.message || 'User not found'
            });
        }
    }


    static async getAllMessagesByUserId(req, res) {
        try {

            const { id } = req.params;
            const { page = 1, limit = 50 } = req.query;

            // Validate ObjectId
            if (!IdValidator(id)) {
                return res.status(HTTPStatusCode.BAD_REQUEST).json({ 
                    message: 'Invalid user ID format' 
                });
            }

            const messages = await MessageService.getMessagesBetweenUsers(
                req.user._id, 
                id, 
                parseInt(page), 
                parseInt(limit)
            );

            res.json({ 
                messages,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: messages.length
                }
            });

        } catch (error) {
            console.error('Get messages error:', error);
            res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json({ 
                message: 'Server error', 
                error: error.message 
            });
        }
    }


}

module.exports = UserController

