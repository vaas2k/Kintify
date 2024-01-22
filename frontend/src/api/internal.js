import axios from "axios";

const api = axios.create({
    baseURL: `${process.env.LOCAL}`,
    withCredentials : true,
    headers: {
        "Content-Type" : "application/json"
    }
})




const login = async (data) => {
    let responce ;

    try{
        responce = await api.post('/login',data);
    }
    catch(error){
        return error;
    }
    
    return responce;
}


export {
    login,
}