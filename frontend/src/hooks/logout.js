import { useDispatch } from "react-redux";
import { logout } from "../api/internal";
import { resetUser } from "../store/userslice";
import { useNavigate } from "react-router-dom";

const Logout = async () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    try{
        const response = await logout();
        if(response.status === 200){
            dispatch(resetUser());
            navigate('/');
        }
    }catch(error){
        throw error;
    }


}

export default Logout;