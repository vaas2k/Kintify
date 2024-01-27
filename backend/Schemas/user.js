const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema ({

    name : {type:String, require : true},
    username : {type : String , require : true},
    email : {type : String , require : true},
    password : {type : String, require : true},
    photoPath : {type : String, require : true},
    tags : [{type : String}]
})

module.exports = mongoose.model('USER',userSchema,'users-kintify');