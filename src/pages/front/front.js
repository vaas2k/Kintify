import fr from './front.module.css';
import Footer from '../../components/footer/footer';
import Login from '../../components/login sign/login-sign'
import Sign from '../../components/login sign/sign'
import { useSelector } from 'react-redux';

const Front = () => {

  const islogged = useSelector((state)=> { return state.user.auth});
  const showLog = useSelector((state) => { return state.log.login});
  const showsign = useSelector((state) => {return state.log.sign});
  return (
    <div className={fr.front}>
      <div className={fr.mainContent}>
        { showLog && <Login />}
        { showsign && <Sign/>}
      </div>
      <div className={fr.footer}>
        <Footer />
      </div>
    </div>
  );
}

export default Front;