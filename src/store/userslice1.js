import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    name:'',
    username: '',
    email: '',
    password : '',
    confirmPassword: '',
    photo : ''
}

const user1Slice = createSlice({
    name: 'user1',
    initialState,
    reducers: {
        setUser1: (state, action) => {
            const {name , username , email , password , confirmPassword } = action.payload;

            state.name = name;
            state.username = username;
            state.email = email;
            state.password = password;
            state.confirmPassword = confirmPassword;
            state.photo = undefined;
        },
        resetUser1: (state, action) => {
            state.name = '';
            state.username = '';
            state.email = '';
            state.password = '';
            state.confirmPassword = '';
        }
    }
})

export const {setUser1 , resetUser1} = user1Slice.actions;
export default user1Slice.reducer;