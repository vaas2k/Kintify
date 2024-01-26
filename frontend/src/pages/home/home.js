import h from './home.module.css';

import { useState, useEffect } from 'react';
const Home = () => {

  const mediaType = 'image';

  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  function handlesize() {
    setSize({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }

  useEffect(() => {

    window.addEventListener('resize', handlesize)

    return () => window.removeEventListener('resize', handlesize);
  }, [])
  return (
    <div className={h.posts}>
      <div className={h.holdimg}>
        {mediaType === 'image' ? (<img src={require('../../images/6d2a0a82f57a6bbc829f6d882abb35fa.jpg')} className={h.postimg}></img>)
         :
         (<video></video>)
         }
        
      </div>
      <div className={h.holdimg}>
        {mediaType === 'image' ? (<img src={require('../../images/6d2a0a82f57a6bbc829f6d882abb35fa.jpg')} className={h.postimg}></img>)
         :
         (<video></video>)
         }
        
      </div>
      <div className={h.holdimg}>
        {mediaType === 'image' ? (<img src={require('../../images/6d2a0a82f57a6bbc829f6d882abb35fa.jpg')} className={h.postimg}></img>)
         :
         (<video></video>)
         }
        
      </div>
      <div className={h.holdimg}>
        {mediaType === 'image' ? (<img src={require('../../images/6d2a0a82f57a6bbc829f6d882abb35fa.jpg')} className={h.postimg}></img>)
         :
         (<video></video>)
         }
        
      </div>
      <div className={h.holdimg}>
        {mediaType === 'image' ? (<img src={require('../../images/6d2a0a82f57a6bbc829f6d882abb35fa.jpg')} className={h.postimg}></img>)
         :
         (<video></video>)
         }
        
      </div>
      <div className={h.holdimg}>
        {mediaType === 'image' ? (<img src={require('../../images/6d2a0a82f57a6bbc829f6d882abb35fa.jpg')} className={h.postimg}></img>)
         :
         (<video></video>)
         }
        
      </div>
      <div className={h.holdimg}>
        {mediaType === 'image' ? (<img src={require('../../images/6d2a0a82f57a6bbc829f6d882abb35fa.jpg')} className={h.postimg}></img>)
         :
         (<video></video>)
         }
        
      </div>
      <div className={h.holdimg}>
        {mediaType === 'image' ? (<img src={require('../../images/6d2a0a82f57a6bbc829f6d882abb35fa.jpg')} className={h.postimg}></img>)
         :
         (<video></video>)
         }
        
      </div>
      <div className={h.holdimg}>
        {mediaType === 'image' ? (<img src={require('../../images/6d2a0a82f57a6bbc829f6d882abb35fa.jpg')} className={h.postimg}></img>)
         :
         (<video></video>)
         }
        
      </div>
      <div className={h.holdimg}>
        {mediaType === 'image' ? (<img src={require('../../images/6d2a0a82f57a6bbc829f6d882abb35fa.jpg')} className={h.postimg}></img>)
         :
         (<video></video>)
         }
        
      </div>

    </div>
  );
}


export default Home;