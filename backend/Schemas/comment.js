const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const newComment = new Schema({
    author : {type : mongoose.SchemaTypes.ObjectId, ref : 'USER'},
    postid : {type : mongoose.SchemaTypes.ObjectId, ref : 'POST'},
    content : {type : String , require : true},
    userimage : {type : String},
    username : {type: String}
})

module.exports = mongoose.model('COMMENT',newComment,'comments-kintify');