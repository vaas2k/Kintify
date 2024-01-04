import './App.css';

const App = () => {

  return (
    <div>
      <h1>Hello World!</h1>
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