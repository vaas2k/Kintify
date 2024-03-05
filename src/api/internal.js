import axios from "axios";

const api = axios.create({
    baseURL: `http://localhost:8800`,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})




const login = async (data) => {
    let response;

    try {
        response = await api.post('/login', data);
    }
    catch (error) {
        return error;
    }

    return response;
}

const signup = async (data) => {
    let response;

    try {
        response = await api.post('/signup', data);
    }
    catch (error) {
        return error;
    }

    return response;
}

const logout = async () => {

    let response;
    try {
        response = await api.get('/logout');
    } catch (error) {
        return error;
    }
    return response;

}

const createPost = async (data) => {

    let response;
    try {
        response = await api.post('/create', data);
    } catch (error) {
        return error;
    }
    return response;

}

const singlePost = async (id) => {

    let response;
    try {
        response = await api.get(`/post/${id}`);
    } catch (error) {
        return error;
    }

    return response;
}

const getallPosts = async (id) => {

    let response;
    try {
        response = await api.get(`/posts`);
    } catch (error) {
        return error;
    }

    return response;
}

const newComment = async (data) => {

    let response;
    try {
        response = await api.post('/comment', data);
    } catch (error) {
        return error;
    }
    return response;

}

const newlike = async (data) => {

    let response;
    try {
        response = await api.post('/like', data);
    } catch (error) {
        return error;
    }
    return response;
}
const similar_tags_posts = async (tags) => {
    let response;
    try {
        response = await api.post('/sameposts', tags);
    } catch (error) {
        return error;
    }
    return response;
}

const update_user_suggestions = async (data) => {
    let response;

    try {
        response = await api.post('/updatetags', data);
    } catch (error) {
        return error;
    }
    return response;
}
const userPosts = async (id) => {
    let response;
    try {
        response = await api.get(`/postsbyuser/${id}`);
    } catch (error) {
        return console.log(error);
    }
    return response;
}


const getuserdata = async (id) => {
    let response;
    try {
        response = await api.get(`/getuserdata/${id}`);
    } catch (error) {
        return error;
    }
    return response;
}

const follow = async (data) => {
    let response;
    try {
        response = await api.post(`/follow`, data);
    } catch (error) {
        return error;
    }
    return response;
}

const Notification = async (data) => {
    let response;
    try {
        response = await api.put('/send_notification', data);
    } catch (error) {
        console.log(error);
        return error;
    }
    return response;
}

const get_notifications = async (id) => {
    let response ;

    try{
        response = await api.get(`/notifications/${id}`);
    }catch(error){
        console.log(error);
        return error;
    }

    return response;
}

const updatenotifications = async (data) => {
    let response ;

    try{
        response = await api.put(`/updatenotifications`,data);
    }catch(error){
        console.log(error);
        return error;
    }

    return response;
}

const GetChats = async (id) => {

    let response ;
    try{
        response = await api.get(`/getmessages/${id}`);
    }catch(error){
        return response;
    }

    return response;
}

const storeMessages = async (data) => {
    let response; 
    try{
        response = await api.post('/storemessages',data);
    }catch(error){
        return error;
    }
    return response;
}
const startChat = async (data) => {
    let response ;
    try{
        response = await api.post('/startChat',data);
    }catch(error){
        return error;
    }
    return response;
}

const getQueryData = async (data) => {
    
    let response;
    try{
        response = await api.post(`/getquerydata`,data);
    }catch(error){
        return error;
    }
    return response;
}



export {
    login,
    GetChats,
    signup,
    logout,
    createPost,
    singlePost,
    getallPosts,
    newComment,
    newlike,
    similar_tags_posts,
    update_user_suggestions,
    userPosts,
    getuserdata,
    follow,
    Notification,
    get_notifications,
    updatenotifications,
    storeMessages,
    startChat,
    getQueryData
}


api.interceptors.response.use(
    config => config,
    async error => {
        const originalreq = error.config;

        if ((error.response.message === '401' || error.response.message === '500') && (originalreq && !originalreq._isRetry)) {
            originalreq._isRetry = true;
            try {
                await api.get('http://localhost:8800/refresh', {
                    withCredentials: true
                });

                api.request(originalreq);

            } catch (error) {
                return error;
            }
        }
        throw error;
    }
)