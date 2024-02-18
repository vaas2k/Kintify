import axios from "axios";
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from '../store/userslice';
import { get_notifications } from "../api/internal";
import { setUserNotif } from "../store/notiSlice";



const useAutoLogin = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        async function getautologin() {

            try {

                let response = await axios.get('http://localhost:8800/refresh', {
                    withCredentials: true
                });
                if (response.status === 200) {

                    const user = {
                        username: response.data.username,
                        _id: response.data._id,
                        photo: response.data.photo,
                        auth: response.data.auth,
                        name: response.data.name
                    }
                    dispatch(setUser(user));
                    
                }
            } catch (error) {
                return error;
            }
        }
        getautologin();
    }, [])
}

export default useAutoLogin;