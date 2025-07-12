class RegisterDto {
    constructor(data) {
        this.username = data.username?.trim();
        this.email = data.email?.toLowerCase().trim();
        this.password = data.password;
    }
}



module.exports = RegisterDto