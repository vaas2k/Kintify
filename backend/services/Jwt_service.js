
const jwt = require('jsonwebtoken');

const ACCESS_TOK = 'ZrGFNG5U7ZCAa3WP3Kt+RPjdG3CfYb72H0DG51Nvj1E=';
const REFRESH_TOK = "zKCHgIIzTvF89PZ3v47Z8H26Y0u22UZLmJ1TmGuow+o=";
const Refresh_token = require('../Schemas/token');




class Jwt {

    static signAccessToken (payload,expiry){
        return jwt.sign(payload,ACCESS_TOK,{expiresIn : expiry});
    }

    static signRefreshToken (payload,expiry){
        return jwt.sign(payload,REFRESH_TOK,{expiresIn : expiry});
    }

    static verifyAccessToken(token){
        return jwt.verify(token,ACCESS_TOK);
    }

    static verifyRefreshToken(token){
        return jwt.verify(token,REFRESH_TOK);
    }


    static async saveRefreshToken (token,user) {
        try{

            const newtoken = new Refresh_token({
                token,
                id : user._id
            })
            
            await newtoken.save();

        }catch(error){
            console.log(error);
        }
        
    }

}


module.exports = Jwt;
