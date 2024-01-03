
const password_pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const USER = require('../Schemas/user');
const dotenv = require("dotenv").config();
const cloudinary = require('cloudinary').v2;
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const userDto = require('../Dtos/usedto');
const Jwt = require('../services/Jwt_service');
const Refresh_token = require('../Schemas/token');

const { CLOUD_NAME, API_KEY, API_SECRET } = require('../configs/secret');


cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET
});

const users = {
    async signup(req, res, next) {
        // validate the data by joi (if error => handle using middleware)
        const schemaCheck = Joi.object({
            name: Joi.string().max(25).required(),
            username: Joi.string().min(4).max(25).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(password_pattern).required(),
            confirm_password: Joi.ref('password'),
            photo: Joi.string()
        })

        const { error } = schemaCheck.validate(req.body);
        if (error) {
            return next(error);
        }
        // check if username or email already exist in DB (if exist => handle accordingly)
        const { name, username, email, password, photo } = req.body;

        try {
            const user_exist = await USER.exists({ username: username });
            const email_exist = await USER.exists({ email: email });

            if (user_exist) {
                const error = {
                    status: 409,
                    message: 'User Already Exists'
                }
                return next(error);
            }
            if (email_exist) {
                const error = {
                    status: 409,
                    message: 'Email Already Exists'
                }
                return next(error);
            }
        } catch (error) {
            return next(error);
        }

        // upload pic to some cloud api

        let imageUrl ;
        if (photo) {

            const responce =  await cloudinary.uploader.upload(photo, {
                resource_type: 'image',
                public_id: "users-kintify"
            })
            imageUrl = responce.secure_url;
        }

        console.log(imageUrl);

        // hash the password
        const hash_password = await bcrypt.hash(password, 10);
        
        // save the user along with the hash password
        let user;
        try{

            if(photo){
                user = new USER({
                    name,
                    username,
                    email,
                    password : hash_password,
                    photoPath : JSON.stringify(imageUrl,null,2)
                })
            }else{
                user = new USER({
                    name,
                    username,
                    email,
                    password : hash_password,
                    photoPath : 'null'
                })
            }

            user = await user.save();

        }catch(error){
            return next(error);
        }

        // generate and save tokens
        let accesstoken;
        let refreshtoken;
        try{
            accesstoken = Jwt.signAccessToken({id : user._id},'30min')
            refreshtoken = Jwt.signRefreshToken({id : user._id},"60min");

            await Jwt.saveRefreshToken(refreshtoken,user);
        }catch(error){
            return next(error);
        }


        // send tokens in cookie responce
        res.cookie('accesstoken', accesstoken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        });

        res.cookie('refreshtoken', refreshtoken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        })

        // send userdto in responce + 200 code 
        const newuser = new userDto(user);
        return res.status(200).json({ newuser });
    },
    async login(req, res, next) {

        const schemaCheck = Joi.object({
            username : Joi.string().required(),
            password : Joi.string().pattern(password_pattern).required()
        })

        const { error } = schemaCheck.validate(req.body);
        if(error){
            return next(error);
        }
        
        const { username , password } = req.body;
        let user ;
        let accesstoken;
        let refreshtoken;
        try{

            user = await USER.findOne({username : username});
            if(user){
                const pass =  bcrypt.compareSync(password,user.password);
                if(!pass) {
                    const error = {
                        status: 409,
                        message : "Wrong Password"
                    }
                    return next(error);
                }
            }else{
                const error = {
                    status: 409,
                    message : "Username not Found"
                }
                return next(error);
            }

            accesstoken = Jwt.signAccessToken({ id : user._id }, "30min");
            refreshtoken = Jwt.signRefreshToken({ id : user._id}, "60min");

        }catch(error){
            return next(error);
        }

        try{
            
            await Refresh_token.updateOne(
                {id : user._id},
                {token : refreshtoken},
                {upsert : true});

        }catch(error){
            return next(error);
        }

        res.cookie('accesstoken', accesstoken , {
            maxAge : 1000 * 60 * 60 * 24,
            httpOnly : true 
        })

        res.cookie('refreshtoken', refreshtoken , {
            maxAge : 1000 * 60 * 60 * 24,
            httpOnly : true 
        })

        const newuser = new userDto(user);
        return res.status(200).json(newuser);
    },
    async refresh(req, res, next) {
        // get original refresh token from req.cookies;
        let OriginalToken = req.cookies.refreshtoken;
        // verify that token
        let id ;
        try{
            id = Jwt.verifyRefreshToken(OriginalToken).id;
            if(!id){
                const error = {
                    status : 401 ,
                    message : 'Unauthorized'
                }
                return next(error);
            }
        }catch(error){
            return next(error);
        }
        // check if it exist in DB

        try{
            const token_check = await Refresh_token.findOne({token : OriginalToken , id : id });
            if(!token_check){
                const error = {
                    status : 401 ,
                    message : 'Unauthorized'
                }
                return next(error);
            }
        }catch(error){
            return next(error);
        }
        // sign a new one 
        const accesstoken = Jwt.signAccessToken({id : id }, "30min");
        const refreshtoken = Jwt.signRefreshToken({id : id },"60min");

        try{
            await Refresh_token.updateOne({id : id},{token : refreshtoken});
        }catch(error){
            return next(error);
        }
        // send in responce
        res.cookie('accesstoken', accesstoken , {
            maxAge : 1000 * 60 * 60 * 24,
            httpOnly : true 
        })

        res.cookie('refreshtoken', refreshtoken , {
            maxAge : 1000 * 60 * 60 * 24,
            httpOnly : true 
        })

        const user = await USER.findOne({_id : id});
        const newuser = new userDto(user);
        return res.status(200).json(newuser);
    },
    async logout(req, res, next) {
        // get tokens 
        const { refreshtoken } = req.cookies;
        // search in DB and
        // delete the token 
        try{
            const token = await Refresh_token.deleteOne({token: refreshtoken});
        
        }catch(error){
            return next(error);
        }
        res.clearCookie('accesstoken');
        res.clearCookie('refreshtoken');
        // send auth : false in responce
        return res.status(200).json({auth : false});
    }
}

module.exports = users;

/*

*/