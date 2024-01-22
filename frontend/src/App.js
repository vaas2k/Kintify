import './App.css';

import Navbar from './components/Navbar/navbar';
import Login from './components/login sign/login-sign';
import Sign from './components/login sign/sign';
import Home from './pages/home/home';
import Feed from './pages/feeds/feeds';
import Create from './pages/create/create';
import Profile from './pages/profile/profile';
import { Routes , Route , BrowserRouter } from 'react-router-dom';
import Explore from './pages/explore/explore';
import Front from './pages/front/front';


const App = () => {
  const username = "somthing";
  return (
    <div>
      <BrowserRouter>
        <Navbar/>
        <Routes >
          <Route path='/' element={<Front/>}/>
          <Route path="/home" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/sign" element={<Sign/>} />
          <Route path="/feed" element={<Feed/>} />
          <Route path= {`/profile`} element={<Profile/>} />
          <Route path="/create" element={<Create/>} />
          <Route path="/explore" element={<Explore/>} />
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