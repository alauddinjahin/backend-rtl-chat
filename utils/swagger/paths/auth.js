
```javascript
/**
 * @swagger
 * /api/v1/register:
 *   post:
 *     summary: Register a new user (Public - No Auth Required)
 *     tags: [Public Authentication]
 *     description: |
 *       Register a new user account.
 *       
 *       **cURL Example:**
 *       ```bash
 *       curl -X POST http://localhost:5000/api/v1/register \
 *         -H "Content-Type: application/json" \
 *         -d '{
 *           "username": "john_doe",
 *           "email": "john.doe@example.com",
 *           "password": "mypassword123",
 *           "confirmPassword": "mypassword123"
 *         }'
 *       ```
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterDto'
 *           examples:
 *             example1:
 *               summary: Valid registration
 *               value:
 *                 username: "john_doe"
 *                 email: "john.doe@example.com"
 *                 password: "mypassword123"
 *                 confirmPassword: "mypassword123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         description: Bad request (validation error, user already exists)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               userExists:
 *                 summary: User already exists
 *                 value:
 *                   error: "Username already exists"
 *                   code: "USER_EXISTS"
 *               validation:
 *                 summary: Validation error
 *                 value:
 *                   error: "Password confirmation does not match"
 *                   code: "VALIDATION_ERROR"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 * /api/v1/login:
 *   post:
 *     summary: Login user (Public - No Auth Required)
 *     tags: [Public Authentication]
 *     description: |
 *       Login an existing user and receive a JWT token.
 *       
 *       **cURL Example:**
 *       ```bash
 *       curl -X POST http://localhost:5000/api/v1/login \
 *         -H "Content-Type: application/json" \
 *         -d '{
 *           "email": "john.doe@example.com",
 *           "password": "mypassword123"
 *         }'
 *       ```
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDto'
 *           examples:
 *             example1:
 *               summary: Valid login
 *               value:
 *                 email: "john.doe@example.com"
 *                 password: "mypassword123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidCredentials:
 *                 summary: Invalid credentials
 *                 value:
 *                   error: "Invalid credentials"
 *                   code: "INVALID_CREDENTIALS"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout user (Protected - JWT Required)
 *     tags: [Protected Authentication]
 *     description: |
 *       Logout the current user.
 *       
 *       **cURL Example:**
 *       ```bash
 *       curl -X POST http://localhost:5000/api/v1/auth/logout \
 *         -H "Content-Type: application/json" \
 *         -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
 *       ```
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               message: "Logout successful"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Access denied"
 *               code: "UNAUTHORIZED"
 * 
 * /api/v1/auth/change-password:
 *   put:
 *     summary: Change user password (Protected - JWT Required)
 *     tags: [Protected Authentication]
 *     description: |
 *       Change the current user's password.
 *       
 *       **cURL Example:**
 *       ```bash
 *       curl -X PUT http://localhost:5000/api/auth/v1/change-password \
 *         -H "Content-Type: application/json" \
 *         -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
 *         -d '{
 *           "currentPassword": "mypassword123",
 *           "newPassword": "newpassword456"
 *         }'
 *       ```
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordDto'
 *           examples:
 *             example1:
 *               summary: Valid password change
 *               value:
 *                 currentPassword: "oldpassword123"
 *                 newPassword: "newpassword456"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               message: "Password changed successfully"
 *       400:
 *         description: Bad request (validation error)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "New password must be at least 6 characters"
 *               code: "VALIDATION_ERROR"
 *       401:
 *         description: Unauthorized or invalid current password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               unauthorized:
 *                 summary: Unauthorized
 *                 value:
 *                   error: "Access denied"
 *                   code: "UNAUTHORIZED"
 *               invalidPassword:
 *                 summary: Invalid current password
 *                 value:
 *                   error: "Invalid current password"
 *                   code: "INVALID_PASSWORD"
 */

module.exports = {};
```