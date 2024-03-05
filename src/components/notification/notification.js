import noti from './notification.module.css'
import GetNotification from '../../hooks/getnotifications';
import { useDispatch, useSelector } from 'react-redux';
import userEvent from '@testing-library/user-event';
import { useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { updateNoti} from '../../store/notiSlice';
import { singlePost } from '../../api/internal';
import { setPost } from '../../store/postSlice';
const Notification = (props) => {

    const dispatch = useDispatch();
    const notis = useSelector((state) => { return state.noti.notification });
    // clicking on notification marks it as seen
    async function handleSeen (id,on_post) {
        dispatch(updateNoti(id));
        try{
            let response = await singlePost(on_post);
            if(response.status === 200){
                dispatch(setPost(response.data.post))
            }
        }catch(error){
            return error;
        }
    }

    // rendering notification for user
    const renderNotification = notis.map((n) => {
        return (<div className={noti.info}>
            <Link
            style={{textDecoration:'none',color:'black'}} 
            onClick={()=> {handleSeen(n._id,n.on_post);}} 
            to={n.on_post ? `/post/${n.on_post}` : `/profile/${n.SenderName}`}
            >
                <div
                style={{backgroundColor : n.is_seen ? 'white' : 'rgb(243, 243, 243)'}} 
                className={noti.profileinfo}>
                    <img src={n.photo} />
                    <p><h>{n.SenderName}</h> {n.Message}</p>
                </div>
            </Link>
        </div>)
    })

    return (<div className={noti.parent}>
        <h3>Notifications</h3>
        {renderNotification}
    </div>)
}


export default Notification;