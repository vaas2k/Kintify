const express = require('express');

const {PORT} = require('./configs/secret');
const DBConnect = require('./DataBase/database');
const router = require('./routes/router');
const error_middleware = require('./middlewares/erroHandler');
const cookieParser = require('cookie-parser');
const auth = require('./middlewares/auth');
const app = express();
const path = require('path');
const cors = require('cors');




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

app.listen(Port,()=> console.log(`Server listeing on ${Port}`));