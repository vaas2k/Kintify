import { Navigate, useNavigate } from 'react-router-dom';
import h from './home.module.css';
import { Link } from 'react-router-dom';
import { getallPosts } from '../../api/internal';
import { useRef } from 'react';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPost} from '../../store/postSlice';

const Home = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const videoRef = useRef();
  // if    photoPath == 'null' display video
  // elif  videoPath == 'null' display image
  const mediaType = 'video'
  const [post, setPosts] = useState([]);



    useEffect(() => {
      async function getblogs() {
        let response = await getallPosts();
        if (response.status === 200) {
          setPosts(response.data);
        } else if (response.status !== 200) {
          console.log(response.message);
        }
      }
      getblogs();
    }, [])


    function handlesinglepost(item){
      dispatch(setPost(item));
      navigate(`/post/${item.id}`)
    }

  const newposts = post.map((item) => {
    return (<div 
      className={h.holdimg}
      onClick={()=>handlesinglepost(item)}
     >

      {item.video === 'null' ?
        (<img
          src={item.photo}
          className={h.postimg}
        ></img>)
        :
        (<video
        ref={videoRef}
          loop
          muted="muted"
          onMouseEnter={(e) => e.target.play()}
          onMouseLeave={(e) => e.target.pause()}
          className={h.postvid}
          
        >
          <source src={item.video} type={'video/mp4'} />
          Your browser does not support the video tag.
        </video>)
      }
    </div>)
  })

  return (
    <div className={h.posts}>
      {newposts}
    </div>
  );
}


export default Home;