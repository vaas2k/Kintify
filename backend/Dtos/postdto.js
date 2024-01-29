
class postDto {

    constructor (post) {
        this.id = post._id;
        this.title = post.title;
        this.description = post.description;
        this.video = post.videoPath;
        this.photo = post.photoPath;
        this.tags = post.tags;
        this.allowcomment = post.allowcomment;
        this.likes = post.likes
    }
}

module.exports =  postDto