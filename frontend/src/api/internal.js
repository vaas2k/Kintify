import axios from "axios";
import { config } from "react-spring";

const api = axios.create({
    baseURL: `http://localhost:8800`,
    withCredentials : true,
    headers: {
        "Content-Type" : "application/json"
    }
})




const login = async (data) => {
    let response ;

    try{
        response = await api.post('/login',data);
    }
    catch(error){
        return error;
    }
    
    return response;
}

const signup = async (data) => {
    let response ;

    try{
        response = await api.post('/signup',data);
    }
    catch(error){
        return error;
    }
    
    return response;
}

const logout = async () => {

    let response;
    try{
        response = await api.get('/logout');
    }catch(error){
        return error;
    }
    return response;

}

const createPost = async (data) => {

    let response;
    try{
        response = await api.post('/create',data);
    }catch(error){
        return error;
    }
    return response;

}

const singlePost = async (id) => {

    let response;
    try{
        response  = await api.get(`/post/${id}`);
    }catch(error){
        return error;
    }

    return response;
}

const getallPosts = async (id) => {

    let response;
    try{
        response  = await api.get(`/posts`);
    }catch(error){
        return error;
    }

    return response;
}

const newComment = async (data) => {

    let response;
    try{
        response = await api.post('/comment',data);
    }catch(error){
        return error;
    }
    return response;

}

const newlike = async(data) => {

    let response;
    try{
        response = await api.post('/like',data);
    }catch(error){
        return error;
    }
    return response;
}
const similar_tags_posts = async (tags) => {
    let response;
    try{
        response = await api.post('/sameposts' , tags);
    }catch(error){
        return error;
    }
    return response;

}


export {
    login,
    signup,
    logout,
    createPost,
    singlePost,
    getallPosts,
    newComment,
    newlike,
    similar_tags_posts
}


api.interceptors.response.use(
    config => config,
    async error => {
        const originalreq = error.config;

        if((error.response.message === '401' || error.response.message === '500' && originalreq && !originalreq._isRetry)){
            originalreq._isRetry = true;
            try{
                await api.get('http://localhost:8800/refresh',{
                    withCredentials : true
                });

                api.request(originalreq);

            }catch(error){
                return error;
            }
        }
        throw error;
    }
)