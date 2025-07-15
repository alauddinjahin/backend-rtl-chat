const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  validateInput,
  validatePassword,
  emailValidator
} = require('../utils/validator');
const UserRepository = require('../repositories/UserRepository');
const UserDto = require('../dto/UserDto');

class UserService {
  static async register(registerDto) {
    // Input validation
    const validationErrors = validateInput(
      registerDto.username,
      registerDto.email,
      registerDto.password
    );

    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    // Email validation
    const emailError = emailValidator(registerDto.email);
    if (emailError) {
      throw new Error(emailError);
    }

    // Check if user already exists
    const existingUser = await UserRepository.findByUsernameOrEmail(
      registerDto.username,
      registerDto.email
    );

    if (existingUser) {
      throw new Error('User already exists with this email or username');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(registerDto.password);

    // Create user
    const userData = {
      username: registerDto.username,
      email: registerDto.email,
      password: hashedPassword
    };

    const user = await UserRepository.create(userData);

    // Generate token
    const token = this.generateToken(user._id);

    return {
      user: new UserDto(user),
      token
    };
  }

  static async login(loginDto) {
    // Input validation
    if (!loginDto.email || !loginDto.password) {
      throw new Error('Email and password are required');
    }

    // Email validation
    const emailError = emailValidator(loginDto.email);
    if (emailError) {
      throw new Error(emailError);
    }

    // Find user
    const user = await UserRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await this.verifyPassword(
      loginDto.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Update online status
    await UserRepository.updateOnlineStatus(user._id, true);

    // Generate token
    const token = this.generateToken(user._id);

    return {
      user: new UserDto(user),
      token
    };
  }

  static async logout(userId) {
    await UserRepository.updateOnlineStatus(userId, false);
    return { message: 'Logout successful' };
  }

  static async changePassword(userId, changePasswordDto) {
    // Input validation
    if (!changePasswordDto.currentPassword || !changePasswordDto.newPassword) {
      throw new Error('Current password and new password are required');
    }

    // Validate new password
    const passwordErrors = validatePassword(changePasswordDto.newPassword);
    if (passwordErrors.length > 0) {
      throw new Error(
        `Password validation failed: ${passwordErrors.join(', ')}`
      );
    }

    // Get user
    const user = await UserRepository.findById(userId);
    console.log(user, 'inside service');
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await this.verifyPassword(
      changePasswordDto.currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await this.hashPassword(
      changePasswordDto.newPassword
    );

    // Update password
    user.password = hashedNewPassword;
    await user.save();

    return { message: 'Password changed successfully' };
  }

  static async getAllUsers(currentUserId) {
    const users = await UserRepository.getAllExceptUser(currentUserId);
    // return users;
    return users.map(user => new UserDto(user));
  }

  static async getUserById(userId) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return new UserDto(user);
  }

  // Private helper methods
  static async hashPassword(password) {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  static generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
  }
}

module.exports = UserService;
