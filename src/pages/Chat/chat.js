import { useEffect, useState, useRef, useDebugValue } from 'react';
import ch from './chat.module.css';
import { Send, PlusCircleIcon } from 'lucide-react';
import useSocket from '../../api/socket';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { resetCurrentChat, updatemessages } from '../../store/chatSlice';
import { storeMessages } from '../../api/internal';
import { Link } from 'react-router-dom';

const Chat = () => {
    const dispatch = useDispatch();

    const params = useParams();
    const socket = useSocket();
    const [socketID, setSocketID] = useState();
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);
    const currentUser = useSelector((state) => state.user);
    const messenger = useSelector((state) => state.chat.currentChat);
    const [allMessages, setAllMessages] = useState([...messenger.messages]);
    const [newMessages , setNewMessages] = useState([])
    const roomID = messenger.roomID;

    // Function to handle message submission
    const handleMessageSend = (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        // Only send the message if it's not empty
        if (message.trim() !== '') {
            const data = {
                roomID: roomID,
                messageBox : messenger.messageBox,
                sender: currentUser.username,
                message: message
            };
            socket.emit('msg', data);
            setAllMessages((oldMessages) => [...oldMessages, data]);
            setNewMessages((oldMessages) => [...oldMessages, data]);

            const msg = {
                sender : currentUser.username,
                message : message
            }
            dispatch(updatemessages(msg));
            setMessage(''); // Clear the message input field
        }
        
    };

    useEffect(() => {
        socket.on('connect', () => {
            setSocketID(socket.id);
            console.log(`User Connected - ${socketID}`);
        });

        socket.emit('join-room', roomID);

        // Cleanup function to remove event listener when component unmounts
        return () => {
            socket.off('connect');
        };
    }, [socket, roomID, socketID]);

    useEffect(() => {
        socket.on('r_msg', (receivedMessage) => {
            console.log(receivedMessage);
            setAllMessages((oldMessages) => [...oldMessages, receivedMessage]);
            setNewMessages((oldMessages) => [...oldMessages, receivedMessage]);
            const msg = {
                sender : receivedMessage.sender,
                message : receivedMessage.message
            }
            dispatch(updatemessages(msg));
        });

        // Cleanup function to remove event listener when component unmounts
        return async () => {
            socket.off('r_msg');
            dispatch(resetCurrentChat());
        };
    }, [socket]);

    useEffect(() => {
        setAllMessages(messenger.messages);
        scrollToBottom();
    }, [messenger]);

    useEffect(() => {
        scrollToBottom();
    }, [allMessages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    console.log(newMessages);
    return (
        <div className={ch.parent}>
            <div className={ch.middlebar}>
                <div className={ch.containuserbar}>
                    <Link to={`/profile/${params.id}`}>
                         <img src={messenger.photo} alt="Profile" />
                    </Link>
                         <h3>{messenger.messenger}</h3>
                </div>
                <div className={ch.messageslist}>
                {allMessages.map(m => {
                        return (
                            <>
                                {m.sender !== currentUser.username ? (<div className={ch.msg}>
                                    <div className={ch.usermsg}>
                                        <img
                                            src={messenger.photo}
                                            style={{ width: '30px' ,borderRadius:'20px'}}
                                        />
                                        <p>{m.message}</p>
                                    </div>
                                </div>)
                                    :
                                    (<div className={ch.msg2}>
                                        <div className={ch.usermsg}>
                                            <p>{m.message}</p>
                                        </div>
                                    </div>)}
                                <div ref={messagesEndRef} />
                            </>
                        )
                    })}
                    <div ref={messagesEndRef} />
                </div>
                <div className={ch.messageBox}>
                    <img
                        style={{ width: '40px', borderRadius: '20px' }}
                        src={currentUser.photo}
                        alt="Profile"
                    />
                    <input
                        placeholder="Write your message"
                        className={ch.msginput}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleMessageSend(e);
                            }
                        }}
                    />
                    <PlusCircleIcon className={ch.send} />
                    <Send onClick={handleMessageSend} className={ch.send} />
                </div>
            </div>
        </div>
    );
};

export default Chat;
