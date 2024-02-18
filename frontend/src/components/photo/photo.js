import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import p from './photo.module.css';
import { useDispatch, useSelector } from 'react-redux';
import {signup , get_notifications}  from '../../api/internal'

import {setUser } from '../../store/userslice';
import { useNavigate } from 'react-router-dom';
import { setUserNotif , setSeen } from '../../store/notiSlice';

const Photo = (props) => {

  const dispatch = useDispatch();  
  const navigate = useNavigate();
  
  const [photo, setPhoto] = useState('');
  const [file, setFile] = useState(null);

  console.log(file);
  console.log('values', props.values)
  
  // Animation for sliding the photo to the selection area
  const slideAnimation = useSpring({
    opacity: photo ? 1 : 0,
    transform: `translateX(${photo ? 0 : -100}%)`,
  });

  // Animation for changing the upload button color
  const buttonColorAnimation = useSpring({
    backgroundColor: file ? '#FF0000' : '#000000',
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(selectedFile);
      setFile(selectedFile);
    }
  };

  function handleclose(){
    props.handleupload();
  }

  async function handleupload(){
    
    const data = {
      name: props.values.name,
      username: props.values.username,
      email: props.values.email,
      password: props.values.password,
      confirmPassword: props.values.confirmPassword,
      photo: photo
    }


    try {
      const responce = await signup(data);
      if (responce.status === 200) {
        console.log(responce.data.newuser);
        const user = {
          _id: responce.data.newuser._id,
          username: responce.data.newuser.username,
          auth: responce.data.newuser.auth,
          photo: responce.data.newuser.photo,
          name: responce.data.newuser.name
        }

        dispatch(setUser(user));
        navigate('/home');
        let notifs = await get_notifications(user.username);
        if (notifs.status === 200) {
          console.log(notifs.data.notis);
          const notification = notifs.data.notis.notification;
          dispatch(setUserNotif(notification));


          if (notification && notification.length > 0) {
            for (let i = 0; i < 4; i++) {
              if (notification[i].is_seen !== undefined && notification[i].is_seen === false) {
                dispatch(setSeen(false));
                console.log(i);
              }
            }
          }
        }

      }
      else if (responce.status !== 200) {
        console.log('error --> ', responce.data.error.message);
      }
    }catch(error){
      console.log(error);
    }
    
  }

  return (
    <div className={p.pp}>
    <div className={p.photo}>
      <div className={p.photoPrompt}>
        <p>Choose a photo</p>
        <span className={p.splabel}>
          {file ? <label htmlFor='ph'className={p.ilabel}>Replace Media</label> 
          : 
          <label htmlFor='ph'className={p.ilabel}>Select Media</label>
          }
          </span>
        <input
          type="file"
          name="photo"
          id="ph"
          style ={{display : 'none'}}
          accept="image/jpg, image/jpeg, image/png"
          onChange={handleFileChange}
        />
        <animated.button className={p.upbutton}
          style={buttonColorAnimation}
          onClick={() => {
            // Handle upload logic here
            handleupload();
            console.log('Upload button clicked');
          }}
        >
          Upload
        </animated.button>
        <animated.div style={slideAnimation} className={p.photoPreview}>
          {photo !== '' && <img src={photo} alt="Preview" width={350} height={250} style={{borderRadius : '20px'}} />}
        </animated.div>
        <div className={p.close}>
          <button onClick={handleclose}>close</button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Photo;
