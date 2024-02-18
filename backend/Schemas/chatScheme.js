const mongoose = require('mongoose');

const { Schema } = mongoose;

const newSchema = new Schema({
    userID: { type: mongoose.SchemaTypes.ObjectId , ref : 'USER' },
    messenger : { type : String },
    photo : {type : String},
    roomID : { type : String},
    messageBox : {type : mongoose.SchemaTypes.ObjectId , ref: 'MESSAGEBOX'}
})

module.exports = mongoose.model('CHAT',newSchema,'Kintify-Chats');

/*

Chat : {
    userID: mickey,
    Messenger: salsuqe,
    roomID: sc3e12nz,
    photo: urltosasluqephoto,
    messagesbox : {type : id};    
}

Message : { 
    _id : {},
    messages : [
        {
            sender : '',
            message: '',      
        }
    ]
}


First time initiating a chat

const { userID , Messenger , roomID } = req.body;
const user = findOne({_id : userID})
const messenger  = findOne({username : messenger});
const newMessageBox = new MESSAGE();

const chat = new CHAT(
    {
        userID : userID,
        messenger : messenger.username,
        photo: messenger.photo,
        messageBox: newMessageBox._id;
    }
)
const chat2 = new CHAT(
    {
        userID : messenger._id,
        messenger : user.username,
        photo: user.photo,
        messageBox: newMessageBox._id;
    }
)


STORING MESSAGES

const {messageBox_id , messages } = req.body;

const messageBox = findOne({_id : messageBox_id});

messageBox.updateOne({v_id : messageBox_id},
    {{ messages : {$push : messages}}); 
} 


MAKING A GET REQUEST


const { userID } = req.body;

const getChat = await findOne({userID : userID});
const getMessages = await findOne({_id : getChat.messageBox})

return both;


    */
