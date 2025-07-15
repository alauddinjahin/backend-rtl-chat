class UserDto {
  constructor(user) {
    this.id = user._id;
    this.username = user.username;
    this.email = user.email;
    this.isOnline = user.isOnline;
    this.lastSeen = user.lastSeen;
    this.createdAt = user.createdAt;
  }
}


module.exports = UserDto;