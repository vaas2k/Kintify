const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LikesSchema = new Schema({
    liker_id : {type : mongoose.SchemaTypes.ObjectId , ref : 'USER'},
    post_id  : {type : mongoose.SchemaTypes.ObjectId , ref : 'POST'},
})


module.exports = mongoose.model('LIKE',LikesSchema,'likes-kintify');