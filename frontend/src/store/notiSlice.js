import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notification: [],
    is_seen : true
}


const notiSlice = createSlice({
    name: 'noti',
    initialState,
    reducers: {
        setUserNotif : (state, action) => {
            state.notification = action.payload;
        },
        updateNoti : (state,action) => {

            const id = action.payload;
            state.notification = state.notification.map((n)=>{
                if(n._id === id ){
                    n.is_seen = true;
                }
                return n;
            })
        },
        resetNoti : (state,action)=>{
            state.notification = [];
        },
        setSeen : (state,action) => {
            state.is_seen = action.payload;
        }
    }
})

export const { setUserNotif ,updateNoti , resetNoti ,setSeen } = notiSlice.actions;

export default notiSlice.reducer;


