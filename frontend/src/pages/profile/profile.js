import { useSelector, useDispatch } from 'react-redux';
import pf from './profile.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from '../../components/home/home';
import { getuserdata, follow, userPosts, Notification, startChat } from '../../api/internal';
import Follow from './followComp/follow';
import { setUser } from '../../store/userslice';
import { setChats, setCurrentChat } from '../../store/chatSlice';


const Profile = () => {

    const dispatch = useDispatch();
    const isAuth = useSelector((state) => { return state.user.auth })
    const getChats = useSelector((state) => {
        if (isAuth === true) {
            return state.chat.chats;
        }
    })
    const params = useParams();
    const user_name = params.username;
    const currentuser = useSelector((state) => { return state.user; });
    const ownaccount = currentuser.username === user_name ? true : false;
    const navigate = useNavigate();

    const [followingslist, setList] = useState({});

    const [pageaccount, setPageAcc] = useState({});
    const [reload, setReload] = useState(false);
    const [followed, setFollowed] = useState(false);
    const [posts, setPosts] = useState([]);
    const [toggleposts, setTogglePosts] = useState(true);
    const [toggleSaved, setToggleSaved] = useState(false);

    const [showFollowers, setShowFollowers] = useState(false);
    const [showFollowing, setShowFollowing] = useState(false);


    /** get user data for the page
     * followers and followings 
     * posts of the user on the profile page
     */
    useEffect(() => {
        const getData = async () => {
            let response, response1;
            try {
                response = await getuserdata(user_name);
                response1 = await getuserdata(currentuser.username);
                if (response.status === 200) {
                    setPageAcc(response.data.newuser);
                    setList(response.data.list);

                    if (response.data.list.followers.length > 0) {
                        for (let i = 0; i < response.data.list.followers.length; i++) {
                            const flr = response.data.list.followers[i];
                            if (currentuser._id === flr.ID) {
                                setFollowed(true);
                            }
                        }
                    }
                }
                if (response1.status === 200) {
                    dispatch(setUser({
                        ...currentuser,
                        followers: response1.data.list.followers,
                        followings: response1.data.list.followings
                    }));
                }
                let response2 = await userPosts(response.data.newuser.id);
                if (response2.status === 200) {
                    setPosts(response2.data);
                } else if (response2.status !== 200) {
                    console.log(response2.message);
                }
            } catch (error) {
                console.log(error);
                return error;
            }

        }
        getData();
    }, [reload, params])


    async function handleFollowClick() {
        const data = {
            username: user_name,
            followerID: currentuser._id
        }

        let response;
        try {
            response = await follow(data);
            if (response.status === 200) {
                setReload(!reload);
                setFollowed(!followed)

                if (!followed) {
                    const data = {
                        ID: currentuser._id,
                        Name: currentuser.username,
                        Message: 'started following you!',
                        photo: currentuser.photo,
                        username: user_name
                    }

                    let send_notif = await Notification(data);
                    if (send_notif.status !== 200) {
                        console.log(send_notif);
                    }
                }
            }
        } catch (error) {
            return error;
        }
    }
    console.log(getChats);
    async function handleMessageClick() {

        //const roomID = uuidv4();
        //roomID.slice(7).toString('hex');
        /**
         * check page username in current redux state
         * if exist then directly navigate to chat room
         * else 
         * make a call to api 
         * make a room with user 
         * refresh state for user
         * then navigate to the room with new user 
         * */
        const checkuser = getChats.find((m) => {
            return m.messenger === pageaccount.username ? true : false;;
        })
        if (checkuser) {
            const getUser = getChats.find((chat)=>{
                return chat.messenger === pageaccount.username;
            })            
            console.log('user-exist');
            dispatch(setCurrentChat(getUser));
            navigate(`/chat/${pageaccount.username}`);
        }
        else {
            const data = {
                userID: currentuser._id,
                messenger: pageaccount.username,
            }
            try {
                const response = await startChat(data);
                if (response.status === 200) {
                    const newChats = [...getChats,response.data.chat1]
                    dispatch(setChats(newChats));
                    dispatch(setCurrentChat(response.data.chat1));
                    navigate(`/chat/${pageaccount.username}`);
                }else{
                    console.log(response.data);
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    // function for toggling users following and followers 
    function handleShowFlr(showFollowers) {
        setShowFollowers(!showFollowers);
    }
    function handleShowFlg(showFollowing) {
        setShowFollowing(!showFollowing);
    }

    return (
        <div className={pf.mainpf}>
            {ownaccount ?
                ((<div className={pf.profile}>
                    <img alt="nill" src={currentuser.photo} style={{ width: '150px' }} />
                    <h2>{currentuser.name}</h2>
                    <h>{user_name}</h>
                    <h> {currentuser.followers && currentuser.followers.length}
                        <h onClick={() => handleShowFlr(showFollowers)} className={pf.f_but}> &nbsp;Followers</h>
                        &nbsp; - &nbsp;
                        {currentuser.followings && currentuser.followings.length}
                        <h onClick={() => handleShowFlg(showFollowing)} className={pf.f_but}>&nbsp;Followings</h></h>
                    <div className={pf.followComponent}>
                        {showFollowers && <Follow flrlist={currentuser.followers} handleflr={(showFollowers) => handleShowFlr(showFollowers)} />}
                        {showFollowing && <Follow flglist={currentuser.followings} handleflg={(showFollowing) => handleShowFlg(showFollowing)} />}
                    </div>
                    <button>Edit Profile</button>{/*take u to update profile info*/}
                </div>))
                :
                ((<div className={pf.profile}>
                    <img alt='nill' src={pageaccount.photo} style={{ width: '150px' }} />
                    <h2>{pageaccount.name}</h2>
                    <h>{user_name}</h>
                    <h> {followingslist.followers && followingslist.followers.length}
                        <h onClick={() => handleShowFlr(showFollowers)} className={pf.f_but}> &nbsp;Followers</h>
                        &nbsp; - &nbsp;
                        {followingslist.followings && followingslist.followings.length}
                        <h onClick={() => handleShowFlg(showFollowing)} className={pf.f_but}>&nbsp;Followings</h></h>
                    <div className={pf.followComponent}>
                        {showFollowers && <Follow flrlist={followingslist.followers} handleflr={(showFollowers) => handleShowFlr(showFollowers)} />}
                        {showFollowing && <Follow flglist={followingslist.followings} handleflg={(showFollowing) => handleShowFlg(showFollowing)} />}
                    </div>
                    {isAuth && <div className={pf.follow_message_buttons}>
                        <button
                            className={pf.FnU}
                            onClick={handleFollowClick}>{followed ? 'unfollow' : 'follow'}</button>
                        <button onClick={handleMessageClick} className={pf.FnU}>Message</button>

                    </div>}
                </div>))
            }
            <hr />
            {ownaccount && <div className={pf.buts}>
                <button onClick={() => { setTogglePosts(true); setToggleSaved(false) }}>Posts</button>
                <button onClick={() => { setToggleSaved(true); setTogglePosts(false) }}>Saved</button>
            </div>}
            <div className={pf.userposts}>
                {toggleposts && !toggleSaved ? <Home posts={posts} /> : null}{/*if exist , else show create button*/}
            </div>
            {ownaccount && (<div>
                {toggleSaved && !toggleposts ? <Home /> : null}
            </div>)}


        </div>
    );
}


export default Profile;