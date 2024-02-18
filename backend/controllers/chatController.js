
const CHAT = require('../Schemas/chatScheme');
const MESSAGE = require('../Schemas/message');
const USER  = require('../Schemas/user');
const shortid = require('shortid')

const chats = {
    async getMessages (req, res, next) {
        const { id } = req.params;
        let chats;
        
        try{
            chats = await CHAT.find({userID : id});
        }
        catch(error){
            return next(error);
        }
        
        let messages;
        const chat = [];
        try{
            for(let i = 0; i < chats.length ;i++){
                messages = await MESSAGE.findOne({_id : chats[i].messageBox});
                if(messages.messages){

                    const obj = {
                        userID: chats[i].userID,
                        messenger: chats[i].messenger,
                        roomID: chats[i].roomID,
                        photo : chats[i].photo,
                        messageBox: chats[i].messageBox,
                        messages : messages.messages
                    }
                    chat.push(obj);
                }
            }
        }catch(error){
            return next(error);
        }
        return res.status(200).json({chat});
    },
    async StartChat (req,res, next){

        const {userID, messenger} = req.body;
        let chat;
        let messageBox
        const roomID = shortid.generate();
        console.log(req.body);
        try{
            const user = await USER.findOne({_id : userID});
            const Messenger = await USER.findOne({username : messenger});
            messageBox = new MESSAGE({
                messages : [
                    {
                        
                    }
                ]
            })
            await messageBox.save();
            chat = new CHAT({
                userID : user._id,
                messenger : Messenger.username,
                photo : Messenger.photoPath,
                roomID : roomID,
                messageBox : messageBox._id
            })
            const chat2 = new CHAT({
                userID : Messenger._id,
                messenger : user.username,
                photo : user.photoPath,
                roomID : roomID,
                messageBox : messageBox._id
            })

            await chat.save();
            await chat2.save();
        }
        catch(error){
            return next(error);
        }
        const chat1 = {
            userID: chat.userID,
            messenger: chat.messenger,
            roomID: chat.roomID,
            photo : chat.photo,
            messageBox: chat.messageBox,
            messages : messageBox.messages
        }
        return res.status(200).json({chat1})
    },
    async storeMessages ( req, res, next ){

        const {messageBox , messages} = req.body;
        const length = messages.length;
        let lastMessages = [];
        try{
            let chat = await MESSAGE.findOne({_id: messageBox});
            
            lastMessages = chat.messages.slice(-length);

            let newMessages = Array.from(new Set([...lastMessages, ...messages].map(JSON.stringify))).map(JSON.parse);
            await chat.updateOne({$pop : { messages : -length}});
            await chat.updateOne({$push : {messages : newMessages}});

        }catch(error){
            return next(error);
        }

        return res.status(200).json({sucess : true});
    }
}

module.exports  = chats
