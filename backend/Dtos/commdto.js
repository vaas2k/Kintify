class commDto { 
    constructor (comm){
        this.id = comm._id;
        this.content = comm.content;
        this.userimage = comm.userimage;
        this.username = comm.username;
    }
}

module.exports = commDto;