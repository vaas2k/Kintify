import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    _id: '',
    auth: false,
    username: '',
    photo: undefined,
    name : '',
    followings : [],
    followers :[],
}


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            const { _id, name , photo, username, auth , followers , followings } = action.payload;
            
            state._id = _id;
            state.photo = photo;
            state.username = username;
            state.auth = auth;
            state.name = name;
            state.followers = followers;
            state.followings = followings;
        },
        setUserNotif : (state, action) => {
            state.notification = action.payload;
        },
        resetUser: (state, action) => {
            state._id = '';
            state.photo = '';
            state.username = '';
            state.auth = false;
            state.name = '';
            state.followers = [];
            state.followings = [];
        }
    }
})

export const { setUser , resetUser , setUserNotif} = userSlice.actions;

export default userSlice.reducer;


