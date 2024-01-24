import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    _id: '',
    auth: false,
    username: '',
    photo: undefined,
}


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            const { _id, photo, username, auth } = action.payload;
            
            state._id = _id;
            state.photo = photo;
            state.username = username;
            state.auth = auth;
        },
        resetUser: (state, action) => {
            state._id = '';
            state.photo = '';
            state.username = '';
            state.auth = false;
        }
    }
})

export const { setUser , resetUser } = userSlice.actions;

export default userSlice.reducer;


