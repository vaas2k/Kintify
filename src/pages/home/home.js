import home from './home.module.css';

import { useState , useEffect} from 'react';
const Home = () => {

    const [size , setSize] = useState({
        width : window.innerWidth,
        height: window.innerHeight
      })
    
      function handlesize(){
        setSize({ 
            width : window.innerWidth,
            height : window.innerHeight
          })
      }
    
      useEffect(()=>{
    
        window.addEventListener('resize',handlesize)
    
        return () => window.removeEventListener('resize', handlesize);
      },[])
    return (
        <div>
           Home
           <h2>{size.width}</h2>
        </div>
    );
}


export default Home;