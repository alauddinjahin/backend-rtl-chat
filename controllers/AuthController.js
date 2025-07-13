const ChangePasswordDto = require('../dto/ChangePasswordDto');
const LoginDto = require('../dto/LoginDto');
const RegisterDto = require('../dto/RegisterDto');
const UserService = require('../services/UserService');
const HTTPStatusCode = require('../utils/statusCode');

class AuthController {

    static async register(req, res) {
        try {
            const registerDto = new RegisterDto(req.body);
            const result = await UserService.register(registerDto);
            
            res.status(HTTPStatusCode.CREATED).json({
                message: 'User registered successfully',
                ...result
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(400).json({ 
                message: error.message || 'Registration failed'
            });
        }
    }

    static async login(req, res) {
        try {
            const loginDto = new LoginDto(req.body);
            const result = await UserService.login(loginDto);
            
            res.json({
                message: 'Login successful',
                ...result
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(HTTPStatusCode.BAD_REQUEST).json({ 
                message: error.message || 'Login failed'
            });
        }
    }

    static async logout(req, res) {
        try {
            const result = await UserService.logout(req.user._id);
            res.json(result);
        } catch (error) {
            console.error('Logout error:', error);
            res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json({ 
                message: error.message || 'Logout failed'
            });
        }
    }

    static async changePassword(req, res) {
        try {
            const changePasswordDto = new ChangePasswordDto(req.body);
            const result = await UserService.changePassword(req.user.id, changePasswordDto);
            
            res.json(result);
            
        } catch (error) {
            console.error('Change password error:', error);
            res.status(HTTPStatusCode.BAD_REQUEST).json({ 
                message: error.message || 'Password change failed'
            });
        }
    }

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

    // static async getAllUsers(req, res) {
    //     try {
    //         const currentUserId = req.user.id; // From auth middleware
    //         const users = await UserService.getAllUsers(currentUserId);
            
    //         res.status(HTTPStatusCode.OK).json({
    //             message: 'Users retrieved successfully',
    //             users: users,
    //             count: users.length
    //         });
    //     } catch (error) {
    //         console.error('Get all users error:', error);
    //         res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
    //             message: 'Server error',
    //             error: error.message
    //         });
    //     }
    // }
    

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
}

module.exports = AuthController
