import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import user from './userslice';
import log from './logslic'
import post from './postSlice'

const persistConfig = {
  key : 'root',
  storage,
  whitelist : ['post']
}



const rootReducer = combineReducers({
  user,
  log, 
  post
})

const persistedReducer = persistReducer(persistConfig,rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

const persistor = persistStore(store)

export { store , persistor };