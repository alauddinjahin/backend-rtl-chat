```javascript
/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterDto:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - confirmPassword
 *       properties:
 *         username:
 *           type: string
 *           description: The desired username
 *           minLength: 3
 *           maxLength: 20
 *           example: "john_doe"
 *         email:
 *           type: string
 *           format: email
 *           description: The email address
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           description: The password
 *           minLength: 6
 *           example: "mypassword123"
 *         confirmPassword:
 *           type: string
 *           description: Password confirmation
 *           minLength: 6
 *           example: "mypassword123"
 *     
 *     LoginDto:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The email address
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           description: The password
 *           example: "mypassword123"
 *     
 *     ChangePasswordDto:
 *       type: object
 *       required:
 *         - currentPassword
 *         - newPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *           description: Current password
 *           example: "oldpassword123"
 *         newPassword:
 *           type: string
 *           description: New password
 *           minLength: 6
 *           example: "newpassword123"
 *     
 *     AuthResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Operation successful"
 *         token:
 *           type: string
 *           description: JWT token (only for login)
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         user:
 *           $ref: '#/components/schemas/UserResponse'
 *     
 *     RegisterResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "User registered successfully"
 *         user:
 *           $ref: '#/components/schemas/UserResponse'
 *     
 *     LoginResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Login successful"
 *         token:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         user:
 *           $ref: '#/components/schemas/UserResponse'
 */

module.exports = {};
```


