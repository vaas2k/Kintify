
const Jwt = require('../services/Jwt_service');
const USER = require('../Schemas/user');
const userDto = require('../Dtos/usedto');

const auth = async (req, res, next) => {

    try{

        const {refreshtoken , accesstoken }  = req.cookies;
    
        if(!refreshtoken || !accesstoken){
            const error = { 
                status : 401,
                message : 'Unauthorized'
            }
            return next(error);
        }
        
        let id;
        try{
             id = Jwt.verifyAccessToken(accesstoken).id;
        }catch(error){
            return next(error)
        }
    
    
        let user ;
        try{
            user = await USER.findOne({_id : id}); 
            if (!user) {
                return next({
                    status: 401,
                    message: 'Unauthorized'
                })
            }
        }catch(error){
            return next(error);
        }
    
        req.user = new userDto(user);
    
        next();

    }
    catch(error){return next(error)};

}

module.exports = auth;