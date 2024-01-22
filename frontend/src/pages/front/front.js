import fr from './front.module.css';
import Footer from '../../components/footer/footer';
import Login from '../../components/login sign/login-sign'
import Sign from '../../components/login sign/sign'

const Front = () => {
  return (
    <div className={fr.front}>
      <div className={fr.mainContent}>
        <Login />
        <Sign/>
      </div>
      <div className={fr.footer}>
        <Footer />
      </div>
    </div>
  );
}

export default Front;