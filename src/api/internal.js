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


export {
    login,
    signup,
    logout,
    createPost
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