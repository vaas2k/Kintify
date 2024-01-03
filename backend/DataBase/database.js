const mongoose = require('mongoose');
const {MONGO_DB} = require('../configs/secret');

const MongoString = MONGO_DB;

const DBConnect = async () => {

    try{

        const conn = await mongoose.connect(MongoString,{
            useNewUrlParser: false,
            useUnifiedTopology: false,
        })

        console.log(`Database Connected Successfully to Host : ${conn.connections[0].host}`);
    }catch(err){
        console.log(err);
    }

}

module.exports = DBConnect;