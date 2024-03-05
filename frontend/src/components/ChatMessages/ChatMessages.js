import { useDispatch, useSelector } from 'react-redux';
import Cm from './ChatMessages.module.css';
import { useNavigate } from 'react-router-dom';
import { setCurrentChat } from '../../store/chatSlice';
import { useEffect } from 'react';
import { setChats } from '../../store/chatSlice';
import { GetChats } from '../../api/internal';

const ChatMessages = () => {
    const currentID = useSelector((state) => { return state.user._id});
    useEffect(()=>{
        async function getchats() {
            try{
                let chatt = await GetChats(currentID);
                let chat = chatt.data.chat;
                dispatch(setChats(chat));
            }catch(error){
                console.log(error);
            }
        }
        getchats();
    },[]);
    const chats = useSelector((state) => { return state.chat.chats});
    const is_seen = true;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleClick(user_name,Chats) {
        dispatch(setCurrentChat(Chats))
        navigate(`/chat/${user_name}`);
    }

    
    const msnger = chats.map((m,i)=> {
        return m.messages.length > 1 && (<div className={Cm.info}>
            <div key={i}
                onClick={ ()=> handleClick(m.messenger,m)}
                style={{ backgroundColor: is_seen ? 'white' : 'rgb(243, 243, 243)' }}
                className={Cm.profileinfo}>
                <img src={m.photo} />
                <p><h>{m.messenger}</h> <br/> { m.messages[0] === undefined || null ? 'empty' : m.messages[m.messages.length - 1].message}</p>
            </div>
        </div>) 
    })
    

    return (<div className={Cm.parent}>
        <h3>messages</h3>
        {msnger}
    </div>)
}

export default ChatMessages;

/**
 * <div className={Cm.info}>
            <div
                onClick={() => handleClick(m.Chats.messenger)}
                style={{ backgroundColor: is_seen ? 'white' : 'rgb(243, 243, 243)' }}
                className={Cm.profileinfo}>
                <img src={m.Chats.photo} />
                <p><h>{m.Chats.messenger}</h> newMessage</p>
            </div>
        </div>
 */