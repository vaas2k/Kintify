import { configureStore } from "@reduxjs/toolkit";
import user from "./userslice";
import user1 from "./userslice1";
import log from './logslic';


const store = configureStore({
    reducer : {user , user1 , log}
})

export default store;