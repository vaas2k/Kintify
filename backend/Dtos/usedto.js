
class userDto {
    constructor(user){
        this._id = user._id;
        this.name = user.name;
        this.username = user.username;
        this.email = user.email;
        this.photo = user.photoPath;
        this.auth = true;
    }
}

module.exports = userDto;