const { boolean } = require('joi');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const newPost = new Schema({
    title : {type : String , require : true },
    description : {type : String , require : true},
    author : {type : mongoose.SchemaTypes.ObjectId , ref: 'USER'},
    photoPath : {type : String},
    allowcomment : {type : Boolean},
    tags : [{type : String}]
})

module.exports = mongoose.model('POST',newPost,'post-kintify');