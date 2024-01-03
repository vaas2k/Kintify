class commDto { 
    constructor (comm){
        this.id = comm._id;
        this.content = comm.content;
        this.userimage = comm.userimage;
    }
}

module.exports = commDto;