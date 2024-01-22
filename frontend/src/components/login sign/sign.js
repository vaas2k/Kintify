
import s from './sign.module.css';

import { useState } from 'react';
import { UseDispatch, useDispatch } from 'react-redux';
import { setUser, resetUser } from '../../store/userslice';
import { Link } from 'react-router-dom';

const Sign = () => {


    const Dispatch = useDispatch();
    const [sign , setSign] = useState({
        _id : 'asdasdadad',
        name : '',
        username : '',
        email : '',
        password : '',
        confirm_password : '',
        auth : true
    })


    function handlesign(){

        const user = sign;
        Dispatch(setUser(sign));
    }


    console.log(sign)
    function signchange(e){
        e.preventDefault();

        setSign(oldSign => {
            const {name , value} = e.target;
            return{
                ...oldSign,
                [name] : value
            }
        })
    }

    return(
        <div className={s.sign}>
            
            <div className={s.signin}>

                <h2>Welcome to Kintify</h2>
                <form className={s.signform}>

                    <h>Name</h>
                    <input
                    type='text'
                    onChange={signchange}
                    name='name'
                    value={sign.name}
                    placeholder='name'
                    required
                    />
                    
                    <h>Username</h>
                    <input 
                    type='text'
                    onChange={signchange}
                    name='username'
                    value={sign.username}
                    placeholder='username'
                    required
                    />

                    <h>Email</h>
                    <input 
                    type='email'
                    onChange={signchange}
                    name='email'
                    value={sign.email}
                    placeholder='Abc@domain.com'
                    required
                    />

                    <h>Password</h>
                    <input 
                    type='password'
                    onChange={signchange}
                    name='password'
                    value={sign.password}
                    placeholder='password'
                    required
                    />

                    <h>Confirm Password</h>
                    <input 
                    type='password'
                    onChange={signchange}
                    name='confirm_password'
                    value={sign.confirm_password}
                    placeholder='password'
                    required
                    />
                </form>

                <div className={s.signbutton}><button onClick={handlesign}>Sign in</button></div>

                <div className={s.logbutton}>
                    Already registered ? <Link to={'/login'}><button>login</button></Link>
                </div>
            </div>
        </div>
    );
}

export default Sign;