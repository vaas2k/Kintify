import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    _id: '',
    auth: false,
    username: '',
    photo: undefined,
    name : ''
}


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            const { _id, name , photo, username, auth } = action.payload;
            
            state._id = _id;
            state.photo = photo;
            state.username = username;
            state.auth = auth;
            state.name = name;
        },
        resetUser: (state, action) => {
            state._id = '';
            state.photo = '';
            state.username = '';
            state.auth = false;
            state.name = ''
        }
    }
})

export const { setUser , resetUser } = userSlice.actions;

export default userSlice.reducer;


