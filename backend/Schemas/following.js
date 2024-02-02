const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const newSchema = new Schema({
    userID : {type : mongoose.SchemaTypes.ObjectId, ref : 'USER'},
    followers : [
        {
            ID : {type : mongoose.SchemaTypes.ObjectId, ref : 'USER'},
            Username : {type : String},
            Photo : {type :String}
        }
    ],
    followings : [
        {
            ID : {type : mongoose.SchemaTypes.ObjectId, ref : 'USER'},
            Username : {type : String},
            Photo : {type :String}
        }
    ]  
})


module.exports = mongoose.model('FOLLOW',newSchema,'kintify-user-following');
