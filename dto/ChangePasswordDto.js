class ChangePasswordDto {
  constructor(data) {
    this.currentPassword = data.currentPassword;
    this.newPassword = data.newPassword;
  }
}

module.exports = ChangePasswordDto;
