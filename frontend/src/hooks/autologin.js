import axios from "axios";
import { useEffect } from "react"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from '../store/userslice';



const useAutoLogin = () => {

    const dispatch = useDispatch();
    useEffect(()=>{
        async function getautologin(){

            let response;
            try{

                response = await axios.get('http://localhost:8800/refresh',{
                    withCredentials : true
                });
                if(response.status === 200){

                    const user = {
                        username : response.data.username,
                        _id : response.data._id,
                        photo : response.data.photo,
                        auth : response.data.auth
                    }
                    dispatch(setUser(user));
                }
            }catch(error){
                return error;
            }
        }
        getautologin();
    },[])
}

export default useAutoLogin;