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
                        username: response.data.newuser.username,
                        _id: response.data.newuser._id,
                        photo: response.data.newuser.photo,
                        auth: response.data.newuser.auth,
                        name: response.data.newuser.name,
                        followings : response.data.follows.followings,
                        followers : response.data.follows.followers
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