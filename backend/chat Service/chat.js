const MESSAGE = require('../Schemas/message');

const chatService = (io) => {

    io.on('connection',(socket)=>{
        
        socket.on('join-room',(data) => {
            socket.join(data);
        })
        socket.on('msg', async (data)=>{
            console.log(data);
            const msg = {
                "message"  : data.message,
                "sender"   : data.sender,
            }
            await MESSAGE.findOneAndUpdate(
                {_id : data.messageBox},
                {$push : {messages : msg}}
            );
            socket.to(data.roomID).emit('r_msg',msg);
        })

        socket.on('getallmsgs',(data)=> {
            console.log(data);
        })

    })
}



module.exports = chatService;