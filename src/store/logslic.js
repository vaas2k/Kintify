import { createSlice  } from "@reduxjs/toolkit";

const initialState = {
    login : true,
    sign : false
}

const logslice = createSlice({
    name : 'log',
    initialState,
    reducers : {
        togglelog : (state) => {
            state.login = true;
            state.sign = false;
        },
        togglesign : (state) => {
            state.sign = true
            state.login = false;
        }
    }
})


export const { togglelog , togglesign} = logslice.actions;
export default logslice.reducer;