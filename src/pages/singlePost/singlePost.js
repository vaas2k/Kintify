import { useFetcher, useParams } from "react-router-dom";
import sp from "./singlePost.module.css";
import postimage from '../../images/6d2a0a82f57a6bbc829f6d882abb35fa.jpg'
import TextInput from '../../components/textinput/textinput'
import { Heart , HeartPulse , Plus} from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { useEffect , useState } from "react";
import { singlePost , newComment, newlike } from "../../api/internal";
import { current } from "@reduxjs/toolkit";
import {setPost} from '../../store/postSlice';

const SinglePost = () => {
    const params = useParams();
    const postid = params.id;
    const dispatch = useDispatch();
    const currentuser = useSelector((state)=> {return state.user});
    const currentpost = useSelector((state) => {return state.post});
    
    const [newcomment , setnewComment] = useState({
        author : currentuser._id,
        username : currentuser.username,
        postid : postid,
        userimage: currentuser.photo,
        content : ''
    })
    const [poster, setPoster] = useState({})
    const [comments , setComments] = useState([]);
    const [likes , setLikes ] = useState();
    const [reload , setReload] = useState(false); 
    const [liked , setLiked] = useState(false);
    
    
    // fetcing data of post -> post creator eg
    useEffect(()=>{
        async function getuserofpost(){
            let response;
            try{
                response = await singlePost(postid);
                if(response.status === 200){
                    setPoster({
                        username : response.data.user.username,
                        photo : response.data.user.photo,
                        likes : response.data.user.likes
                    })
                    setComments(response.data.comments);
                }
            }
            catch(error){
                console.log(error);
                return error;
            }
        }
        getuserofpost();
    },[reload])
    
    
    // function to send comment to server
    async function sendcomment(){
        
        let response;
        try{
            response = await newComment(newcomment);
            setReload(!reload);
            setnewComment({author : currentuser._id,
                username : currentuser.username,
                postid : postid,
                userimage: currentuser.photo,
                content : ''})
            }catch(error){
                return error;
            }
        }
        

        // send like ot server
        async function sendLike(){
            const data = {
                post_id : currentpost.id,
                liker_id : currentuser._id,
            }

            try{
                const response = await newlike(data);
                if(response.status === 200){
                    setReload(!reload);
                    setLiked(!liked);
                    console.log(liked);
                }
            }catch(error){
                console.log(error);
            }
        }
        

        return (
            <div className={sp.mainpage}>
            <div className={sp.mainpost}>
                <div className={sp.image}>
                    {currentpost.video === 'null' ?
                    <img className={sp.img} src={currentpost.photo} />
                    :
                    <video controls autoPlay className={sp.img}>
                        <source src={currentpost.video} />
                    </video>
                 }
                </div>

                <div className={sp.postdetails}>
                    <div className={sp.details}>
                        <div className={sp.profile}>
                            <img
                                className={sp.profileimg}
                                style={{ width: '35px', borderRadius: '20px' }}
                                src={poster.photo}
                            />
                            <p>{poster.username}</p>
                            
                            </div>
                        <br/>
                        <p1>
                            {currentpost.description}
                        </p1>
                    </div>

                    <div className={sp.comments}>
                        <h3>Comments</h3>
                        {comments.map((comm)=>{
                            return (<div className={sp.comment}>
                            <img src = {comm.userimage} />
                            <p> <h>{comm.username} - </h>{comm.content}</p>
                        </div>)
                        })}
                    </div>
                    
                    {currentpost.allowcomment === true ? 
                    (<div className={sp.postcomment}>
                        <img
                        style={{width:'35px'  , borderRadius:'20px'}}
                        src={currentuser.photo}
                        />
                        <TextInput 
                        placeholder='write a comment'
                        name="content"
                        value={newcomment.content}
                        onKeyDown={(e)=>{
                            if(e.key === 'Enter'){
                                e.preventDefault();
                                sendcomment();
                            }
                        }}
                        onChange={(e)=>{
                            setnewComment(oldcom => {
                                return {
                                    ...oldcom,
                                    [e.target.name] : e.target.value 
                                }
                            })
                        }}
                        className={sp.commInput}
                        />
                        
                        {liked ? <div className={sp.hp} onClick={sendLike}><HeartPulse color="red"/></div> : <div onClick={sendLike} className={sp.hh}><Heart enableBackground={true}/></div> }

                        <div>{poster.likes}</div>
                    </div>)
                     : 
                     (<div className={sp.comments}>
                        <p>comments are turned off by the <h>{poster.username}</h> </p>
                     </div>)} 
                    
                </div>
            </div>
        </div>

    );
}

export default SinglePost;


/*

post image 
post comments likes

down the page the contain posts with same tags
show them below the page

*/