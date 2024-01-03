const mongoose = require('mongoose');

const Schema  = mongoose.Schema;

const newToken = new Schema({
    token : {type : String,require : true },
    id : {type : mongoose.SchemaTypes.ObjectId, ref : 'USER'}
},{
    timestamps : true
}
)

module.exports = mongoose.model('Refresh_token',newToken,'tokens-kintify');