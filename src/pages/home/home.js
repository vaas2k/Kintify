import { Navigate, useNavigate } from 'react-router-dom';
import h from './home.module.css';
import { Link } from 'react-router-dom';
import { getallPosts , similar_tags_posts } from '../../api/internal';
import { useRef } from 'react';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPost} from '../../store/postSlice';

const Home = (props) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const videoRef = useRef();
  const [post, setPosts] = useState([]);

    useEffect(() => {
      async function getposts() {
        let response = await getallPosts();
        if (response.status === 200) {
          setPosts(response.data);
        } else if (response.status !== 200) {
          console.log(response.message);
        }
      }
      async function gettagsposts() {
        const data = {
          tags : props.tags,
          id : props.id
        }
        let response = await similar_tags_posts(data);
        if (response.status === 200) {
          setPosts(response.data.newposts);
        } else if (response.status !== 200) {
          console.log(response.message);
        }
      }
      if(!props.tags){
        getposts()
      }else{
        gettagsposts();
        props.handleReload(props.reload)
      }

      window.sessionStorage.setItem('tags',JSON.stringify(props.tags));

    }, [props.tags])


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