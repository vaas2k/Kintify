const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;


const COMMENT = require('../Schemas/comment');
const USER = require('../Schemas/user');
const POST =require('../Schemas/post');
const commDto = require('../Dtos/commdto');
const Joi = require('joi');


const comment = {
    async comment(req, res, next){
        const dataCheck = Joi.object({
            content : Joi.string().required(),
            author : Joi.string().regex(mongodbIdPattern).required(),
            postid : Joi.string().regex(mongodbIdPattern).required(),
            userimage : Joi.string()
        })

        const {error} = dataCheck.validate(req.body);
        if(error){
            return next(error);
        }

        const {content , postid , author , userimage} = req.body;
        try{
            const check = await POST.findOne({_id : postid});
            if(!check){
                return next({status : 404, messag : "Post doesnt Exist"});
            }
        }catch(error){
            return next(error);
        }


        let comm;
        try{
            if(userimage){

                comm = new COMMENT({
                   author, 
                   postid,
                   content,
                   userimage 
               })

            }else{
                comm = new COMMENT({
                    author, 
                    postid,
                    content 
                })
            }

            await comm.save();
        }catch(error){
            return next(error);
        }
        const newcomm = new commDto(comm);
        return res.status(200).json({message : 'Comment Added',newcomm});
    },
    async getAllcomments(req, res, next){
        const {id} = req.params;
        let comm = [];
        try{
            comm = await COMMENT.find({postid : id});
            
        }catch(error){
            return next(error);
        }
        let comments = [];
        for(let i = 0; i < comm.length ;i++){
            const newcom = new commDto(comm[i]);
            comments.push(newcom);
        }

        return res.status(200).json(comments);
    }
}

module.exports = comment;