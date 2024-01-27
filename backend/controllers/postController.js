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
            photo : Joi.string(),
            video : Joi.string(),
            allowcomment : Joi.boolean(),
            tags : Joi.array().items(Joi.string()),
            link : Joi.string()
        })
        // validate users database
        const { error } = dataCheck.validate(req.body); 
        if(error){
            console.log(error)
            return next(error);
        }
        
        const {title , description ,link , photo , video , author , tags , allowcomment } = req.body;
        // save image
        let responce ;
        try{
            
            if(photo != 'null' &&  video === 'null'){
                responce = await cloudinary.uploader.upload(photo, {
                    resource_type : "image",
                    public_id : "posts-kintify"
                })
            }
            else if(video != 'null' && photo === 'null'){
                responce = await cloudinary.uploader.upload(video, {
                    resource_type : "video",
                    public_id : "posts-kintify"
                })
            }
            
            
        }catch(error){
            return next(error);
        }
        console.log(req.body)
        // save the data in DB
        let post;
        try{

            if(photo != 'null' &&  video === 'null'){
                post = new POST({
                    title,
                    description,
                    author,
                    photoPath : responce.secure_url ,
                    videoPath : 'null',
                    tags,
                    allowcomment,
                    link
                })
            }
            else if(video != 'null' && photo === 'null'){
                post = new POST({
                    title,
                    description,
                    author,
                    photoPath : 'null',
                    videoPath : responce.secure_url || 'null',
                    tags,
                    allowcomment,
                    link
                })
            }
            

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
            video : Joi.string(),
            allowcomment : Joi.boolean().required(),
            tags : Joi.array().items(Joi.string()),
            link: Joi.string()
        })
        
        const { error } = dataCheck.validate(req.body); 
        if(error){
            return next(error);
        }

        const {id, title , description , photo , video , author , tags} = req.body;

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
                    photoPath : responce.secure_url || 'null',
                    tags,
                    link
                }) 
            }
            else if(video){
                const responce = await cloudinary.uploader.upload(video,{
                    resource_type : "video"
                })

                post = await POST.updateOne(
                    {_id : id},
                    {
                    title,
                    author,
                    description,
                    videoPath : responce.secure_url || 'null',
                    tags,
                    link
                })
            }
            else{
                post = await POST.updateOne(
                    {_id : id},
                    {
                    title,
                    author,
                    description,
                    tags,
                    link
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
    ,
    async likes(req,res,next) {
        /* request = { liker-id , post-id , like }
         get previous likes
         add + 1
         update the likes on post DB
         get tags from post by post id
         update the top 5 tags in liker DB
         send responce
         since we have liker id and we can directly save the tags from post in liker schema
        */
    }
}

module.exports = post;
