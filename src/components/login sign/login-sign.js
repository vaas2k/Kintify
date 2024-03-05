import { Link, useNavigate } from 'react-router-dom';
import ls from './login-sign.module.css';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { togglelog, togglesign } from '../../store/logslic';
import { login, get_notifications } from '../../api/internal';
import { setUser } from '../../store/userslice';
import { useFormik } from 'formik';
import { logschema } from '../../schema/signschema';
import TextInput from '../textinput/textinput';
import { setUserNotif, setSeen } from '../../store/notiSlice';
import { GetChats } from '../../api/internal';
import { setChats } from '../../store/chatSlice';
import { Eye } from 'lucide-react';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const toggleSignComp = () => { dispatch(togglesign()) };
    const [logerror, setLogerror] = useState(false);
    const [logmess, setLogmess] = useState('');
    const [show, setShow] = useState(false);

    const { values, handleChange, touched, handleBlur } = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        validationSchema: logschema
    })

    console.log(values)
    async function handleclick(e) {
        e.preventDefault();
        try{
            const log = {
                username: values.username,
                password: values.password
            }
    
            const responce = await login(log);
            if (responce.status === 200) {
                const user = {
                    username: responce.data.username,
                    _id: responce.data._id,
                    photo: responce.data.photo,
                    auth: responce.data.auth,
                    name: responce.data.name
                }
                console.log(responce.data);
                dispatch(setUser(user));
    
                navigate('/home');
                let notifs = await get_notifications(user.username);
                let chats = await GetChats(user._id);
                let chat = chats.data.chat;
                dispatch(setChats(chat));
                if (notifs.status === 200) {
                    console.log(notifs.data.notis);
                    const notification = notifs.data.notis.notification;
                    dispatch(setUserNotif(notification));
    
                    
                    if(notification && notification.length > 0) {
                            for (let i = 0; i < 4; i++) {
                                if (notification[i].is_seen !== undefined && notification[i].is_seen === false) {
                                    dispatch(setSeen(false));
                                    console.log(i);
                                }
                            }
                    }
                    
    
                } else {
                    console.log(notifs.data);
                }
            }
            else if (responce.status === 409) {
                setLogerror(true);
                setLogmess('username or password not matched')
                console.log(responce.message);
            } else if (responce.status === 500) {
                setLogerror(true);
                setLogmess('Server Error Please try later.')
                console.log(responce.message);
            }

        }catch(error){
            console.log(error);
            return error;
        }
    }

    return (
        <div className={ls.log}>

            <div className={ls.login}>

                <h2>Welcome to Kintify</h2>
                <form className={ls.logform}>

                    <h>Username</h>
                    <TextInput
                        type='text'
                        onChange={handleChange}
                        name='username'
                        value={values.username}
                        placeholder='username'
                        required
                    />

                    <h>Password</h>
                    <span className={ls.pas}>
                        <TextInput
                            type={show ? 'text' : `password`}
                            onChange={handleChange}
                            name='password'
                            value={values.password}
                            placeholder='password'
                            required
                        />
                        <div onClick={() => setShow(!show)}><Eye color={show ? 'red' : 'black'} width={'20px'} style={{ marginTop: '6px', marginLeft: '3px' }} className={ls.show} /></div>
                    </span>

                </form>
                {logerror && <p style={{ fontSize: '10px', color: 'red' }}>{logmess}</p>}

                <div className={ls.logbutton}><button onClick={handleclick} type='submit'>Login</button></div>

                <div className={ls.signbutton}>
                    sign up instead ? <button onClick={toggleSignComp}>signup</button>
                </div>
            </div>
        </div>
    );
}


export default Login;