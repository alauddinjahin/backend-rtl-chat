```javascript
/**
 * @swagger
 * components:
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 *           example: "Something went wrong"
 *         code:
 *           type: string
 *           description: Error code
 *           example: "VALIDATION_ERROR"
 *         details:
 *           type: object
 *           description: Additional error details
 *           example: {}
 *     
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 *           example: "Operation completed successfully"
 *         data:
 *           type: object
 *           description: Response data
 */

module.exports = {};
```;
