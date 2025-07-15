/* eslint-env node, jest */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserService = require('../../services/UserService');
const UserRepository = require('../../repositories/UserRepository');
const {
  validateInput,
  validatePassword,
  emailValidator
} = require('../../utils/validator');
const UserDto = require('../../dto/UserDto');

// Mock all dependencies
jest.mock('../../repositories/UserRepository');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../utils/validator');
jest.mock('../../dto/UserDto');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const registerDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123!'
      };

      validateInput.mockReturnValue([]); // no validation errors
      emailValidator.mockReturnValue(null); // email valid

      UserRepository.findByUsernameOrEmail.mockResolvedValue(null); // no existing user
      bcrypt.hash.mockResolvedValue('hashedPassword');

      UserRepository.create.mockResolvedValue({
        _id: '64a7b8c9d1e2f3a4b5c6d7e8',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword'
      });
      UserDto.mockImplementation(user => user); // return user object as is
      jwt.sign.mockReturnValue('jwtToken');

      // Act
      const result = await UserService.register(registerDto);

      // Assert
      expect(validateInput).toHaveBeenCalledWith(
        registerDto.username,
        registerDto.email,
        registerDto.password
      );
      expect(emailValidator).toHaveBeenCalledWith(registerDto.email);
      expect(UserRepository.findByUsernameOrEmail).toHaveBeenCalledWith(
        registerDto.username,
        registerDto.email
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 12);
      expect(UserRepository.create).toHaveBeenCalledWith({
        username: registerDto.username,
        email: registerDto.email,
        password: 'hashedPassword'
      });
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: '64a7b8c9d1e2f3a4b5c6d7e8' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      expect(result).toEqual({
        user: {
          _id: '64a7b8c9d1e2f3a4b5c6d7e8',
          username: 'testuser',
          email: 'test@example.com',
          password: 'hashedPassword'
        },
        token: 'jwtToken'
      });
    });

    it('should throw an error if validation fails', async () => {
      validateInput.mockReturnValue(['username is required']);
      const registerDto = {
        username: '',
        email: 'test@example.com',
        password: 'Password123!'
      };

      await expect(UserService.register(registerDto)).rejects.toThrow(
        'Validation failed: username is required'
      );
    });

    it('should throw an error if email is invalid', async () => {
      validateInput.mockReturnValue([]);
      emailValidator.mockReturnValue('Invalid email');
      const registerDto = {
        username: 'testuser',
        email: 'bademail',
        password: 'Password123!'
      };

      await expect(UserService.register(registerDto)).rejects.toThrow(
        'Invalid email'
      );
    });

    it('should throw if user already exists', async () => {
      validateInput.mockReturnValue([]);
      emailValidator.mockReturnValue(null);
      UserRepository.findByUsernameOrEmail.mockResolvedValue({
        _id: 'existingUserId'
      });
      const registerDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123!'
      };

      await expect(UserService.register(registerDto)).rejects.toThrow(
        'User already exists with this email or username'
      );
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const loginDto = { email: 'test@example.com', password: 'Password123!' };

      emailValidator.mockReturnValue(null);
      UserRepository.findByEmail.mockResolvedValue({
        _id: 'user123',
        password: 'hashedPassword'
      });
      bcrypt.compare.mockResolvedValue(true);
      UserRepository.updateOnlineStatus.mockResolvedValue(true);
      UserDto.mockImplementation(user => user);
      jwt.sign.mockReturnValue('jwtToken');

      const result = await UserService.login(loginDto);

      expect(emailValidator).toHaveBeenCalledWith(loginDto.email);
      expect(UserRepository.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        'hashedPassword'
      );
      expect(UserRepository.updateOnlineStatus).toHaveBeenCalledWith(
        'user123',
        true
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: 'user123' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      expect(result).toEqual({
        user: { _id: 'user123', password: 'hashedPassword' },
        token: 'jwtToken'
      });
    });

    it('should throw if email or password is missing', async () => {
      await expect(
        UserService.login({ email: 'test@example.com' })
      ).rejects.toThrow('Email and password are required');
      await expect(UserService.login({ password: 'pass' })).rejects.toThrow(
        'Email and password are required'
      );
    });

    it('should throw if email is invalid', async () => {
      emailValidator.mockReturnValue('Invalid email');
      await expect(
        UserService.login({ email: 'bademail', password: 'pass' })
      ).rejects.toThrow('Invalid email');
    });

    it('should throw if user not found', async () => {
      emailValidator.mockReturnValue(null);
      UserRepository.findByEmail.mockResolvedValue(null);
      await expect(
        UserService.login({ email: 'test@example.com', password: 'pass' })
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw if password is invalid', async () => {
      emailValidator.mockReturnValue(null);
      UserRepository.findByEmail.mockResolvedValue({
        _id: 'user123',
        password: 'hashedPassword'
      });
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        UserService.login({ email: 'test@example.com', password: 'wrongpass' })
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      UserRepository.updateOnlineStatus.mockResolvedValue(true);

      const result = await UserService.logout('user123');
      expect(UserRepository.updateOnlineStatus).toHaveBeenCalledWith(
        'user123',
        false
      );
      expect(result).toEqual({ message: 'Logout successful' });
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const userId = 'user123';
      const changePasswordDto = {
        currentPassword: 'oldPass',
        newPassword: 'NewPassword123!'
      };

      validatePassword.mockReturnValue([]);
      UserRepository.findById.mockResolvedValue({
        _id: userId,
        password: 'hashedOldPass',
        save: jest.fn().mockResolvedValue(true)
      });
      bcrypt.compare.mockImplementation((password, _hashed) => {
        if (password === 'oldPass') return Promise.resolve(true);
        return Promise.resolve(false);
      });
      bcrypt.hash.mockResolvedValue('hashedNewPass');

      const result = await UserService.changePassword(
        userId,
        changePasswordDto
      );

      expect(validatePassword).toHaveBeenCalledWith('NewPassword123!');
      expect(UserRepository.findById).toHaveBeenCalledWith(userId);
      expect(bcrypt.compare).toHaveBeenCalledWith('oldPass', 'hashedOldPass');
      expect(bcrypt.hash).toHaveBeenCalledWith('NewPassword123!', 12);
      expect(result).toEqual({ message: 'Password changed successfully' });
    });

    it('should throw if required fields are missing', async () => {
      await expect(
        UserService.changePassword('user123', { currentPassword: '' })
      ).rejects.toThrow('Current password and new password are required');
    });

    it('should throw if new password validation fails', async () => {
      validatePassword.mockReturnValue(['too weak']);
      await expect(
        UserService.changePassword('user123', {
          currentPassword: 'old',
          newPassword: 'weak'
        })
      ).rejects.toThrow('Password validation failed: too weak');
    });

    it('should throw if user not found', async () => {
      validatePassword.mockReturnValue([]);
      UserRepository.findById.mockResolvedValue(null);

      await expect(
        UserService.changePassword('user123', {
          currentPassword: 'old',
          newPassword: 'NewPass123!'
        })
      ).rejects.toThrow('User not found');
    });

    it('should throw if current password is incorrect', async () => {
      validatePassword.mockReturnValue([]);
      UserRepository.findById.mockResolvedValue({ password: 'hashedOldPass' });
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        UserService.changePassword('user123', {
          currentPassword: 'wrongOld',
          newPassword: 'NewPass123!'
        })
      ).rejects.toThrow('Current password is incorrect');
    });
  });

  describe('getAllUsers', () => {
    it('should return all users except current user', async () => {
      const currentUserId = 'user123';
      const users = [
        { _id: 'user1', username: 'user1' },
        { _id: 'user2', username: 'user2' }
      ];
      UserRepository.getAllExceptUser.mockResolvedValue(users);
      UserDto.mockImplementation(user => user);

      const result = await UserService.getAllUsers(currentUserId);

      expect(UserRepository.getAllExceptUser).toHaveBeenCalledWith(
        currentUserId
      );
      expect(result).toEqual(users);
    });
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      const user = { _id: 'user123', username: 'user123' };
      UserRepository.findById.mockResolvedValue(user);
      UserDto.mockImplementation(u => u);

      const result = await UserService.getUserById('user123');

      expect(UserRepository.findById).toHaveBeenCalledWith('user123');
      expect(result).toEqual(user);
    });

    it('should throw if user not found', async () => {
      UserRepository.findById.mockResolvedValue(null);

      await expect(UserService.getUserById('nonexistent')).rejects.toThrow(
        'User not found'
      );
    });
  });
});
