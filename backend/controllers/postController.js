const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const Joi = require('joi');
const COMMENT = require('../Schemas/comment');
const POST = require('../Schemas/post');
const USER = require('../Schemas/user');
const LIKE = require('../Schemas/likes');
const FOLLOW = require('../Schemas/following');
const NOTIFICATION = require('../Schemas/notifiactions');
const cloudinary = require('cloudinary').v2;
const postDto = require('../Dtos/postdto');
const userDto = require('../Dtos/usedto');
const { CLOUD_NAME, API_KEY, API_SECRET } = require('../configs/secret');
const { JSONCookies } = require('cookie-parser');
const commDto = require('../Dtos/commdto');




cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET
});
const post = {
    async create_post(req, res, next) {
        // get data from users
        console.log(req.body);
        const dataCheck = Joi.object({
            title : Joi.string().required(),
            description : Joi.string().required(),
            author : Joi.string().regex(mongodbIdPattern).required(),
            photo : Joi.string(),
            video : Joi.string(),
            allowcomment : Joi.boolean(),
            tags : Joi.array().items(Joi.string()),
            authorName : Joi.string(),
            authorPhoto: Joi.string(),
            userlinks : Joi.string()
        })
        // validate users database
        const { error } = dataCheck.validate(req.body); 
        if(error){
            console.log(error)
            return next(error);
        }
        
        const {title , description ,userlinks , photo , video , author , tags , allowcomment , authorName,authorPhoto } = req.body;
        // save image
        let responce ;
        try{
            
            if(photo != 'null' &&  video === 'null'){
                responce = await cloudinary.uploader.upload(photo, {
                    resource_type : "image",
                })
            }
            else if(video != 'null' && photo === 'null'){
                responce = await cloudinary.uploader.upload(video, {
                    resource_type : "video",
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
                    userlinks ,
                    authorPhoto,
                    authorName,
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
                    userlinks ,
                    authorPhoto,
                    authorName,
                })
            }
            

            await post.save();
            const newlike = new LIKE({
                post_id : post._id,
                likes : 0
            })
            await newlike.save();
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
            userlinks: Joi.string()
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
                    userlinks
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
                    userlinks
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
                    userlinks
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
        
        for (let i = 0; i < posts.length; i++) {
            const j = Math.floor(Math.random() * (i + 1));
            [posts[i], posts[j]] = [posts[j], posts[i]];
        }
        for(let i = 0; i < posts.length; i++){
            const newpost = new postDto(posts[i]);
            allposts.push(newpost);
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
        let comments;
        try{
            comments = await COMMENT.find({postid : id});
        }
        catch(error){
            return next(error);
        }
        let poster ;
        try{
            poster = await USER.findOne({_id : post.author});
        }
        catch(error){ return next(error);}
        let likes = [];
        try{
            likes = await LIKE.find({post_id : post._id});
        }
        catch(error){ return next(error);}

        post = new postDto(post);
        if(poster){
            const user = new userDto(poster);
            return res.status(200).json({post, comments, likes });
        }
            
        return res.status(200).json({user : {username:'dont Exist'}, comments, likes});
        

    },
    async postByuser(req, res, next){

        console.log(req.params.id);
        const dataCheck = Joi.object({
            id : Joi.string().regex(mongodbIdPattern).required(),           
        })
        const { error } = dataCheck.validate(req.params);
        if(error){
            return next(error);
        }
        
        console.log(req.params);
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
    async like(req,res,next) {
        /* request = { liker-id , post-id , like }
         if user already liked the post then remove decrease likes by 1 
         else increase likes by one 
         get tags from post by post id
         update the top 5 tags in liker DB
         send responce
         since we have liker id and we can directly save the tags from post in liker schema
        */

       const check = Joi.object({
           liker_id  : Joi.string().pattern(mongodbIdPattern),
           post_id : Joi.string().pattern(mongodbIdPattern),
        })
        
        const {error} = check.validate(req.body);
        if(error){
            return next(error);
        }
        const {post_id , liker_id} = req.body;

        try{
            const check_like = await LIKE.findOne({post_id : post_id , liker_id: liker_id });
            const post = await POST.findOne({_id : post_id});
            if (!check_like) {
                const newlike = new LIKE({
                    liker_id,
                    post_id
                })
                await newlike.save();
                const like = post.likes + 1;
                await post.updateOne({likes : like});
            }
            else{
                // if user like laready exist then
                await LIKE.deleteOne({post_id : post_id , liker_id: liker_id });
                const like = post.likes - 1;
                await post.updateOne({likes : like}); 
                return res.status(201).json({message: 'unliked'});
            }
        }catch(error){
            console.log(error);
            return next(error);
        }
        return res.status(200).json({message : 'liked'});
        
    },
    async sametagsposts(req, res, next) {
        // get tags in req
        const checktags = Joi.object({
            tags : Joi.array().items(Joi.string())
        })
        const {error} = checktags.validate(req.body);
        // search posts that matchs the current tags
        const {tags , id } = req.body;
        let posts = [] ;
        let newposts = [];
        try{
            posts = await POST.find({ tags: { $elemMatch: { $in : tags } } });
            for(let i = 0 ; i < posts.length ;i++){
                if(posts[i]._id.equals(id)){
                    continue;
                }
                const newpost = new postDto(posts[i]);
                newposts.push(newpost);
            }
        }catch(error){
            console.log(error);
            return next(error);
        }
        // send in responce;
        return res.status(200).json({newposts});
    }
}

module.exports = post;
