const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const Joi = require('joi');
const COMMENT = require('../Schemas/comment');
const POST = require('../Schemas/post');
const cloudinary = require('cloudinary').v2;
const postDto = require('../Dtos/postdto');
const { CLOUD_NAME, API_KEY, API_SECRET } = require('../configs/secret');
const { JSONCookies } = require('cookie-parser');



cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET
});
const post = {
    async create_post(req, res, next) {
        // get data from users
        const dataCheck = Joi.object({
            title : Joi.string().required(),
            description : Joi.string().required(),
            author : Joi.string().regex(mongodbIdPattern).required(),
            photo : Joi.string().required(),
            tags : Joi.array().items(Joi.string()),
        })
        // validate users database
        const { error } = dataCheck.validate(req.body); 
        if(error){
            return next(error);
        }

        const {title , description , photo , author , tags } = req.body;
        // save image
        let responce ;
        try{
            responce = await cloudinary.uploader.upload(photo, {
                resource_type : "image",
                public_id : "posts-kintify"
            })
            
        }catch(error){
            return next(error);
        }
        // save the data in DB
        let post;
        try{
            post = new POST({
                title,
                description,
                author,
                photoPath : JSON.stringify(responce.secure_url,null),
                tags
            })

            await post.save();
        }catch(error){
            return next(error);
        }
        // return Dto in responce
        const newpost = new postDto(post);
        return res.status(200).json(newpost);
    },
    async update_post(req,res,next) {

        const dataCheck = Joi.object({
            id : Joi.string().regex(mongodbIdPattern).required(),
            title : Joi.string().required(),
            description : Joi.string().required(),
            author : Joi.string().regex(mongodbIdPattern).required(),
            photo : Joi.string(),
            tags : Joi.array().items(Joi.string())
        })
        
        const { error } = dataCheck.validate(req.body); 
        if(error){
            return next(error);
        }

        const {id, title , description , photo , author , tags} = req.body;

        try{
            const check = await POST.findOne({_id : id},{author : author});
            if(!check){
                const error = {
                    status : 404,
                    message : "Post not Found"
                }
                return next(error);
            }

        }catch(error){
            return next(error);
        }
        

        try{
            let post ;
            if(photo){
                const responce = await cloudinary.uploader.upload(photo,{
                    resource_type : "image"
                })

                post = await POST.updateOne(
                    {_id : id},
                    {
                    title,
                    author,
                    description,
                    photoPath : JSON.stringify(responce.secure_url,null,2),
                    tags
                }) 
            }else{
                post = await POST.updateOne(
                    {_id : id},
                    {
                    title,
                    author,
                    description,
                    tags
                }) 
            }
            
        }catch(error){
            return next(error);
        }

        return res.status(200).json({message : "Post Updated"});

    },
    async delete_post(req, res, next){

        const dataCheck = Joi.object({
            id : Joi.string().regex(mongodbIdPattern).required(),           
        })
        const { error } = dataCheck.validate(req.params);
        if(error){
            return next(error);
        }
        const {id} = req.params
        try{
            const check = await POST.deleteOne({_id : id});
            if(check){
                await COMMENT.deleteMany({postid : id})
            }
        }catch(error){
            return next(error);
        }
        
        return res.status(200).json({message : "Post Deleted"});
    },
    async getAllPost(req, res, next){
        let posts = [];
        try{
            posts = await POST.find();
        }catch(error){
            return next(error);
        }
        let allposts = [];
        
        for(let i = 0; i < posts.length; i++){
            const post = new postDto(posts[i]);
            allposts.push(post);
        }

        return res.status(200).json(allposts);
    },
    async getSinglePost(req, res, next){
        const {id} = req.params
        let post;
        try{
            post = await POST.findOne({_id : id});
            if(!post){
                const error = {
                    status : 404,
                    message: 'Post not found'
                }
                return next(error);
            }
        }catch(error){
            return next(error);
        }

        const newpost = new postDto(post);
        return res.status(200).json(newpost);
    },
    async postByuser(req, res, next){

        const dataCheck = Joi.object({
            id : Joi.string().regex(mongodbIdPattern).required(),           
        })
        const { error } = dataCheck.validate(req.params);
        if(error){
            return next(error);
        }
        
        const {id} = req.params;
        let posts = [];
        try{
            posts = await POST.find({author : id});
        }catch(error){
            return next(error);
        }

        let allposts = [];
        
        for(let i = 0; i < posts.length; i++){
            const post = new postDto(posts[i]);
            allposts.push(post);
        }

        return res.status(200).json(allposts);
        
    }
}

module.exports = post;