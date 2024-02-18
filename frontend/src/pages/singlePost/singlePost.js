import { Link, useParams } from "react-router-dom";
import sp from "./singlePost.module.css";
import TextInput from '../../components/textinput/textinput'
import { Heart, HeartPulse } from 'lucide-react';
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { singlePost, newComment, newlike , Notification } from "../../api/internal";
import Home from "../../components/home/home";
import { current } from "@reduxjs/toolkit";

const SinglePost = () => {
    const params = useParams();
    const postid = params.id;
    const currentuser = useSelector((state) => { return state.user });
    const currentpost = useSelector((state) => { return state.post });

    const [newcomment, setnewComment] = useState({
        author: currentuser._id,
        username: currentuser.username,
        postid: postid,
        userimage: currentuser.photo,
        content: ''
    })
    const [poster, setPoster] = useState({})
    const [comments, setComments] = useState([]);
    const [reload, setReload] = useState(false);
    const [liked, setLiked] = useState();
    const [fullSize , setFullSize] = useState(false);

    // fetcing data of post -> post creator eg
    useEffect(() => {
        async function getuserofpost() {
            let response;
            try {
                response = await singlePost(postid);
                if (response.status === 200) {
                    setPoster({
                        username: response.data.post.authorname,
                        photo: response.data.post.authorphoto,
                        likes: response.data.post.likes
                    })
                    setComments(response.data.comments);
                    console.log(response.data.likes);
                    for (let i = 0; i < response.data.likes.length; i++) {
                        if (response.data.likes[i].liker_id === currentuser._id) {
                            setLiked(true);
                        }
                    }
                }
            }
            catch (error) {
                console.log(error);
                return error;
            }
        }
        getuserofpost();
    }, [reload , currentpost])


    // function to send comment to server
    async function sendcomment() {

        let response;
        try {
            response = await newComment(newcomment);
            setReload(!reload);
            setnewComment({
                author: currentuser._id,
                username: currentuser.username,
                postid: postid,
                userimage: currentuser.photo,
                content: ''
            })
            if(currentpost.authorname !== currentuser.username){
                const data = {
                    ID : currentuser._id,
                    Name : currentuser.username,
                    Message : 'commented on your post',
                    username : currentpost.authorname,
                    post_id : currentpost.id,
                    photo : currentuser.photo,
                    type : 'comment'
                }

                let send_notif = await Notification(data);
                if(send_notif.status !== 200){
                    console.log(send_notif);
                }
            }
        } catch (error) {
            return error;
        }
    }

    // send like ot server
    async function sendLike() {
        const data = {
            post_id: currentpost.id,
            liker_id: currentuser._id,
        }
        let response;
        try {
            response = await newlike(data);
            if (response.status === 200) {
                setReload(!reload);
                
                if(!liked && currentpost.authorname !== currentuser.username){
                    const data = {
                        ID : currentuser._id,
                        Name : currentuser.username,
                        Message : 'liked your post',
                        username : currentpost.authorname,
                        post_id : currentpost.id,
                        photo : currentuser.photo,
                        type : 'liked'
                    }
    
                    let send_notif = await Notification(data);
                    if(send_notif.status !== 200){
                        console.log(send_notif);
                    }
                }
            }
            else if (response.status === 201) {
                setLiked(false);
                setReload(!reload);
            }
        } catch (error) {
            console.log(error);
        }

        // if post was liked save the tags in session storage
        if(response.status === 200){
            let getTags = window.sessionStorage.getItem('Liked-tags');
            console.log('before --> ',getTags);
            if(getTags){
                getTags = JSON.parse(getTags);
            }else{
                getTags = [];
            }
            for(let i = 0; i < currentpost.tags.length ; i++){
                getTags.push(currentpost.tags[i]);
            }
            window.sessionStorage.setItem('Liked-tags',JSON.stringify(getTags));

            console.log('after --> ',getTags);
        }
    }

    function handleReload(reload){
        setReload(!reload);
    }

    return (
        <div className={sp.mainpage}>
            <div className={sp.mainpost}>
                <div className={sp.image}>
                    {currentpost.video === 'null' ?
                        <img 
                        alt="nill" 
                        onClick={() => window.open(currentpost.photo)} 
                        className={sp.img} src={currentpost.photo} />
                        :
                        <video controls autoPlay className={sp.img}>
                            <source src={currentpost.video} />
                        </video>
                    }
                </div>

                <div className={sp.postdetails}>
                    <div className={sp.details}>
                       <Link style={{textDecoration:"none",color:"black"}} to={`/profile/${currentpost.authorname}`}> <div className={sp.profile}>
                            <img
                                alt={require('../../images/noooaccc.png')}
                                className={sp.profileimg}
                                style={{ width: '35px', borderRadius: '20px' }}
                                src={currentpost.authorphoto}
                            />
                            <p>{currentpost.authorname}</p>
                        </div>
                        </Link>
                        <br />
                        <p1>
                            {currentpost.description}
                        </p1>
                    </div>

                    <div className={sp.comments}>
                        <h3>Comments - ({comments.length})</h3>
                        {comments.map((comm) => {
                            return (<div className={sp.comment}>
                                <img alt="nill" src={comm.userimage} />
                                <p> <Link style={{textDecoration:"none"}} to={`/profile/${comm.username}`}><h>{comm.username}</h></Link>  {comm.content}</p>
                            </div>)
                        })}
                    </div>

                    {currentpost.allowcomment === true ?
                        (<div className={sp.postcomment}>
                            <img
                                alt="nill"
                                style={{ width: '35px', borderRadius: '20px' }}
                                src={currentuser.photo}
                            />
                            <TextInput
                                placeholder='write a comment'
                                name="content"
                                value={newcomment.content}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        sendcomment();
                                    }
                                }}
                                onChange={(e) => {
                                    setnewComment(oldcom => {
                                        return {
                                            ...oldcom,
                                            [e.target.name]: e.target.value
                                        }
                                    })
                                }}
                                className={sp.commInput}
                            />

                            {liked ? <div className={sp.hp} onClick={sendLike}><HeartPulse color="red" /></div> : <div onClick={sendLike} className={sp.hh}><Heart enableBackground={true} /></div>}

                            <div>{poster.likes}</div>
                        </div>)
                        :
                        (<div className={sp.comments}>
                            <p>comments are turned off by the <h>{poster.username}</h> </p>
                        </div>)}

                </div>
            </div>
            <br />
            <div><h2 color="ff2626">Similar Post Suggestions</h2></div>

            <div>
                <Home tags={currentpost.tags} id={currentpost.id} handleReload={handleReload} reload={reload}/>
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