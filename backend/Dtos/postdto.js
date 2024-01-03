
class postDto {

    constructor (post) {
        this.id = post._id;
        this.title = post.title;
        this.description = post.description;
        this.photo = post.photoPath;
    }
}

module.exports =  postDto