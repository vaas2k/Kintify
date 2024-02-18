import { useSelector , useDispatch } from "react-redux";
import { get_notifications } from "../api/internal";
import { setUserNotif } from "../store/userslice";
import { useEffect } from "react";

const useGetNotification = async () => {
    const currentuser = useSelector((state) => {return state.user});
    const dispatch = useDispatch();

    useEffect(()=>{
        
        async function getNoti(){
            try{
                let notifs = await get_notifications(currentuser.username);
                if(notifs.status === 200){
                    console.log(notifs.data.notis);
                    const notification = notifs.data.notis.notification;
                    dispatch(setUserNotif(notification));
                }else{
                    console.log(notifs.data);
                }
            }
            catch(error){
                console.log(error);
                return error;
            }

        }
        getNoti();
    },[])


}

export default useGetNotification;