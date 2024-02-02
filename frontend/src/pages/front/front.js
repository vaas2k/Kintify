import fr from './front.module.css';
import Footer from '../../components/footer/footer';
import Login from '../../components/login sign/login-sign'
import Sign from '../../components/login sign/sign'
import { useSelector } from 'react-redux';
import useAutoLogin from '../../hooks/autologin';
import { Hypnosis } from 'react-cssfx-loading';
import { useNavigate } from 'react-router-dom';

const Front = () => {
  
  const loading = useAutoLogin();
  const islogged = useSelector((state)=> { return state.user.auth});
  const showLog = useSelector((state) => { return state.log.login});
  const showsign = useSelector((state) => {return state.log.sign});
  const navigate = useNavigate();

  if(islogged){
    return (navigate('/home'));
  }
  else if(loading){
    return (<div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <Hypnosis color="red" className="hyp" />
    </div>)
  }
  else if(!islogged){
    return (<div className={fr.front}>
      <div className={fr.mainContent}>
        { !islogged && showLog && <Login />}
        { !islogged && showsign && <Sign/>}
      </div>
      <div className={fr.footer}>
        <Footer />
      </div>
    </div>)
  }
}

export default Front;