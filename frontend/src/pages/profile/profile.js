import { useSelector } from 'react-redux';
import pf from './profile.module.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from '../../components/home/home';
import { getuserdata, follow, userPosts } from '../../api/internal';

const Profile = () => {


    const params = useParams();
    const user_name = params.username;
    const currentuser = useSelector((state) => { return state.user; });
    const ownaccount = currentuser.username === user_name ? true : false;

    const [followingslist, setList] = useState({});
    const [curfollowingslist, setcurList] = useState({});
    const [pageaccount, setPageAcc] = useState({});
    const [reload, setReload] = useState(false);
    const [followed, setFollowed] = useState(false);
    const [posts, setPosts] = useState([]);
    const [toggleposts, setTogglePosts] = useState(true);
    const [toggleSaved, setToggleSaved] = useState(false);

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
                    setcurList(response1.data.list);
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
    }, [reload])


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
            }
        } catch (error) {
            return error;
        }
    }


    return (
        <div className={pf.mainpf}>
            {ownaccount ?
                ((<div className={pf.profile}>
                    <img alt="nill" src={currentuser.photo} style={{ width: '150px' }} />
                    <h2>{currentuser.name}</h2>
                    <h>{user_name}</h>
                    <h> {curfollowingslist.followers && curfollowingslist.followers.length} followers -  {curfollowingslist.followings && curfollowingslist.followings.length} followings</h>
                    <button>Edit Profile</button>{/*take u to update profile info*/}
                </div>))
                :
                ((<div className={pf.profile}>
                    <img alt='nill' src={pageaccount.photo} style={{ width: '150px' }} />
                    <h2>{pageaccount.name}</h2>
                    <h>{user_name}</h>
                    <h> {followingslist.followers && followingslist.followers.length} followers -  {followingslist.followings && followingslist.followings.length} followings</h>
                    <button onClick={handleFollowClick}>{followed ? 'unfollow' : 'follow'}</button>{/*take u to update profile info*/}
                </div>))
            }
            <hr/>
            {ownaccount && <div className={pf.buts}>
                <button  onClick={() => {setTogglePosts(true); setToggleSaved(false)}}>Posts</button>
                <button  onClick={() => {setToggleSaved(true); setTogglePosts(false)}}>Saved</button>
            </div>}
            <div className={pf.userposts}>
                {toggleposts && !toggleSaved ? <Home posts={posts} /> : null}{/*if exist , else show create button*/}
            </div>
            {ownaccount && (<div>
                { toggleSaved && !toggleposts ? <Home/> : null}
            </div>)}
        </div>
    );
}


export default Profile;