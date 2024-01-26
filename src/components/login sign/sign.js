
import s from './sign.module.css';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import {signschema} from '../../schema/signschema'
import TextInput from '../textinput/textinput';
import Photo from '../photo/photo';
import { togglelog } from '../../store/logslic';


const Sign = () => {


    const toggleLoginComp = () => { dispatch(togglelog())};

    const [showupload, setupload] = useState(false);
    const dispatch = useDispatch();

    function handlesign(e) {
        e.preventDefault();
        setupload(!showupload);
    }

    function handleupload(){
        setupload(!showupload);
    }
    const { values, touched, handleBlur, handleChange, errors } = useFormik({
        initialValues: {
            name: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },

        validationSchema: signschema,
    });
    return (
        <>
            <div className={s.sign}>
            <div className={s.signin}>

                <h2>Welcome to Kintify</h2>
                <form className={s.signform}  onSubmit={handlesign}>

                    <h>Name</h>
                    <TextInput
                        type='text'
                        name='name'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.name}
                        placeholder='name'
                        error={errors.name && touched.name ? 1 : undefined}
                        errormessage={errors.name}
                    />

                    <h>Username</h>
                    <TextInput
                        type='text'
                        name='username'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.username}
                        placeholder='username'
                        error={errors.username && touched.username ? 1 : undefined}
                        errormessage={errors.username}
                    />

                    <h>Email</h>
                    <TextInput
                        type='email'
                        name='email'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                        placeholder='email'
                        error={errors.email && touched.email ? 1 : undefined}
                        errormessage={errors.email}
                    />

                    <h>Password</h>
                    <TextInput
                        type='password'
                        name='password'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                        placeholder='password'
                        error={errors.password && touched.password ? 1 : undefined}
                        errormessage={errors.password}
                    />

                    <h>Confirm Password</h>
                    <TextInput
                        type='password'
                        name='confirmPassword'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.confirmPassword}
                        placeholder='confirmPassword'
                        error={errors.confirmPassword && touched.confirmPassword ? 1 : undefined}
                        errormessage={errors.confirmPassword}
                    />

                <div className={s.signbutton}><button type='submit'
                disabled={
                    !values.username ||
                    !values.password ||
                    !values.name ||
                    !values.confirmPassword ||
                    !values.email ||
                    errors.username ||
                    errors.password ||
                    errors.confirmPassword ||
                    errors.name ||
                    errors.email
                  }
                >Sign in</button></div>
                </form>


                <div className={s.logbutton}>
                    Already registered ? <button onClick={toggleLoginComp} >login</button>
                </div>
            </div>
        </div>
        {showupload && <Photo values={values} handleupload={handleupload}/>}
            </>
            
    );
}

export default Sign;





/*
 const [sign , setSign] = useState({
        _id : 'asdasdadad',
        name : '',
        username : '',
        email : '',
        password : '',
        confirmPassword : '',
        auth : true
    })
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

*/