import React, { useEffect, useState } from 'react';
import n from './navbar.module.css';
import { Bell, ChevronDownCircle, Home, BellRing, MessageCircleMore } from 'lucide-react';
import { Link } from 'react-router-dom';
import DropDown from '../dropdown/dropdown';
import { UseSelector, useSelector } from 'react-redux';

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
  const islogged = false;
  const [menu, setMenu] = useState(false);
  const [menu1, setMenu1] = useState(false);
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const toggleMenu = () => setMenu(!menu);
  const toggleMenu1 = () => setMenu1(!menu1);

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

  const renderLeftSection = () => {
    if (size.width > 915) {
      return (
        <div className={n.left}>
          <Link to={'/home'}><button><h>Home</h></button></Link>
          <Link to={'/create'}><button><h>Create</h></button></Link>
        </div>
      );
    } else {
      return (
        <div>
          <button onClick={toggleMenu} style={menu ? { ...h_style } : { ...n_style }}><Home /></button>
          {menu && <DropDown
            s1={<Link to={'/home'}><button><h>Home</h></button></Link>}
            s2={<Link to={'/create'}><button><h>Create</h></button></Link>}
          />}
        </div>
      );
    }
  };

  const renderRightSection = () => {
    if (size.width > 915) {
      return (
        <div className={n.right}>
          {islogged ? (
            <>
              <button><Bell /></button>
              <button><MessageCircleMore /></button>
            </>
          ) : (
            <>
              <Link to={'/login'}><button><h>Login</h></button></Link>
              <Link to={'/sign'}><button><h>Signup</h></button></Link>
            </>
          )}
        </div>
      );
    } else {
      return (
        <div>
          <button onClick={toggleMenu1} style={menu1 ? { ...h_style } : { ...n_style }}><ChevronDownCircle /></button>
          {menu1 && (
            <DropDown
              s1={islogged ? <button><Bell /></button> : <Link to={'/login'}><button><h>Login</h></button></Link>}
              s2={islogged ? <button><MessageCircleMore /></button> : <Link to={'/signup'}><button><h>Signup</h></button></Link>}
            />
          )}
        </div>
      );
    }
  };

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
      <Link to={'/'}><img src={require('../../images/Kintify.png')} className={n.navimg} alt='Logo' /></Link>
      <div className={n.navbar}>
        {renderLeftSection()}
        <div className={n.mid}>
          <Search />
        </div>
        {renderRightSection()}
      </div>
      <Link to={'/profile'}><img src={require('../../images/6d2a0a82f57a6bbc829f6d882abb35fa.jpg')} className={n.proimg} alt='Profile' /></Link>
    </div>
  );
};

export default Navbar;
