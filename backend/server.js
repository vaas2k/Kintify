const express = require('express');

const {PORT} = require('./configs/secret');
const DBConnect = require('./DataBase/database');
const router = require('./routes/router');
const error_middleware = require('./middlewares/erroHandler');
const cookieParser = require('cookie-parser');
const auth = require('./middlewares/auth');
const app = express();

const Port = PORT;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());
DBConnect();

app.use(router);
app.use(error_middleware);

app.listen(Port,()=> console.log(`Server listeing on ${Port}`));