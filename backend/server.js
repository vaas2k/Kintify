const express = require('express');
const {createServer} = require('http');
const {Server} = require('socket.io');
const {PORT} = require('./configs/secret');
const DBConnect = require('./DataBase/database');
const router = require('./routes/router');
const error_middleware = require('./middlewares/erroHandler');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const chatService = require('./chat Service/chat');

const server = createServer(app);
const io = new Server(server,{
    cors : {
        origin : 'http://localhost:3000',
        method:"*",
        credentials : true
    }
})
chatService(io);

const Port = PORT;
app.use(cookieParser());
app.use(cors({
    credentials : true,
    origin:'http://localhost:3000'
}))
app.use(express.json({ limit: '40mb' }));
app.use(express.urlencoded({ extended: true, limit: '40mb' }));
DBConnect();

app.use(router);
app.use(error_middleware);

server.listen(Port,()=> console.log(`Server listeing on ${Port}`));