import React, { useEffect, useState, useRef } from 'react';
import i from '../../images/noooaccc.png'

import n from './navbar.module.css';
import { Bell, LogOut, ChevronDownCircle, Home, BellRing, MessageCircleMore , BadgeInfo } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import DropDown from '../dropdown/dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { togglelog, togglesign } from '../../store/logslic';
import Logout from '../../hooks/logout';
import { logout, updatenotifications } from "../../api/internal";
import { resetUser } from "../../store/userslice";
import Notification from '../notification/notification';
import { resetNoti ,setSeen } from '../../store/notiSlice';
import ChatMessages from '../ChatMessages/ChatMessages';
import { resetChats } from '../../store/chatSlice';
import { GetChats } from '../../api/internal';
import { setChats } from '../../store/chatSlice';
import { resetPost } from '../../store/postSlice';

const Search = () => {
  return (
    <div className={n.search}>
      <input
        className={n.searchInput}
        type='text'
        placeholder='Search'
      />
    </div>
  );
};

const Navbar = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const seen = useSelector((state) => { return state.noti.is_seen})

  const profileimage = useSelector((state) => { return state.user.photo })
  const islogged = useSelector((state) => { return state.user.auth });
  const username = useSelector((state) => { return state.user.username });
  const currentID = useSelector((state) => { return state.user._id });
  console.log(username);
  const notification = useSelector((state) => {
    return state.noti.notification.map(item => {
      if(item.is_seen === true){
        return { _id : item._id, is_seen : item.is_seen } 
      }
    }
    )
  });  
  // handle notifcation componenet
  const [showNoti, setShowNoti] = useState(false);
  const togglenoti = (showNoti) => { 
    setShowNoti(!showNoti);
    dispatch(setSeen(true));
  }

  //handle messsages notifications
  const [showMsg, setShowMsg] = useState(false);
  const toggleMsg = (showMsg) => { 
    setShowMsg(!showMsg);
    dispatch(setSeen(true));
  }

  // handle the logout 
  const data = {
    username: username,
    notification: notification
  }
  async function handlelogout() {
    try {
      await updatenotifications(data);
      const response = await logout();
      if (response.status === 200) {
        dispatch(resetUser());
        dispatch(resetNoti());
        dispatch(resetChats());
        dispatch(resetPost())
        navigate('/');
      }
    } catch (error) {
      throw error;
    }
  }
  //------------------------------------------------------>>>>

  // shows and unshow dropmenu
  const [menu, setMenu] = useState(false);
  const [menu1, setMenu1] = useState(false);
  const toggleMenu = () => setMenu(!menu);
  const toggleMenu1 = () => setMenu1(!menu1);

  // shows login and signup component when not logged in
  const toggleLoginComp = () => { dispatch(togglelog()) };
  const toggleSignComp = () => { dispatch(togglesign()) };
  const dropDownRef = useRef(null);

  function handleClickOutSide(event) {
    if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
      setMenu(false);
      setMenu1(false);
      setShowNoti(false);
      setShowMsg(false);
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutSide);
    return () => document.removeEventListener('click', handleClickOutSide);
  }, [])
  //------------------------------------------------>>>>


  //---------------> use for handling responciveness 
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const handleSize = () => {
    setSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };
  useEffect(() => {
    window.addEventListener('resize', handleSize);
    return () => window.removeEventListener('resize', handleSize);
  }, []);
  //------------------------------------------------------>>>>

  // render left section of navabar
  const renderLeftSection = () => {
    if (size.width > 986) {
      return (
        <div className={n.left}>
          {islogged && <Link to={'/home'}><button><h>Following</h></button></Link>}
          {islogged && <Link to={'/home'}><button><h>Home</h></button></Link>}
          {islogged && <Link to={'/create'}><button><h>Create</h></button></Link>}
          {!islogged && <Link to={'/explore'}><button><h>Explore</h></button></Link>}
        </div>
      );
    } else {
      return (
        <div>
          <button onClick={toggleMenu} style={menu ? { ...h_style } : { ...n_style }}><Home /></button>
          {menu && <DropDown
            s1={islogged && <Link to={'/home'}><button><h>Home</h></button></Link>}
            s2={islogged && <Link to={'/create'}><button><h>Create</h></button></Link>}
            s3={!islogged && <Link to={'/explore'}><button><h>Explore</h></button></Link>}
            s4={islogged && <Link to={'/home'}><button><h>Following</h></button></Link>}
          />}
        </div>
      );
    }
  };
  //------------------------------------------------------>>>>


  // render Right section of navabar
  const renderRightSection = () => {
    if (size.width > 986) {
      return (
        <div className={n.right} >
          {islogged ? (
            <>
              <button onClick={() => togglenoti(showNoti)}>
                {seen === false && <BadgeInfo
                style={{
                  width:'10px',
                  position : 'absolute',
                  top : '25px',
                  color : 'red'
                }} 
                />}
                <Bell width={'20px'} /></button>
              <button onClick={() => toggleMsg(showMsg)}  ><MessageCircleMore width={'20px'} /></button>
              <button onClick={() => handlelogout()}><LogOut width={'20px'} /></button>
            </>
          ) : (
            <>
              <Link to={'/'}><button onClick={toggleLoginComp}><h>Login</h></button></Link>
              <Link to={'/'}><button onClick={toggleSignComp}><h>Signup</h></button></Link>
            </>
          )}
        </div>
      );
    } else {
      return (
        <div>
          <button className={n.arrow} onClick={toggleMenu1} style={menu1 ? { ...h_style } : { ...n_style }} ><ChevronDownCircle /></button>
          {menu1 && (
            <DropDown
              type='icons'
              s1={islogged ? <button onClick={() => togglenoti(showNoti)}><Bell /></button> : <Link to={'/'}><button onClick={toggleLoginComp}><h>Login</h></button></Link>}
              s2={islogged ? <button onClick={() => toggleMsg(showMsg)} ><MessageCircleMore width={'20px'} /></button> : <Link to={'/'}><button onClick={toggleSignComp}><h>Signup</h></button></Link>}
              s3={islogged && <button onClick={handlelogout}><LogOut /></button>}
            />
          )}
        </div>
      );
    }
  };
  //------------------------------------------------------>>>>
  

  const h_style = {
    backgroundColor: '#373636',
    color: 'white'
  };
  const n_style = {
    backgroundColor: 'white',
    color: '#373636'
  };

  return (
    <div className={n.nav} ref={dropDownRef}>
      {!islogged ? (<Link to={'/'}><img src={require('../../images/Kintify.png')} className={n.navimg} alt='Logo' /></Link>)
        :
        (<Link to={'/home'}><img src={require('../../images/Kintify.png')} className={n.navimg} alt='Logo' /></Link>)}
      <div className={n.navbar}>
        {renderLeftSection()}
        <div className={n.mid}>
          <Search />
        </div>
        {renderRightSection()}
        {showNoti && <Notification  togglenoti={() => togglenoti(showNoti)} />}
        {showMsg && <ChatMessages  toggleMsg={() => toggleMsg(showMsg)} />}
      </div>
      <Link to={`/profile/${username}`}><img src={profileimage ? profileimage : require('../../images/noooaccc.png')} className={n.proimg} alt='Profile' /></Link>
    </div>
  );
};

export default Navbar;
