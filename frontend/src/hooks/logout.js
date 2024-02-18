import { useDispatch, useSelector } from "react-redux";
import { logout ,updatenotifications } from "../api/internal";
import { resetUser } from "../store/userslice";
import { useNavigate } from "react-router-dom";
import { resetNoti } from "../store/notiSlice";
import axios from "axios";

const useLogout = async () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const username = useSelector((state)=>{return state.user.username})
    const notification = useSelector((state)=> {return state.noti.notification});
    try{
        const data = {
            username : username,
            notification : notification
        }
        console.log(data);
        await updatenotifications(data);
        const response = await logout();
        if(response.status === 200){ 
            dispatch(resetUser());
            dispatch(resetNoti());
            navigate('/');
        }
    }catch(error){
        throw error;
    }


}

export default useLogout;