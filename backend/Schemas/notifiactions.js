const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const newSchema = new Schema({
    username : {type : String},
    notification : [
        {
            SenderID :   {type : mongoose.SchemaTypes.ObjectId, ref : 'USER'},
            SenderName : {type : String},
            Message :    {type : String},
            on_post :    {type : mongoose.SchemaTypes.ObjectId ,ref : 'POST'},
            photo :      {type : String},
            is_seen :    {type : Boolean, default : false}
        },
        {timeStamp : true}
    ]
})

module.exports = mongoose.model('NOTIFICATION',newSchema,'kintify-notification');