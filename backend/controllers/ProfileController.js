
const password_pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;
const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const USER = require('../Schemas/user');
const FOLLOW = require('../Schemas/following');
const dotenv = require("dotenv").config();
const Joi = require('joi');
const userDto = require('../Dtos/usedto');
const CHAT = require('../Schemas/chatScheme');
const POST = require('../Schemas/post')
const postDto = require('../Dtos/postdto');


const usersProfile = {
    async follow(req, res, next){

        const checkID = Joi.object({
            username : Joi.string().required(),
            followerID : Joi.string().pattern(mongodbIdPattern).required()
        })
        
        const { error } = checkID.validate(req.body);
        if(error){return next(error);}
        
        console.log(req.body);
        const {username , followerID} = req.body;

        let followed;
        try{ 
            const followerInfo = await USER.findOne({_id : followerID});
            const user = await USER.findOne({username : username});
            const follower = await FOLLOW.findOne({ userID: user._id, followers: { $elemMatch: { ID: followerID } } });
                        
            if(follower){
                // add follower to followed to person list
                await FOLLOW.updateOne(
                    {userID : user._id},
                    {$pull : {followers : {ID : followerID , Username : followerInfo.username , Photo : followerInfo.photoPath}}}
                )
                // add followed person to follower followings list
                await FOLLOW.updateOne(
                    {userID : followerID},
                    {$pull : {followings : {ID : user._id, Username : user.username , Photo : user.photoPath}}}
                )
            }
            else{
                // remove him as a follower
                await FOLLOW.updateOne(
                    {userID : user._id},
                    {$push : {followers : {ID : followerID , Username : followerInfo.username , Photo : followerInfo.photoPath}}}
                )
                // remove the user from follower following list
                await FOLLOW.updateOne(
                    {userID : followerID},
                    {$push : {followings : {ID : user._id, Username : user.username , Photo : user.photoPath}}}
                )
            }

        }catch(error){
            console.error('Error updating followers and followings:', error);
            return next(error);
        }

        return res.status(200).json({message : 'followers - updated',followed : !followed});
    },
    async getuserdata(req, res, next){
        
        const check = Joi.object({
            id : Joi.string().required()
        })
        const { error }  = check.validate(req.params);
        if(error){return next(error);}
        const {id} = req.params;

        let list;
        let user;
        try{
            user = await USER.findOne({username : id});
            list = await FOLLOW.findOne({userID : user._id});
        }catch(error){
            return next(error);
        }
        const newuser = {
            name : user.name,
            username : user.username,
            email : user.email,
            photo : user.photoPath,
            id : user._id
        }
        return res.status(200).json({newuser,list});
    }
    ,
    async updateTags(req, res, next){
        // get user_id and tags in request
        // check user exist
        // save update the tags in user DB => {tags: tags}

        console.log(req.body);
        const checkData = Joi.object({
            id : Joi.string().required(),
            tags : Joi.array().items(Joi.string())
        })

        const { error } =  checkData.validate(req.body);
        if(error){
            return next(error);
        }

        const {id , tags} = req.body;

        try{
            const user = await USER.findOne({_id : id});
            await user.updateOne({tags : tags});
        }catch(error){
            return next(error);
        }

        return res.status(200).json({message : 'changed'});
    },
    async getUserChats (req, res, next) { 

        const { id } = req.params;
        console.log(req.body);
        let chats ;
        try{
            chats = await CHAT.find({userID : id });
        }catch(error){
            return next(error);
        }
        return res.status(200).json({chats});
    },
    async getQueryData (req, res, next) {
        console.log(req.body);
        const {id , userID} = req.body;
        let Profiles;
        let Posts; 
        try{
            Profiles = await USER.find({
                $or : [
                {name : id},
                {username : id}
                ]});
            
            Posts = await POST.find({
                $or: [
                    { title: id },
                    { description: { $regex: id, $options: 'i' } }, // Case-insensitive regex match
                    { tags: { $elemMatch: { $in: id } } }
                ]
            })

            await USER.findOneAndUpdate({_id : userID},{
                recent_searchs : id
            })

        }catch(error){
            console.log(error);
            return next(error);
        }
        const newProfiles = [];
        for(i of Profiles){
            const obj = {
                name : i.name,
                photo : i.photoPath,
                username : i.username
            }
            newProfiles.push(obj)
        }
        const newPosts = []
        for(i of Posts){
            const post = new postDto(i);
            newPosts.push(post);
        }
        return res.status(200).json({Profiles,newPosts});
    }
}

module.exports = usersProfile;

/**
 * user follow someone 
 * in his following list we will add user who he followed
 * we will add him the followers list of users who he followed
 */