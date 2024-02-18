import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chats : [],
    currentChat : {}
}

const chatSlice = createSlice({
    name : 'chat',
    initialState,
    reducers : {
        setChats: (state, action) => {
            state.chats = action.payload;
        },
        updatemessages : (state, action) => {
            console.log(action.payload);
            state.currentChat.messages.push(action.payload)
        },
        setCurrentChat : (state, action) => {
            state.currentChat = action.payload;
        },
        resetChats : (state,action) => {
            state.chats = [];
            state.currentChat = {}
        },
        resetCurrentChat : (state,action) => {
            state.currentChat = {};
        }
        
    }
})


export const {resetCurrentChat,setChats ,updatemessages ,setCurrentChat ,resetChats} = chatSlice.actions;
export default chatSlice.reducer;