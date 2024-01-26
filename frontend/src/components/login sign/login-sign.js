import { Link, useNavigate } from 'react-router-dom';
import ls from './login-sign.module.css';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { togglelog , togglesign } from '../../store/logslic';
import {login} from '../../api/internal';
import { setUser } from '../../store/userslice';
import { useFormik } from 'formik';
import {logschema} from '../../schema/signschema';
import TextInput from '../textinput/textinput';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const toggleSignComp = () => { dispatch(togglesign())};
    const [logerror , setLogerror] = useState(false);

    const {values, handleChange , touched , handleBlur} = useFormik({
        initialValues : {
            username : '',
            password : ''
        },
        validationSchema : logschema
    })

    console.log(values)
    async function handleclick(e) {
        e.preventDefault();
        
        const log = {
            username : values.username,
            password : values.password
        }

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
        else if(responce.status !== 200 || responce.status === 409){
            setLogerror(true);
            console.log(responce.message);
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
                    <TextInput
                        type='password'
                        onChange={handleChange}
                        name='password'
                        value={values.password}
                        placeholder='password'
                        required
                    />

                </form>
                    {logerror && <p style={{fontSize:'10px' , color:'red'}}>username or password not matched</p>}
                    
                <div className={ls.logbutton}><button onClick={handleclick} type='submit'>Login</button></div>

                <div className={ls.signbutton}>
                    sign up instead ? <button onClick={toggleSignComp}>signup</button>
                </div>
            </div>
        </div>
    );
}


export default Login;