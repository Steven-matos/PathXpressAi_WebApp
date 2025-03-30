import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import languageReducer from './languageSlice';
import routesReducer from './routesSlice';
import apiDataReducer from './apiDataSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    language: languageReducer,
    routes: routesReducer,
    apiData: apiDataReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 