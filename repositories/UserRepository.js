
const User = require('../models/User');

class UserRepository {
  static async findById(id) {
    return await User.findById(id);
  }

  static async findByEmail(email) {
    return await User.findOne({ email });
  }

  static async findByUsernameOrEmail(username, email) {
    return await User.findOne({
      $or: [
        { email },
        { username: { $regex: new RegExp(`^${username}$`, 'i') } }
      ]
    });
  }

  static async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  static async updateById(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  }

  static async deleteById(id) {
    return await User.findByIdAndDelete(id);
  }

  static async getAllExceptUser(userId) {
    return await User.find({ _id: { $ne: userId } })
      .select('-password')
      .sort({ username: 1 });
  }

  static async updateOnlineStatus(userId, isOnline) {
    return await User.findByIdAndUpdate(userId, {
      isOnline,
      lastSeen: new Date()
    }, { new: true });
  }
}

module.exports = UserRepository;