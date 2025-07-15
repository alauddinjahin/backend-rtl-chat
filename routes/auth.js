const express = require('express');
const AuthController = require('../controllers/AuthController');
const auth = require('../middleware/auth');

const router = express.Router();

// Authentication routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// router.use(auth);
router.post('/auth/logout', auth, AuthController.logout);
router.put('/auth/change-password', auth, AuthController.changePassword);


module.exports = router;