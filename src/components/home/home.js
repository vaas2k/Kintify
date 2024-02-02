import {useNavigate } from 'react-router-dom';
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
      if(props.posts){
        setPosts(props.posts);
      }
      else if(props.tags){
        gettagsposts();
        props.handleReload(props.reload)
      }
      else{
        getposts()
      }

      

    }, [props.tags , props.posts])


    function handlesinglepost(item){
      dispatch(setPost(item));

      // if post was Clicked save the tags in session storage
      let getTags = window.sessionStorage.getItem('Post-Saw-tags');
      console.log('before --> ',getTags);
      if(getTags){
          getTags = JSON.parse(getTags);
      }else{
          getTags = [];
      }
      for(let i = 0; i < item.tags.length ; i++){
          getTags.push(item.tags[i]);
      }
      window.sessionStorage.setItem('Post-Saw-tags',JSON.stringify(getTags));

      console.log('after --> ',getTags);

      navigate(`/post/${item.id}`)
    }

  const newposts = post.map((item) => {
    return (<div 
      className={h.holdimg}
      
     >

      {item.video === 'null' ?
        (<img
        alt='nill'
          onClick={()=>handlesinglepost(item)}
          src={item.photo}
          className={h.postimg}
        ></img>)
        :
        (<video
        ref={videoRef}
          onClick={()=>handlesinglepost(item)}
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
      <Link to={`/profile/${item.authorname}`}><div className={h.pfp}><img alt='nill' src={item.authorphoto}/> <h>{item.authorname}</h></div></Link>
    </div>)
  })

  return (
    <div className={h.posts}>
      {newposts}
    </div>
  );
}


export default Home;