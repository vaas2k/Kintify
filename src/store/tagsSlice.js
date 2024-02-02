import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tags : []
}

const newSlice = createSlice({
    name : 'tags',
    initialState,
    reducers : {
        addtags : (state, action) => {
            const { tags } = action.payload;
            
        }
    }
})