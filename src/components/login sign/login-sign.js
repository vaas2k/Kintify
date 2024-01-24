import { Link, useNavigate } from 'react-router-dom';
import ls from './login-sign.module.css';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { togglelog , togglesign } from '../../store/logslic';
import {login} from '../../api/internal';
import { setUser } from '../../store/userslice';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const toggleSignComp = () => { dispatch(togglesign())};

    const [log, setLog] = useState({
        username: '',
        password: ''
    })

    console.log(log);
    function logchange(e) {


        setLog(oldLog => {
            const { name, value } = e.target;
            return {
                ...oldLog,
                [name]: value
            }
        })
    }

    async function handleclick(e) {
        e.preventDefault();
        
        const responce = await login(log);
        if(responce.status === 200){
            const user = {
                username : responce.data.username,
                _id : responce.data._id,
                photo : responce.data.photo,
                auth : responce.data.auth
            }
            console.log(responce.data);
            dispatch(setUser(user));
            navigate('/home');
        }
        else if(responce.status !== 200){
            console.log(responce.data);
        }
    }

    return (
        <div className={ls.log}>

            <div className={ls.login}>

                <h2>Welcome to Kintify</h2>
                <form className={ls.logform}>

                    <h>Username</h>
                    <input
                        type='text'
                        onChange={logchange}
                        name='username'
                        value={log.username}
                        placeholder='username'
                        required
                    />

                    <h>Password</h>
                    <input
                        type='password'
                        onChange={logchange}
                        name='password'
                        value={log.password}
                        placeholder='password'
                        required
                    />

                </form>

                <div className={ls.logbutton}><button onClick={handleclick} type='submit'>Login</button></div>

                <div className={ls.signbutton}>
                    sign up instead ? <button onClick={toggleSignComp}>signup</button>
                </div>
            </div>
        </div>
    );
}


export default Login;