import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id : '',
    photo : '',
    video : '',
    author : '',
    title: '',
    description:'',
    tags : [],
    allowcomment:null,
    likes:'',
    authorname : '',
    authorphoto : ''
}

const postSlice = createSlice({
    name : 'post',
    initialState,
    reducers: {
        setPost : (state, action) => {
            return action.payload
        }
    }
})


export const {setPost } = postSlice.actions;
export default postSlice.reducer;