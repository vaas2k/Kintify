const mongoose = require('mongoose');

const { Schema } = mongoose;

const newSchema = new Schema({
    messages : [
        {
            sender : {type : String},
            message : {type : String},
        },
        {timeStamp : true}
    ]
})

module.exports = mongoose.model('MESSAGEBOX',newSchema,'Kintify-Messages');