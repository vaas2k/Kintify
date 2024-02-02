import './App.css';

import Navbar from './components/Navbar/navbar';
import Login from './components/login sign/login-sign';
import Sign from './components/login sign/sign';
import Home from './components/home/home';
import Feed from './pages/feeds/feeds';
import Create from './pages/create/create';
import Profile from './pages/profile/profile';
import { Routes, Route, BrowserRouter} from 'react-router-dom';
import Explore from './pages/explore/explore';
import Front from './pages/front/front';
import Photo from './components/photo/photo';
import useAutoLogin from './hooks/autologin';
import { Protected,} from './components/protected/protected'
import { useSelector } from 'react-redux';
import { useEffect,} from 'react';
import SinglePost from './pages/singlePost/singlePost';


const App = () => {

  useEffect(()=>{
    window.localStorage.setItem('post',JSON.stringify({message : 'lmaow'}));
  },[])

  const isAuth = useSelector((state) => { return state.user.auth });
  useAutoLogin();

  let errorredirect;
  if(isAuth){
    errorredirect = '/home'
  }else{
    errorredirect = '/'
  }

  //useTags();
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <BrowserRouter>
        <Navbar />
        <Routes >
          <Route path="*" element={
            <div style={{ textAlign: 'center' }}>
              <h1>Error 404</h1>
              <a href={errorredirect}>go back</a>
            </div>
          } />
          <Route path='/' element={<Front />} />

          <Route path="/home" element={<Protected isAuth={isAuth}><Home /></Protected>} />

          <Route path="/login" element={<Login />} />

          <Route path="/sign" element={<Sign />} />

          <Route path="/feed" element={<Feed />} />

          <Route path={`/profile/:username`} element={<Protected isAuth={isAuth}><Profile /></Protected>} />

          <Route path="/create" element={<Protected isAuth={isAuth}><Create /></Protected>} />

          <Route path="/explore" element={<Explore />} />

          <Route path="/image" element={<Protected isAuth={isAuth}><Photo /></Protected>} />
          <Route path="/post/:id" element={<Protected isAuth={isAuth}><SinglePost /></Protected>}/>

        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;

// Features to Add : 
/*

() => Save the post
{

 show save button on the post 
 when clicked => send post data to backend and save the post with user id 
 show the saved posts on user profile
 showing => send user id in params to backend get every post saved with the id
 show the post on user profile  

} 

() => search engine for each charactar entered (has to done on the frontend only i guess) 
{
  the same searching as facebook , pinterest , google 
  Like when a user enter a char : A =>  post titles with A at start will be shown and so on 
}


() => Recommendation of posts 
{
  for each user based on the post they like with specific tags
  like if a post contain tags : [ "goku" , "dragonball" , "vegata"] they will be shown posts with these tags on top
  followed by other posts
}
 

() => users can follow and unfollow each other 

() => Chat component  
() => only users that follow each other can text each other (or maybe add privacy to allow user who can text them)
 


 thats enough for now 

 */