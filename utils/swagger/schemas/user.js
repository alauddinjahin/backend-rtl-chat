```javascript
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user
 *           example: "64a7b8c9d1e2f3a4b5c6d7e8"
 *         username:
 *           type: string
 *           description: The username of the user
 *           minLength: 3
 *           maxLength: 20
 *           example: "john_doe"
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           description: The hashed password of the user
 *           minLength: 6
 *           example: "$2a$10$N9qo8uLOickgx2ZMRZoMye..."
 *         isOnline:
 *           type: boolean
 *           description: Whether the user is currently online
 *           default: false
 *           example: true
 *         lastSeen:
 *           type: string
 *           format: date-time
 *           description: The last time the user was seen
 *           example: "2024-01-15T10:30:00.000Z"
 *         socketId:
 *           type: string
 *           description: The socket ID for real-time communication
 *           nullable: true
 *           example: "abc123xyz789"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the user was created
 *           example: "2024-01-15T10:30:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the user was last updated
 *           example: "2024-01-15T10:30:00.000Z"
 *     
 *     UserResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "64a7b8c9d1e2f3a4b5c6d7e8"
 *         username:
 *           type: string
 *           example: "john_doe"
 *         email:
 *           type: string
 *           example: "john.doe@example.com"
 *         isOnline:
 *           type: boolean
 *           example: true
 *         lastSeen:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00.000Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00.000Z"
 */

module.exports = {};
```;
