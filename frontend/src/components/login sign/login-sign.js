import { Link } from 'react-router-dom';
import ls from './login-sign.module.css';
import { useState } from 'react';

const Login = () => {

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

    function handlechange(e) {
        e.preventDefault();

        
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

                <div className={ls.logbutton}><button onClick={handlechange} type='submit'>Login</button></div>

                <div className={ls.signbutton}>
                    sign up instead ? <Link to={'/sign'}><button>signup</button></Link>
                </div>
            </div>
        </div>
    );
}


export default Login;