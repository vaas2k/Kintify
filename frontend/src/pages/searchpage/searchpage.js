import s from './searchpage.module.css';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import Home from '../../components/home/home';
import { getQueryData } from '../../api/internal';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { SafetyCheck } from '@mui/icons-material';
import { unmountComponentAtNode } from 'react-dom';


const SearchPage = () => {

  const currentID = useSelector((state)=> {return state.user._id});
  const params = useParams();
  const [ShowProfiles , setProfile] = useState(false);
  const [ShowPosts , setPost] = useState(true);
  const [check , setCheck] = useState(false);
  const [posts , setPosts] = useState([]);
  const [Profiles, setProfiles] = useState([]); 
  const followings = useSelector((state)=> {return state.user.
  followings})

  console.log(params.id);
  useEffect(()=>{
    
    async function getData(){
      try{
        const data = {userID : currentID, id:params.id}
        const response = await getQueryData(data);
        if(response.status === 200) {
          setPosts(response.data.newPosts);
          setProfiles(response.data.Profiles)
          console.log(response.data);
        }
        else if( response.status === 404){
          // show data not found
        }
        else{
          // show bad request from server
          // try later in several mins
        }
      }catch(error){
        console.log(error);
      }
    }
    getData();
  },[params.id])

  let renderProfiles = [];
  let exist;
  try{
    renderProfiles = Profiles.map((item)=>{
      // check if current user alread followed or not
      exist = followings.some((s) => {
        return s.Username === item.username;
      });
     return(
      <Link style={{textDecoration:'none',color:'black'}} to={`/profile/${item.username}`}>
      <div className={s.ShowProfiles}>
          <div className={s.profile}>
            <div className={s.profile_background}
             style={{ backgroundImage: `url(${require('../../images/332106430_723193776136659_5725300635769288019_n.jpg')})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
            <img
             src={item.photoPath}
            />
            <p className={s.p1}>{item.name}</p>
            <p className={s.p2}>{item.username}</p>
            <p className={s.h11}>1.2k &nbsp;&nbsp; Followers <button className={s.follow_button}>{exist === true ? 'Following' : 'Follow'}</button></p>
            
          </div>
      
        </div> 
      </Link>
     
     ) 
    })
  }catch(error){
    console.log(error);
  }

  return (
    <div className={s.parent}>
      <div className={s.post_profile_buttons}>
        <button onClick={()=>{setProfile(true) ;setPost(false)}} className={ShowProfiles ? s.pp_buttons_clicked : s.pp_buttons}><SupervisorAccountIcon /> Profiles</button>
        <button onClick={()=>{setPost(true) ;setProfile(false)}} className={ShowPosts ? s.pp_buttons_clicked : s.pp_buttons}><DynamicFeedIcon /> Posts</button>
      </div>

      {ShowProfiles &&
        <div className={s.containAll}>
          {renderProfiles}
      </div>
      }


      {ShowPosts && <div className={s.containPosts}>
        <Home posts={posts} />
      </div>}
    </div>
  );
}


export default SearchPage;

