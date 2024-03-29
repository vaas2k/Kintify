const { boolean } = require('joi');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const newPost = new Schema({
    title : {type : String , require : true },
    description : {type : String , require : true},
    author : {type : mongoose.SchemaTypes.ObjectId , ref: 'USER'},
    photoPath : {type : String},
    videoPath : {type : String},
    allowcomment : {type : Boolean},
    tags : [{type : String}],
    userlinks : {type : String},
    likes : {type : Number, default : 0},
    authorPhoto : {type : String},
    authorName : {type : String}
})

module.exports = mongoose.model('POST',newPost,'post-kintify');