import React, { useEffect, useState } from 'react';
import i from '../../images/noooaccc.png'

import n from './navbar.module.css';
import { Bell, LogOut, ChevronDownCircle, Home, BellRing, MessageCircleMore } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import DropDown from '../dropdown/dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { togglelog , togglesign } from '../../store/logslic';
import Logout from '../../hooks/logout';
import { logout } from "../../api/internal";
import { resetUser } from "../../store/userslice";

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
  const profileimage = useSelector((state) => { return state.user.photo})
  const islogged = useSelector((state) => { return state.user.auth});
  
  // handle the logout 
  async function handlelogout(){
    try{
      const response = await logout();
      if(response.status === 200){
          dispatch(resetUser());
          navigate('/');
      }
  }catch(error){
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
  const toggleLoginComp = () => { dispatch(togglelog())};
  const toggleSignComp = () => { dispatch(togglesign())};
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
    if (size.width > 915) {
      return (
        <div className={n.left}>
         { islogged && <Link to={'/home'}><button><h>Home</h></button></Link>}
         { islogged && <Link to={'/create'}><button><h>Create</h></button></Link>}
         { !islogged && <Link to={'/explore'}><button><h>Explore</h></button></Link>}
        </div>
      );
    } else {
      return (
        <div>
          <button onClick={toggleMenu} style={menu ? { ...h_style } : { ...n_style }}><Home /></button>
          {menu && <DropDown
           s1 = { islogged && <Link to={'/home'}><button><h>Home</h></button></Link>}
           s2 = { islogged && <Link to={'/create'}><button><h>Create</h></button></Link>}
           s3 = { !islogged && <Link to={'/explore'}><button><h>Explore</h></button></Link>}
          />}
        </div>
      );
    }
  };
  //------------------------------------------------------>>>>


  // render Right section of navabar
  const renderRightSection = () => {
    if (size.width > 915) {
      return (
        <div className={n.right}>
          {islogged ? (
            <>
              <button><Bell /></button>
              <button><MessageCircleMore /></button>
              <button onClick={() => handlelogout()}><LogOut /></button>
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
              s1={islogged ? <button><Bell /></button> : <Link to={'/'}><button onClick={toggleLoginComp}><h>Login</h></button></Link>}
              s2={islogged ? <button><MessageCircleMore /></button> : <Link to={'/'}><button onClick={toggleSignComp}><h>Signup</h></button></Link>}
              s3={islogged && <button onClick={handlelogout}><LogOut /></button> }
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
    <div className={n.nav}>
      { !islogged ? (<Link to={'/'}><img src={require('../../images/Kintify.png')} className={n.navimg} alt='Logo' /></Link>)
      :
      (<Link to={'/home'}><img src={require('../../images/Kintify.png')} className={n.navimg} alt='Logo' /></Link>)}
      <div className={n.navbar}>
        {renderLeftSection()}
        <div className={n.mid}>
          <Search />
        </div>
        {renderRightSection()}
      </div>
      <Link to={'/profile'}><img src={ profileimage ? profileimage : require('../../images/noooaccc.png')} className={n.proimg} alt='Profile' /></Link>
    </div>
  );
};

export default Navbar;
